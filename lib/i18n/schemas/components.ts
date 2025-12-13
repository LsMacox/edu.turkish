/**
 * Components Schema - components.json
 * Merged from: modals, ui
 */

export interface ComponentsSchema {
    modal: {
        exit_intent_title: string
        consultation_title: string
        your_name: string
        required: string
        phone: string
        email: string
        additional_info: string
        name_placeholder: string
        phone_placeholder: string
        email_placeholder: string
        message_placeholder: string
        preferences_title: string
        preference_labels: {
            user_type: string
            university: string
            language: string
            scholarship: string
        }
        user_types: {
            student: string
            parent: string
        }
        university_chosen: {
            yes: string
            no: string
        }
        languages: {
            turkish: string
            english: string
            both: string
        }
        scholarship: {
            yes: string
            no: string
        }
        agreement: string
        submit_button: string
        submitting: string
        success_title: string
        success_message: string
        error_title: string
        error_message: string
        applying_for: string
        service_context_label: string
    }
    admissionRequirements: {
        title: string
        subtitle: string
        requiredDocuments: {
            title: string
        }
        examsAndLanguage: {
            title: string
            goodNews: string
            goodNewsText: string
        }
        scholarships: {
            title: string
        }
        importantDates: {
            title: string
        }
    }
    range: {
        to: string
    }
    pageLoadingOverlay: {
        ariaLabel: string
    }
}
