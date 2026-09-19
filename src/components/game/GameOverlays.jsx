import { motion } from 'framer-motion'
import { Heart, Gift, Gamepad2, ArrowLeft } from 'lucide-react'
import { game } from '../../data/content'

// Общий стеклянный контейнер для экранов игры.
function Panel({ children, wide = false }) {
  return (
    <motion.div
      className="absolute inset-0 z-30 flex items-center justify-center overflow-y-auto bg-bordeaux-deep/25 backdrop-blur-sm"
      style={{
        padding: 'max(1.25rem, env(safe-area-inset-top)) max(1.25rem, env(safe-area-inset-right)) max(1.25rem, env(safe-area-inset-bottom)) max(1.25rem, env(safe-area-inset-left))',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        className={`m-auto flex max-h-full w-full ${wide ? 'max-w-lg' : 'max-w-md'} flex-col items-center gap-4 overflow-y-auto rounded-3xl border border-white/70 bg-milk/92 p-7 text-center shadow-2xl shadow-bordeaux/25 backdrop-blur-xl sm:p-9`}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

function PrimaryButton({ onClick, children, autoFocus = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      autoFocus={autoFocus}
      className="w-full cursor-pointer rounded-full bg-bordeaux px-8 py-3.5 font-semibold text-milk shadow-lg shadow-bordeaux/25 transition hover:bg-bordeaux-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold active:scale-95"
    >
      {children}
    </button>
  )
}

function GhostButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-powder bg-white/70 px-6 py-3 text-sm font-semibold text-bordeaux transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
    >
      {children}
    </button>
  )
}

export function GameStart({ onPlay, onBack }) {
  return (
    <Panel>
      <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-rose to-powder text-bordeaux shadow-inner">
        <Gamepad2 size={30} strokeWidth={1.8} />
      </span>
      <h2 className="font-display text-2xl font-semibold text-bordeaux sm:text-3xl">
        {game.title}
      </h2>
      <p className="max-w-xs text-sm leading-relaxed text-ink/70">
        {game.subtitle}
      </p>
      <p className="text-xs text-ink/50">{game.controlsHint}</p>
      <div className="mt-2 flex w-full flex-col gap-2.5">
        <PrimaryButton onClick={onPlay} autoFocus>
          {game.play}
        </PrimaryButton>
        <GhostButton onClick={onBack}>
          <ArrowLeft size={16} />
          {game.back}
        </GhostButton>
      </div>
    </Panel>
  )
}

export function GamePause({ onResume, onRestart, onQuit }) {
  return (
    <Panel>
      <h2 className="font-display text-2xl font-semibold text-bordeaux">
        {game.pause}
      </h2>
      <div className="mt-2 flex w-full flex-col gap-2.5">
        <PrimaryButton onClick={onResume} autoFocus>
          {game.resume}
        </PrimaryButton>
        <GhostButton onClick={onRestart}>{game.restart}</GhostButton>
        <GhostButton onClick={onQuit}>{game.quit}</GhostButton>
      </div>
    </Panel>
  )
}

export function GameOver({ onRestart, onQuit }) {
  return (
    <Panel>
      <h2 className="font-display text-2xl font-semibold text-bordeaux sm:text-3xl">
        {game.gameOverTitle}
      </h2>
      <div className="mt-2 flex w-full flex-col gap-2.5">
        <PrimaryButton onClick={onRestart} autoFocus>
          {game.gameOverRestart}
        </PrimaryButton>
        <GhostButton onClick={onQuit}>
          <ArrowLeft size={16} />
          {game.backToGift}
        </GhostButton>
      </div>
    </Panel>
  )
}

export function GameWin({ stats, onOpenGift, onBack }) {
  return (
    <Panel>
      <h2 className="font-display text-3xl font-semibold text-bordeaux">
        {game.winTitle}
      </h2>
      <div className="flex items-center gap-5 text-bordeaux">
        <span className="flex items-center gap-1.5 text-lg font-semibold">
          <Heart size={19} className="fill-rose-deep text-rose-deep" />
          {stats.hearts}/{stats.totalHearts}
        </span>
        <span className="flex items-center gap-1.5 text-lg font-semibold">
          <Gift size={19} className="text-gold" />
          {stats.gifts}/{stats.totalGifts}
        </span>
      </div>
      <p className="text-xs tracking-wide text-ink/50 uppercase">
        {game.winHearts} · {game.winGifts}
      </p>
      <p className="font-display text-lg text-bordeaux/90 italic">
        {game.winNote}
      </p>
      <div className="mt-2 flex w-full flex-col gap-2.5">
        <PrimaryButton onClick={onOpenGift} autoFocus>
          {game.openGift}
        </PrimaryButton>
        <GhostButton onClick={onBack}>{game.winBack}</GhostButton>
      </div>
    </Panel>
  )
}
