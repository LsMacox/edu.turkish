import type { SemanticColor, Size } from './common'

export interface BaseBadgeProps {
  color?: SemanticColor
  size?: Size
  variant?: 'solid' | 'soft' | 'outline'
  icon?: string
  removable?: boolean
  removeLabel?: string
  dot?: boolean
  pulse?: boolean
  outlined?: boolean
}

export interface BaseIconBadgeProps {
  icon: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal'
  size?: Size | 'xl'
  rounded?: 'md' | 'lg' | 'xl' | '2xl'
}

export interface BaseStatBadgeProps {
  icon?: string
  label: string
  value?: string
  color?: 'primary' | 'success' | 'info' | 'warning'
  size?: Size
  layout?: 'horizontal' | 'vertical'
}
