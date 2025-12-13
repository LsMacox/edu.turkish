/**
 * Shared types used across multiple i18n schemas
 */

export interface FaqItem {
    question: string
    answer: string
}

export interface ServicePackage {
    name: string
    description?: string
    priceUsd?: number
    ctaButton?: string
    services?: string[]
    includes?: string
    additionalServices?: string[]
}

export interface ContentItem {
    title: string
    description: string
    icon?: string
}

export interface CoursePackage {
    name: string
    targetScore: string
}

export interface TeamMember {
    name: string
    position: string
    role: string
    description: string
}

export interface TimelineStep {
    title: string
    description: string
}

export interface Advantage {
    title: string
    description: string
}

export interface ContactChannel {
    description?: string
    button: string
}

export interface TipItem {
    title: string
    description: string
}

export interface ScholarshipType {
    title: string
    badge: string
    description: string
    benefits: Record<string, string>
}

export interface BlogStat {
    icon: string
    /** @placeholder {count} - Statistic count */
    label: string
}

export interface QuickLinkItem {
    id: string
    label: string
}

export interface AchievementStat {
    title: string
    description: string
}

export interface FormField {
    label: string
    placeholder: string
}

export interface ReviewForm {
    name: FormField
    reviewerType: {
        label: string
        placeholder: string
        student: string
        parent: string
    }
    university: {
        label: string
        placeholder: string
        loading: string
        other: string
    }
    faculty: FormField
    year: {
        label: string
        placeholder: string
        earlier: string
    }
    rating: {
        label: string
        placeholder: string
        excellent: string
        good: string
        satisfactory: string
        poor: string
        veryPoor: string
    }
    contact: FormField
    review: FormField
    helpful: {
        label: string
        aspects: Record<string, string>
    }
    recommend: {
        label: string
        yes: string
        maybe: string
        no: string
    }
    submit: string
    submitting: string
}
