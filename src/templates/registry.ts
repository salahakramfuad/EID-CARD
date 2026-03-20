import type { EidTemplate, TemplateId } from './types'
import modern from './modern'
import islamic from './islamic'
import minimal from './minimal'
import colorful from './colorful'
import elegant from './elegant'
import festive from './festive'
import royal from './royal'
import moonlight from './moonlight'

export const templates: EidTemplate[] = [modern, islamic, minimal, colorful, elegant, festive, royal, moonlight]

export function getTemplateById(id: TemplateId): EidTemplate {
  return templates.find((t) => t.id === id) ?? modern
}

export function templateStyleKey(id: TemplateId): string {
  return getTemplateById(id).styleKey
}

