import { motion } from 'framer-motion'
import GiftBox from '../components/GiftBox'
import GiftCard from '../components/GiftCard'
import { cards, main } from '../data/content'

export default function MainScene({ activeCard, onCardOpen }) {
  return (
    <motion.div
      className="flex min-h-dvh flex-col items-center px-4 pt-10 pb-12 sm:justify-center sm:pt-10 sm:pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-center font-display text-[clamp(1.3rem,6vw,1.875rem)] font-semibold text-bordeaux/90 italic"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        {main.heading}
      </motion.h2>

      <motion.div
        className="mt-6 mb-7 sm:mt-8 sm:mb-10"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
      >
        <GiftBox mini />
      </motion.div>

      <div className="flex w-full max-w-3xl flex-wrap items-stretch justify-center gap-3 sm:gap-5">
        {cards.map((card, i) => (
          <GiftCard
            key={card.id}
            card={card}
            index={i}
            selected={activeCard === card.id}
            onOpen={onCardOpen}
          />
        ))}
      </div>
    </motion.div>
  )
}
