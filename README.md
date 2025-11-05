# masterplitkavl — готово к деплою на Vercel

**Стек:** Vite + React 18 + TypeScript + TailwindCSS + framer-motion + lucide-react

## Старт локально
```bash
npm install
npm run dev
```

## Деплой на Vercel
1. Запушьте этот проект в GitHub (в корне репозитория должен лежать `package.json`).
2. В Vercel подключите репозиторий. В проекте уже есть `vercel.json`:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. В `package.json` указан движок Node `22.x` — это требование Vercel.

## Картинки
Положите свои файлы в `public/images` (например, `public/images/1.jpg`). В `src/App.tsx`
отредактируйте массив `galleryImages` под свои имена файлов.

## Почему так
- Убрали react-helmet, чтобы не ловить конфликт peer-зависимостей с React 19.
- Зафиксированы версии Vite/React/Tailwind для стабильной сборки.
