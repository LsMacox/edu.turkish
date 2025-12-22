import type { Size5, Size3, WithNone, SemanticColor } from '../common'

export interface BaseIconTextProps {
  icon: string
  text?: string
  size?: Size5
  color?: SemanticColor
  iconColor?: SemanticColor | 'inherit'
  align?: 'left' | 'center' | 'right'
  spacing?: Size5
  truncate?: boolean
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
}

export interface BaseSectionHeaderProps {
  title?: string
  subtitle?: string
  preTitle?: string
  titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: Size5
  align?: 'left' | 'center' | 'right'
  marginBottom?: WithNone<Size3 | 'xl'>
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  balanced?: boolean
}

export interface BaseIconTextEvents {
  click: [event: MouseEvent]
}

export interface BaseSectionHeaderEvents {
  click: [event: MouseEvent]
}
