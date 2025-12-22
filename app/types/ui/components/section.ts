import type { Size3 } from '../common'

export type SectionBackground = 'default' | 'white' | 'gray' | 'gradient' | 'gradient-down' | 'primary' | 'primary-gradient'

export interface BaseSectionProps {
  id?: string
  tag?: 'section' | 'div' | 'article' | 'aside'
  padding?: Size3 | 'xl'
  bg?: SectionBackground
  container?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | 'full'
}
