/**
 * Blog Schema - blog.json
 * Merged from: blog, article, power-page
 */

import type { BlogStat, QuickLinkItem } from './types'

export interface BlogSchema {
    meta: {
        title: string
        description: string
    }
    hero: {
        title: string
        titleAccent: string
        description: string
        searchPlaceholder: string
        imageAlt: string
        highlight: {
            title: string
            subtitle: string
        }
        stats: BlogStat[]
    }
    categories: {
        all: {
            label: string
        }
    }
    articles: {
        title: string
        readMore: string
        loadMore: string
        loading: string
        empty: string
        /** @placeholder {minutes} - Reading time in minutes */
        readingTime: string
    }
    pros_cons: {
        pros: string
        cons: string
    }
    sidebar: {
        popular: {
            title: string
        }
        quickLinks: {
            title: string
            items: QuickLinkItem[]
        }
    }
    article: {
        loading: string
        notFound: string
        error: string
        tableOfContents: string
        quickFacts: {
            title: string
            category: string
            published: string
            readingTime: string
        }
        share: {
            title: string
            description: string
            copyLink: string
            copySuccess: string
            copyError: string
        }
        tags: {
            title: string
        }
        related: {
            title: string
            description: string
            allArticles: string
        }
    }
    powerPage: {
        cta: {
            consult: string
            universities: string
            mobile_label: string
            mobile_title: string
        }
        stats: {
            guarantee: string
            exams: string
            support: string
            universities: string
        }
        quickFacts: {
            category: string
            published: string
            readingTime: string
        }
        share: {
            copySuccess: string
            copyError: string
        }
        price: {
            title: string
            year: string
        }
        universities: {
            title: string
            view_all: string
        }
    }
}
