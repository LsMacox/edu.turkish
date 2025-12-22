import type { SemanticColor, BadgeVariant } from '~/types/ui'
import {
    SEMANTIC_COLOR_TOKENS,
    SEMANTIC_BADGE_COLORS,
    type ColorTokens,
} from './tokens/colors'

export function useColorTokens(color: SemanticColor): ColorTokens {
    return SEMANTIC_COLOR_TOKENS[color] ?? SEMANTIC_COLOR_TOKENS.neutral
}

export function useBadgeColorClasses(color: SemanticColor, variant: BadgeVariant): string {
    return SEMANTIC_BADGE_COLORS[color]?.[variant] ?? SEMANTIC_BADGE_COLORS.neutral.soft
}
