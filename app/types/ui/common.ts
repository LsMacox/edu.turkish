export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type Size5 = Exclude<Size, '2xl'>
export type Size3 = 'sm' | 'md' | 'lg'
export type SizeCompact = 'xs' | 'sm' | 'md'
export type StatusSize = 'xs' | 'sm' | 'md'
export type FormSize = 'sm' | 'md' | 'lg'
export type WithNone<T extends string> = T | 'none'

export type Rounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
export type CardRounded = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
export type FormRounded = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
export type ButtonRounded = Rounded | 'button'

export type ShadowSemantic =
  | 'none' // No shadow
  | 'button' // Subtle shadow for buttons/interactive elements
  | 'card' // Standard card elevation
  | 'elevated' // Hero images, surfaces, prominent cards
  | 'hover' // Hover/active state elevation

export type SemanticColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type BadgeVariant = 'solid' | 'soft' | 'outline' | 'gradient'

