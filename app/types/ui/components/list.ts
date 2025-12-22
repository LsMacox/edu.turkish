export type ListStyle = 'standard' | 'checklist' | 'steps'

export interface BaseListProps {
  items: string[]
  ordered?: boolean
  listStyle?: ListStyle
}
