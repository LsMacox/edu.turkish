import type { SemanticColor, Size } from './common'

export interface BaseIconTextProps {
  icon: string
  text?: string
  size?: Size
  color?: SemanticColor
  iconColor?: SemanticColor | 'inherit'
  align?: 'start' | 'center' | 'end'
  spacing?: Size
  truncate?: boolean
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
}

export interface BaseSectionHeaderProps {
  title?: string
  subtitle?: string
  preTitle?: string
  titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: Size | 'xl'
  align?: 'left' | 'center' | 'right'
  marginBottom?: Size | 'xl' | 'none'
}
