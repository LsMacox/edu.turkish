export const CITY_ALL = '__all__'
export const TYPE_ALL = '__all__'
export const LEVEL_ALL = 'all'

export const VALID_LEVELS = ['bachelor', 'master', 'phd'] as const
export const SORT_OPTIONS = ['pop', 'price_asc', 'price_desc', 'alpha', 'lang_en'] as const
export const DEFAULT_SORT = 'pop' as const

// Default price range bounds (used when filters not yet loaded)
export const DEFAULT_PRICE_MIN = 0
export const DEFAULT_PRICE_MAX = 50000
