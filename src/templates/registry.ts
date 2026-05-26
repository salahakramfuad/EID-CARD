import type { EidTemplate, TemplateId } from './types'
import cow from './cow'
import goat from './goat'
import camel from './camel'

export const templates: EidTemplate[] = [cow, goat, camel]

export function getTemplateById(id: TemplateId): EidTemplate {
  return templates.find((t) => t.id === id) ?? cow
}

export function templateStyleKey(id: TemplateId): string {
  return getTemplateById(id).styleKey
}
