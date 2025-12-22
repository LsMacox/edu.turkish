import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import type { CardHoverEffect } from '~/types/ui'

export type HoverEffect = 'scale' | 'color' | 'lift' | 'shadow'

export interface HoverEffectClasses {
    base: string
    hover: string
    combined: string
}

export const HOVER_EFFECTS: Record<HoverEffect, HoverEffectClasses> = {
    scale: {
        base: 'transition-scale',
        hover: 'group-hover:scale-105',
        combined: 'transition-scale group-hover:scale-105',
    },
    color: {
        base: 'transition-color',
        hover: 'group-hover:text-primary',
        combined: 'transition-color group-hover:text-primary',
    },
    lift: {
        base: 'transition-default ease-out',
        hover: 'group-hover:-translate-y-1 group-hover:shadow-card-hover',
        combined: 'transition-default ease-out group-hover:-translate-y-1 group-hover:shadow-card-hover',
    },
    shadow: {
        base: 'transition-shadow',
        hover: 'group-hover:shadow-card-hover',
        combined: 'transition-shadow group-hover:shadow-card-hover',
    },
}

export const CARD_HOVER_CLASSES: Record<CardHoverEffect, string> = {
    lift: 'transition-default ease-out hover:-translate-y-1 hover:shadow-card-hover',
    shadow: 'transition-default ease-out hover:shadow-card-hover',
    scale: 'transition-default ease-out hover:scale-105',
}

export function useHoverEffect(effect: MaybeRefOrGetter<HoverEffect>) {
    return computed(() => {
        const value = toValue(effect)
        return HOVER_EFFECTS[value]
    })
}

export function useHoverEffects(effects: MaybeRefOrGetter<HoverEffect[]>) {
    return computed(() => {
        const values = toValue(effects)
        const bases: string[] = []
        const hovers: string[] = []

        for (const effect of values) {
            const classes = HOVER_EFFECTS[effect]
            if (classes) {
                bases.push(classes.base)
                hovers.push(classes.hover)
            }
        }

        return {
            base: bases.join(' '),
            hover: hovers.join(' '),
            combined: [...bases, ...hovers].join(' '),
        }
    })
}

export const IMAGE_HOVER_CLASSES = HOVER_EFFECTS.scale.combined

export const TEXT_HOVER_CLASSES = HOVER_EFFECTS.color.combined
