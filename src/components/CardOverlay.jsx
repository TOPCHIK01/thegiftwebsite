import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { sections } from '../sections'
import { stubText } from '../data/content'
import { CardIcon } from './GiftCard'

// Оверлей-заглушка раздела. Карточка «разворачивается» в панель
// через общий layoutId. Позже сюда подставятся настоящие разделы.
export default function CardOverlay({ card, onClose }) {
  useEffect(() => {
    if (!card) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [card, onClose])

  const Section = card ? sections[card.id] : null

  return (
    <AnimatePresence>
      {card && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-bordeaux-deep/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          {card.gallery ? (
            <motion.div
              key={card.id}
              layoutId={card.id}
              role="dialog"
              aria-modal="true"
              aria-label={card.title}
              className="absolute inset-0 flex flex-col overflow-hidden bg-[#1d1016]"
            >
              <button
                type="button"
                onClick={onClose}
                autoFocus
                aria-label={stubText.back}
                className="absolute z-20 grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/15 bg-white/10 text-milk backdrop-blur transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                style={{
                  top: 'max(0.75rem, env(safe-area-inset-top))',
                  left: 'max(0.75rem, env(safe-area-inset-left))',
                }}
              >
                <ArrowLeft size={20} />
              </button>
              {Section && <Section />}
            </motion.div>
          ) : (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-y-auto"
            style={{
              padding: 'max(1.25rem, env(safe-area-inset-top)) max(1.25rem, env(safe-area-inset-right)) max(1.25rem, env(safe-area-inset-bottom)) max(1.25rem, env(safe-area-inset-left))',
            }}
          >
            <motion.div
              key={card.id}
              layoutId={card.id}
              role="dialog"
              aria-modal="true"
              aria-label={card.title}
              className="pointer-events-auto m-auto max-h-full w-full max-w-md overflow-y-auto rounded-3xl border border-white/70 bg-milk/90 shadow-2xl shadow-bordeaux/25 backdrop-blur-xl"
            >
              <div className="flex flex-col items-center gap-4 p-7 text-center sm:p-9">
                <CardIcon icon={card.icon} accent={card.accent} size="lg" />
                <h3 className="font-display text-2xl font-semibold text-bordeaux">
                  {card.title}
                </h3>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
                {Section && <Section />}
                <button
                  type="button"
                  onClick={onClose}
                  autoFocus
                  className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full border border-powder bg-white/70 px-7 py-3 text-base font-semibold text-bordeaux transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  <ArrowLeft size={16} />
                  {stubText.back}
                </button>
              </div>
            </motion.div>
          </div>
          )}
        </div>
      )}
    </AnimatePresence>
  )
}
