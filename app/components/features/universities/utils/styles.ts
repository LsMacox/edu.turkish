/**
 * Shared style constants for university components
 */

/**
 * Language badge CSS classes by language code
 */
export const LANGUAGE_BADGE_CLASSES: Record<string, string> = {
  EN: 'bg-blue-100 text-blue-800',
  TR: 'bg-green-100 text-green-800',
  'EN/TR': 'bg-purple-100 text-purple-800',
  default: 'bg-gray-100 text-gray-800',
}

/**
 * Get language badge classes
 */
export function getLanguageBadgeClass(language: string): string {
  const baseClasses = 'px-2 py-1 rounded-lg text-sm'
  const colorClasses = LANGUAGE_BADGE_CLASSES[language] ?? LANGUAGE_BADGE_CLASSES.default
  return `${baseClasses} ${colorClasses}`
}

/**
 * Icon with background style configuration
 */
export interface IconStyle {
  icon: string
  bg: string
  color: string
}

/**
 * Facility type to icon style mapping
 */
export const FACILITY_STYLES: Record<string, IconStyle> = {
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

/**
 * Get facility style with custom icon override
 */
export function getFacilityStyleWithIcon(icon?: string): IconStyle {
  const defaultStyle = FACILITY_STYLES.default!
  if (!icon) return defaultStyle
  return { ...defaultStyle, icon }
}

/**
 * Default facilities for campus life section
 */
export const DEFAULT_FACILITIES = [
  { key: 'library', icon: 'ph:books', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
  { key: 'laboratories', icon: 'ph:flask', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  { key: 'sportsCenter', icon: 'ph:barbell', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
  { key: 'dormitories', icon: 'ph:bed', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  { key: 'cafeteria', icon: 'ph:fork-knife', iconBg: 'bg-red-100', iconColor: 'text-red-600' },
  { key: 'wifi', icon: 'ph:wifi-high', iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
  { key: 'medicalCenter', icon: 'ph:first-aid', iconBg: 'bg-pink-100', iconColor: 'text-pink-600' },
  { key: 'transport', icon: 'ph:bus', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  { key: 'studentClubs', icon: 'ph:users-three', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
] as const

/**
 * Color schemes for admission requirements
 */
export const BORDER_COLORS = ['border-blue-500', 'border-purple-500', 'border-orange-500'] as const

export const SCHOLARSHIP_COLOR_SCHEMES = [
  { bgColor: 'bg-yellow-50', badgeColor: 'bg-yellow-200 text-yellow-800' },
  { bgColor: 'bg-blue-50', badgeColor: 'bg-blue-200 text-blue-800' },
  { bgColor: 'bg-green-50', badgeColor: 'bg-green-200 text-green-800' },
  { bgColor: 'bg-purple-50', badgeColor: 'bg-purple-200 text-purple-800' },
] as const

