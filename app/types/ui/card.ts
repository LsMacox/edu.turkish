import type { BaseIconBadgeProps } from './badge'

export interface BaseCardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  hover?: boolean | 'lift' | 'shadow' | 'scale'
  bordered?: boolean
  fullHeight?: boolean
  clickable?: boolean
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

export interface BaseFeatureCardProps {
  icon?: string
  iconColor?: BaseIconBadgeProps['color']
  iconSize?: BaseIconBadgeProps['size']
  title?: string
  titleTag?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  description?: string
  hover?: boolean | 'lift' | 'scale' | 'shadow'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  centered?: boolean
}
