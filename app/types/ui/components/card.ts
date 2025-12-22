import type { Size5, WithNone, ShadowSemantic, CardRounded } from '../common'

export type CardVariant = 'default' | 'surface' | 'bordered'
export type CardHoverEffect = 'lift' | 'shadow' | 'scale'

export interface BaseCardProps {
  variant?: CardVariant
  padding?: WithNone<Size5>
  shadow?: WithNone<Size5> | ShadowSemantic
  rounded?: CardRounded
  bordered?: boolean
  fullHeight?: boolean
  hover?: boolean | CardHoverEffect
  clickable?: boolean
  selected?: boolean
  href?: string
  to?: string | object
  ariaLabel?: string
  tabIndex?: number
}

export interface BaseCardEvents {
  click: [event: Event]
  mouseenter: [event: MouseEvent]
  mouseleave: [event: MouseEvent]
}

