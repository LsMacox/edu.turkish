export type Size = 'sm' | 'md' | 'lg'
export type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
export type SemanticColor = Color | 'gray'
export type Variant = 'solid' | 'soft' | 'outline'
export type Alignment = 'left' | 'center' | 'right'

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
  // Enhanced accessibility
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaPressed?: boolean
  ariaExpanded?: boolean
  ariaHaspopup?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
  ariaControls?: string
  tabIndex?: number
  // Enhanced interaction
  preventDefault?: boolean
  stopPropagation?: boolean
  loadingText?: string
}

export interface BaseBadgeProps {
  color?: SemanticColor
  size?: Size
  variant?: Variant
  icon?: string
  removable?: boolean
  removeLabel?: string
  // Enhanced properties
  dot?: boolean
  pulse?: boolean
  outlined?: boolean
}

export interface BaseCardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  hover?: boolean | 'lift' | 'shadow' | 'scale'
  bordered?: boolean
  fullHeight?: boolean
  clickable?: boolean
  href?: string
  to?: string | object
  // Enhanced accessibility
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaPressed?: boolean
  headerAriaLabel?: string
  contentAriaLabel?: string
  footerAriaLabel?: string
  clickableDescription?: string
  role?: string
  tabIndex?: number
}

export interface BaseIconTextProps {
  icon: string
  text?: string
  size?: Size
  color?: Color | 'gray'
  iconColor?: Color | 'gray' | 'inherit'
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
  align?: Alignment
  marginBottom?: Size | 'xl' | 'none'
  maxWidth?: Size | 'xl' | '2xl' | 'full'
  balanced?: boolean
}

export interface BaseIconBadgeProps {
  icon: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal'
  size?: Size | 'xl'
  rounded?: 'md' | 'lg' | 'xl' | '2xl'
}

export interface BaseFeatureCardProps {
  icon?: string
  iconColor?: BaseIconBadgeProps['color']
  iconSize?: BaseIconBadgeProps['size']
  title?: string
  titleTag?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  description?: string
  hover?: boolean | 'lift' | 'scale' | 'shadow'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  centered?: boolean
}

export interface BaseSocialLinkProps {
  platform: 'whatsapp' | 'telegram' | 'instagram' | 'linkedin' | 'facebook' | 'youtube' | 'twitter'
  href: string
  size?: Size
  variant?: 'filled' | 'outline'
  ariaLabel?: string
}

export interface BaseStatBadgeProps {
  icon?: string
  label: string
  value?: string
  color?: 'primary' | 'success' | 'info' | 'warning'
  size?: Size
  layout?: 'horizontal' | 'vertical'
}

export interface BaseButtonEvents {
  click: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}

export interface BaseCardEvents {
  click: [event: Event]
  mouseenter: [event: MouseEvent]
  mouseleave: [event: MouseEvent]
}

export interface BaseTextFieldProps {
  modelValue: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  id?: string
  name?: string
  label?: string
  placeholder?: string
  helperText?: string
  error?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
  // Enhanced validation
  validation?: FormFieldValidation
  // Enhanced accessibility
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaRequired?: boolean
  ariaInvalid?: boolean
  // Input constraints
  min?: string | number
  max?: string | number
  step?: string | number
  maxlength?: number | string
  autocomplete?: string
  // Enhanced styling
  clearable?: boolean
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  size?: Size
}

export interface FormFieldValidation {
  required?: boolean
  pattern?: RegExp
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  customValidator?: (value: any) => boolean | string
}
