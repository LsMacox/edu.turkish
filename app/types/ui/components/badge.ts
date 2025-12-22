import type { BadgeVariant, Size5, Rounded, SemanticColor } from '../common'

export interface BaseBadgeProps {
  color?: SemanticColor
  size?: Size5
  variant?: BadgeVariant
  rounded?: Exclude<Rounded, 'none' | 'sm'>
  icon?: string
  removable?: boolean
  removeLabel?: string
  dot?: boolean
  pulse?: boolean
  outlined?: boolean
  ariaLabel?: string
}

export interface BaseBadgeEvents {
  remove: []
}

export interface BaseIconBadgeProps {
  icon: string
  color?: SemanticColor
  size?: Size5
  rounded?: Exclude<Rounded, 'none' | 'sm'>
}

export interface BaseIconBadgeEvents {
  click: [event: MouseEvent]
}

export type IconBoxVariant = 'soft' | 'bordered'

export interface BaseIconBoxProps {
  icon: string
  variant?: IconBoxVariant
  color?: SemanticColor
  size?: Size5
  rounded?: Exclude<Rounded, 'none' | 'sm'>
}

export type InfoBadgeSize = 'sm' | 'md'

export interface BaseInfoBadgeProps {
  icon: string
  color?: SemanticColor
  size?: InfoBadgeSize
}

