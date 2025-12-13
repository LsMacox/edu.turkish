export type ContentVariant = 'article' | 'powerpage'
export type ImageWidth = 'standard' | 'wide' | 'full' | undefined
export type SpacerSize = 'sm' | 'md' | 'lg' | 'xl'

export interface VariantStyles {
  container: string
  paragraph: string
  heading: (level: number) => string | (string | Record<string, boolean>)[]
  imageContainer: string
  image: (width: ImageWidth) => (string | Record<string, boolean>)[]
  caption: (width: ImageWidth) => string | (string | Record<string, boolean>)[]
  quote: string
  cite: string
  spacer: (size: SpacerSize) => Record<string, boolean>
  divider: string
}

export const variantStyles: Record<ContentVariant, VariantStyles> = {
  article: {
    container: 'space-y-5',
    paragraph: 'text-base md:text-lg leading-[1.75] text-gray-700',
    heading: () =>
      'scroll-mt-28 text-xl md:text-2xl font-bold text-secondary mt-6 mb-3 tracking-tight',
    imageContainer: 'my-5 space-y-2',
    image: (width) => [
      'object-cover shadow-md',
      width === 'full'
        ? '-mx-6 w-[calc(100%+3rem)] max-w-none rounded-xl lg:-mx-10 lg:w-[calc(100%+5rem)]'
        : 'w-full rounded-xl',
    ],
    caption: (width) => [
      'text-sm text-gray-500 italic text-center',
      { 'px-6 lg:px-10': width === 'full' },
    ],
    quote:
      'relative my-6 pl-5 border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent py-4 pr-5 rounded-r-xl',
    cite: 'block mt-3 text-sm font-medium text-gray-500 not-italic',
    spacer: (size) => ({
      'h-4': size === 'sm',
      'h-6': size === 'md',
      'h-10': size === 'lg',
      'h-14': size === 'xl',
    }),
    divider: 'border-gray-200 my-6',
  },
  powerpage: {
    container: 'space-y-8 text-lg leading-relaxed text-gray-700',
    paragraph: 'mb-6',
    heading: (level) => [
      'font-bold text-secondary mt-12 mb-6',
      {
        'text-3xl md:text-4xl': level === 2,
        'text-2xl md:text-3xl': level === 3,
        'text-xl md:text-2xl': level >= 4,
      },
    ],
    imageContainer: 'my-10',
    image: (width) => [
      'rounded-2xl shadow-xl w-full object-cover',
      { 'aspect-video': width === 'full' },
    ],
    caption: () => 'mt-3 text-center text-sm text-gray-500',
    quote: 'my-10 p-8 bg-blue-50 rounded-2xl border-l-4 border-primary',
    cite: 'block text-sm font-bold text-primary uppercase tracking-wide not-italic',
    spacer: (size) => ({
      'h-8': size === 'sm',
      'h-16': size === 'md',
      'h-24': size === 'lg',
      'h-32': size === 'xl',
    }),
    divider: 'my-12 border-gray-200',
  },
}
