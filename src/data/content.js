// Все тексты сайта — меняй здесь, компоненты трогать не нужно.

export const intro = {
  subtitle: 'Для тебя',
  hint: 'Нажми, чтобы открыть',
  boxLabel: 'Открыть подарок',
}

export const message = {
  titleLine1: 'С днём рождения,',
  titleLine2: 'мам',
  subtitle: 'Подарок для тебя',
  button: 'Открыть подарок дальше →',
}

export const main = {
  heading: 'Выбери, что открыть первым',
}

// Карточки на главной сцене. icon — имя иконки из lucide-react (см. GiftCard.jsx),
// tilt — постоянный наклон карточки в градусах, accent — цвет иконки.
export const cards = [
  {
    id: 'adventure',
    title: 'Маленькое приключение',
    caption: 'Короткое путешествие за подарком',
    icon: 'Gamepad2',
    accent: 'bordeaux',
    tilt: -3,
  },
  {
    id: 'memories',
    title: 'Наши воспоминания',
    caption: 'Фотографии и крутые моменты',
    icon: 'Camera',
    accent: 'rose',
    tilt: -4,
    gallery: true,
  },
  {
    id: 'final',
    title: 'Ещё один подарок',
    caption: 'Сюрприз внутри',
    icon: 'Sparkles',
    accent: 'gold',
    tilt: 5,
  },
]

export const stubText = {
  title: 'Скоро здесь будет кое-что особенное',
  body: 'Этот раздел ещё наполняется любовью. Загляни чуть позже ❤️',
  back: 'Назад',
}

// Секретный подарок «Кот и конфетти».
// Фото кота кладётся в src/assets/cat/ — любой файл jpg/jpeg/png/webp,
// подхватится автоматически (например cat.jpg или cat.jpeg).
// Необязательный звук открытия: src/assets/cat/confetti.mp3
export const catGift = {
  loading: 'Открываем подарок…',
  caption: 'Кот.',
  back: 'Назад к подаркам',
  noPhoto:
    'Положи фото кота в src/assets/cat/ — и он станет звездой этой сцены 🐱',
}

// Галерея «Наши воспоминания». Фотографии кладутся в src/assets/photos/
// и называются числами: 1.jpg, 2.jpg, 3.jpg … — порядок = номера.
export const memories = {
  emptyTitle: 'Здесь будут наши фотографии',
  emptyBody: 'Этот раздел ещё наполняется тёплыми моментами ❤️',
  swipeHint: 'Свайпай, чтобы листать фотографии',
  photoAlt: 'Наше воспоминание',
  prev: 'Предыдущая фотография',
  next: 'Следующая фотография',
}

// Все тексты игры — тоже меняются здесь.
export const game = {
  loading: 'Загружаем приключение…',
  title: 'Небольшое приключение для тебя ❤️',
  subtitle:
    'Собирай сердечки, перепрыгивай препятствия и найди подарок в конце пути',
  play: 'Играть',
  back: 'Назад',
  controlsHint: 'На телефоне — кнопки внизу экрана, на компьютере — стрелки и пробел',
  rotateHint: 'Для этой маленькой игры удобнее повернуть телефон ❤️',
  goalHint: 'Нажми ↑ или коснись подарка',
  pause: 'Пауза',
  resume: 'Продолжить',
  restart: 'Начать заново',
  quit: 'Выйти из игры',
  gameOverTitle: 'Попробуем ещё раз? ❤️',
  gameOverRestart: 'Начать заново',
  backToGift: 'Вернуться к подарку',
  winTitle: 'Ура! Ты дошла до конца! 🎉',
  winHearts: 'Собрано сердечек',
  winGifts: 'Подарков найдено',
  winNote: '«А теперь забирай настоящий подарок ❤️»',
  openGift: 'Открыть подарок',
  winBack: 'Вернуться',
  checkpointReached: 'Чекпоинт!',
  giftOpened: 'Ты нашла подарок! 🎁',
}
