/**
 * Home Page Schema - home.json
 */

export interface HomeSchema {
    seo: {
        title: string
        description: string
    }
    hero: {
        title: string
        title_accent: string
        subtitle: string
        stat_students: string
        stat_verified: string
        stat_documents: string
        success_rate: string
        success_desc: string
    }
    who: {
        title: string
        subtitle: string
        student: string
        student_desc: string
        parent: string
        parent_desc: string
        university_chosen: string
        yes_know: string
        no_help: string
        language_interest: string
        turkish: string
        english: string
        scholarship_help: string
        yes_important: string
        no_ready_pay: string
        profile_ready: string
        type: string
        university: string
        language: string
        scholarship: string
        get_offer: string
        view_universities: string
        already_chosen: string
        need_help_choosing: string
        scholarship_required: string
        ready_pay_self: string
    }
    how: {
        title: string
        subtitle: string
        step1_title: string
        step1_desc: string
        step2_title: string
        step2_desc: string
        step3_title: string
        step3_desc: string
        step4_title: string
        step4_desc: string
    }
    universities: {
        title: string
        subtitle: string
        all_cities: string
        english_language: string
        budget_filter: string
        view_all: string
    }
    services: {
        title: string
        subtitle: string
        card1_title: string
        card1_text: string
        card2_title: string
        card2_text: string
        card3_title: string
        card3_text: string
        card4_title: string
        card4_text: string
        card5_title: string
        card5_text: string
    }
    reviews: {
        title: string
        subtitle: string
        loading: string
        error: string
        empty: string
        read_more: string
    }
    fears: {
        title: string
        subtitle: string
        fear_label: string
        fear1_title: string
        fear1_quote: string
        fear1_answer: string
        fear2_title: string
        fear2_quote: string
        fear2_answer: string
        fear3_title: string
        fear3_quote: string
        fear3_answer: string
        fear4_title: string
        fear4_quote: string
        fear4_answer: string
        fear5_title: string
        fear5_quote: string
        fear5_answer: string
        fear6_title: string
        fear6_quote: string
        fear6_answer: string
    }
    faq: {
        title: string
        subtitle: string
        question1: string
        answer1: string
        question2: string
        answer2: string
        question3: string
        answer3: string
        question4: string
        answer4: string
        question5: string
        answer5: string
        question6: string
        answer6: string
    }
    final_cta: {
        title: string
        /** @placeholder {days} - Days remaining until deadline */
        subtitle: string
        days: string
        hours: string
        minutes: string
        button: string
        guarantee: string
    }
}
