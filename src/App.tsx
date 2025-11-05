import React, { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Phone, MessageCircle, Image as ImageIcon, ChevronLeft, ChevronRight, Layers, Calculator } from 'lucide-react'

const DOMAIN = 'masterplitkavl.ru'
const PHONE_DISPLAY = '+7 951 005‑00‑02'
const PHONE_TEL = '+79510050002'
const WHATSAPP = 'https://wa.me/79510050002'

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
  { src: "/images/photo13.jpg", alt: "Фартук кухни — белый кабанчикКухня — фартук и столешница" },
  { src: "/images/photo14.jpg", alt: "Фартук кухни — белый кабанчик" },
  { src: "/images/photo15.jpg", alt: "Фартук кухни — белый кабанчикДекоративные швы и примыкания" },
  { src: "/images/photo16.jpg", alt: "Фартук кухни — белый кабанчик" },
   { src: "/images/photo22.jpg", alt: "Душ — линейный трап, стекло" },
]

const tileBg: React.CSSProperties = {
  backgroundImage:
    'repeating-linear-gradient(0deg, rgba(255,255,255,.06) 0 1px, transparent 1px 56px), ' +
    'repeating-linear-gradient(90deg, rgba(255,255,255,.06) 0 1px, transparent 1px 56px)',
  backgroundSize: '56px 56px, 56px 56px'
}

function WhatsAppButton({ label, message }: { label?: string; message?: string }) {
  const href = useMemo(() => {
    const query = message ? `?text=${encodeURIComponent(message)}` : ''
    return `${WHATSAPP}${query}`
  }, [message])
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg hover:shadow-xl transition focus:outline-none focus:ring text-white bg-emerald-600 hover:bg-emerald-700"
    >
      <MessageCircle className="w-5 h-5" />
      <span>{label ?? 'Написать в WhatsApp'}</span>
    </a>
  )
}

export default function App() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowRight') setLightboxIndex(i => (i + 1) % galleryImages.length)
      if (e.key === 'ArrowLeft') setLightboxIndex(i => (i - 1 + galleryImages.length) % galleryImages.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxOpen])

  const calcMsg = 'Здравствуйте! Хочу рассчитать плиточные работы. Напишите, пожалуйста, когда можно сделать замер.'

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-100">
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20"
        style={tileBg}
        animate={{ backgroundPosition: ['0px 0px, 0px 0px', '56px 56px, 56px 56px'] }}
        transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-30"
        initial={{ opacity: 0.14 }}
        animate={{ opacity: [0.14, 0.22, 0.14] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          background:
            'radial-gradient(800px 520px at 10% -10%, rgba(16,185,129,0.18), transparent 60%), radial-gradient(800px 520px at 110% 110%, rgba(34,211,238,0.12), transparent 60%)'
        }}
      />

      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-slate-950/80 bg-slate-950/90 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: -8, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16 }}
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
              Укладка плитки и керамогранита: санузлы, фартуки кухонь, полы. Подготовка основания, гидроизоляция, затирка, запил под 45°, аккуратные примыкания.
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
              Базовая цена укладки: <span className="text-white font-medium">от 1 800 ₽/м²</span>. Итог после замера.
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl p-6 md:p-8 border border-white/10 shadow-xl bg-slate-950/95"
          >
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <h2 className="text-2xl font-bold">Калькулятор</h2>
            </div>
            <p className="text-sm mt-3 text-slate-300">
              Полная версия калькулятора может быть добавлена позже. Отправьте параметры в WhatsApp — посчитаю быстро.
            </p>
            <div className="mt-4">
              <WhatsAppButton label="Отправить параметры" message={calcMsg} />
            </div>
          </motion.div>
        </div>
      </section>

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
                onClick={() => { setLightboxIndex(i); setLightboxOpen(true) }}
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
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
                <div className="absolute bottom-2 left-2 text-[11px] sm:text-xs text-slate-200 drop-shadow">{img.alt}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

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
                onClick={() => setLightboxIndex(i => (i - 1 + galleryImages.length) % galleryImages.length)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20"
                aria-label="Назад"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setLightboxIndex(i => (i + 1) % galleryImages.length)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20"
                aria-label="Вперёд"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-white/10 py-8 text-sm text-slate-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} {DOMAIN}</div>
          <div className="flex items-center gap-3">
            <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-2 underline decoration-dotted">
              <Phone className="w-4 h-4" /> {PHONE_DISPLAY}
            </a>
            <WhatsAppButton label="WhatsApp" />
          </div>
        </div>
      </footer>
    </div>
  )
}
