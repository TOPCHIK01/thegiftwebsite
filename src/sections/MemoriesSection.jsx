import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Images } from 'lucide-react'
import { memories } from '../data/content'

// Автоподхват фоток из src/assets/photos — называй файлы числами:
// 1.jpg, 2.jpg, 3.jpg … Порядок в галерее = порядок номеров.
const photoUrls = Object.entries(
  import.meta.glob(
    '../assets/photos/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
    { eager: true, query: '?url', import: 'default' },
  ),
)
  .sort(([a], [b]) => {
    const na = Number(a.match(/(\d+)/)?.[1] ?? 0)
    const nb = Number(b.match(/(\d+)/)?.[1] ?? 0)
    return na - nb || a.localeCompare(b)
  })
  .map(([, url]) => url)

const slide = {
  enter: (dir) => ({ x: dir >= 0 ? '55%' : '-55%', opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: (dir) => ({
    x: dir >= 0 ? '-55%' : '55%',
    opacity: 0,
    transition: { duration: 0.22 },
  }),
}

export default function MemoriesSection() {
  const [[index, dir], setSlide] = useState([0, 0])
  const count = photoUrls.length

  const go = useCallback(
    (delta) => {
      if (!count) return
      setSlide(([i]) => {
        const next = i + delta
        return next < 0 || next >= count ? [i, 0] : [next, delta]
      })
    },
    [count],
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  if (!count) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-16 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-white/10 text-gold-light">
          <Images size={26} strokeWidth={1.8} />
        </span>
        <p className="font-display text-xl font-semibold text-milk">
          {memories.emptyTitle}
        </p>
        <p className="max-w-xs text-sm leading-relaxed text-milk/60">
          {memories.emptyBody}
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex justify-center px-4 pt-[max(0.9rem,env(safe-area-inset-top))]">
        <span
          aria-live="polite"
          className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-milk/90 backdrop-blur"
        >
          {index + 1} / {count}
        </span>
      </div>

      <div className="relative min-h-0 flex-1 p-3 sm:px-14">
        <AnimatePresence custom={dir} initial={false}>
          <motion.div
            key={index}
            custom={dir}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70 || info.velocity.x < -500) go(1)
              else if (info.offset.x > 70 || info.velocity.x > 500) go(-1)
            }}
            className="absolute inset-3 cursor-grab select-none active:cursor-grabbing sm:inset-x-14"
            style={{ touchAction: 'pan-y' }}
          >
            <img
              src={photoUrls[index]}
              alt={`${memories.photoAlt} ${index + 1}`}
              draggable={false}
              className="h-full w-full rounded-3xl border border-white/15 object-contain shadow-2xl shadow-black/40"
            />
          </motion.div>
        </AnimatePresence>

        {/* Стрелки — дополнение для desktop, на телефоне свайп */}
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label={memories.prev}
          className="absolute top-1/2 left-3 hidden h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 text-milk backdrop-blur transition hover:bg-white/20 disabled:opacity-30 sm:grid"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={index === count - 1}
          aria-label={memories.next}
          className="absolute top-1/2 right-3 hidden h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/10 text-milk backdrop-blur transition hover:bg-white/20 disabled:opacity-30 sm:grid"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Предзагрузка следующего кадра — свайп не ждёт сеть */}
      {photoUrls[index + 1] && (
        <img src={photoUrls[index + 1]} alt="" aria-hidden className="hidden" />
      )}

      <div className="flex flex-col items-center gap-2.5 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {count <= 15 && (
          <div className="flex items-center gap-1.5" aria-hidden>
            {photoUrls.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index ? 'w-5 bg-gold' : 'w-2 bg-white/25'
                }`}
              />
            ))}
          </div>
        )}
        <p className="text-xs text-milk/50">{memories.swipeHint}</p>
      </div>
    </div>
  )
}
