import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { message } from '../data/content'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.45, delayChildren: 0.25 } },
}

const line = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function MessageScene({ onContinue }) {
  return (
    <motion.div
      className="flex min-h-dvh flex-col items-center justify-center px-6 text-center"
      variants={container}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45 }}
      aria-live="polite"
    >
      <motion.h1
        variants={line}
        className="font-display text-[clamp(1.8rem,8.5vw,3.75rem)] leading-tight font-semibold text-bordeaux"
        style={{ textShadow: '0 0 30px rgba(232,199,149,.45)' }}
      >
        {message.titleLine1}
        <br />
        <span className="italic">
          {message.titleLine2}
          <Heart
            className="mb-2 ml-2 inline-block fill-rose-deep text-rose-deep"
            size={34}
            aria-label="❤"
          />
        </span>
      </motion.h1>

      <motion.p
        variants={line}
        className="mt-6 max-w-sm text-base leading-relaxed text-ink/65 sm:text-lg"
      >
        {message.subtitle}
      </motion.p>

      <motion.button
        variants={line}
        type="button"
        onClick={onContinue}
        className="mt-10 cursor-pointer rounded-full bg-bordeaux px-8 py-3.5 font-semibold text-milk shadow-lg shadow-bordeaux/25 transition hover:bg-bordeaux-deep hover:shadow-xl hover:shadow-bordeaux/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold active:scale-95"
      >
        {message.button}
      </motion.button>
    </motion.div>
  )
}
