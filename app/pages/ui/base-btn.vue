<template>
  <div class="min-h-screen bg-gray-50 section-py-lg">
    <div class="container mx-auto px-4 max-w-6xl">
      <h1 class="text-3xl font-bold text-secondary mb-2">UI Showcase (BaseButton)</h1>
      <p class="text-gray-600 mb-12">Все виды кнопок, используемых в приложении — унифицированные через BaseButton</p>

      <!-- BUTTONS SECTION -->
      <section class="mb-16">
        <h2 class="text-2xl font-bold text-secondary mb-8 pb-4 border-b border-gray-200">
          Кнопки
        </h2>

        <!-- BaseButton Component -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">BaseButton Component</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: HeroSection, ListCard, ListFilterPanel</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <div class="flex flex-wrap gap-4 items-center">
              <BaseButton variant="primary" size="lg" class="shadow-lg">
                Primary Large
              </BaseButton>
              <BaseButton variant="primary" size="md">
                Primary Medium
              </BaseButton>
              <BaseButton variant="primary" size="sm">
                Primary Small
              </BaseButton>
            </div>
            <div class="flex flex-wrap gap-4 items-center">
              <BaseButton variant="outline" size="md">
                Outline
              </BaseButton>
              <BaseButton variant="outline" size="sm" icon="mdi:send" />
            </div>
            <div class="flex flex-wrap gap-4 items-center">
              <BaseButton variant="secondary" size="md">
                Secondary
              </BaseButton>
              <BaseButton variant="ghost" size="md">
                Ghost
              </BaseButton>
            </div>
            <div class="flex flex-wrap gap-4 items-center">
              <BaseButton variant="primary" size="md" icon="mdi:magnify">
                С иконкой
              </BaseButton>
              <BaseButton variant="primary" size="md" loading>
                Loading
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Primary CTA Large -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Primary CTA Large (Hero/Final CTA)</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: FinalCtaSection, WhoSection</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex flex-wrap gap-4">
              <BaseButton variant="primary" size="xl" class="shadow-2xl">
                Получить предложение
              </BaseButton>
              <BaseButton variant="primary" size="lg" class="shadow-lg w-full sm:w-auto">
                Получить предложение
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Primary Submit Form -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Primary Submit (Forms)</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: ApplicationModal, ShareExperienceForm, DetailApplicationCTASection</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex flex-wrap gap-4">
              <BaseButton variant="primary" size="lg" full-width class="shadow-lg max-w-md">
                Отправить заявку
              </BaseButton>
              <BaseButton variant="primary" size="lg" class="shadow-lg hover:scale-105 transition-transform">
                Подать заявку
              </BaseButton>
              <BaseButton variant="primary" size="lg" class="shadow-lg w-full md:w-auto max-w-sm">
                Отправить отзыв
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Card CTA Buttons -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Card CTA Full Width</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: ServiceCard, PackageCard</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex flex-wrap gap-4">
              <div class="w-64">
                <BaseButton variant="primary" size="md" full-width rounded="lg">
                  Заказать
                </BaseButton>
              </div>
              <div class="w-64">
                <BaseButton variant="gradient" size="md" full-width rounded="lg">
                  VIP Заказать
                </BaseButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Outline Primary Link -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Outline Primary (Links)</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: UniversitiesSection, WhoSection</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex flex-wrap gap-4">
              <BaseButton variant="outline" size="md" href="#">
                Смотреть все
              </BaseButton>
              <BaseButton variant="outline" size="lg" class="w-full sm:w-auto">
                Смотреть университеты
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Selection Card Buttons -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Selection Card Buttons</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: WhoSection (questionnaire)</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="grid md:grid-cols-2 gap-4 max-w-2xl">
              <button
                class="p-3 md:p-4 border-2 rounded-xl md:hover:scale-105 transition-all text-left min-h-touch-44 md:min-h-auto border-primary bg-red-50"
              >
                <div class="flex items-center gap-2 md:gap-3">
                  <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Icon name="mdi:school" class="text-blue-500" />
                  </div>
                  <div>
                    <p class="font-semibold text-secondary">Студент</p>
                    <p class="text-sm text-gray-500">Выбрано</p>
                  </div>
                </div>
              </button>
              <button
                class="p-3 md:p-4 border-2 rounded-xl md:hover:scale-105 transition-all text-left min-h-touch-44 md:min-h-auto border-gray-200 hover:border-primary hover:bg-red-50"
              >
                <div class="flex items-center gap-2 md:gap-3">
                  <div class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Icon name="mdi:heart" class="text-purple-500" />
                  </div>
                  <div>
                    <p class="font-semibold text-secondary">Родитель</p>
                    <p class="text-sm text-gray-500">Не выбрано</p>
                  </div>
                </div>
              </button>
            </div>
            <div class="grid md:grid-cols-2 gap-4 max-w-2xl mt-4">
              <button
                class="p-3 md:p-4 border-2 rounded-xl transition-all min-h-touch-44 md:min-h-auto text-sm md:text-base border-primary bg-red-50"
              >
                Да, уже выбрал
              </button>
              <button
                class="p-3 md:p-4 border-2 rounded-xl transition-all min-h-touch-44 md:min-h-auto text-sm md:text-base border-gray-200 hover:border-primary hover:bg-red-50"
              >
                Нет, нужна помощь
              </button>
            </div>
          </div>
        </div>

        <!-- Filter Chips -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Filter Chips</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: UniversitiesSection, FAQ</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <p class="text-xs text-gray-500 mb-2">Rectangular (UniversitiesSection):</p>
              <div class="flex flex-wrap gap-3">
                <BaseButton variant="chip" size="sm" data-active="true">
                  Все города
                </BaseButton>
                <BaseButton variant="chip" size="sm">
                  Стамбул
                </BaseButton>
                <BaseButton variant="chip" size="sm">
                  Анкара
                </BaseButton>
              </div>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-2">Rounded (FAQ categories, Language filters):</p>
              <div class="flex flex-wrap gap-2">
                <BaseButton variant="chip-pill" size="sm" data-active="true">
                  Английский
                </BaseButton>
                <BaseButton variant="chip-pill" size="sm">
                  Турецкий
                </BaseButton>
              </div>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-2">FAQ Category with icon:</p>
              <div class="flex flex-wrap gap-2">
                <BaseButton variant="chip-pill" size="sm" icon="mdi:star" data-active="true">
                  Все
                </BaseButton>
                <BaseButton variant="chip-pill" size="sm" icon="mdi:file-document">
                  Документы
                </BaseButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Suggestion/Popular Chips -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Suggestion Chips</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: FAQ (popular searches)</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex flex-wrap gap-2">
              <BaseButton variant="suggestion" size="sm">
                Документы
              </BaseButton>
              <BaseButton variant="suggestion" size="sm">
                Стипендии
              </BaseButton>
              <BaseButton variant="suggestion" size="sm">
                Экзамены
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Header/Navigation Buttons -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Header & Navigation Buttons</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: SiteHeader, MobileNavDrawer</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <p class="text-xs text-gray-500 mb-2">Header Selector (Language/Currency):</p>
              <div class="flex flex-wrap gap-4">
                <button
                  class="flex items-center gap-2 px-3 py-2 rounded-lg bg-background hover:bg-gray-100 transition-colors text-sm font-medium text-secondary min-h-touch-44"
                >
                  <Icon name="mdi:web" class="text-base" />
                  RU
                  <Icon name="mdi:chevron-down" class="text-base text-gray-400" />
                </button>
                <button
                  class="flex items-center gap-2 px-3 py-2 rounded-lg bg-background hover:bg-gray-100 transition-colors text-sm font-medium text-secondary min-h-touch-44"
                >
                  ₸
                  <Icon name="mdi:chevron-down" class="text-base" />
                </button>
              </div>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-2">Mobile Menu Toggle:</p>
              <BaseButton variant="icon" icon="mdi:menu" aria-label="Меню" rounded="xl" class="w-12 h-12" />
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-2">Mobile Language Switcher:</p>
              <div class="flex gap-2 max-w-xs">
                <BaseButton variant="primary" size="sm" rounded="lg" class="flex-1">
                  RU
                </BaseButton>
                <BaseButton variant="chip-pill" size="sm" rounded="lg" class="flex-1">
                  ҚЗ
                </BaseButton>
                <BaseButton variant="chip-pill" size="sm" rounded="lg" class="flex-1">
                  EN
                </BaseButton>
                <BaseButton variant="chip-pill" size="sm" rounded="lg" class="flex-1">
                  TR
                </BaseButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Close/Icon Buttons -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Icon Buttons (Close, Clear, etc.)</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: ApplicationModal, SiteHeader, FAQ</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex flex-wrap gap-4 items-center">
              <BaseButton variant="icon-close-lg" icon="mdi:close" aria-label="Закрыть" no-focus-ring class="w-11 h-11" />
              <BaseButton variant="icon-close-md" icon="mdi:close" aria-label="Закрыть" no-focus-ring class="w-9 h-9" />
              <BaseButton variant="icon-close-sm" icon="mdi:close" aria-label="Закрыть" no-focus-ring />
            </div>
          </div>
        </div>

        <!-- Accordion/Toggle Buttons -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Accordion/Toggle Buttons</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: FearsSection, FAQ, PackageCard</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <button class="w-full text-left">
              <p class="text-gray-600 text-sm">Страх</p>
              <div class="mt-1 flex items-center justify-between">
                <span class="text-card-title">Не поступлю в университет</span>
                <span class="ml-3 text-gray-400 text-xl leading-none">+</span>
              </div>
              <p class="mt-1 text-sm text-gray-500 italic">"А вдруг я не сдам экзамен?"</p>
            </button>
            <button
              class="w-full px-4 py-3 sm:px-6 sm:py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset rounded-xl sm:rounded-2xl min-h-touch-44 border border-gray-200"
            >
              <span class="text-base sm:text-lg font-medium text-secondary pr-4">
                Какие документы нужны для поступления?
              </span>
              <Icon
                name="mdi:chevron-down"
                class="text-gray-400 transition-transform w-5 h-5 flex-shrink-0"
              />
            </button>
            <button
              class="w-full flex items-center justify-between text-left font-semibold text-gray-700 mb-2"
            >
              <span>Что входит в пакет</span>
              <Icon name="mdi:chevron-down" class="w-5 h-5 transition-transform" />
            </button>
          </div>
        </div>

        <!-- Pagination Buttons -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Pagination Buttons</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: Pagination component</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <nav class="flex items-center justify-center gap-1 text-sm select-none">
              <BaseButton variant="pagination">
                ‹
              </BaseButton>
              <BaseButton variant="pagination" data-active="true">
                1
              </BaseButton>
              <BaseButton variant="pagination">
                2
              </BaseButton>
              <BaseButton variant="pagination">
                3
              </BaseButton>
              <BaseButton variant="pagination" disabled class="!border-transparent !text-gray-400">
                …
              </BaseButton>
              <BaseButton variant="pagination">
                10
              </BaseButton>
              <BaseButton variant="pagination">
                ›
              </BaseButton>
            </nav>
          </div>
        </div>

        <!-- Text/Ghost Buttons -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Text & Ghost Buttons</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: ListFilterPanel, FAQ, ShareExperienceForm</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div class="flex flex-wrap gap-4">
              <BaseButton size="sm" variant="link" icon="mdi:refresh">
                Сбросить фильтры
              </BaseButton>
              <BaseButton size="sm" variant="link" class="text-primary hover:text-primary-dark font-medium">
                Показать все вопросы
              </BaseButton>
              <BaseButton size="sm" variant="link" class="text-red-600 hover:text-red-800 font-semibold">
                Закрыть
              </BaseButton>
            </div>
            <div>
              <BaseButton size="sm" variant="link" icon="mdi:tune-variant" class="text-gray-600 hover:text-primary px-3 py-2.5">
                Больше фильтров
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Sidebar Quick Link Buttons -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Sidebar Quick Links</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: SidebarSection (Blog)</p>
          <div class="bg-white rounded-xl p-6 shadow-sm max-w-sm">
            <button
              class="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-left transition-all hover:bg-primary/5"
            >
              <span
                class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 group-hover:bg-primary group-hover:text-white transition-colors"
              >
                <Icon name="mdi:school-outline" class="text-sm" />
              </span>
              <span class="text-gray-600 group-hover:text-secondary transition-colors">
                Университеты
              </span>
            </button>
            <button
              class="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-left transition-all hover:bg-primary/5"
            >
              <span
                class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 group-hover:bg-primary group-hover:text-white transition-colors"
              >
                <Icon name="mdi:headset" class="text-sm" />
              </span>
              <span class="text-gray-600 group-hover:text-secondary transition-colors">
                Консультация
              </span>
            </button>
          </div>
        </div>

        <!-- Sticky Mobile CTA -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Sticky Mobile CTA</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: StickyCtaWidget (Blog)</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex items-center gap-3 max-w-md p-4 bg-white border border-gray-100 shadow-lg rounded-xl">
              <div class="flex-1">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                  Бесплатно
                </p>
                <p class="text-sm font-bold text-secondary leading-tight">
                  Получить консультацию
                </p>
              </div>
              <BaseButton variant="primary" size="sm" rounded="full" class="shadow-lg">
                Записаться
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Calculator Submit -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Calculator Submit</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: TranslationsCalculatorSection</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <BaseButton variant="primary" size="md" full-width rounded="lg" class="max-w-md shadow-md hover:shadow-lg">
              Заказать перевод
            </BaseButton>
          </div>
        </div>

        <!-- Dropdown Item Buttons -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Dropdown Items</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: SiteHeader (dropdowns), FAQ (search suggestions)</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="w-64 rounded-xl border border-gray-100 bg-white shadow-dropdown py-2">
              <button
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-primary bg-primary/5 font-medium"
              >
                <span class="w-5 text-center text-xs text-gray-400">RU</span>
                <span>Русский</span>
                <Icon name="mdi:check" class="ml-auto text-primary" />
              </button>
              <button
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-secondary hover:bg-gray-50"
              >
                <span class="w-5 text-center text-xs text-gray-400">EN</span>
                <span>English</span>
              </button>
              <button
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-secondary hover:bg-gray-50"
              >
                <span class="w-5 text-center text-xs text-gray-400">TR</span>
                <span>Türkçe</span>
              </button>
            </div>
          </div>
        </div>

        <!-- WhatsApp Button -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">WhatsApp CTA Button</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: DetailView (university detail)</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <BaseButton
              variant="whatsapp-cta"
              href="#"
              icon="ph:whatsapp-logo"
              no-focus-ring
              class="px-8 py-4 text-lg w-fit"
            >
              Написать в WhatsApp
            </BaseButton>
          </div>
        </div>

        <!-- Tab Buttons -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Tab Buttons</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: ProsConsWidget, DetailAcademicProgramsSection</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <p class="text-xs text-gray-500 mb-2">Segmented Tabs (Academic Programs):</p>
              <div class="bg-background rounded-xl p-1 flex space-x-1 w-fit">
                <BaseButton variant="tab-active" no-focus-ring>
                  Бакалавриат
                </BaseButton>
                <BaseButton variant="tab-inactive" no-focus-ring>
                  Магистратура
                </BaseButton>
              </div>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-2">Pros/Cons Tabs:</p>
              <div class="flex border-b border-gray-200 w-fit">
                <button
                  class="flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-colors bg-green-50 text-green-700 border-b-2 border-green-500"
                >
                  <Icon name="mdi:check-circle" class="text-lg" />
                  Плюсы
                </button>
                <button
                  class="flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-colors text-gray-500 hover:bg-gray-50"
                >
                  <Icon name="mdi:alert" class="text-lg" />
                  Минусы
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Lightbox Navigation Buttons -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Lightbox Navigation</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: Lightbox component</p>
          <div class="bg-gray-800 rounded-xl p-6 shadow-sm">
            <div class="flex items-center gap-4">
              <BaseButton
                variant="lightbox-close"
                icon="mdi:close"
                aria-label="Закрыть"
                no-focus-ring
                class="w-10 h-10"
              />
              <BaseButton
                variant="lightbox-nav"
                icon="mdi:chevron-left"
                aria-label="Назад"
                no-focus-ring
                class="w-12 h-12"
              />
              <BaseButton
                variant="lightbox-nav"
                icon="mdi:chevron-right"
                aria-label="Вперед"
                no-focus-ring
                class="w-12 h-12"
              />
            </div>
          </div>
        </div>

        <!-- Share Link Buttons -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Share Link Buttons</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: Article, Programs Detail (share section)</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex flex-wrap gap-2">
              <BaseButton
                variant="secondary"
                size="sm"
                href="#"
                icon="mdi:telegram"
                class="shadow-sm hover:border-primary hover:text-primary hover:shadow-md"
              >
                Telegram
              </BaseButton>
              <BaseButton
                variant="secondary"
                size="sm"
                href="#"
                icon="mdi:whatsapp"
                class="shadow-sm hover:border-primary hover:text-primary hover:shadow-md"
              >
                WhatsApp
              </BaseButton>
              <BaseButton
                variant="secondary"
                size="sm"
                icon="mdi:link-variant"
                class="shadow-sm hover:border-primary hover:text-primary hover:shadow-md"
              >
                Копировать ссылку
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Tag Chips -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Tag Chips (Clickable)</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: Article, Programs Detail (tags)</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex flex-wrap gap-2">
              <span
                class="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white cursor-pointer"
              >
                #образование
              </span>
              <span
                class="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white cursor-pointer"
              >
                #турция
              </span>
              <span
                class="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white cursor-pointer"
              >
                #университеты
              </span>
            </div>
          </div>
        </div>

        <!-- Back Link -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Back Link</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: Programs Detail</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <BaseButton size="sm" variant="link" href="#" icon="mdi:arrow-left">
              Назад к программам
            </BaseButton>
          </div>
        </div>

        <!-- Related Articles Link -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Related Articles Link (Pill)</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: Article (related section)</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <BaseButton
              variant="pill-secondary"
              size="sm"
              href="#"
              icon="mdi:arrow-right"
              icon-position="right"
              no-focus-ring
              class="px-6 py-3"
            >
              Все статьи
            </BaseButton>
          </div>
        </div>

        <!-- Show All / Collapse Buttons -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Show All / Collapse</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: DetailAcademicProgramsSection</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <BaseButton variant="primary" size="md" icon="ph:caret-down" icon-position="right" class="shadow-lg">
              Показать все
            </BaseButton>
            <BaseButton variant="link" icon="ph:caret-up" icon-position="right" class="text-primary hover:text-red-600 font-semibold">
              Свернуть
            </BaseButton>
          </div>
        </div>

        <!-- Toast Close Button -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Toast Close Button</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: Toast component</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="rounded-xl shadow-lg p-4 border flex gap-3 items-start bg-green-50 border-green-200 text-green-900 max-w-sm">
              <div class="mt-0.5">
                <Icon name="mdi:check-circle" class="text-green-600" />
              </div>
              <div class="flex-1">
                <p class="font-semibold mb-0.5">Успешно!</p>
                <p class="text-sm leading-snug opacity-90">Заявка отправлена</p>
              </div>
              <BaseButton variant="toast-close" icon="mdi:close" aria-label="Закрыть" no-focus-ring />
            </div>
          </div>
        </div>

        <!-- Table of Contents Button -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Table of Contents Item</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: Article, Programs Detail (sidebar TOC)</p>
          <div class="bg-white rounded-xl p-6 shadow-sm max-w-sm">
            <button
              class="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-left transition-all hover:bg-primary/5 bg-primary/10"
            >
              <span
                class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors bg-primary text-white"
              >
                1
              </span>
              <span class="line-clamp-2 transition-colors text-secondary font-medium">
                Введение
              </span>
            </button>
            <button
              class="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-left transition-all hover:bg-primary/5"
            >
              <span
                class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors bg-gray-100 text-gray-500 group-hover:bg-primary group-hover:text-white"
              >
                2
              </span>
              <span class="line-clamp-2 transition-colors text-gray-600 group-hover:text-secondary">
                Требования к документам
              </span>
            </button>
          </div>
        </div>

        <!-- Inverted CTA Button -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Inverted CTA (White on Gradient)</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: FinalCtaSection</p>
          <div class="bg-gradient-to-r from-primary to-red-600 rounded-xl p-6 shadow-sm">
            <BaseButton variant="inverted" size="xl">
              Получить предложение
            </BaseButton>
          </div>
        </div>

        <!-- Mobile Nav Link with Icon -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Mobile Navigation Link</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: MobileNavDrawer</p>
          <div class="bg-white rounded-xl p-6 shadow-sm max-w-xs">
            <div class="space-y-1">
              <a
                href="#"
                class="flex items-center gap-3 px-3 py-3 rounded-xl transition-colors bg-primary/5 text-primary"
              >
                <Icon name="mdi:school" class="text-lg opacity-70" />
                <span class="font-medium">Университеты</span>
              </a>
              <a
                href="#"
                class="flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-secondary hover:bg-gray-50"
              >
                <Icon name="mdi:book-education" class="text-lg opacity-70" />
                <span class="font-medium">Программы</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Services Dropdown Toggle -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Services Dropdown Toggle (Mobile)</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: MobileNavDrawer</p>
          <div class="bg-white rounded-xl p-6 shadow-sm max-w-xs">
            <button
              type="button"
              class="w-full flex items-center justify-between px-3 py-3 rounded-xl transition-colors bg-primary/5 text-primary"
            >
              <div class="flex items-center gap-3">
                <Icon name="mdi:briefcase-outline" class="text-lg opacity-70" />
                <span class="font-medium">Услуги</span>
              </div>
              <Icon
                name="mdi:chevron-down"
                class="text-lg transition-transform duration-200 rotate-180"
              />
            </button>
            <button
              type="button"
              class="w-full flex items-center justify-between px-3 py-3 rounded-xl transition-colors text-secondary hover:bg-gray-50 mt-2"
            >
              <div class="flex items-center gap-3">
                <Icon name="mdi:briefcase-outline" class="text-lg opacity-70" />
                <span class="font-medium">Услуги</span>
              </div>
              <Icon
                name="mdi:chevron-down"
                class="text-lg transition-transform duration-200"
              />
            </button>
          </div>
        </div>

        <!-- Desktop Nav Link with Dropdown -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Desktop Navigation Dropdown</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: SiteHeader</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex gap-4">
              <button
                type="button"
                class="nav-link flex items-center gap-1 nav-link-active"
              >
                Услуги
                <Icon name="mdi:chevron-up" class="text-base" />
              </button>
              <button
                type="button"
                class="nav-link flex items-center gap-1"
              >
                Услуги
                <Icon name="mdi:chevron-down" class="text-base" />
              </button>
            </div>
          </div>
        </div>

        <!-- Footer Links -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Footer Links</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: SiteFooter</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="space-y-3">
              <a href="#" class="footer-link block">О нас</a>
              <button class="footer-link">Стамбул</button>
              <a href="#" class="footer-link block">FAQ</a>
            </div>
          </div>
        </div>

        <!-- Social Media Icon Buttons -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Social Media Icon Buttons</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: SiteFooter</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex space-x-3">
              <BaseButton
                variant="social-whatsapp"
                href="#"
                icon="mdi:whatsapp"
                aria-label="WhatsApp"
                rounded="xl"
              />
              <BaseButton
                variant="social-telegram"
                href="#"
                icon="mdi:telegram"
                aria-label="Telegram"
                rounded="xl"
              />
              <BaseButton
                variant="social-instagram"
                href="#"
                icon="mdi:instagram"
                aria-label="Instagram"
                rounded="xl"
              />
            </div>
          </div>
        </div>

        <!-- Popular Articles Link (Sidebar) -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Popular Articles Link (Sidebar)</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: SidebarSection (Blog)</p>
          <div class="bg-white rounded-xl p-6 shadow-sm max-w-sm">
            <div class="space-y-1">
              <a
                href="#"
                class="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-left transition-all hover:bg-primary/5"
              >
                <span
                  class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold bg-gray-100 text-gray-500 group-hover:bg-primary group-hover:text-white transition-colors"
                >
                  1
                </span>
                <div class="min-w-0 flex-1">
                  <span class="line-clamp-2 text-gray-600 group-hover:text-secondary transition-colors block">
                    Как поступить в университет
                  </span>
                  <span class="text-xs text-gray-400 block">15 дек 2024</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- Input Clear Button -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Input Clear Button</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: BaseTextField (clearable)</p>
          <div class="bg-white rounded-xl p-6 shadow-sm max-w-md">
            <div class="relative">
              <input
                type="text"
                value="Пример текста"
                class="w-full pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none font-medium text-secondary placeholder-gray-400 transition-all duration-200"
                placeholder="Введите текст"
              />
              <BaseButton
                variant="input-clear"
                icon="mdi:close"
                aria-label="Очистить"
                no-focus-ring
                class="absolute inset-y-0 right-0 flex items-center"
              />
            </div>
          </div>
        </div>

        <!-- Service CTA (White on Red) -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Service CTA (White on Red Background)</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: TranslationsCTASection</p>
          <div class="bg-primary rounded-xl p-6 shadow-sm">
            <BaseButton variant="inverted" size="lg" icon="mdi:email" rounded="lg" class="shadow-lg hover:shadow-card-hover">
              Заказать услугу
            </BaseButton>
          </div>
        </div>

      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>
