import { useState, lazy, Suspense } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import BackgroundEffects from './components/BackgroundEffects'
import CardOverlay from './components/CardOverlay'
import MusicToggle from './components/MusicToggle'
import IntroScene from './scenes/IntroScene'
import MessageScene from './scenes/MessageScene'
import MainScene from './scenes/MainScene'
import { useMusic } from './hooks/useMusic'
import { cards, game, catGift } from './data/content'

// Игра и кот-сцена подгружаются отдельными чанками только при
// открытии — первый экран сайта остаётся лёгким.
const GameScreen = lazy(() => import('./components/game/GameScreen'))
const CatGiftScreen = lazy(
  () => import('./components/catgift/CatGiftScreen'),
)

function GameLoader({ text }) {
  return (
    <motion.div
      className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-milk"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
      >
        <Heart size={42} className="fill-rose-deep text-rose-deep" />
      </motion.div>
      <p className="font-display text-lg text-bordeaux/80 italic">{text}</p>
    </motion.div>
  )
}

// Сцены сайта: intro → opening → message → main → game / catgift.
// 'opening' живёт внутри IntroScene (непрерывная анимация коробки),
// в App достаточно знать, что подарок начали открывать (для фона и музыки).
export default function App() {
  const [scene, setScene] = useState('intro') // 'intro' | 'opening' | 'message' | 'main' | 'game' | 'catgift'
  const [activeCard, setActiveCard] = useState(null)
  const [gameCompleted, setGameCompleted] = useState(false)
  const music = useMusic()

  const handleOpen = () => {
    setScene('opening')
    music.start() // клик по коробке — жест пользователя, автоплей разрешён
  }

  const handleCardOpen = (id) => {
    if (id === 'adventure') {
      setScene('game')
    } else if (id === 'final') {
      setScene('catgift')
    } else {
      setActiveCard(id)
    }
  }

  // «Открыть подарок» на экране победы → сразу кот и конфетти.
  const handleWinGift = () => {
    setGameCompleted(true)
    setScene('catgift')
  }

  const activeCardData = cards.find((c) => c.id === activeCard) ?? null

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-dvh overflow-x-hidden font-body text-ink">
        <BackgroundEffects opened={scene !== 'intro'} />

        <AnimatePresence mode="wait">
          {(scene === 'intro' || scene === 'opening') && (
            <IntroScene
              key="intro"
              onOpen={handleOpen}
              onOpened={() => setScene('message')}
            />
          )}
          {scene === 'message' && (
            <MessageScene key="message" onContinue={() => setScene('main')} />
          )}
          {scene === 'main' && (
            <MainScene
              key="main"
              activeCard={activeCard}
              onCardOpen={handleCardOpen}
            />
          )}
          {scene === 'game' && (
            <Suspense key="game" fallback={<GameLoader text={game.loading} />}>
              <GameScreen
                completed={gameCompleted}
                onExit={() => setScene('main')}
                onWinGift={handleWinGift}
              />
            </Suspense>
          )}
          {scene === 'catgift' && (
            <Suspense
              key="catgift"
              fallback={<GameLoader text={catGift.loading} />}
            >
              <CatGiftScreen onExit={() => setScene('main')} />
            </Suspense>
          )}
        </AnimatePresence>

        <CardOverlay card={activeCardData} onClose={() => setActiveCard(null)} />

        {scene !== 'intro' && scene !== 'game' && (
          <MusicToggle
            hasTrack={music.hasTrack}
            playing={music.playing}
            onToggle={music.toggle}
          />
        )}
      </div>
    </MotionConfig>
  )
}
