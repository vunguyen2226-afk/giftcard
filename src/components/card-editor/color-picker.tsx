import { useState } from "react"
import { COLOR_PRESETS } from "@/lib/color-presets"

interface ColorPickerProps {
  selectedColor: string
  onSelect: (color: string) => void
}

export function ColorPicker({ selectedColor, onSelect }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(selectedColor)

  const handleCustomColorChange = (value: string) => {
    setCustomColor(value)
    if (/^#[0-9A-F]{6}$/i.test(value)) {
      onSelect(value)
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Primary Color
      </label>

      {/* Preset Colors */}
      <div className="grid grid-cols-5 gap-3">
        {COLOR_PRESETS.map((preset) => {
          const isSelected = preset.hex.toLowerCase() === selectedColor.toLowerCase()

          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset.hex)}
              className={`
                relative aspect-square rounded-lg transition-all hover:scale-110
                ${isSelected ? "ring-4 ring-offset-2 ring-rose-500 dark:ring-offset-gray-900" : "ring-2 ring-gray-200 dark:ring-gray-700"}
              `}
              style={{ backgroundColor: preset.hex }}
              title={preset.name}
              aria-label={preset.name}
            >
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Custom Color Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
          Or enter custom color
        </label>
        <div className="flex gap-3 items-center">
          <input
            type="color"
            value={customColor}
            onChange={(e) => handleCustomColorChange(e.target.value)}
            className="h-10 w-16 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => handleCustomColorChange(e.target.value)}
            placeholder="#000000"
            pattern="^#[0-9A-Fa-f]{6}$"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-rose-500 focus:border-transparent
                     font-mono text-sm"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Enter hex color code (e.g., #FF5733)
        </p>
      </div>

      {/* Color Preview */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div
          className="w-12 h-12 rounded-lg ring-2 ring-gray-200 dark:ring-gray-700"
          style={{ backgroundColor: selectedColor }}
        />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">Current Color</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{selectedColor}</p>
        </div>
      </div>
    </div>
  )
}
