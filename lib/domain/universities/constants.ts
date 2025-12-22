import type { SemanticColor } from '~/types/ui'

export const TYPE_BADGE_COLORS: Record<string, SemanticColor> = {
  state: 'info',
  private: 'warning',
  tech: 'primary',
  elite: 'success',
}

export const BADGE_COLOR_MAP: Record<string, SemanticColor> = {
  green: 'success',
  blue: 'info',
  orange: 'warning',
  purple: 'primary',
  yellow: 'warning',
}

export interface UniversityBadge {
  labelKey: string
  color: SemanticColor
}

export function generateBadge(u: {
  type?: string | null
  scholarships?: unknown[]
}): UniversityBadge | undefined {
  if (u.scholarships?.length) {
    return { labelKey: 'universities_page.card.badges.scholarships', color: 'success' }
  }
  if (u.type === 'tech') {
    return { labelKey: 'universities_page.card.badges.technical', color: 'primary' }
  }
  return undefined
}

