import type { ButtonRounded, Size5 } from '../common'

export type CoreButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'gradient'
  | 'inverted'
  | 'link'

export type ChipButtonVariant =
  | 'chip'
  | 'chip-pill'
  | 'suggestion'

export type IconActionVariant =
  | 'icon'
  | 'icon-circle'
  | 'icon-close-lg'
  | 'icon-close-md'
  | 'icon-close-sm'

export type SocialButtonVariant =
  | 'social-whatsapp'
  | 'social-telegram'
  | 'social-instagram'
  | 'whatsapp-cta'

export type TabButtonVariant =
  | 'tab-active'
  | 'tab-inactive'
  | 'tab-pros'
  | 'tab-cons'

export type SpecializedButtonVariant =
  | 'pagination'
  | 'lightbox-close'
  | 'lightbox-nav'
  | 'pill-secondary'
  | 'toast-close'
  | 'input-clear'

export type ButtonVariant =
  | CoreButtonVariant
  | ChipButtonVariant
  | IconActionVariant
  | SocialButtonVariant
  | TabButtonVariant
  | SpecializedButtonVariant

export interface BaseButtonProps {
  variant?: ButtonVariant
  size?: Size5
  rounded?: ButtonRounded
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  type?: 'button' | 'submit' | 'reset'
  href?: string
  rel?: string
  target?: string
  to?: string | object
  ariaLabel?: string
  tabIndex?: number
  preventDefault?: boolean
  stopPropagation?: boolean
  loadingText?: string
  noFocusRing?: boolean
}

export interface BaseButtonEvents {
  click: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}

export type IconButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'subtle'

export type IconButtonShape = 'square' | 'circle'

export interface BaseIconButtonProps {
  icon: string
  variant?: IconButtonVariant
  size?: Size5
  shape?: IconButtonShape
  rounded?: ButtonRounded
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  href?: string
  to?: string | object
  ariaLabel?: string
  tabIndex?: number
  preventDefault?: boolean
  stopPropagation?: boolean
}

export interface BaseIconButtonEvents {
  click: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}

