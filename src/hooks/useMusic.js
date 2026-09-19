import { useCallback, useRef, useState } from 'react'

// Автоматически подхватывает первый аудиофайл из src/assets/music/.
// Если файлов нет — hasTrack = false и сайт работает без музыки.
const musicFiles = import.meta.glob('../assets/music/*.{mp3,ogg,wav,m4a}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const trackUrl = Object.values(musicFiles)[0] ?? null

export function useMusic() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const hasTrack = Boolean(trackUrl)

  const start = useCallback(() => {
    if (!trackUrl) return
    if (!audioRef.current) {
      const audio = new Audio(trackUrl)
      audio.loop = true
      audio.volume = 0.55
      audioRef.current = audio
    }
    audioRef.current
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }, [])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      audio.pause()
      setPlaying(false)
    }
  }, [])

  return { hasTrack, playing, start, toggle }
}
