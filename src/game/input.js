// Управление: клавиатура + touch-кнопки (React дёргает set* методы).
// Слушатели вешаются один раз в attach() и снимаются в detach() —
// при рестарте игры ничего не переустанавливается.

const KEYS_LEFT = ['ArrowLeft', 'a', 'A', 'ф', 'Ф']
const KEYS_RIGHT = ['ArrowRight', 'd', 'D', 'в', 'В']
const KEYS_JUMP = [' ', 'ArrowUp', 'w', 'W', 'ц', 'Ц']

export class Input {
  constructor(onJumpPress, onPausePress) {
    this.left = false
    this.right = false
    this.jumpHeld = false
    this.onJumpPress = onJumpPress // прыжок или «открыть подарок»
    this.onPausePress = onPausePress

    this._down = (e) => {
      if (e.key === 'Escape') {
        this.onPausePress?.()
        return
      }
      // Пробел на сфокусированной кнопке (меню паузы/рестарта)
      // должен активировать её, а не перехватываться игрой.
      if (
        e.key === ' ' &&
        e.target instanceof HTMLElement &&
        e.target.closest('button')
      ) {
        return
      }
      if (KEYS_LEFT.includes(e.key)) {
        this.left = true
        e.preventDefault()
      } else if (KEYS_RIGHT.includes(e.key)) {
        this.right = true
        e.preventDefault()
      } else if (KEYS_JUMP.includes(e.key)) {
        if (!e.repeat) this.onJumpPress?.()
        this.jumpHeld = true
        e.preventDefault()
      }
    }

    this._up = (e) => {
      if (KEYS_LEFT.includes(e.key)) this.left = false
      else if (KEYS_RIGHT.includes(e.key)) this.right = false
      else if (KEYS_JUMP.includes(e.key)) this.jumpHeld = false
    }
  }

  attach() {
    window.addEventListener('keydown', this._down)
    window.addEventListener('keyup', this._up)
  }

  detach() {
    window.removeEventListener('keydown', this._down)
    window.removeEventListener('keyup', this._up)
    this.reset()
  }

  reset() {
    this.left = false
    this.right = false
    this.jumpHeld = false
  }

  // Методы для touch-кнопок.
  setLeft(v) {
    this.left = v
  }
  setRight(v) {
    this.right = v
  }
  pressJump() {
    this.jumpHeld = true
    this.onJumpPress?.()
  }
  releaseJump() {
    this.jumpHeld = false
  }
}
