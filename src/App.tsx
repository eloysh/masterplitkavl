import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  MessageCircle,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Layers,
  Calculator,
  Info,
  Scissors,
} from "lucide-react";

// --- Константы контактов/домена ---
const DOMAIN = "masterplitkavl.ru";
const PHONE_DISPLAY = "+7 951 005-00-02";
const PHONE_TEL = "+79510050002";
const WHATSAPP = "https://wa.me/79510050002";

// --- Плиточный фон ---
const tileBg: React.CSSProperties = {
  backgroundImage:
    "repeating-linear-gradient(0deg, rgba(255,255,255,.06) 0 1px, transparent 1px 56px), " +
    "repeating-linear-gradient(90deg, rgba(255,255,255,.06) 0 1px, transparent 1px 56px)",
  backgroundSize: "56px 56px, 56px 56px",
};

// --- Галерея (картинки лежат в public/images) ---
const galleryImages: { src: string; alt: string }[] = [
  { src: "/images/photo1.jpg", alt: "Санузел — керамогранит, ванна" },
  { src: "/images/photo2.jpg", alt: "Открытая полка — керамогранит" },
  { src: "/images/photo3.jpg", alt: "Открытая полка — керамогранит" },
  { src: "/images/photo4.jpg", alt: "Открытая полка — керамогранит" },
  { src: "/images/photo5.jpg", alt: "Санузел под ключ" },
  { src: "/images/photo6.jpg", alt: "Санузел под ключ" },
  { src: "/images/photo7.jpg", alt: "Ванная комната — керамогранит, ванна" },
  { src: "/images/photo8.jpg", alt: "Ванная комната — керамогранит, душ" },
  { src: "/images/photo9.jpg", alt: "Санузел — керамогранит, ванна" },
  { src: "/images/photo10.jpg", alt: "Пол — крупный формат 60×120" },
  { src: "/images/photo12.jpg", alt: "Санузел — скрытая ниша" },
  { src: "/images/photo13.jpg", alt: "Кухня — фартук и столешница" },
  { src: "/images/photo14.jpg", alt: "Фартук кухни — белый кабанчик" },
  { src: "/images/photo15.jpg", alt: "Декоративные швы и примыкания" },
  { src: "/images/photo16.jpg", alt: "Фартук кухни — белый кабанчик" },
  { src: "/images/photo22.jpg", alt: "Душ — линейный трап, стекло" },
];

// --- Типы и прайсы для калькулятора ---
type AreaType = "bathroom" | "backsplash" | "floor";
type MaterialType = "tile" | "porcelain";
type Complexity = "normal" | "diagonal" | "largeFormat" | "mosaic";

const initialPrices = {
  base: {
    bathroom: { tile: 1800, porcelain: 1800 },
    backsplash: { tile: 1800, porcelain: 1800 },
    floor: { tile: 1800, porcelain: 1800 },
  },
  extras: {
    demolitionPerM2: 200,
    waterproofingPerM2: 250,
    prepPerM2: 140,
    adhesivePerM2: 220,
    groutPerM2: 130,
    miterPerLm: 250,
    siliconePerLm: 90,
    packageDiscountPct: 5,
  },
  coefficients: {
    normal: 1.0,
    diagonal: 1.1,
    largeFormat: 1.15,
    mosaic: 1.2,
  },
} as const;

function WhatsAppButton({
  label,
  message,
}: {
  label?: string;
  message?: string;
}) {
  const href = useMemo(() => {
    const q = message ? `?text=${encodeURIComponent(message)}` : "";
    return `${WHATSAPP}${q}`;
  }, [message]);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl transition focus:outline-none focus:ring text-white bg-emerald-600 hover:bg-emerald-700"
      aria-label="Написать в WhatsApp"
    >
      <MessageCircle className="w-5 h-5" />
      <span>{label ?? "Написать в WhatsApp"}</span>
    </a>
  );
}

export default function App() {
  // --- Лайтбокс ---
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i + 1) % galleryImages.length);
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen]);

  // --- Состояния калькулятора ---
  const [prices, setPrices] = useState(initialPrices);
  const [showPricePanel, setShowPricePanel] = useState(false);
  const [showLmHelper, setShowLmHelper] = useState(false);

  const [areaType, setAreaType] = useState<AreaType>("bathroom");
  const [material, setMaterial] = useState<MaterialType>("tile");
  const [area, setArea] = useState<number>(6);
  const [complexity, setComplexity] = useState<Complexity>("normal");
  const [turnkey, setTurnkey] = useState<boolean>(true);

  const [withDemolition, setWithDemolition] = useState(false);
  const [withPrep, setWithPrep] = useState(true);
  const [withAdhesive, setWithAdhesive] = useState(true);
  const [withGrout, setWithGrout] = useState(true);
  const [withWaterproofing, setWithWaterproofing] = useState(true);
  const [linkWaterproofingToArea, setLinkWaterproofingToArea] = useState(true);
  const [waterproofingArea, setWaterproofingArea] = useState<number>(6);

  const [miterLm, setMiterLm] = useState(0);
  const [siliconeLm, setSiliconeLm] = useState(0);

  // помощник по погонным метрам
  const [hWalls, setHWalls] = useState(2.5);
  const [innerCorners, setInnerCorners] = useState(2);
  const [outerCorners, setOuterCorners] = useState(0);
  const [floorPerimeter, setFloorPerimeter] = useState(0);
  const [extraSilicone, setExtraSilicone] = useState(0);
  const [openEdges, setOpenEdges] = useState(0);

  useEffect(() => {
    if (linkWaterproofingToArea) setWaterproofingArea(area);
  }, [area, linkWaterproofingToArea]);

  useEffect(() => {
    if (turnkey) {
      setWithPrep(true);
      setWithAdhesive(true);
      setWithGrout(true);
      setWithWaterproofing(true);
      setLinkWaterproofingToArea(true);
    }
  }, [turnkey]);

  const applyLmHelper = () => {
    const miter = outerCorners * hWalls + openEdges;
    const silicone = innerCorners * hWalls + floorPerimeter + extraSilicone;
    setMiterLm(Number(miter.toFixed(2)));
    setSiliconeLm(Number(silicone.toFixed(2)));
  };

  // --- Расчёт стоимости ---
  const baseRate = prices.base[areaType][material];
  const coeff = prices.coefficients[complexity];
  const baseCost = (area || 0) * baseRate * coeff;

  const demolitionCost = withDemolition ? (area || 0) * prices.extras.demolitionPerM2 : 0;
  const prepCost = withPrep ? (area || 0) * prices.extras.prepPerM2 : 0;
  const adhesiveCost = withAdhesive ? (area || 0) * prices.extras.adhesivePerM2 : 0;
  const groutCost = withGrout ? (area || 0) * prices.extras.groutPerM2 : 0;
  const waterproofingBase = linkWaterproofingToArea ? (area || 0) : (waterproofingArea || 0);
  const waterproofingCost = withWaterproofing ? waterproofingBase * prices.extras.waterproofingPerM2 : 0;
  const miterCost = (miterLm || 0) * prices.extras.miterPerLm;
  const siliconeCost = (siliconeLm || 0) * prices.extras.siliconePerLm;

  const subtotal =
    baseCost +
    demolitionCost +
    prepCost +
    adhesiveCost +
    groutCost +
    waterproofingCost +
    miterCost +
    siliconeCost;

  const discount = turnkey ? Math.round((subtotal * prices.extras.packageDiscountPct) / 100) : 0;
  const total = Math.max(0, subtotal - discount);

  const calcMsg =
    `Здравствуйте! Хочу рассчитать работы: ` +
    `${areaType === "bathroom" ? "Санузел" : areaType === "backsplash" ? "Фартук кухни" : "Пол"}. ` +
    `Материал: ${material === "tile" ? "кафель" : "керамогранит"}. ` +
    `Площадь: ${area} м². Сложность: ${
      { normal: "стандарт", diagonal: "диагональ", largeFormat: "крупный формат", mosaic: "мозаика/рисунок" }[
        complexity
      ]
    }. ` +
    `${withDemolition ? "Демонтаж: да. " : ""}` +
    `${withPrep ? "Подготовка: да. " : ""}` +
    `${withAdhesive ? "Клей: да. " : ""}` +
    `${withGrout ? "Затирка: да. " : ""}` +
    `${withWaterproofing ? `Гидроизоляция: ${waterproofingBase} м². ` : ""}` +
    `${miterLm ? `Запил 45°: ${miterLm} п.м. ` : ""}` +
    `${siliconeLm ? `Силикон: ${siliconeLm} п.м. ` : ""}` +
    `${turnkey ? `Пакет «под ключ», скидка ${prices.extras.packageDiscountPct}%. ` : ""}` +
    `Сумма по калькулятору: ~${total.toLocaleString("ru-RU")} ₽. Когда можно сделать замер?`;

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-100">
      {/* фон */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={tileBg}
        animate={{ backgroundPosition: ["0px 0px, 0px 0px", "56px 56px, 56px 56px"] }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-30"
        initial={{ opacity: 0.14 }}
        animate={{ opacity: [0.14, 0.22, 0.14] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          background:
            "radial-gradient(800px 520px at 10% -10%, rgba(16,185,129,0.18), transparent 60%), radial-gradient(800px 520px at 110% 110%, rgba(34,211,238,0.12), transparent 60%)",
        }}
      />

      {/* шапка */}
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-slate-950/80 bg-slate-950/90 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: -8, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              className="w-9 h-9 rounded-2xl bg-emerald-500/25 grid place-content-center shadow-inner"
            >
              <Layers className="w-5 h-5 text-emerald-400" />
            </motion.div>
            <div>
              <div className="text-xs sm:text-sm uppercase tracking-widest text-emerald-400">{DOMAIN}</div>
              <div className="font-semibold text-base sm:text-lg">Гуренко Евгений — плиточник</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${PHONE_TEL}`}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 hover:border-white/30 transition bg-slate-900"
            >
              <Phone className="w-4 h-4" />
              <span>{PHONE_DISPLAY}</span>
            </a>
            <WhatsAppButton />
          </div>
        </div>
      </header>

      {/* герой + калькулятор */}
      <section className="relative pt-10 sm:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-14 grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow">
              Плиточные работы во Владивостоке и Артёме
              <span className="block text-emerald-400">качественно, в срок, под ключ</span>
            </h1>
            <p className="text-slate-200 text-base sm:text-lg">
              Укладка плитки и керамогранита: санузлы, фартуки кухонь, полы. Подготовка основания, гидроизоляция,
              затирка, запил под 45°, аккуратные примыкания.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <WhatsAppButton label="Рассчитать и записаться" message={calcMsg} />
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/15 hover:border-white/30 transition bg-slate-900"
              >
                <Phone className="w-5 h-5" /> Позвонить
              </a>
            </div>
            <div className="text-sm text-slate-300">
              Базовая цена укладки: <span className="text-white font-medium">от 1 800 ₽/м²</span>. Итог после замера.
            </div>
          </motion.div>

          {/* Блок калькулятора */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl p-6 md:p-8 border border-white/10 shadow-xl bg-slate-950/95"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <h2 className="text-2xl font-bold">Калькулятор</h2>
              </div>
              <button
                onClick={() => setShowPricePanel((v) => !v)}
                className="text-sm inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/15 hover:border-white/30 bg-slate-900"
              >
                <Scissors className="w-4 h-4" />
                Настроить цены
              </button>
            </div>

            {/* Панель прайсов */}
            {showPricePanel && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {(["bathroom", "backsplash", "floor"] as const).map((k) => (
                  <div key={k} className="space-y-2">
                    <div className="font-medium">
                      {k === "bathroom" ? "Санузел" : k === "backsplash" ? "Фартук кухни" : "Пол"}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="block">
                        <div className="text-slate-400 mb-1">Кафель ₽/м²</div>
                        <input
                          type="number"
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
                          value={prices.base[k].tile}
                          onChange={(e) =>
                            setPrices((p) => ({
                              ...p,
                              base: { ...p.base, [k]: { ...p.base[k], tile: Number(e.target.value || 0) } } as any,
                            }))
                          }
                        />
                      </label>
                      <label className="block">
                        <div className="text-slate-400 mb-1">Керамогранит ₽/м²</div>
                        <input
                          type="number"
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
                          value={prices.base[k].porcelain}
                          onChange={(e) =>
                            setPrices((p) => ({
                              ...p,
                              base: {
                                ...p.base,
                                [k]: { ...p.base[k], porcelain: Number(e.target.value || 0) },
                              } as any,
                            }))
                          }
                        />
                      </label>
                    </div>
                  </div>
                ))}

                <div className="space-y-2">
                  <div className="font-medium">Доп. работы, ₽</div>
                  {[
                    ["demolitionPerM2", "Демонтаж ₽/м²"],
                    ["waterproofingPerM2", "Гидроизоляция ₽/м²"],
                    ["prepPerM2", "Подготовка ₽/м²"],
                    ["adhesivePerM2", "Клей и расходники ₽/м²"],
                    ["groutPerM2", "Затирка ₽/м²"],
                    ["miterPerLm", "Запил 45° ₽/п.м"],
                    ["siliconePerLm", "Силикон ₽/п.м"],
                  ].map(([key, label]) => (
                    <label key={key} className="block">
                      <div className="text-slate-400 mb-1">{label}</div>
                      <input
                        type="number"
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
                        value={(prices.extras as any)[key]}
                        onChange={(e) =>
                          setPrices((p) => ({
                            ...p,
                            extras: { ...p.extras, [key as string]: Number(e.target.value || 0) } as any,
                          }))
                        }
                      />
                    </label>
                  ))}

                  <label className="block">
                    <div className="text-slate-400 mb-1">Скидка «под ключ», %</div>
                    <input
                      type="number"
                      className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
                      value={prices.extras.packageDiscountPct}
                      onChange={(e) =>
                        setPrices((p) => ({
                          ...p,
                          extras: { ...p.extras, packageDiscountPct: Number(e.target.value || 0) },
                        }))
                      }
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <div className="font-medium">Коэффициенты</div>
                  {[
                    ["normal", "Стандарт ×1.00"],
                    ["diagonal", "Диагональ ×1.10"],
                    ["largeFormat", "Крупный формат ×1.15"],
                    ["mosaic", "Мозаика ×1.20"],
                  ].map(([key, label]) => (
                    <label key={key} className="block">
                      <div className="text-slate-400 mb-1">{label}</div>
                      <input
                        type="number"
                        step={0.01}
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
                        value={(prices.coefficients as any)[key]}
                        onChange={(e) =>
                          setPrices((p) => ({
                            ...p,
                            coefficients: { ...p.coefficients, [key as string]: Number(e.target.value || 0) } as any,
                          }))
                        }
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Фильтры/параметры */}
            <div className="mt-6 grid grid-cols-1 gap-4">
              <div>
                <div className="text-sm mb-2 text-slate-300">Зона работ</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ["bathroom", "Санузел"],
                    ["backsplash", "Фартук"],
                    ["floor", "Пол"],
                  ].map(([k, label]) => (
                    <button
                      key={k}
                      onClick={() => setAreaType(k as AreaType)}
                      className={`px-3 py-2 rounded-xl border ${
                        areaType === k ? "border-emerald-400 bg-emerald-400/10" : "border-white/15"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm mb-2 text-slate-300">Материал</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["tile", "Кафель"],
                    ["porcelain", "Керамогранит"],
                  ].map(([k, label]) => (
                    <button
                      key={k}
                      onClick={() => setMaterial(k as MaterialType)}
                      className={`px-3 py-2 rounded-xl border ${
                        material === k ? "border-emerald-400 bg-emerald-400/10" : "border-white/15"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <div className="text-sm mb-2 text-slate-300">Площадь, м²</div>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={0.1}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value || 0))}
                />
              </label>

              <div>
                <div className="text-sm mb-2 text-slate-300">Сложность</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    ["normal", "Стандарт"],
                    ["diagonal", "Диагональ"],
                    ["largeFormat", "Крупный формат"],
                    ["mosaic", "Мозаика"],
                  ].map(([k, label]) => (
                    <button
                      key={k}
                      onClick={() => setComplexity(k as Complexity)}
                      className={`px-3 py-2 rounded-xl border ${
                        complexity === k ? "border-emerald-400 bg-emerald-400/10" : "border-white/15"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-emerald-500 w-4 h-4"
                    checked={turnkey}
                    onChange={(e) => setTurnkey(e.target.checked)}
                  />
                  <span className="text-sm text-slate-300">
                    Санузел под ключ (скидка {prices.extras.packageDiscountPct}%)
                  </span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-emerald-500 w-4 h-4"
                    checked={withDemolition}
                    onChange={(e) => setWithDemolition(e.target.checked)}
                  />
                  <span className="text-sm text-slate-300">Добавить демонтаж</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-emerald-500 w-4 h-4"
                    checked={withPrep}
                    onChange={(e) => setWithPrep(e.target.checked)}
                  />
                  <span className="text-sm text-slate-300">Подготовка/выравнивание</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-emerald-500 w-4 h-4"
                    checked={withAdhesive}
                    onChange={(e) => setWithAdhesive(e.target.checked)}
                  />
                  <span className="text-sm text-slate-300">Клей и расходники</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-emerald-500 w-4 h-4"
                    checked={withGrout}
                    onChange={(e) => setWithGrout(e.target.checked)}
                  />
                  <span className="text-sm text-slate-300">Затирка</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-emerald-500 w-4 h-4"
                      checked={withWaterproofing}
                      onChange={(e) => setWithWaterproofing(e.target.checked)}
                    />
                    <span className="text-sm text-slate-300">Гидроизоляция</span>
                  </label>
                  {withWaterproofing && (
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-emerald-500 w-4 h-4"
                        checked={linkWaterproofingToArea}
                        onChange={(e) => setLinkWaterproofingToArea(e.target.checked)}
                      />
                      <span className="text-sm text-slate-300">= площади</span>
                    </label>
                  )}
                </div>
              </div>

              {withWaterproofing && !linkWaterproofingToArea && (
                <label className="block">
                  <div className="text-sm mb-2 text-slate-300">Гидроизоляция — площадь, м²</div>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={0.1}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
                    value={waterproofingArea}
                    onChange={(e) => setWaterproofingArea(Number(e.target.value || 0))}
                  />
                </label>
              )}

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="block">
                  <div className="text-sm mb-2 text-slate-300">Запил под 45°, пог. м</div>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={0.1}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
                    value={miterLm}
                    onChange={(e) => setMiterLm(Number(e.target.value || 0))}
                  />
                </label>
                <label className="block">
                  <div className="text-sm mb-2 text-slate-300">Силикон/примыкания, пог. м</div>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={0.1}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
                    value={siliconeLm}
                    onChange={(e) => setSiliconeLm(Number(e.target.value || 0))}
                  />
                </label>
              </div>

              {/* помощник погонных метров */}
              <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
                <button
                  onClick={() => setShowLmHelper((v) => !v)}
                  className="inline-flex items-center gap-2 text-sm mb-2 hover:opacity-90"
                >
                  <Info className="w-4 h-4" /> Как посчитать погонные метры?
                </button>
                {showLmHelper && (
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-2">
                      <label className="block">
                        <div className="text-slate-300 mb-1">Высота стен, м</div>
                        <input
                          type="number"
                          step={0.1}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
                          value={hWalls}
                          onChange={(e) => setHWalls(Number(e.target.value || 0))}
                        />
                      </label>
                      <label className="block">
                        <div className="text-slate-300 mb-1">Внутренние углы, шт (силикон)</div>
                        <input
                          type="number"
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
                          value={innerCorners}
                          onChange={(e) => setInnerCorners(Number(e.target.value || 0))}
                        />
                      </label>
                      <label className="block">
                        <div className="text-slate-300 mb-1">Внешние углы, шт (под 45°)</div>
                        <input
                          type="number"
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
                          value={outerCorners}
                          onChange={(e) => setOuterCorners(Number(e.target.value || 0))}
                        />
                      </label>
                    </div>
                    <div className="space-y-2">
                      <label className="block">
                        <div className="text-slate-300 mb-1">Периметр пол-стена, м</div>
                        <input
                          type="number"
                          step={0.1}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
                          value={floorPerimeter}
                          onChange={(e) => setFloorPerimeter(Number(e.target.value || 0))}
                        />
                      </label>
                      <label className="block">
                        <div className="text-slate-300 mb-1">Доп. примыкания, м</div>
                        <input
                          type="number"
                          step={0.1}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
                          value={extraSilicone}
                          onChange={(e) => setExtraSilicone(Number(e.target.value || 0))}
                        />
                      </label>
                      <label className="block">
                        <div className="text-slate-300 mb-1">Открытые торцы/ниши (под 45°), м</div>
                        <input
                          type="number"
                          step={0.1}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2"
                          value={openEdges}
                          onChange={(e) => setOpenEdges(Number(e.target.value || 0))}
                        />
                      </label>
                    </div>
                    <div className="sm:col-span-2 flex items-center justify-between pt-1">
                      <div className="text-xs text-slate-400">
                        Формула: 45° = внешние углы × высота + открытые торцы. Силикон = внутренние углы × высота + периметр пол-стена + доп. примыкания.
                      </div>
                      <button
                        onClick={applyLmHelper}
                        className="px-3 py-2 rounded-xl border border-white/15 hover:border-white/30 bg-slate-900"
                      >
                        Подставить
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Итог */}
              <div className="mt-2 rounded-2xl border border-white/10 bg-slate-950 p-4">
                <div className="text-sm text-slate-300">Предварительный расчёт</div>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <ul className="space-y-1">
                    <li className="flex justify-between gap-3">
                      <span>База (×{coeff.toFixed(2)})</span>
                      <span>{Math.round(baseCost).toLocaleString("ru-RU")} ₽</span>
                    </li>
                    {withDemolition && (
                      <li className="flex justify-between gap-3">
                        <span>Демонтаж</span>
                        <span>{Math.round(demolitionCost).toLocaleString("ru-RU")} ₽</span>
                      </li>
                    )}
                    {withPrep && (
                      <li className="flex justify-between gap-3">
                        <span>Подготовка</span>
                        <span>{Math.round(prepCost).toLocaleString("ru-RU")} ₽</span>
                      </li>
                    )}
                    {withAdhesive && (
                      <li className="flex justify-between gap-3">
                        <span>Клей/расходники</span>
                        <span>{Math.round(adhesiveCost).toLocaleString("ru-RU")} ₽</span>
                      </li>
                    )}
                  </ul>
                  <ul className="space-y-1">
                    {withGrout && (
                      <li className="flex justify-between gap-3">
                        <span>Затирка</span>
                        <span>{Math.round(groutCost).toLocaleString("ru-RU")} ₽</span>
                      </li>
                    )}
                    {withWaterproofing && (
                      <li className="flex justify-between gap-3">
                        <span>Гидроизоляция</span>
                        <span>{Math.round(waterproofingCost).toLocaleString("ru-RU")} ₽</span>
                      </li>
                    )}
                    {miterLm > 0 && (
                      <li className="flex justify-between gap-3">
                        <span>Запил 45°</span>
                        <span>{Math.round(miterCost).toLocaleString("ru-RU")} ₽</span>
                      </li>
                    )}
                    {siliconeLm > 0 && (
                      <li className="flex justify-between gap-3">
                        <span>Силикон</span>
                        <span>{Math.round(siliconeCost).toLocaleString("ru-RU")} ₽</span>
                      </li>
                    )}
                  </ul>
                </div>
                {turnkey && (
                  <div className="flex justify-between gap-3 text-sm mt-2 text-emerald-300">
                    <span>Скидка «под ключ»</span>
                    <span>−{discount.toLocaleString("ru-RU")} ₽</span>
                  </div>
                )}
                <div className="text-3xl font-extrabold mt-2">
                  {total.toLocaleString("ru-RU")} ₽
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Без материалов (если не отмечены). Итог после замера и раскладки.
                </div>
                <div className="mt-3 flex flex-col sm:flex-row gap-3">
                  <WhatsAppButton label="Отправить расчёт в WhatsApp" message={calcMsg} />
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/15 hover:border-white/30 transition bg-slate-900"
                  >
                    <Phone className="w-5 h-5" /> Позвонить
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Галерея */}
      <section className="py-12 md:py-16 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-emerald-400" />
            <h2 className="text-2xl sm:text-3xl font-bold drop-shadow">Галерея выполненных работ</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {galleryImages.map((img, i) => (
              <motion.button
                key={i}
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full h-full object-cover group-hover:scale-[1.03] transition"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute bottom-2 left-2 text-[11px] sm:text-xs text-slate-200 drop-shadow">
                  {img.alt}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Лайтбокс */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-40 bg-black/80 grid place-items-center p-4" role="dialog" aria-modal="true">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 focus:outline-none"
            aria-label="Закрыть"
          >
            ✕
          </button>
          <div className="relative max-w-5xl w-full">
            <img
              src={galleryImages[lightboxIndex].src}
              alt={galleryImages[lightboxIndex].alt}
              className="w-full h-auto rounded-2xl border border-white/10"
            />
            <div className="absolute inset-0 flex items-center justify-between px-2">
              <button
                onClick={() =>
                  setLightboxIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length)
                }
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20"
                aria-label="Назад"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setLightboxIndex((i) => (i + 1) % galleryImages.length)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20"
                aria-label="Вперёд"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Футер */}
      <footer className="border-t border-white/10 py-8 text-sm text-slate-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} {DOMAIN}
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-2 underline decoration-dotted">
              <Phone className="w-4 h-4" /> {PHONE_DISPLAY}
            </a>
            <WhatsAppButton label="WhatsApp" message={calcMsg} />
          </div>
        </div>
      </footer>
    </div>
  );
}
