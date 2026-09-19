import { Sparkles } from 'lucide-react'
import { stubText } from '../data/content'

// Общая заглушка раздела. Когда будешь наполнять раздел —
// замени содержимое нужного файла в src/sections/ на настоящее.
export default function SectionStub() {
  return (
    <div className="w-full rounded-2xl border border-white/80 bg-white/60 px-5 py-6">
      <Sparkles className="mx-auto mb-3 text-gold" size={24} />
      <p className="font-display text-lg font-medium text-bordeaux">
        {stubText.title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">
        {stubText.body}
      </p>
    </div>
  )
}
