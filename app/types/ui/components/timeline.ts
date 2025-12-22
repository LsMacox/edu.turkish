import type { Size5, WithNone, SemanticColor, CardRounded } from '../common'

export interface BaseTimelineStepProps {
  step?: number | string
  icon?: string
  title?: string
  description?: string
  color?: SemanticColor
}

export interface StatItem {
  value: string | number
  label: string
}

export interface BaseStatsCardProps {
  stats: StatItem[]
  columns?: 2 | 3 | 4
  padding?: WithNone<Size5>
  shadow?: WithNone<Size5>
  rounded?: CardRounded
  valueColor?: SemanticColor
}
