import type { SemanticColor } from '~/types/ui'
import { SEMANTIC_COLOR_TOKENS } from '~/composables/ui/tokens/colors'

const LANGUAGE_BADGE_CLASSES: Record<string, string> = {
    EN: 'bg-info-light text-info-dark',
    TR: 'bg-success-light text-success-dark',
    'EN/TR': 'bg-primary-soft text-primary',
    default: 'bg-surface-elevated text-muted',
}

export function getLanguageBadgeClass(language: string): string {
    const baseClasses = 'px-2 py-1 rounded-lg text-sm'
    const colorClasses = LANGUAGE_BADGE_CLASSES[language] ?? LANGUAGE_BADGE_CLASSES.default
    return `${baseClasses} ${colorClasses}`
}

export interface FacilityIconStyle {
    icon: string
    bg: string
    color: string
}

const t = SEMANTIC_COLOR_TOKENS

const FACILITY_STYLES: Record<string, FacilityIconStyle> = {
    academic: { icon: 'ph:books', bg: t.info.bgSoft, color: t.info.text },
    recreational: { icon: 'ph:users-three', bg: t.warning.bgSoft, color: t.warning.text },
    accommodation: { icon: 'ph:bed', bg: t.primary.bgSoft, color: t.primary.text },
    dining: { icon: 'ph:fork-knife', bg: t.error.bgSoft, color: t.error.text },
    sports: { icon: 'ph:barbell', bg: t.warning.bgSoft, color: t.warning.text },
    medical: { icon: 'ph:first-aid', bg: t.error.bgSoft, color: t.error.text },
    transport: { icon: 'ph:bus', bg: t.info.bgSoft, color: t.info.text },
    technology: { icon: 'ph:wifi-high', bg: t.success.bgSoft, color: t.success.text },
    default: { icon: 'ph:buildings', bg: t.neutral.bgSoft, color: t.neutral.text },
}

export function getFacilityStyleWithIcon(icon?: string): FacilityIconStyle {
    const defaultStyle = FACILITY_STYLES.default!
    if (!icon) return defaultStyle
    return { ...defaultStyle, icon }
}

export function getFacilityStyle(category: string): FacilityIconStyle {
    return FACILITY_STYLES[category] ?? FACILITY_STYLES.default!
}

export const ADMISSION_BORDER_COLORS = ['border-info', 'border-primary', 'border-warning'] as const

export const SCHOLARSHIP_COLOR_SCHEMES = [
    { bgColor: 'bg-warning-light', badgeColor: 'bg-warning-dark/20 text-warning-dark' },
    { bgColor: 'bg-info-light', badgeColor: 'bg-info-dark/20 text-info-dark' },
    { bgColor: 'bg-success-light', badgeColor: 'bg-success-dark/20 text-success-dark' },
    { bgColor: 'bg-primary-soft', badgeColor: 'bg-primary-light text-red-900' },
] as const

export interface InfoItemStyle {
    icon: string
    color: SemanticColor
}

const INFO_ITEM_STYLES: Record<string, InfoItemStyle> = {
    city: { icon: 'ph:map-pin', color: 'info' },
    foundedYear: { icon: 'ph:calendar', color: 'primary' },
    cost: { icon: 'ph:currency-dollar', color: 'success' },
    languages: { icon: 'ph:translate', color: 'warning' },
    students: { icon: 'ph:users', color: 'primary' },
    accommodation: { icon: 'ph:bed', color: 'info' },
    ranking: { icon: 'ph:trophy', color: 'warning' },
    internationalStudents: { icon: 'ph:globe', color: 'success' },
}

const DEFAULT_INFO_ITEM_STYLE: InfoItemStyle = {
    icon: 'ph:info',
    color: 'neutral',
}

export function getInfoItemStyle(key: string): InfoItemStyle {
    return INFO_ITEM_STYLES[key] ?? DEFAULT_INFO_ITEM_STYLE
}

export { LANGUAGE_BADGE_CLASSES, FACILITY_STYLES, INFO_ITEM_STYLES }
