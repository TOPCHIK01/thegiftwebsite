import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameEngine } from '../../game/GameEngine'
import { level1 } from '../../game/levels/level1'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import GameHUD from './GameHUD'
import TouchControls from './TouchControls'
import { GameStart, GamePause, GameOver, GameWin } from './GameOverlays'
import { game } from '../../data/content'

// Полноэкранная игровая сцена: canvas + HUD + touch-кнопки + экраны.
// React управляет экранами, движок — самой игрой.
export default function GameScreen({ onExit, onWinGift }) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const screenRef = useRef('ready')
  const liveTimer = useRef(null)
  const rotateDismissed = useRef(false)

  const [engine, setEngine] = useState(null)
  const [screen, setScreen] = useState('ready') // ready | playing | paused | over | won
  const [hud, setHud] = useState({
    lives: 3,
    hearts: 0,
    gifts: 0,
    totalHearts: 0,
    totalGifts: 0,
  })
  const [muted, setMuted] = useState(false)
  const [nearGoal, setNearGoal] = useState(false)
  const [winStats, setWinStats] = useState(null)
  const [liveMsg, setLiveMsg] = useState('')
  const [showRotate, setShowRotate] = useState(false)
  const [coarse] = useState(
    () => window.matchMedia('(pointer: coarse)').matches,
  )
  const reduceMotion = usePrefersReducedMotion()

  useEffect(() => {
    screenRef.current = screen
  }, [screen])

  const announce = useCallback((msg) => {
    setLiveMsg(msg)
    clearTimeout(liveTimer.current)
    liveTimer.current = setTimeout(() => setLiveMsg(''), 2500)
  }, [])

  const togglePause = useCallback(() => {
    const eng = engineRef.current
    if (!eng) return
    if (screenRef.current === 'playing') {
      eng.setPaused(true)
      setScreen('paused')
    } else if (screenRef.current === 'paused') {
      eng.setPaused(false)
      setScreen('playing')
    }
  }, [])

  // Движок создаётся один раз при монтировании сцены.
  useEffect(() => {
    const eng = new GameEngine(canvasRef.current, {
      reduceFx: reduceMotion,
      onEvent: (type, payload) => {
        if (type === 'hud') setHud(payload)
        else if (type === 'over') setScreen('over')
        else if (type === 'won') {
          setWinStats(payload)
          setScreen('won')
        } else if (type === 'goal') setNearGoal(payload)
        else if (type === 'checkpoint') announce(game.checkpointReached)
        else if (type === 'pause-toggle') togglePause()
      },
    })
    eng.load(level1)
    engineRef.current = eng
    setEngine(eng)

    const wrap = wrapRef.current
    const ro = new ResizeObserver(() => {
      const r = wrap.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      eng.resize(r.width, r.height, dpr)
      // Мягкая подсказка повернуть телефон (не блокирует игру).
      if (!rotateDismissed.current) {
        setShowRotate(r.width < r.height && r.width < 560)
      }
    })
    ro.observe(wrap)

    const canvas = canvasRef.current
    const onTap = (e) => eng.handleTap(e.clientX, e.clientY)
    canvas.addEventListener('pointerdown', onTap)

    return () => {
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onTap)
      eng.stop()
      engineRef.current = null
      clearTimeout(liveTimer.current)
    }
  }, [reduceMotion, togglePause, announce])

  const play = () => {
    engine?.start()
    setScreen('playing')
  }

  const resume = () => {
    engine?.setPaused(false)
    setScreen('playing')
  }

  const restart = () => {
    engine?.reset()
    setScreen('playing')
  }

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    engine?.setMuted(next)
  }

  return (
    <motion.div
      className="fixed inset-0 z-30 bg-milk select-none"
      style={{ touchAction: 'pan-x pan-y', overscrollBehavior: 'none' }}
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div ref={wrapRef} className="absolute inset-0">
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          style={{ touchAction: 'none' }}
          aria-label="Игровое поле: маленькое приключение"
        />
      </div>

      {screen === 'playing' && engine && (
        <>
          <GameHUD
            hud={hud}
            muted={muted}
            onPause={togglePause}
            onToggleMute={toggleMute}
          />

          {showRotate && (
            <button
              type="button"
              onClick={() => {
                rotateDismissed.current = true
                setShowRotate(false)
              }}
              className="absolute top-16 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-medium text-bordeaux shadow-md backdrop-blur-md"
            >
              {game.rotateHint}
            </button>
          )}

          {nearGoal && (
            <div className="absolute bottom-32 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/60 bg-white/70 px-5 py-2 text-sm font-semibold text-bordeaux shadow-md backdrop-blur-md">
              {game.goalHint}
            </div>
          )}

          {coarse && <TouchControls input={engine.input} />}
        </>
      )}

      <AnimatePresence>
        {screen === 'ready' && (
          <GameStart onPlay={play} onBack={onExit} />
        )}
        {screen === 'paused' && (
          <GamePause onResume={resume} onRestart={restart} onQuit={onExit} />
        )}
        {screen === 'over' && (
          <GameOver onRestart={restart} onQuit={onExit} />
        )}
        {screen === 'won' && winStats && (
          <GameWin stats={winStats} onOpenGift={onWinGift} onBack={onExit} />
        )}
      </AnimatePresence>

      <div aria-live="polite" className="sr-only">
        {liveMsg}
      </div>
    </motion.div>
  )
}
