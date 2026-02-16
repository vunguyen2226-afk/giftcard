import { TEMPLATES } from "@/templates"
import Image from "next/image"
import { useTranslation } from "@/lib/i18n"

interface TemplateSelectorProps {
  selectedTemplateId: string
  onSelect: (templateId: string, defaultColor: string, defaultFont: string, defaultImage?: string) => void
}

const TEMPLATE_KEYS: Record<string, { name: string; desc: string }> = {
  traditional: { name: "traditional", desc: "traditionalDesc" },
  modern: { name: "modern", desc: "modernDesc" },
  animated: { name: "animated", desc: "animatedDesc" },
  minimal: { name: "minimal", desc: "minimalDesc" },
  elegant: { name: "elegant", desc: "elegantDesc" },
}

export function TemplateSelector({ selectedTemplateId, onSelect }: TemplateSelectorProps) {
  const { t } = useTranslation()
  const tpl = t.templates as Record<string, string>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.templates.title}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t.templates.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map((template) => {
          const isSelected = template.id === selectedTemplateId
          const keys = TEMPLATE_KEYS[template.id]
          const name = keys ? tpl[keys.name] : template.name
          const desc = keys ? tpl[keys.desc] : template.description

          return (
            <button
              key={template.id}
              onClick={() => onSelect(template.id, template.defaultColor, template.defaultFont, template.defaultImage)}
              className={`
                relative group rounded-xl overflow-hidden border-2 transition-all
                hover:shadow-xl hover:scale-[1.02]
                ${
                  isSelected
                    ? "border-rose-500 ring-4 ring-rose-100 dark:ring-rose-900/30"
                    : "border-gray-200 dark:border-gray-700 hover:border-rose-300"
                }
              `}
            >
              {/* Thumbnail */}
              <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 relative">
                <Image
                  src={template.thumbnail}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-rose-600 text-white rounded-full p-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 bg-white dark:bg-gray-900 text-left">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 capitalize">
                    {name}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
