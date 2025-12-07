import type { SemanticColor } from '~/types/ui'

// ============================================================================
// TRANSLATION KEY MAPPINGS
// ============================================================================

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

// ============================================================================
// BADGE COLORS
// ============================================================================

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

// ============================================================================
// LANGUAGE BADGE STYLES
// ============================================================================

const LANGUAGE_BADGE_CLASSES: Record<string, string> = {
  EN: 'bg-blue-100 text-blue-800',
  TR: 'bg-green-100 text-green-800',
  'EN/TR': 'bg-purple-100 text-purple-800',
  default: 'bg-gray-100 text-gray-800',
}

export function getLanguageBadgeClass(language: string): string {
  const baseClasses = 'px-2 py-1 rounded-lg text-sm'
  const colorClasses = LANGUAGE_BADGE_CLASSES[language] ?? LANGUAGE_BADGE_CLASSES.default
  return `${baseClasses} ${colorClasses}`
}

// ============================================================================
// FACILITY STYLES
// ============================================================================

export interface IconStyle {
  icon: string
  bg: string
  color: string
}

const FACILITY_STYLES: Record<string, IconStyle> = {
  academic: { icon: 'ph:books', bg: 'bg-blue-100', color: 'text-blue-600' },
  recreational: { icon: 'ph:users-three', bg: 'bg-yellow-100', color: 'text-yellow-600' },
  accommodation: { icon: 'ph:bed', bg: 'bg-purple-100', color: 'text-purple-600' },
  dining: { icon: 'ph:fork-knife', bg: 'bg-red-100', color: 'text-red-600' },
  sports: { icon: 'ph:barbell', bg: 'bg-orange-100', color: 'text-orange-600' },
  medical: { icon: 'ph:first-aid', bg: 'bg-pink-100', color: 'text-pink-600' },
  transport: { icon: 'ph:bus', bg: 'bg-indigo-100', color: 'text-indigo-600' },
  technology: { icon: 'ph:wifi-high', bg: 'bg-teal-100', color: 'text-teal-600' },
  default: { icon: 'ph:buildings', bg: 'bg-gray-100', color: 'text-gray-600' },
}

export function getFacilityStyleWithIcon(icon?: string): IconStyle {
  const defaultStyle = FACILITY_STYLES.default!
  if (!icon) return defaultStyle
  return { ...defaultStyle, icon }
}

// ============================================================================
// ADMISSION STYLES
// ============================================================================

export const BORDER_COLORS = ['border-blue-500', 'border-purple-500', 'border-orange-500'] as const

export const SCHOLARSHIP_COLOR_SCHEMES = [
  { bgColor: 'bg-yellow-50', badgeColor: 'bg-yellow-200 text-yellow-800' },
  { bgColor: 'bg-blue-50', badgeColor: 'bg-blue-200 text-blue-800' },
  { bgColor: 'bg-green-50', badgeColor: 'bg-green-200 text-green-800' },
  { bgColor: 'bg-purple-50', badgeColor: 'bg-purple-200 text-purple-800' },
] as const

// ============================================================================
// KEY INFO SECTION STYLES
// ============================================================================

export interface InfoItemStyle {
  icon: string
  iconBg: string
  iconColor: string
}

const INFO_ITEM_STYLES: Record<string, InfoItemStyle> = {
  city: { icon: 'ph:map-pin', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  foundedYear: { icon: 'ph:calendar', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  cost: { icon: 'ph:currency-dollar', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  languages: { icon: 'ph:translate', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
  students: { icon: 'ph:users', iconBg: 'bg-red-100', iconColor: 'text-red-600' },
  accommodation: { icon: 'ph:house', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  ranking: { icon: 'ph:trophy', iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
  internationalStudents: {
    icon: 'ph:globe',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
}

export function getInfoItemStyle(key: string): InfoItemStyle {
  return (
    INFO_ITEM_STYLES[key] ?? { icon: 'ph:info', iconBg: 'bg-gray-100', iconColor: 'text-gray-600' }
  )
}
