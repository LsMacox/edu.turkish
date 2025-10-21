// Base UI Component Types for edu.turkish

export type Size = 'sm' | 'md' | 'lg'
export type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
export type SemanticColor = Color | 'gray'
export type Variant = 'solid' | 'soft' | 'outline'
export type Alignment = 'left' | 'center' | 'right'

// Enhanced component state types
export type ComponentState = 'idle' | 'loading' | 'error' | 'success' | 'disabled'
export type ButtonState = ComponentState
export type CardState = 'idle' | 'hover' | 'active' | 'selected'

// Enhanced BaseButton Component Interface
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

// Enhanced BaseBadge Component Interface
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

// BaseCard Component Interface
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

// BaseIconText Component Interface
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

// BaseSectionHeader Component Interface
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

// BaseIconBadge Component Interface
export interface BaseIconBadgeProps {
  icon: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal'
  size?: Size | 'xl'
  rounded?: 'md' | 'lg' | 'xl' | '2xl'
}

// BaseFeatureCard Component Interface
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

// BaseSocialLink Component Interface
export interface BaseSocialLinkProps {
  platform: 'whatsapp' | 'telegram' | 'instagram' | 'linkedin' | 'facebook' | 'youtube' | 'twitter'
  href: string
  size?: Size
  variant?: 'filled' | 'outline'
  ariaLabel?: string
}

// BaseStatBadge Component Interface
export interface BaseStatBadgeProps {
  icon?: string
  label: string
  value?: string
  color?: 'primary' | 'success' | 'info' | 'warning'
  size?: Size
  layout?: 'horizontal' | 'vertical'
}

// Enhanced Event Interfaces
export interface BaseButtonEvents {
  click: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}

export interface BaseBadgeEvents {
  remove: []
  click?: [event: Event]
}

export interface BaseCardEvents {
  click: [event: Event]
  mouseenter: [event: MouseEvent]
  mouseleave: [event: MouseEvent]
}

export interface BaseTextFieldEvents {
  'update:modelValue': [value: string | number]
  input: [event: Event]
  change: [event: Event]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  keydown?: [event: KeyboardEvent]
  keyup?: [event: KeyboardEvent]
  clear?: []
}

// Theme-related Types
export interface DesignTokens {
  colors: {
    primary: string
    secondary: string
    background: string
  }
  spacing: {
    section: string
    sectionSm: string
    sectionLg: string
  }
  borderRadius: {
    card: string
    cardLg: string
    button: string
  }
  touchTargets: {
    minimum: string
    comfortable: string
  }
}

// Responsive Breakpoint Types
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

// Enhanced Accessibility Types
export interface AccessibilityProps {
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaLabelledBy?: string
  ariaRequired?: boolean
  ariaInvalid?: boolean
  ariaExpanded?: boolean
  ariaHaspopup?: boolean
  ariaControls?: string
  role?: string
  tabIndex?: number
}

// Component Composition Types
export interface SlotProps {
  default?: any
  header?: any
  footer?: any
  preTitle?: any
  title?: any
  subtitle?: any
  action?: any
}

// Enhanced BaseTextField Component Interface
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

// Form field validation interface
export interface FormFieldValidation {
  required?: boolean
  pattern?: RegExp
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  customValidator?: (value: any) => boolean | string
}

// Enhanced Animation Types
export type AnimationType =
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'slideIn'
  | 'slideUp'
  | 'slideDown'
  | 'pulseSoft'
  | 'float'
  | 'hoverLift'
  | 'bounce'
  | 'spin'

export interface AnimationProps {
  animation?: AnimationType
  delay?: number
  duration?: number
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | string
  iterations?: number | 'infinite'
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
}

// Layout Types
export interface ContainerProps {
  fluid?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: boolean
  centered?: boolean
}

// Enhanced Export namespace for easier imports
// Avoid namespaces in ES modules to satisfy lint rules
export type UIComponentsButton = BaseButtonProps
export type UIComponentsBadge = BaseBadgeProps
export type UIComponentsCard = BaseCardProps
export type UIComponentsIconText = BaseIconTextProps
export type UIComponentsSectionHeader = BaseSectionHeaderProps
export type UIComponentsTextField = BaseTextFieldProps

// Enhanced Theme Types
export interface EnhancedDesignTokens extends DesignTokens {
  animations: {
    fadeIn: string
    slideUp: string
    bounce: string
    spin: string
  }
  shadows: {
    card: string
    cardHover: string
    button: string
  }
}

// Component prop validation helpers
export const validateSize = (size: any): size is Size => {
  return ['sm', 'md', 'lg'].includes(size)
}

export const validateColor = (color: any): color is SemanticColor => {
  return [
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'info',
    'neutral',
    'gray',
  ].includes(color)
}
