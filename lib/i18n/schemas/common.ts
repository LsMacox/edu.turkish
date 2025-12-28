/**
 * Common Schema - common.json
 * Merged from: common, nav, errors, currency
 */

export interface CommonSchema {
    breadcrumbs: {
        home: string
        services: string
        relocation: string
        universities: string
        blog: string
        articles: string
    }
    site: {
        description: string
    }
    common: {
        clear: string
        loading: string
        from: string
    }
    cta: {
        apply: string
        consultation: string
    }
    academicPrograms: {
        title: string
        subtitle: string
        tabs: {
            bachelor: string
            master: string
            doctorate: string
        }
        table: {
            programName: string
            language: string
            duration: string
            costPerYear: string
        }
        emptyState: {
            title: string
            description: string
        }
        showAll: string
        collapse: string
    }
    footer: {
        home: string
        relocation: string
        about_us: string
        who_we_are: string
        our_team: string
        contacts: string
        universities: string
        all_universities: string
        support: string
        faq: string
        reviews: string
        contract: string
        privacy_policy: string
        social_networks: string
        copyright: string
        licensed_agency: string
    }
    applicationCTA: {
        /** @placeholder {universityName} - Name of the university */
        title: string
        subtitle: string
        form: {
            name_label: string
            name_placeholder: string
            phone_label: string
            phone_placeholder: string
            email_label: string
            email_placeholder: string
            program_label: string
            program_placeholder: string
            program_other: string
            level_label: string
            level_bachelor: string
            level_master: string
            comment_label: string
            comment_placeholder: string
            privacy_agreement: string
            submit_button: string
            submitting: string
            response_time: string
        }
    }
    back_to_home: string
    loading: string
    universityInformation: string
    backToUniversities: string
    nav: {
        tagline: string
        services: string
        universities: string
        programs: string
        reviews: string
        blog: string
        about: string
        faq: string
        language: string
        social: string
        servicesDropdown: {
            relocation: string
            trYosCourses: string
            satCourses: string
            languageCourse: string
            documentTranslations: string
        }
    }
    errors: {
        universityNotFound: string
        universityNotFoundDescription: string
        required: string
        /** @placeholder {min} - Minimum character count */
        min_length: string
        /** @placeholder {max} - Maximum character count */
        max_length: string
        invalid_email: string
        invalid_phone: string
        invalid_format: string
        invalid: string
        /** @placeholder {message} - Error message from CRM */
        crm_validation_error: string
        server_error: string
        unknown_error: string
        validation_error_title: string
        generic_error_title: string
        generic_error_message: string
        /** @placeholder {min} - Minimum value */
        min_value: string
        /** @placeholder {max} - Maximum value */
        max_value: string
        invalid_year: string
        fields: {
            personal_info: {
                first_name: {
                    required: string
                    /** @placeholder {min} */
                    min_length: string
                    /** @placeholder {max} */
                    max_length: string
                }
                phone: {
                    required: string
                    invalid_phone: string
                }
                email: {
                    invalid_email: string
                    /** @placeholder {max} */
                    max_length: string
                }
            }
            additional_info: {
                /** @placeholder {max} */
                max_length: string
            }
        }
    }
    currency: {
        selector: {
            label: string
            KZT: string
            TRY: string
            RUB: string
            USD: string
        }
    }
}
