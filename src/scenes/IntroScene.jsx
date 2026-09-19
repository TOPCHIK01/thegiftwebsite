import { useRef, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import GiftBox from '../components/GiftBox'
import GlowBurst from '../components/GlowBurst'
import ParticleBurst from '../components/ParticleBurst'
import { intro } from '../data/content'

// Весь тайминг открытия в одном месте — легко подкрутить.
const OPEN_TIMING = {
  total: 2400, // через сколько показать поздравление
}

export default function IntroScene({ onOpen, onOpened }) {
  const [phase, setPhase] = useState('idle') // 'idle' | 'opening'
  const lockRef = useRef(false)
  const boxControls = useAnimationControls()
  const lidControls = useAnimationControls()

  const open = () => {
    if (lockRef.current) return
    lockRef.current = true
    setPhase('opening')
    onOpen?.()

    boxControls.start({
      scale: [1, 1.08, 1.02],
      y: [0, -18, -4],
      transition: { duration: 0.55, ease: 'easeOut', times: [0, 0.55, 1] },
    })
    lidControls.start({
      y: -200,
      x: -30,
      rotate: -20,
      opacity: 0,
      transition: { duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] },
    })

    window.setTimeout(() => onOpened?.(), OPEN_TIMING.total)
  }

  return (
    <motion.div
      className="flex min-h-dvh flex-col items-center justify-center px-6"
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="relative">
        <button
          type="button"
          onClick={open}
          disabled={phase !== 'idle'}
          aria-label={intro.boxLabel}
          className={`block rounded-3xl p-6 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-gold ${
            phase === 'idle' ? 'cursor-pointer' : 'pointer-events-none'
          }`}
        >
          <span className={phase === 'idle' ? 'block animate-gift-float' : 'block'}>
            <motion.span className="block" animate={boxControls}>
              <GiftBox lidControls={lidControls} />
            </motion.span>
          </span>
        </button>

        {phase === 'opening' && (
          <>
            <GlowBurst />
            <ParticleBurst />
          </>
        )}
      </div>

      <motion.p
        className="mt-12 max-w-xs text-center font-display text-lg text-bordeaux/80 italic sm:text-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: phase === 'opening' ? 0 : 1,
          y: phase === 'opening' ? -6 : 0,
        }}
        transition={{ duration: 0.6, delay: phase === 'idle' ? 0.5 : 0 }}
      >
        {intro.subtitle}
      </motion.p>

      <motion.p
        className="mt-3 text-sm font-medium tracking-wide text-ink/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'opening' ? 0 : 1 }}
        transition={{ duration: 0.5, delay: phase === 'idle' ? 1 : 0 }}
      >
        <span className="animate-hint-pulse inline-block">{intro.hint}</span>
      </motion.p>
    </motion.div>
  )
}
