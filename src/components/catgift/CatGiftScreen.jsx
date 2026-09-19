import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import CatConfettiCanvas from './CatConfettiCanvas'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { catGift } from '../../data/content'

// Фото кота: положи ЛЮБОЙ файл в src/assets/cat/ (cat.jpg, cat.jpeg, cat.png…)
const catUrl =
  Object.values(
    import.meta.glob(
      '../../assets/cat/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
      { eager: true, query: '?url', import: 'default' },
    ),
  )[0] ?? null

// Необязательный звук открытия: src/assets/cat/confetti.mp3
const confettiSound =
  Object.values(
    import.meta.glob('../../assets/cat/confetti.{mp3,ogg,wav,m4a}', {
      eager: true,
      query: '?url',
      import: 'default',
    }),
  )[0] ?? null

// Секретный мемный подарок: большой кот в рамке + бесконечный
// дождь из конфетти и маленьких котов на canvas.
export default function CatGiftScreen({ onExit }) {
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onExit()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onExit])

  // Короткий праздничный звук при открытии (если файл есть).
  // Сцена открывается по тапу — автоплей разрешён, ошибки глушим.
  useEffect(() => {
    if (!confettiSound) return
    const audio = new Audio(confettiSound)
    audio.volume = 0.6
    audio.play().catch(() => {})
    return () => audio.pause()
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-30 select-none overflow-hidden bg-gradient-to-b from-milk via-blush/70 to-rose/45"
      style={{ touchAction: 'pan-y', overscrollBehavior: 'none' }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      <CatConfettiCanvas catUrl={catUrl} reduceMotion={reduceMotion} />

      {/* Мягкое золотое свечение сверху */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/25 blur-3xl"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={onExit}
        aria-label={catGift.back}
        className="absolute z-20 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-white/70 bg-white/75 px-5 text-sm font-semibold text-bordeaux shadow-lg shadow-bordeaux/10 backdrop-blur-md transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        style={{
          top: 'max(0.75rem, env(safe-area-inset-top))',
          left: 'max(0.75rem, env(safe-area-inset-left))',
        }}
      >
        <ArrowLeft size={17} />
        {catGift.back}
      </button>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            delay: 0.25,
            type: 'spring',
            stiffness: 160,
            damping: 17,
          }}
        >
          <motion.div
            animate={
              reduceMotion
                ? {}
                : { scale: [1, 1.025, 1], rotate: [0, 0.7, -0.7, 0] }
            }
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="rounded-[2rem] border border-white/80 bg-white/85 p-3 shadow-2xl shadow-bordeaux/25 backdrop-blur-sm"
          >
            {catUrl ? (
              <img
                src={catUrl}
                alt="Кот — главный герой этого подарка"
                draggable={false}
                className="max-h-[46vh] w-auto max-w-[68vw] rounded-3xl object-contain sm:max-w-[min(46vw,340px)]"
              />
            ) : (
              <div className="grid h-64 w-56 place-items-center rounded-3xl border-2 border-dashed border-rose-deep/40 bg-blush/40 p-6 text-center">
                <span className="text-sm leading-relaxed font-medium text-bordeaux/70">
                  {catGift.noPhoto}
                </span>
              </div>
            )}
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="font-display text-xl font-semibold text-bordeaux/85 italic"
        >
          {catGift.caption}
        </motion.p>
      </div>
    </motion.div>
  )
}
