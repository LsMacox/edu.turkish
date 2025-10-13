# Feature Specification: Enhanced Service Pages for Document Translation

**Feature Branch**: `011-`  
**Created**: 2025-10-12  
**Status**: Draft  
**Input**: User description: "Твоя задача дополнить страницы услуг, вот что нужно сделать с примером: Вводный блок (оставить). Заголовок и краткое описание норм. Только чуть живее: Профессиональный перевод документов для поступления, работы и переезда в Турцию. Без сухости — пусть звучит, как услуга, а не инструкция. Карточки услуг (оставить, но улучшить). Добавить под ценой маленькую строку: срок выполнения, например 'Срок: 1–2 дня' — помогает мгновенно понять ценность. Блок 'Как это работает'. Добавить обязательно. Коротко, 3–4 шага с иконками: Загружаете документ, Мы уточняем детали, Переводим и заверяем, Получаете готовый файл/бумагу. Это снижает тревожность и экономит тебе кучу писем. Блок 'Почему выбирают нас' (короткий). Три тезиса с иконками вроде: Лицензированные переводчики, Переводы принимают турецкие вузы, Поддержка на русском, турецком и английском. Можно вставить под карточками, до кнопки 'Подать заявку'. Доверие и оформление. Значок 'Работаем с 2019 года', Плашка '1000+ переведённых документов'. Это не отдельный раздел, а просто декоративные фразы под кнопками или в подвале блока."

## Overview

This feature enhances the document translation service pages to better communicate value, reduce user anxiety, and increase conversion rates. The enhancement focuses on making the service offering more engaging and trustworthy through improved content structure, clearer process explanation, and trust indicators.

## User Scenarios & Testing

### User Story 1 - Quick Service Understanding (Priority: P1)

A prospective student or professional visits the service page to understand what translation services are available and how long they take.

**Why this priority**: This is the primary user journey - visitors need to immediately understand service offerings and timelines to make decisions. Without this, users bounce or contact support unnecessarily.

**Independent Test**: Can be fully tested by navigating to any service page and verifying that service cards display price, description, and delivery timeframe. Delivers immediate value by reducing support inquiries about basic service information.

**Acceptance Scenarios**:

1. **Given** a user visits any translation service page, **When** they view the service cards section, **Then** each service card displays the service name, description, price, and delivery timeframe
2. **Given** a user is comparing services, **When** they scan the service cards, **Then** delivery timeframes are consistently formatted (e.g., "Срок: 1–2 дня") and positioned directly under pricing
3. **Given** a user reads the intro block, **When** they see the heading and description, **Then** the text communicates value and approachability rather than dry instructions

---

### User Story 2 - Process Transparency (Priority: P1)

A potential client wants to understand the translation process before committing to the service, reducing uncertainty about what happens after they order.

**Why this priority**: This directly addresses user anxiety and reduces support email volume. Clear process visibility is critical for first-time customers making trust-based decisions.

**Independent Test**: Can be fully tested by checking if the "How it works" section is present on service pages with 3-4 clear steps. Delivers value by reducing pre-purchase anxiety and support inquiries.

**Acceptance Scenarios**:

1. **Given** a user is on a service page, **When** they scroll to the "How it works" section, **Then** they see 3-4 clearly defined steps with visual icons
2. **Given** a user reads the process steps, **When** they review each step, **Then** steps follow the sequence: document upload → clarification → translation/certification → delivery
3. **Given** a user is uncertain about the process, **When** they read the step descriptions, **Then** each step clearly explains what the user does and what the service provider does

---

### User Story 3 - Building Trust and Credibility (Priority: P2)

A visitor wants to understand why they should choose this translation service over competitors, particularly regarding credentials and acceptance by Turkish institutions.

**Why this priority**: This supports conversion but is secondary to understanding what's offered and how it works. Trust-building is important but only after the user understands the service.

**Independent Test**: Can be fully tested by verifying the "Why choose us" section displays three key differentiators with icons. Delivers value by addressing common objections and building credibility.

**Acceptance Scenarios**:

1. **Given** a user is evaluating the service, **When** they view the "Why choose us" section, **Then** they see three trust factors: licensed translators, acceptance by Turkish universities, and multilingual support
2. **Given** a user scrolls through the service page, **When** they reach the area before the call-to-action button, **Then** the "Why choose us" section is positioned to reinforce value before decision-making
3. **Given** a user wants proof of credibility, **When** they scan the page, **Then** trust indicators ("Working since 2019", "1000+ translated documents") are visible in natural positions throughout the content

---

### User Story 4 - Trust Indicator Visibility (Priority: P3)

A visitor scans the page for social proof and credibility markers to validate the service's reliability.

**Why this priority**: Trust indicators support conversion but are supplementary visual elements. They enhance trust but aren't the primary decision factor.

**Independent Test**: Can be fully tested by verifying trust indicators appear in appropriate locations. Delivers value by providing passive credibility signals.

**Acceptance Scenarios**:

1. **Given** a user scans the service page, **When** they look near buttons or section footers, **Then** they see decorative trust indicators like "Работаем с 2019 года" and "1000+ переведённых документов"
2. **Given** multiple trust indicators exist, **When** they are displayed, **Then** they appear naturally integrated into the design rather than as a separate section

---

### Edge Cases

- What happens when a service has variable delivery timeframes (e.g., depending on document complexity)? Should we display a range or "от X дней"?
- How should the "How it works" section adapt if different services have different processes (e.g., notarization vs. simple translation)?
- What happens if new trust metrics become available (e.g., "2000+ documents")? How easily can these be updated?
- What if a service card has no fixed price (consultation required)? How should delivery time be displayed?

## Requirements

### Functional Requirements

- **FR-001**: Service page MUST display an engaging intro block with a heading and description that emphasizes service value and approachability for document translation services
- **FR-002**: Each service card MUST display the service name, description, and price as currently implemented
- **FR-003**: Each service card MUST display a delivery timeframe indicator (e.g., "Срок: 1–2 дня") positioned directly below the price
- **FR-004**: Service page MUST include a "How it works" section positioned between service cards and the call-to-action
- **FR-005**: "How it works" section MUST display 3-4 process steps with corresponding icons showing: document upload, clarification, translation/certification, and delivery
- **FR-006**: Service page MUST include a "Why choose us" section with three key differentiators: licensed translators, acceptance by Turkish universities, and multilingual support
- **FR-007**: Each item in "Why choose us" section MUST display a relevant icon alongside the text
- **FR-008**: "Why choose us" section MUST be positioned after service cards but before the main call-to-action button
- **FR-009**: Service page MUST display trust indicators showing "Работаем с 2019 года" and "1000+ переведённых документов"
- **FR-010**: Trust indicators MUST be positioned naturally within the page layout (near buttons or section footers) rather than as a standalone section
- **FR-011**: All text content MUST be in Russian and maintain a conversational, service-oriented tone rather than instructional dryness

### Key Entities

- **Service Card**: Represents a translation service offering with attributes including name, description, price, and delivery timeframe
- **Process Step**: Represents one step in the service workflow with attributes including step number, title, description, and associated icon
- **Trust Factor**: Represents a credibility element from "Why choose us" section with attributes including title, description, and associated icon
- **Trust Indicator**: Represents a decorative credibility marker with attributes including display text and metric value

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can understand the complete service offering and process flow within 45 seconds of landing on the page
- **SC-002**: 80% of users who view the page scroll through all enhancement sections (intro, cards, how it works, why choose us)
- **SC-003**: Support inquiries about "how the service works" and "delivery timeframes" decrease by 40% within 30 days of launch
- **SC-004**: Time spent on service pages increases by at least 25% compared to current baseline
- **SC-005**: Conversion rate from service page view to inquiry form submission increases by at least 15%
- **SC-006**: 90% of users who complete a survey report feeling confident about the service process after viewing the page

## Assumptions

- Service delivery timeframes are already known for each service offering and can be added to the content management system
- Icon assets or an icon library is available for use in "How it works" and "Why choose us" sections
- The current intro block structure is functional but needs content refinement, not structural changes
- Trust metrics (2019 founding year, 1000+ documents) are accurate and verified
- All services follow a similar enough process that a single "How it works" section applies across service pages
- The target audience primarily reads Russian, though the service supports multilingual communication
- Current service cards have a consistent layout that can accommodate an additional line for delivery timeframe

## Out of Scope

- Creating entirely new service offerings or changing service pricing
- Implementing real-time delivery time calculation based on document complexity
- Adding customer testimonials or reviews (only using aggregate trust indicators)
- Redesigning the overall page layout or navigation structure
- Implementing dynamic content personalization based on user type
- Adding comparison tools between different service offerings
- Creating separate processes for different service types (assuming unified process description is sufficient)
