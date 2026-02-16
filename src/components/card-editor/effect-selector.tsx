import { EffectType } from "@/types"
import { useTranslation } from "@/lib/i18n"

interface EffectOption {
  id: EffectType
  name: string
  description: string
  emoji: string
}

const EFFECT_IDS: { id: EffectType; emoji: string }[] = [
  { id: "fireworks", emoji: "🎆" },
  { id: "snow", emoji: "❄️" },
  { id: "cherry_blossom", emoji: "🌸" },
  { id: "confetti", emoji: "🎉" },
]

interface EffectSelectorProps {
  selectedEffect: EffectType
  onSelect: (effect: EffectType) => void
}

export function EffectSelector({ selectedEffect, onSelect }: EffectSelectorProps) {
  const { t } = useTranslation()

  const effectNameMap: Record<string, string> = {
    fireworks: t.effects.fireworks,
    snow: t.effects.snow,
    cherry_blossom: t.effects.cherryBlossom,
    confetti: t.effects.confetti,
  }

  const effectDescMap: Record<string, string> = {
    fireworks: t.effects.fireworksDesc,
    snow: t.effects.snowDesc,
    cherry_blossom: t.effects.cherryBlossomDesc,
    confetti: t.effects.confettiDesc,
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t.effects.label}
      </label>

      <div className="grid grid-cols-2 gap-3">
        {EFFECT_IDS.map((effect) => {
          const isSelected = effect.id === selectedEffect

          return (
            <button
              key={effect.id}
              onClick={() => onSelect(effect.id)}
              className={`
                p-4 rounded-lg border-2 text-center transition-all
                hover:shadow-md hover:scale-[1.02]
                ${
                  isSelected
                    ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                }
              `}
            >
              <div className="text-4xl mb-2">{effect.emoji}</div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {effectNameMap[effect.id]}
                </span>
                {isSelected && (
                  <svg className="w-5 h-5 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{effectDescMap[effect.id]}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
