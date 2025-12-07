import type { Size } from './common'

export interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: Size | 'xl'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  type?: 'button' | 'submit' | 'reset'
  href?: string
  to?: string | object
  ariaLabel?: string
  tabIndex?: number
  preventDefault?: boolean
  stopPropagation?: boolean
  loadingText?: string
}

export interface BaseButtonEvents {
  click: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}
