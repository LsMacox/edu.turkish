import type { Size5, SemanticColor } from '../common'

export type FeatureCardLayout = 'vertical' | 'horizontal'

export interface BaseFeatureCardProps {
  icon: string
  iconColor?: SemanticColor
  iconSize?: Size5
  title: string
  description?: string
  label?: string
  layout?: FeatureCardLayout
  centered?: boolean
  step?: number | string
  stepBadge?: {
    icon?: string
    text?: string
  }
  ariaLabel?: string
}

export interface BaseFeatureCardEvents {
  click: [event: MouseEvent]
}
