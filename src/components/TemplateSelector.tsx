import type { EidTemplate, TemplateId } from '../templates/types'

type TemplateSelectorProps = {
  templates: EidTemplate[]
  selectedTemplateId: TemplateId
  onSelectTemplate: (id: TemplateId) => void
}

export default function TemplateSelector({
  templates,
  selectedTemplateId,
  onSelectTemplate,
}: TemplateSelectorProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Templates
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelectTemplate(t.id)}
            className={[
              'rounded-xl border px-2 py-1.5 text-left transition sm:rounded-2xl sm:p-2',
              t.id === selectedTemplateId
                ? 'border-zinc-900/70 dark:border-zinc-100/80 bg-zinc-100/40 dark:bg-zinc-800/40'
                : 'border-zinc-300/60 hover:bg-zinc-100/30 dark:border-zinc-700/60 dark:hover:bg-zinc-800/30',
            ].join(' ')}
          >
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">{t.thumbnail(t.id === selectedTemplateId)}</div>
              <div className="min-w-0">
                <div className="truncate text-xs font-semibold text-zinc-900 sm:text-sm dark:text-zinc-100">
                  {t.name}
                </div>
                <div className="hidden truncate text-xs text-zinc-600 dark:text-zinc-400 sm:block">
                  {t.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

