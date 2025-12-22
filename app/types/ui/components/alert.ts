export type AlertVariant = 'success' | 'warning' | 'error' | 'info'
export type AlertLayout = 'default' | 'horizontal'

export interface BaseAlertProps {
  variant?: AlertVariant
  layout?: AlertLayout
  title?: string
  icon?: string
}
