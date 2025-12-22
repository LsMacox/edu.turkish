<template>
  <div class="min-h-screen bg-gray-50 section-py-lg">
    <div class="container mx-auto px-4 max-w-6xl">
      <h1 class="text-3xl font-bold text-secondary mb-2">UI Showcase</h1>
      <p class="text-gray-600 mb-12">Все виды кнопок, используемых в приложении</p>

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
              <button
                class="bg-primary text-white px-12 py-4 rounded-xl font-bold text-xl hover:bg-red-600 shadow-2xl"
              >
                Получить предложение
              </button>
              <button
                class="bg-primary text-white px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold text-sm md:text-lg hover:bg-red-600 transition-all shadow-lg w-full sm:w-auto min-h-touch-44 md:min-h-touch-48"
              >
                Получить предложение
              </button>
            </div>
          </div>
        </div>

        <!-- Primary Submit Form -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Primary Submit (Forms)</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: ApplicationModal, ShareExperienceForm, DetailApplicationCTASection</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex flex-wrap gap-4">
              <button
                class="w-full bg-primary text-white rounded-xl font-semibold hover:bg-red-600 active:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed py-4 text-lg md:text-lg min-h-[52px] shadow-lg active:shadow-md max-w-md"
              >
                Отправить заявку
              </button>
              <button
                class="bg-primary text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
              >
                Подать заявку
              </button>
              <button
                class="w-full md:w-auto bg-primary text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed max-w-sm"
              >
                Отправить отзыв
              </button>
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
                <button
                  class="w-full bg-primary text-white rounded-lg py-3 px-4 font-semibold hover:bg-red-600 active:bg-red-700 transition-colors"
                >
                  Заказать
                </button>
              </div>
              <div class="w-64">
                <button
                  class="w-full rounded-lg py-3 px-4 font-semibold transition-colors bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                >
                  VIP Заказать
                </button>
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
              <a
                href="#"
                class="inline-block bg-white border-2 border-primary text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white"
              >
                Смотреть все
              </a>
              <button
                class="bg-white border-2 border-primary text-primary px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold text-sm md:text-lg hover:bg-primary hover:text-white transition-all w-full sm:w-auto min-h-touch-44 md:min-h-touch-48 text-center"
              >
                Смотреть университеты
              </button>
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
                <button
                  class="px-4 py-2 text-sm rounded-xl font-medium md:px-6 md:text-base bg-primary text-white"
                >
                  Все города
                </button>
                <button
                  class="px-4 py-2 text-sm rounded-xl font-medium md:px-6 md:text-base bg-white border border-gray-300 text-secondary hover:border-primary hover:text-primary"
                >
                  Стамбул
                </button>
                <button
                  class="px-4 py-2 text-sm rounded-xl font-medium md:px-6 md:text-base bg-white border border-gray-300 text-secondary hover:border-primary hover:text-primary"
                >
                  Анкара
                </button>
              </div>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-2">Rounded (FAQ categories, Language filters):</p>
              <div class="flex flex-wrap gap-2">
                <button
                  class="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 bg-primary text-white shadow-sm"
                >
                  Английский
                </button>
                <button
                  class="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  Турецкий
                </button>
              </div>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-2">FAQ Category with icon:</p>
              <div class="flex flex-wrap gap-2">
                <button
                  class="px-3 py-1.5 text-sm rounded-full font-medium transition-all min-h-touch-44 flex items-center gap-1.5 bg-primary text-white shadow-sm"
                >
                  <Icon name="mdi:star" class="w-4 h-4" />
                  <span>Все</span>
                </button>
                <button
                  class="px-3 py-1.5 text-sm rounded-full font-medium transition-all min-h-touch-44 flex items-center gap-1.5 bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                >
                  <Icon name="mdi:file-document" class="w-4 h-4" />
                  <span>Документы</span>
                </button>
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
              <button
                class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Документы
              </button>
              <button
                class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Стипендии
              </button>
              <button
                class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Экзамены
              </button>
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
              <button
                class="lg:hidden flex items-center justify-center w-12 h-12 rounded-xl hover:bg-gray-100 transition-colors min-h-touch-44 min-w-touch-44"
              >
                <Icon name="mdi:menu" class="text-secondary text-xl" />
              </button>
            </div>
            <div>
              <p class="text-xs text-gray-500 mb-2">Mobile Language Switcher:</p>
              <div class="flex gap-2 max-w-xs">
                <button
                  class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors bg-primary text-white"
                >
                  RU
                </button>
                <button
                  class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  ҚЗ
                </button>
                <button
                  class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  EN
                </button>
                <button
                  class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  TR
                </button>
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
              <button
                class="w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors flex-shrink-0"
              >
                <Icon name="mdi:close" class="text-gray-500 text-2xl" />
              </button>
              <button
                class="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Icon name="mdi:close" class="text-gray-400 text-xl" />
              </button>
              <button
                class="text-gray-400 hover:text-gray-600 transition-colors p-1 min-w-touch-44 min-h-touch-44 flex items-center justify-center"
              >
                <Icon name="mdi:close" class="w-5 h-5" />
              </button>
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
              <button
                class="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                ‹
              </button>
              <button
                class="px-3 py-2 rounded-lg border text-center min-w-[40px] border-primary bg-primary text-white"
              >
                1
              </button>
              <button
                class="px-3 py-2 rounded-lg border text-center min-w-[40px] border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                2
              </button>
              <button
                class="px-3 py-2 rounded-lg border text-center min-w-[40px] border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                3
              </button>
              <button
                class="px-3 py-2 rounded-lg border text-center min-w-[40px] border-transparent text-gray-400 cursor-default"
                disabled
              >
                …
              </button>
              <button
                class="px-3 py-2 rounded-lg border text-center min-w-[40px] border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                10
              </button>
              <button
                class="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                ›
              </button>
            </nav>
          </div>
        </div>

        <!-- Text/Ghost Buttons -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Text & Ghost Buttons</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: ListFilterPanel, FAQ, ShareExperienceForm</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div class="flex flex-wrap gap-4">
              <button
                class="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1.5"
              >
                <Icon name="mdi:refresh" class="w-4 h-4" />
                Сбросить фильтры
              </button>
              <button
                class="text-primary hover:text-primary-dark font-medium text-sm"
              >
                Показать все вопросы
              </button>
              <button
                class="text-red-600 hover:text-red-800 font-semibold"
              >
                Закрыть
              </button>
            </div>
            <div>
              <button
                class="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
              >
                <Icon name="mdi:tune-variant" class="w-4 h-4" />
                <span>Больше фильтров</span>
              </button>
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
              <button
                class="px-6 py-3 text-sm font-bold text-white bg-primary rounded-full shadow-lg hover:bg-primary-dark whitespace-nowrap"
              >
                Записаться
              </button>
            </div>
          </div>
        </div>

        <!-- Calculator Submit -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Calculator Submit</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: TranslationsCalculatorSection</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <button
              class="w-full max-w-md px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors shadow-md hover:shadow-lg"
            >
              Заказать перевод
            </button>
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
            <a
              href="#"
              class="bg-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-600 transition-all shadow-lg flex items-center justify-center space-x-2 w-fit"
            >
              <Icon name="ph:whatsapp-logo" />
              <span>Написать в WhatsApp</span>
            </a>
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
                <button
                  class="px-6 py-3 rounded-lg font-semibold transition-colors bg-primary text-white"
                >
                  Бакалавриат
                </button>
                <button
                  class="px-6 py-3 rounded-lg font-semibold transition-colors text-gray-600 hover:text-secondary"
                >
                  Магистратура
                </button>
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
              <button
                class="w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-primary flex items-center justify-center transition-all"
              >
                <Icon name="mdi:close" class="text-2xl" />
              </button>
              <button
                class="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg transition-all hover:bg-primary hover:text-white hover:scale-110"
              >
                <Icon name="mdi:chevron-left" class="text-2xl" />
              </button>
              <button
                class="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg transition-all hover:bg-primary hover:text-white hover:scale-110"
              >
                <Icon name="mdi:chevron-right" class="text-2xl" />
              </button>
            </div>
          </div>
        </div>

        <!-- Share Link Buttons -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Share Link Buttons</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: Article, Programs Detail (share section)</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex flex-wrap gap-2">
              <a
                href="#"
                class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow-md"
              >
                <Icon name="mdi:telegram" class="text-base" />
                Telegram
              </a>
              <a
                href="#"
                class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow-md"
              >
                <Icon name="mdi:whatsapp" class="text-base" />
                WhatsApp
              </a>
              <button
                class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow-md"
              >
                <Icon name="mdi:link-variant" class="text-base" />
                Копировать ссылку
              </button>
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
            <a
              href="#"
              class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
            >
              <Icon name="mdi:arrow-left" class="text-base" />
              Назад к программам
            </a>
          </div>
        </div>

        <!-- Related Articles Link -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Related Articles Link (Pill)</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: Article (related section)</p>
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <a
              href="#"
              class="inline-flex items-center gap-2 rounded-full bg-secondary px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-primary hover:shadow-primary/25"
            >
              Все статьи
              <Icon name="mdi:arrow-right" class="text-lg" />
            </a>
          </div>
        </div>

        <!-- Show All / Collapse Buttons -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Show All / Collapse</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: DetailAcademicProgramsSection</p>
          <div class="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <button
              class="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors shadow-lg flex items-center gap-2"
            >
              <span>Показать все</span>
              <Icon name="ph:caret-down" class="text-lg" />
            </button>
            <button
              class="text-primary font-semibold hover:text-red-600 transition-colors flex items-center gap-2"
            >
              <span>Свернуть</span>
              <Icon name="ph:caret-up" class="text-lg" />
            </button>
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
              <button class="opacity-60 hover:opacity-100">
                <Icon name="mdi:close" />
              </button>
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
            <button
              class="bg-white text-primary px-12 py-4 rounded-xl font-bold text-xl hover:bg-gray-100 shadow-2xl"
            >
              Получить предложение
            </button>
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
              <a
                href="#"
                class="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-colors bg-green-500 hover:bg-green-600"
                aria-label="WhatsApp"
              >
                <Icon name="mdi:whatsapp" />
              </a>
              <a
                href="#"
                class="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-colors bg-blue-500 hover:bg-blue-600"
                aria-label="Telegram"
              >
                <Icon name="mdi:telegram" />
              </a>
              <a
                href="#"
                class="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-colors bg-pink-500 hover:bg-pink-600"
                aria-label="Instagram"
              >
                <Icon name="mdi:instagram" />
              </a>
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
                class="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none font-medium text-secondary placeholder-gray-400 transition-all duration-200"
                placeholder="Введите текст"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Очистить"
              >
                <Icon name="mdi:close" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Service CTA (White on Red) -->
        <div class="mb-12">
          <h3 class="text-lg font-semibold text-gray-700 mb-4">Service CTA (White on Red Background)</h3>
          <p class="text-sm text-gray-500 mb-4">Используется в: TranslationsCTASection</p>
          <div class="bg-primary rounded-xl p-6 shadow-sm">
            <button
              type="button"
              class="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-card-hover"
            >
              <Icon name="mdi:email" class="w-5 h-5 mr-2" />
              Заказать услугу
            </button>
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
