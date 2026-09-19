// Звуки игры. Файлы кладутся в src/assets/audio/ и подхватываются
// автоматически по имени: jump.mp3, collect.mp3, hit.mp3, win.mp3,
// checkpoint.mp3, game-music.mp3. Если файла нет — игра идёт без звука.

const files = import.meta.glob('../assets/audio/*.{mp3,ogg,wav,m4a}', {
  eager: true,
  query: '?url',
  import: 'default',
})

// name → url, где name — имя файла без расширения.
const urls = {}
for (const [path, url] of Object.entries(files)) {
  const name = path.split('/').pop().replace(/\.[^.]+$/, '')
  urls[name] = url
}

export class GameAudio {
  constructor() {
    this.muted = false
    this.sounds = {}
    this.musicEl = null
  }

  _get(name) {
    if (!urls[name]) return null
    if (!this.sounds[name]) {
      this.sounds[name] = new Audio(urls[name])
      this.sounds[name].volume = name === 'game-music' ? 0.4 : 0.7
    }
    return this.sounds[name]
  }

  play(name) {
    if (this.muted) return
    const a = this._get(name)
    if (!a) return
    a.currentTime = 0
    a.play().catch(() => {})
  }

  startMusic() {
    if (this.muted) return
    const a = this._get('game-music')
    if (!a) return
    a.loop = true
    a.play().catch(() => {})
    this.musicEl = a
  }

  stopMusic() {
    if (this.musicEl) this.musicEl.pause()
  }

  setMuted(m) {
    this.muted = m
    if (m) {
      this.stopMusic()
    } else if (this.musicEl) {
      this.musicEl.play().catch(() => {})
    }
  }
}
