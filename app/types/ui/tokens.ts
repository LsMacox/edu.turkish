import type { Size5, WithNone, ShadowSemantic } from './common'

export type SpacingType = 'space' | 'gap' | 'mb' | 'mt' | 'pt' | 'pb'
export type BorderColor = 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'error' | 'info'
export type ShadowValue = WithNone<Size5> | ShadowSemantic
export type StatusColor = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'

export interface StatusBadgeClasses {
    container: string
    icon: string
}

export type RingColor = 'default' | 'primary' | 'white' | 'success' | 'error'

export type CalloutColor = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'

export interface CalloutClasses {
    container: string
    text: string
    icon: string
}
