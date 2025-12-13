/**
 * About Page Schema - about.json
 */

import type { TeamMember, TimelineStep, Advantage, ContactChannel } from './types'

export interface AboutSchema {
    meta: {
        title: string
        description: string
    }
    hero: {
        title: string
        subtitle: string
        experienced_team: string
        students_enrolled: string
        official_contracts: string
        cta: string
    }
    who_we_are: {
        title: string
        subtitle: string
        experienced_agency: string
        experienced_agency_desc: string
        students_enrolled: string
        students_enrolled_desc: string
        official_work: string
        official_work_desc: string
        comprehensive_help: string
        comprehensive_help_desc: string
    }
    team: {
        title: string
        subtitle: string
        links: {
            /** @placeholder {name} - Team member name */
            linkedin: string
            /** @placeholder {name} - Team member name */
            whatsapp: string
        }
        members: {
            hakim: TeamMember
            nazrin: TeamMember
            adam: TeamMember
            nargiz: TeamMember
        }
    }
    story: {
        title: string
        subtitle: string
        imageAlt: string
        timeline: {
            step1: TimelineStep
            step2: TimelineStep
            step3: TimelineStep
            step4: TimelineStep
        }
        stats: {
            students: string
            universities: string
            success: string
        }
        read_reviews: string
    }
    whyChooseUs: {
        title: string
        subtitle: string
        imageAlt: string
        advantages: {
            personal: Advantage
            direct: Advantage
            multilingual: Advantage
            support: Advantage
        }
    }
    contact: {
        title: string
        subtitle: string
        channels: {
            whatsapp: ContactChannel
            telegram: ContactChannel
            email: {
                button: string
            }
        }
    }
}
