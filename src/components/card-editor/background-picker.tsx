import { BACKGROUND_PRESETS } from "@/lib/background-presets"
import { useTranslation } from "@/lib/i18n"

interface BackgroundPickerProps {
  selectedBackground?: string
  onSelect: (backgroundId: string | undefined) => void
}

const BG_NAME_MAP: Record<string, keyof typeof import("@/lib/i18n/en")["en"]["backgrounds"]> = {
  "peach-blossom": "peachBlossom",
  "golden-lanterns": "goldenLanterns",
  "mai-flower-field": "maiFlowerField",
  "lucky-red-silk": "luckyRedSilk",
  "spring-morning": "springMorning",
  "fireworks-sky": "fireworksSky",
}

export function BackgroundPicker({ selectedBackground, onSelect }: BackgroundPickerProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t.backgrounds.label}
      </label>

      <div className="grid grid-cols-3 gap-3">
        {/* Default / None option */}
        <button
          onClick={() => onSelect(undefined)}
          className={`relative aspect-[4/3] rounded-lg border-2 transition-all hover:scale-105 overflow-hidden ${
            !selectedBackground
              ? "ring-4 ring-offset-2 ring-rose-500 dark:ring-offset-gray-900 border-rose-500"
              : "border-gray-200 dark:border-gray-700"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{t.backgrounds.none}</span>
          </div>
          {!selectedBackground && <SelectedCheck />}
        </button>

        {/* Preset backgrounds */}
        {BACKGROUND_PRESETS.map((preset) => {
          const isSelected = selectedBackground === preset.id
          const nameKey = BG_NAME_MAP[preset.id]
          const displayName = nameKey ? (t.backgrounds as Record<string, string>)[nameKey] : preset.name

          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset.id)}
              className={`relative aspect-[4/3] rounded-lg border-2 transition-all hover:scale-105 overflow-hidden ${
                isSelected
                  ? "ring-4 ring-offset-2 ring-rose-500 dark:ring-offset-gray-900 border-rose-500"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              title={displayName}
            >
              <div
                className="absolute inset-0"
                style={{ background: preset.css }}
              />
              <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-black/40 backdrop-blur-sm">
                <span className="text-[10px] font-medium text-white leading-tight block truncate">
                  {displayName}
                </span>
              </div>
              {isSelected && <SelectedCheck />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SelectedCheck() {
  return (
    <div className="absolute top-1 right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  )
}
