/**
 * Reviews Page Schema - reviews.json
 */

import type { AchievementStat, ReviewForm } from './types'

export interface ReviewsSchema {
    hero: {
        title: string
        titleAccent: string
        description: string
        stats: {
            students: string
            rating: string
            success: string
        }
    }
    mediaReviews: {
        title: string
        titleAccent: string
        badge: string
        description: string
        error: string
        empty: string
    }
    achievements: {
        title: string
        titleAccent: string
        description: string
        stats: {
            students: AchievementStat
            success: AchievementStat
            universities: AchievementStat
            experience: AchievementStat
        }
        overallRating: {
            title: string
            description: string
        }
        support: {
            title: string
            description: string
        }
        recommendation: {
            title: string
            description: string
        }
    }
    shareExperience: {
        title: string
        titleAccent: string
        description: string
        form: ReviewForm
        validation: {
            nameRequired: string
            universityRequired: string
            ratingRequired: string
            reviewRequired: string
        }
        success: {
            title: string
            message: string
        }
        error: {
            title: string
            dismiss: string
        }
        errors: {
            validation: string
            generic: string
        }
    }
}
