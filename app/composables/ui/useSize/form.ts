import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { Size5 } from '~/types/ui'

export const FORM_SIZE_MAP: Record<Size5, string> = {
    xs: 'px-2.5 py-1 text-xs min-h-[36px] md:px-3 md:py-1.5 md:min-h-[40px]',
    sm: 'px-3 py-1.5 text-xs min-h-[40px] md:px-4 md:py-2 md:text-sm md:min-h-[44px]',
    md: 'px-3.5 py-2 text-sm min-h-[44px] md:px-5 md:py-3 md:min-h-[48px]',
    lg: 'px-4 py-2.5 text-sm min-h-[48px] md:px-6 md:py-4 md:text-base md:min-h-[52px]',
    xl: 'px-5 py-3 text-base min-h-[52px] md:px-8 md:py-5 md:text-lg md:min-h-[56px]',
}

export function useFormSizeClasses(
    size: MaybeRefOrGetter<Size5 | undefined>,
    defaultSize: Size5 = 'md'
) {
    return computed(() => {
        const value = toValue(size)
        return FORM_SIZE_MAP[value ?? defaultSize] ?? FORM_SIZE_MAP[defaultSize]
    })
}

export interface CheckboxSizeClasses {
    container: string
    input: string
    text: string
}

export const CHECKBOX_SIZE_MAP: Record<Size5, CheckboxSizeClasses> = {
    xs: { container: 'min-h-touch-16 md:min-h-auto', input: 'w-3 h-3 md:w-3 md:h-3', text: 'text-xs' },
    sm: { container: 'min-h-touch-20 md:min-h-auto', input: 'w-4 h-4 md:w-3.5 md:h-3.5', text: 'text-xs' },
    md: { container: 'min-h-touch-24 md:min-h-auto', input: 'w-5 h-5 md:w-4 md:h-4', text: 'text-xs md:text-sm' },
    lg: { container: 'min-h-touch-28 md:min-h-auto', input: 'w-6 h-6 md:w-5 md:h-5', text: 'text-sm md:text-base' },
    xl: { container: 'min-h-touch-32 md:min-h-auto', input: 'w-7 h-7 md:w-6 md:h-6', text: 'text-base md:text-lg' },
}

export function useCheckboxSizeClasses(
    size: MaybeRefOrGetter<Size5 | undefined>,
    defaultSize: Size5 = 'md'
) {
    return computed(() => {
        const value = toValue(size)
        return CHECKBOX_SIZE_MAP[value ?? defaultSize] ?? CHECKBOX_SIZE_MAP[defaultSize]
    })
}

export interface FieldLabelSizeClasses {
    text: string
    margin: string
}

export const FIELD_LABEL_SIZE_MAP: Record<Size5, FieldLabelSizeClasses> = {
    xs: { text: 'text-[10px] font-medium', margin: 'mb-0.5 md:mb-1' },
    sm: { text: 'text-xs font-medium', margin: 'mb-1 md:mb-1.5' },
    md: { text: 'text-sm font-medium', margin: 'mb-1.5 md:mb-2' },
    lg: { text: 'text-base font-medium', margin: 'mb-2 md:mb-2.5' },
    xl: { text: 'text-lg font-bold', margin: 'mb-2.5 md:mb-3' },
}

export function useFieldLabelSizeClasses(
    size: MaybeRefOrGetter<Size5 | undefined>,
    defaultSize: Size5 = 'md'
) {
    return computed(() => {
        const value = toValue(size)
        return FIELD_LABEL_SIZE_MAP[value ?? defaultSize] ?? FIELD_LABEL_SIZE_MAP[defaultSize]
    })
}

export interface FieldMessageSizeClasses {
    text: string
    margin: string
    icon: string
}

export const FIELD_MESSAGE_SIZE_MAP: Record<Size5, FieldMessageSizeClasses> = {
    xs: { text: 'text-[10px]', margin: 'mt-0.5 md:mt-1', icon: 'w-3 h-3' },
    sm: { text: 'text-xs', margin: 'mt-1 md:mt-1.5', icon: 'w-3.5 h-3.5' },
    md: { text: 'text-sm', margin: 'mt-1.5 md:mt-2', icon: 'w-4 h-4' },
    lg: { text: 'text-base', margin: 'mt-2 md:mt-2.5', icon: 'w-5 h-5' },
    xl: { text: 'text-lg', margin: 'mt-2.5 md:mt-3', icon: 'w-6 h-6' },
}

export function useFieldMessageSizeClasses(
    size: MaybeRefOrGetter<Size5 | undefined>,
    defaultSize: Size5 = 'md'
) {
    return computed(() => {
        const value = toValue(size)
        return FIELD_MESSAGE_SIZE_MAP[value ?? defaultSize] ?? FIELD_MESSAGE_SIZE_MAP[defaultSize]
    })
}

export interface RangeSliderSizeClasses {
    value: string
    track: string
    numberInput: string
    separator: string
    thumbSize: string
}

export const RANGE_SLIDER_SIZE_MAP: Record<Size5, RangeSliderSizeClasses> = {
    xs: { value: 'text-[10px] text-gray-600', track: 'h-1.5', numberInput: 'w-16 px-1.5 py-1 text-[10px]', separator: 'text-[10px]', thumbSize: '12px' },
    sm: { value: 'text-xs text-gray-600', track: 'h-1.5', numberInput: 'w-20 px-2 py-1.5 text-xs', separator: 'text-xs', thumbSize: '16px' },
    md: { value: 'text-sm text-gray-600', track: 'h-2', numberInput: 'w-24 px-3 py-2 text-sm', separator: 'text-sm', thumbSize: '20px' },
    lg: { value: 'text-base text-gray-600', track: 'h-2.5', numberInput: 'w-28 px-4 py-3 text-base', separator: 'text-base', thumbSize: '24px' },
    xl: { value: 'text-lg text-gray-600', track: 'h-3', numberInput: 'w-32 px-5 py-4 text-lg', separator: 'text-lg', thumbSize: '28px' },
}

export function useRangeSliderSizeClasses(
    size: MaybeRefOrGetter<Size5 | undefined>,
    defaultSize: Size5 = 'md'
) {
    return computed(() => {
        const value = toValue(size)
        return RANGE_SLIDER_SIZE_MAP[value ?? defaultSize] ?? RANGE_SLIDER_SIZE_MAP[defaultSize]
    })
}
