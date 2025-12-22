import type { Size3 } from '~/types/ui'

export type SemanticTextColor = 'content' | 'muted' | 'meta' | 'hint' | 'disabled'

export const SEMANTIC_TEXT_CLASSES: Record<SemanticTextColor, string> = {
    content: 'text-content',
    muted: 'text-muted',
    meta: 'text-meta',
    hint: 'text-hint',
    disabled: 'text-disabled',
}

export interface HeroTypographyClasses {
    title: string
    subtitle: string
}

export const HERO_TYPOGRAPHY: Record<'default', HeroTypographyClasses> = {
    default: {
        title: 'text-hero',
        subtitle: 'text-hero-subtitle',
    },
}

export interface SectionTypographyClasses {
    title: string
    subtitle: string
}

export const SECTION_TYPOGRAPHY_MAP: Record<Size3, SectionTypographyClasses> = {
    sm: {
        title: 'text-section-title-sm',
        subtitle: 'text-section-subtitle-sm',
    },
    md: {
        title: 'text-section-title',
        subtitle: 'text-section-subtitle',
    },
    lg: {
        title: 'text-section-title-lg',
        subtitle: 'text-section-subtitle-lg',
    },
}

export interface CardTypographyClasses {
    title: string
    subtitle: string
    body: string
}

export const CARD_TYPOGRAPHY_MAP: Record<Size3, CardTypographyClasses> = {
    sm: {
        title: 'text-card-title-sm',
        subtitle: 'text-card-subtitle-sm',
        body: 'text-card-body-sm',
    },
    md: {
        title: 'text-card-title',
        subtitle: 'text-card-subtitle',
        body: 'text-card-body',
    },
    lg: {
        title: 'text-card-title-lg',
        subtitle: 'text-card-subtitle-lg',
        body: 'text-card-body-lg',
    },
}

export interface BodyTypographyClasses {
    text: string
}

export const BODY_TYPOGRAPHY_MAP: Record<Size3, BodyTypographyClasses> = {
    sm: {
        text: 'text-body-sm',
    },
    md: {
        text: 'text-body',
    },
    lg: {
        text: 'text-body-lg',
    },
}

export interface LabelTypographyClasses {
    text: string
}

export const LABEL_TYPOGRAPHY_MAP: Record<Size3, LabelTypographyClasses> = {
    sm: {
        text: 'text-label-sm',
    },
    md: {
        text: 'text-label',
    },
    lg: {
        text: 'text-base font-semibold text-secondary',
    },
}
