import type { Size5, WithNone } from '~/types/ui'

export type ShadowSize = WithNone<Size5>

export const SHADOW_SIZE_MAP: Record<ShadowSize, string> = {
    none: '',
    xs: 'shadow-sm',
    sm: 'shadow-button',
    md: 'shadow-card',
    lg: 'shadow-card-hover',
    xl: 'shadow-card-hover',
}
