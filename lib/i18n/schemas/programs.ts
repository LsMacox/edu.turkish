/**
 * Programs Page Schema - programs.json
 */

export interface ProgramsSchema {
    meta: {
        title: string
        description: string
    }
    hero: {
        title: string
        titleAccent: string
        description: string
        badge: string
        stats: {
            programs: string
            categories: string
            support: string
        }
        card: {
            title: string
            subtitle: string
        }
    }
    learnMore: string
    loading: string
    empty: string
    emptyTitle: string
    error: string
    errorTitle: string
    retry: string
    /** @placeholder {count} - Number of programs */
    categorySubtitle: string
    cta: {
        title: string
        description: string
        universities: string
        contact: string
    }
    detail: {
        loading: string
        notFound: string
        error: string
        allPrograms: string
        backToPrograms: string
        tableOfContents: string
        quickFacts: string
        category: string
        published: string
        readingTime: string
        tags: string
        share: {
            title: string
            description: string
            copyLink: string
            copySuccess: string
            copyError: string
        }
    }
}
