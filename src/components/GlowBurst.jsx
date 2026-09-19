import { motion } from 'framer-motion'

// Мягкое золотисто-белое свечение, «вырывающееся» из коробки при открытии.
export default function GlowBurst() {
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-1/3 z-10 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        background:
          'radial-gradient(circle, rgba(255,252,246,.95) 0%, rgba(232,199,149,.75) 35%, rgba(243,217,222,.4) 60%, transparent 75%)',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 2.4, 3], opacity: [0, 1, 0] }}
      transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut', times: [0, 0.45, 1] }}
      aria-hidden="true"
    />
  )
}
