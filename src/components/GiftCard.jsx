import { motion } from 'framer-motion'
import { Camera, Sparkles, Gift, Gamepad2 } from 'lucide-react'

const ICONS = { Camera, Sparkles, Gift, Gamepad2 }

const ACCENTS = {
  rose: 'from-rose to-powder text-bordeaux',
  gold: 'from-gold-light to-gold text-bordeaux-deep',
  bordeaux: 'from-rose-deep to-bordeaux text-milk',
}

export function CardIcon({ icon, accent, size = 'md' }) {
  const Icon = ICONS[icon] ?? Gift
  const box = size === 'lg' ? 'h-14 w-14' : 'h-11 w-11'
  const iconSize = size === 'lg' ? 26 : 20
  return (
    <span
      className={`grid ${box} shrink-0 place-items-center rounded-full bg-gradient-to-br shadow-inner ${ACCENTS[accent] ?? ACCENTS.rose}`}
    >
      <Icon size={iconSize} strokeWidth={1.8} />
    </span>
  )
}

export default function GiftCard({ card, index, selected, onOpen }) {
  return (
    <motion.button
      type="button"
      layoutId={card.id}
      onClick={() => onOpen(card.id)}
      initial={{ opacity: 0, scale: 0.5, y: -90, rotate: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotate: card.tilt }}
      transition={{
        delay: 0.3 + index * 0.13,
        type: 'spring',
        stiffness: 130,
        damping: 15,
      }}
      whileHover={{ y: -8, rotate: 0, scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      aria-label={card.title}
      className="flex w-[8.5rem] cursor-pointer flex-col items-center gap-2.5 rounded-3xl border border-white/70 bg-white/55 px-3 py-5 text-center shadow-xl shadow-bordeaux/10 backdrop-blur-md transition-shadow focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold sm:w-40 sm:px-4 sm:py-7 sm:gap-3"
    >
      <span
        className="flex flex-col items-center gap-3 transition-opacity duration-200"
        style={{ opacity: selected ? 0 : 1 }}
      >
        <CardIcon icon={card.icon} accent={card.accent} />
        <span className="font-display text-sm leading-snug font-semibold text-bordeaux sm:text-base">
          {card.title}
        </span>
        <span className="text-xs leading-snug text-ink/60">{card.caption}</span>
      </span>
    </motion.button>
  )
}
