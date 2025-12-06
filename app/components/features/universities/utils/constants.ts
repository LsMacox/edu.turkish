import type { SemanticColor } from '~/types/ui'

// Translation key mappings - single source of truth
export const TYPE_LABEL_KEYS: Record<string, string> = {
  state: 'universities_page.filters.types.state',
  private: 'universities_page.filters.types.private',
  tech: 'universities_page.filters.types.tech',
  elite: 'universities_page.filters.types.elite',
}

export const LEVEL_LABEL_KEYS: Record<string, string> = {
  bachelor: 'universities_page.filters.levels.bachelor',
  master: 'universities_page.filters.levels.master',
  phd: 'universities_page.filters.levels.doctorate',
}

export const LANGUAGE_LABEL_KEYS: Record<string, string> = {
  EN: 'universities_page.filters.languages.en',
  TR: 'universities_page.filters.languages.tr',
  RU: 'universities_page.filters.languages.ru',
}

// Badge color mappings
export const TYPE_BADGE_COLORS: Record<string, SemanticColor> = {
  state: 'info',
  private: 'warning',
  tech: 'primary',
  elite: 'success',
}

export const BADGE_COLOR_MAP: Record<string, SemanticColor> = {
  green: 'success',
  blue: 'info',
  orange: 'warning',
  purple: 'primary',
  yellow: 'warning',
}
