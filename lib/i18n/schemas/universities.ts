/**
 * Universities Schema - universities.json
 * Merged from: list, detail
 */

import type { TipItem, ScholarshipType } from './types'

export interface UniversitiesSchema {
    meta: {
        title: string
        description: string
        keywords: string
    }
    list: {
        hero: {
            title: string
            subtitle: string
            stats: {
                universities: string
                cities: string
                programs: string
            }
        }
        filters: {
            search_label: string
            search_placeholder: string
            city_label: string
            all_cities: string
            language_label: string
            type_label: string
            all_types: string
            level_label: string
            all_levels: string
            price_label: string
            reset_button: string
            apply_button: string
            more_filters: string
            hide_filters: string
            cities: {
                istanbul: string
                ankara: string
                izmir: string
            }
            languages: {
                en: string
                tr: string
                ru: string
            }
            types: {
                state: string
                private: string
                tech: string
                elite: string
            }
            levels: {
                bachelor: string
                master: string
                doctorate: string
            }
        }
        featured_programs_category: string
        sort: {
            showing_text: string
            of_text: string
            universities_text: string
            sort_label: string
            options: {
                popularity: string
                price_asc: string
                price_desc: string
                alphabetical: string
                english_first: string
            }
        }
        loading: string
        card: {
            details_button: string
            apply_button: string
            application_description: string
            year: string
            price_on_request: string
        }
        load_more: string
        how_to_choose: {
            title: string
            subtitle: string
            tips: {
                location: TipItem
                language: TipItem
                dormitory: TipItem
                rating: TipItem
            }
        }
        scholarships: {
            title: string
            subtitle: string
            types: {
                government: ScholarshipType
                university: ScholarshipType
            }
        }
        /** @placeholder {price} - Tuition price */
        tuitionFrom: string
    }
    detail: {
        fallbackDescription: string
        applyButton: string
        whatsappButton: string
        /** @placeholder {name} - University name */
        metaTitleTemplate: string
        keyInformation: {
            title: string
            subtitle: string
            city: string
            foundedYear: string
            cost: string
            /** @placeholder {cost} - Cost amount */
            costFrom: string
            languages: string
            students: string
            accommodation: string
            ranking: string
            internationalStudents: string
        }
        accommodationValue: {
            has: string
            none: string
        }
        rankingNotSpecified: string
        /** @placeholder {count} - Number of international students */
        internationalCount: string
        advantages: {
            /** @placeholder {advantage} - Advantage text */
            autoDescription: string
        }
        programDuration: {
            /** @placeholder {count} - Number of years */
            durationYears: string
        }
        aboutUniversity: {
            title: string
            history: string
            campus: string
            strongPrograms: string
            advantages: string
        }
        campusLife: {
            title: string
            subtitle: string
            infrastructure: string
            capacity: string
            area: string
        }
        faq: {
            title: string
            subtitle: string
            q1: string
            a1: string
            q2: string
            a2: string
            q3: string
            a3: string
            q4: string
            a4: string
            q5: string
            a5: string
            q6: string
            a6: string
            q7: string
            a7: string
            q8: string
            a8: string
            q9: string
            a9: string
        }
        universityType: {
            state: string
            private: string
            public: string
            tech: string
            elite: string
        }
    }
}
