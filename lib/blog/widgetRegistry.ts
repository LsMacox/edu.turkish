import { defineAsyncComponent, type Component } from 'vue'
import type { ProsConsData, ImageGalleryData } from '~/types/blog/widgets'

// Lazy-loaded widget components
const BlogUniversitiesGridWidget = defineAsyncComponent(
  () => import('~/components/features/blog/widgets/UniversitiesGridWidget.vue'),
)
const BlogPriceCardWidget = defineAsyncComponent(
  () => import('~/components/features/blog/widgets/PriceCardWidget.vue'),
)
const BlogProsConsWidget = defineAsyncComponent(
  () => import('~/components/features/blog/widgets/ProsConsWidget.vue'),
)
const BlogImageGalleryWidget = defineAsyncComponent(
  () => import('~/components/features/blog/widgets/ImageGalleryWidget.vue'),
)

export interface WidgetMatch {
  component: Component
  props: Record<string, unknown>
}

export interface WidgetDefinition {
  pattern: string
  component: Component
  parseProps: (text: string) => Record<string, unknown>
}

/**
 * Extract JSON from widget text using bracket counting
 */
const extractWidgetJson = (text: string, prefix: string): string | null => {
  const start = text.indexOf(prefix)
  if (start === -1) return null

  let depth = 0
  const jsonStart = start + prefix.length

  for (let i = jsonStart; i < text.length; i++) {
    if (text[i] === '{') depth++
    else if (text[i] === '}') {
      depth--
      if (depth === 0) return text.substring(jsonStart, i + 1)
    }
  }
  return null
}

/**
 * Parse JSON from widget text with fallback
 */
export const parseWidgetJson = <T>(text: string, prefix: string, fallback: T): T => {
  const json = extractWidgetJson(text, prefix)
  if (!json) return fallback
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

/**
 * Create widget registry with lazy-loaded components
 */
export const createWidgetRegistry = (): WidgetDefinition[] => [
  {
    pattern: '{{WIDGET:UNIVERSITIES}}',
    component: BlogUniversitiesGridWidget as Component,
    parseProps: () => ({}),
  },
  {
    pattern: '{{WIDGET:PRICE}}',
    component: BlogPriceCardWidget as Component,
    parseProps: (text) => ({ text: text.replace('{{WIDGET:PRICE}}', '').trim() }),
  },
  {
    pattern: '{{WIDGET:PROSCONS:',
    component: BlogProsConsWidget as Component,
    parseProps: (text) => ({
      data: parseWidgetJson<ProsConsData>(text, '{{WIDGET:PROSCONS:', { pros: [], cons: [] }),
    }),
  },
  {
    pattern: '{{WIDGET:GALLERY:',
    component: BlogImageGalleryWidget as Component,
    parseProps: (text) => ({
      data: parseWidgetJson<ImageGalleryData>(text, '{{WIDGET:GALLERY:', { images: [] }),
    }),
  },
]

/**
 * Detect widget in text and return match
 */
export const detectWidget = (text: string, registry: WidgetDefinition[]): WidgetMatch | null => {
  for (const widget of registry) {
    if (text.includes(widget.pattern)) {
      return {
        component: widget.component,
        props: widget.parseProps(text),
      }
    }
  }
  return null
}

/**
 * Get text before widget pattern
 */
export const getWidgetTextBefore = (text: string, registry: WidgetDefinition[]): string => {
  for (const widget of registry) {
    const idx = text.indexOf(widget.pattern)
    if (idx !== -1) {
      return text.substring(0, idx).trim()
    }
  }
  return ''
}
