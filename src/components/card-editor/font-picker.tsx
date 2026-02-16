import { FONT_DEFINITIONS } from "@/lib/font-definitions"
import { FontFamily } from "@/types"
import { useTranslation } from "@/lib/i18n"

interface FontPickerProps {
  selectedFont: FontFamily
  onSelect: (font: FontFamily) => void
}

export function FontPicker({ selectedFont, onSelect }: FontPickerProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t.fonts.label}
      </label>

      <div className="grid grid-cols-1 gap-3">
        {FONT_DEFINITIONS.map((font) => {
          const isSelected = font.id === selectedFont

          return (
            <button
              key={font.id}
              onClick={() => onSelect(font.id)}
              className={`
                p-4 rounded-lg border-2 text-left transition-all
                hover:shadow-md
                ${
                  isSelected
                    ? "border-rose-500 bg-rose-50 dark:bg-rose-900/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {font.name}
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
                  <p
                    className="text-2xl text-gray-700 dark:text-gray-300 mb-2"
                    style={{ fontFamily: font.cssFamily }}
                  >
                    Happy New Year!
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{font.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
