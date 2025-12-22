import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { Size3 } from '~/types/ui'
import {
  SEMANTIC_TEXT_CLASSES,
  HERO_TYPOGRAPHY,
  SECTION_TYPOGRAPHY_MAP,
  CARD_TYPOGRAPHY_MAP,
  BODY_TYPOGRAPHY_MAP,
  LABEL_TYPOGRAPHY_MAP,
  type SemanticTextColor,
} from './tokens/typography'

export type TypographyContext = 'hero' | 'section' | 'card' | 'body' | 'label'

export function useTextColor(color: MaybeRefOrGetter<SemanticTextColor | undefined>) {
  return computed(() => {
    const value = toValue(color)
    return value ? SEMANTIC_TEXT_CLASSES[value] : ''
  })
}

export function useHeroTypography() {
  return computed(() => HERO_TYPOGRAPHY.default)
}

export function useSectionTypography(
  size: MaybeRefOrGetter<Size3 | undefined>,
  defaultSize: Size3 = 'md'
) {
  return computed(() => {
    const value = toValue(size)
    return SECTION_TYPOGRAPHY_MAP[value ?? defaultSize]
  })
}

export function useCardTypography(
  size: MaybeRefOrGetter<Size3 | undefined>,
  defaultSize: Size3 = 'md'
) {
  return computed(() => {
    const value = toValue(size)
    return CARD_TYPOGRAPHY_MAP[value ?? defaultSize]
  })
}

export function useBodyTypography(
  size: MaybeRefOrGetter<Size3 | undefined>,
  defaultSize: Size3 = 'md'
) {
  return computed(() => {
    const value = toValue(size)
    return BODY_TYPOGRAPHY_MAP[value ?? defaultSize]
  })
}

export function useLabelTypography(
  size: MaybeRefOrGetter<Size3 | undefined>,
  defaultSize: Size3 = 'md'
) {
  return computed(() => {
    const value = toValue(size)
    return LABEL_TYPOGRAPHY_MAP[value ?? defaultSize]
  })
}
