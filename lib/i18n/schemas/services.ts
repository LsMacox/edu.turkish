/**
 * Services Schema - services.json
 */

import type { FaqItem, ServicePackage, ContentItem, CoursePackage } from './types'

interface RelocationService {
    title: string
    subtitle: string
    packages: {
        admission: ServicePackage & {
            services: {
                consultation: string
                selection: string
                documents: string
                translation: string
                guarantee: string
                payment: string
            }
        }
        standard: ServicePackage & {
            includes: string
            additionalServices: {
                transfer: string
                registration: string
                studentCard: string
                dormitory: string
                travelCard: string
                taxNumber: string
                residencePermit: string
                denklik: string
                accompaniment: string
                simCard: string
            }
        }
        vip: ServicePackage & {
            includes: string
            additionalServices: {
                apartment: string
                utilities: string
                residence: string
                bankAccount: string
            }
        }
    }
    benefits: {
        title: string
        content: string
    }
    risks: {
        title: string
        content: string
    }
    faq: {
        title: string
        items: {
            process_time: FaqItem
            installments: FaqItem
            cities: FaqItem
            individual_services: FaqItem
            risks: FaqItem
            accommodation: FaqItem
            documents: FaqItem
            visa: FaqItem
            rejection: FaqItem
        }
    }
}

interface TrYosCourseService {
    title: string
    subtitle: string
    subServices: {
        basic: ServicePackage
        individual: ServicePackage
    }
    courseGoal: {
        title: string
        description: string
        packages: {
            basic: CoursePackage
            individual: CoursePackage
        }
    }
    programContent: {
        title: string
        items: {
            theory: ContentItem
            practice: ContentItem
            errorAnalysis: ContentItem
            materials: ContentItem
        }
    }
    formatSchedule: {
        title: string
        labels: {
            format: string
            recordings: string
            platform: string
            support: string
        }
        format: string
        recordings: string
        platform: string
        support: string
    }
    studentResults: {
        title: string
        maxResults: {
            individual: { package: string; score: string }
            group: { package: string; score: string }
        }
    }
    faq: {
        title: string
        items: {
            difference: FaqItem
            duration: FaqItem
            trial: FaqItem
            content: FaqItem
            missed_lesson: FaqItem
            score: FaqItem
            online: FaqItem
        }
    }
}

interface SatCourseService {
    title: string
    subtitle: string
    temporarilyUnavailable: string
    courseGoal: {
        title: string
        description: string
        packages: {
            foundation: CoursePackage
            advanced: CoursePackage
            elite: CoursePackage
        }
    }
    programContent: {
        title: string
        items: {
            math: ContentItem
            reading: ContentItem
            mock_tests: ContentItem
            strategies: ContentItem
            tracking: ContentItem
        }
    }
    formatSchedule: {
        title: string
        enrollmentSchedule: string
        duration: string
        recordings: string
        taskBank: string
    }
    studentResults: {
        title: string
        labels: {
            before: string
            after: string
            duration: string
            admittedTo: string
        }
        cases: {
            case1: { score: number; proof: string; admission: string }
            case2: { score: number; proof: string; admission: string }
        }
    }
    faq: {
        title: string
        items: {
            attempts: FaqItem
            date_change: FaqItem
            toefl: FaqItem
        }
    }
}

interface LanguageCourseService {
    title: string
    subtitle: string
    temporarilyUnavailable: string
    levelProgression: {
        title: string
        levels: {
            a1_a2: { from: string; to: string; outcome: string }
            b1_b2: { from: string; to: string; outcome: string }
            c1_c2: { from: string; to: string; outcome: string }
        }
    }
    formatSchedule: {
        title: string
        labels: {
            groupSize: string
            individual: string
            conversationClubs: string
            schedule: string
            platform: string
            certificate: string
        }
        groupSize: string
        individual: string
        conversationClubs: string
        schedule: string
        platform: string
        certificate: string
    }
    teachers: {
        title: string
        methodology: string
        profiles: {
            ayse: { name: string; photo: string; achievements: string }
            john: { name: string; photo: string; achievements: string }
            mehmet: { name: string; photo: string; achievements: string }
        }
    }
    expectedResults: {
        title: string
        duration: string
        skills: {
            bank: string
            interview: string
            news: string
            email: string
            life: string
        }
    }
    faq: {
        title: string
        items: {
            missed_class: FaqItem
            freeze: FaqItem
            refund: FaqItem
        }
    }
}

interface DocumentTranslationService {
    title: string
    subtitle: string
    shortTitle: string
    serviceCards: {
        certificate: ContentItem
        school: ContentItem
        passport: ContentItem
        criminal: ContentItem
        power: ContentItem
        financial: ContentItem
        other: ContentItem
    }
    calculatorData: {
        documentTypes: {
            passport: { name: string; priceUsd: number }
            highSchool: { name: string; priceUsd: number }
            diploma: { name: string; priceUsd: number }
            powerOfAttorney: { name: string; priceUsd: number }
            financial: { name: string; priceUsd: number }
            other: { name: string; priceUsd: null }
        }
        languagePairs: {
            ru_tr: string
            tr_ru: string
        }
        urgency: {
            standard: { name: string; surcharge: number }
            rush: { name: string; surcharge: number }
        }
    }
    calculator: {
        title: string
        documentTypeLabel: string
        languagePairLabel: string
        urgencyLabel: string
        estimatedPrice: string
        submitButton: string
        byRequest: string
    }
    howItWorks: {
        title: string
        steps: {
            upload: ContentItem
            clarify: ContentItem
            translate: ContentItem
            receive: ContentItem
        }
    }
    whyChooseUs: {
        title: string
        factors: {
            accredited: ContentItem
            accepted: ContentItem
            online: ContentItem
            verification: ContentItem
            rush: ContentItem
        }
    }
    finalCTA: {
        title: string
        button: string
        icon: string
    }
}

export interface ServicesSchema {
    common: {
        deliveryTime: string
        price: string
        week: string
        day: string
        days: string
        months: string
        phase: string
        documentType: string
        languagePair: string
        urgency: string
        estimatedPrice: string
        acceptedFormats: string
        acceptedByUniversities: string
        sampleDocumentsNote: string
        whatIncluded: string
        howItWorks: {
            title: string
            steps: {
                upload: ContentItem
                clarify: ContentItem
                translate: ContentItem
                receive: ContentItem
            }
        }
        whyChooseUs: {
            title: string
            factors: {
                licensed: ContentItem
                accepted: ContentItem
                support: ContentItem
            }
        }
        trustIndicators: {
            workingSince: string
            documentsCount: string
        }
    }
    'relocation-in-turkey': RelocationService
    'tr-yos-courses': TrYosCourseService
    'sat-courses': SatCourseService
    'turkish-english-course': LanguageCourseService
    'document-translations': DocumentTranslationService
}
