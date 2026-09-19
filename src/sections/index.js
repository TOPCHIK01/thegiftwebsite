import MemoriesSection from './MemoriesSection'

// Реестр разделов-оверлеев: id карточки → компонент раздела.
// CardOverlay берёт отсюда компонент по card.id.
// Карточки adventure и final — отдельные полноэкранные сцены
// (роутятся через App.jsx), сюда они не входят.
export const sections = {
  memories: MemoriesSection,
}
