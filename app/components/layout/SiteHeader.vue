<template>
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
    <div class="container mx-auto container-padding-narrow">
      <div class="flex items-center justify-between h-14 md:h-16">
        <!-- Logo -->
        <NuxtLink :to="localePath('/')" class="flex items-center">
          <NuxtImg
            :src="ASSETS.logo"
            alt="Edu.turkish"
            width="60"
            height="60"
            fetchpriority="high"
            decoding="async"
            class="h-[52px] w-[52px]"
            sizes="52px"
            format="webp"
          />
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-8">
          <!-- Services Dropdown -->
          <div
            ref="servicesRef"
            class="relative"
            @mouseenter="servicesDropdown.open"
            @mouseleave="servicesDropdown.scheduleClose"
          >
            <button
              type="button"
              class="nav-link flex items-center gap-1"
              :class="
                servicesDropdown.isOpen.value || isServiceRouteActive ? 'nav-link-active' : ''
              "
              @click.prevent="servicesDropdown.toggle"
            >
              {{ t('nav.services') }}
              <Icon
                :name="servicesDropdown.isOpen.value ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                class="text-base"
              />
            </button>

            <Transition name="fade">
              <div
                v-if="servicesDropdown.isOpen.value"
                class="absolute left-0 top-full z-50 pt-2"
                @mouseenter="servicesDropdown.open"
                @mouseleave="servicesDropdown.scheduleClose"
              >
                <div class="w-64 rounded-xl border border-gray-100 bg-white shadow-xl py-2">
                  <NuxtLink
                    v-for="link in serviceLinks"
                    :key="link.path"
                    :to="link.path"
                    class="block px-4 py-2 text-sm transition-colors"
                    :class="
                      route.path === link.path
                        ? 'text-primary bg-primary/10'
                        : 'text-secondary hover:bg-gray-50'
                    "
                    @click="servicesDropdown.close"
                  >
                    {{ link.label }}
                  </NuxtLink>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Nav Links -->
          <NuxtLink
            v-for="link in navLinks"
            :key="link.path"
            :to="localePath(link.path)"
            class="nav-link"
            :class="isActive(link.path) ? 'nav-link-active' : ''"
          >
            {{ t(link.i18nKey) }}
          </NuxtLink>
        </nav>

        <!-- Right Section -->
        <div class="flex items-center space-x-3 md:space-x-4">
          <!-- Desktop Language Switcher -->
          <div ref="localeElRef" class="relative hidden md:block">
            <button
              type="button"
              class="flex items-center gap-2 px-3 py-2 rounded-lg bg-background hover:bg-gray-100 transition-colors text-sm font-medium text-secondary min-h-touch-44"
              @click="localeDropdown.toggle"
            >
              <Icon name="mdi:web" class="text-base" />
              {{ currentLocaleLabel }}
              <Icon
                :name="localeDropdown.isOpen.value ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                class="text-base text-gray-400"
              />
            </button>

            <Transition name="fade">
              <div v-if="localeDropdown.isOpen.value" class="absolute right-0 top-full z-50 pt-2">
                <div class="min-w-[140px] rounded-xl border border-gray-100 bg-white shadow-xl py-1">
                  <button
                    v-for="opt in localeOptions"
                    :key="opt.code"
                    type="button"
                    class="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                    :class="
                      opt.code === currentLocale
                        ? 'text-primary bg-primary/5 font-medium'
                        : 'text-secondary hover:bg-gray-50'
                    "
                    @click="changeLocale(opt.code)"
                  >
                    <span class="w-5 text-center text-xs text-gray-400">{{ opt.code.toUpperCase() }}</span>
                    <span>{{ opt.fullLabel }}</span>
                    <Icon
                      v-if="opt.code === currentLocale"
                      name="mdi:check"
                      class="ml-auto text-primary"
                    />
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Currency Selector -->
          <div ref="currencyElRef" class="relative hidden md:block">
            <button
              type="button"
              class="flex items-center gap-2 px-3 py-2 rounded-lg bg-background hover:bg-gray-100 transition-colors text-sm font-medium text-secondary min-h-touch-44"
              @click="currencyDropdown.toggle"
            >
              {{ currencySymbol }}
              <Icon
                :name="currencyDropdown.isOpen.value ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                class="text-base"
              />
            </button>

            <Transition name="fade">
              <div v-if="currencyDropdown.isOpen.value" class="absolute right-0 top-full z-50 pt-2">
                <div class="w-40 rounded-xl border border-gray-100 bg-white shadow-xl py-2">
                  <button
                    v-for="curr in currencyOptions"
                    :key="curr.code"
                    type="button"
                    class="w-full text-left px-4 py-2 text-sm transition-colors"
                    :class="
                      curr.code === currency
                        ? 'text-primary bg-primary/10'
                        : 'text-secondary hover:bg-gray-50'
                    "
                    @click="changeCurrency(curr.code)"
                  >
                    {{ curr.label }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Mobile Menu Button -->
          <button
            class="lg:hidden flex items-center justify-center w-12 h-12 rounded-xl hover:bg-gray-100 transition-colors min-h-touch-44 min-w-touch-44"
            aria-label="Toggle menu"
            @click="toggleMobileNav"
          >
            <Icon
              :name="isMobileNavOpen ? 'mdi:close' : 'mdi:menu'"
              class="text-secondary text-xl"
            />
          </button>
        </div>
      </div>
    </div>

    <MobileNavDrawer :is-open="isMobileNavOpen" @close="closeMobileNav" />
  </header>
</template>

<script setup lang="ts">
import type { SupportedLocale } from '~~/lib/locales'
import type { Currency } from '~/types/currency'
import { ASSETS } from '~~/lib/assets'

const route = useRoute()
const { t } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { currencyRef: currency, setCurrency, getCurrencySymbol } = useCurrency()

// Refs for click-outside detection
const servicesRef = ref<HTMLElement | null>(null)
const currencyElRef = ref<HTMLElement | null>(null)
const localeElRef = ref<HTMLElement | null>(null)

// Dropdown helper
function useDropdown(containerRef: Ref<HTMLElement | null>) {
  const isOpen = ref(false)
  let timer: NodeJS.Timeout | null = null

  const open = () => {
    clearTimer()
    isOpen.value = true
  }
  const close = () => {
    isOpen.value = false
  }
  const toggle = () => {
    isOpen.value = !isOpen.value
  }
  const scheduleClose = () => {
    clearTimer()
    timer = setTimeout(close, 120)
  }
  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  // Click outside
  const onDocClick = (e: MouseEvent) => {
    if (containerRef.value && !containerRef.value.contains(e.target as Node)) close()
  }

  onMounted(() => document.addEventListener('click', onDocClick))
  onBeforeUnmount(() => {
    document.removeEventListener('click', onDocClick)
    clearTimer()
  })

  return { isOpen, open, close, toggle, scheduleClose }
}

const servicesDropdown = useDropdown(servicesRef)
const currencyDropdown = useDropdown(currencyElRef)
const localeDropdown = useDropdown(localeElRef)

// Navigation links
const navLinks = [
  { path: '/universities', i18nKey: 'nav.universities' },
  { path: '/programs', i18nKey: 'nav.programs' },
  { path: '/reviews', i18nKey: 'nav.reviews' },
  { path: '/blog', i18nKey: 'nav.blog' },
  { path: '/about', i18nKey: 'nav.about' },
  { path: '/faq', i18nKey: 'nav.faq' },
]

const serviceLinks = computed(() => [
  {
    label: t('nav.servicesDropdown.relocation'),
    path: localePath('/services/relocation-in-turkey'),
  },
  { label: t('nav.servicesDropdown.trYosCourses'), path: localePath('/services/tr-yos-courses') },
  { label: t('nav.servicesDropdown.satCourses'), path: localePath('/services/sat-courses') },
  {
    label: t('nav.servicesDropdown.languageCourse'),
    path: localePath('/services/turkish-english-course'),
  },
  {
    label: t('nav.servicesDropdown.documentTranslations'),
    path: localePath('/services/document-translations'),
  },
])

const isServiceRouteActive = computed(
  () => serviceLinks.value.some((l) => route.path === l.path) || route.hash === '#services',
)

// Locale switcher
const localeOptions: { code: SupportedLocale; label: string; fullLabel: string }[] = [
  { code: 'ru', label: 'RU', fullLabel: 'Русский' },
  { code: 'kk', label: 'KZ', fullLabel: 'Қазақша' },
  { code: 'en', label: 'EN', fullLabel: 'English' },
  { code: 'tr', label: 'TR', fullLabel: 'Türkçe' },
]

const currentLocale = computed(() => useI18n().locale.value)
const currentLocaleLabel = computed(
  () => localeOptions.find((o) => o.code === currentLocale.value)?.label ?? 'RU',
)

function changeLocale(code: SupportedLocale) {
  if (code !== currentLocale.value) {
    const path = switchLocalePath(code)
    if (path) navigateTo(path)
  }
  localeDropdown.close()
}

// Currency
const currencyOptions = computed(() => [
  { code: 'KZT' as Currency, label: t('currency.selector.KZT') },
  { code: 'TRY' as Currency, label: t('currency.selector.TRY') },
  { code: 'RUB' as Currency, label: t('currency.selector.RUB') },
  { code: 'USD' as Currency, label: t('currency.selector.USD') },
])

const currencySymbol = computed(() => getCurrencySymbol())

function changeCurrency(code: Currency) {
  setCurrency(code)
  currencyDropdown.close()
}

// Mobile nav
const isMobileNavOpen = ref(false)

function toggleMobileNav() {
  isMobileNavOpen.value = !isMobileNavOpen.value
  if (import.meta.client) {
    document.body.style.overflow = isMobileNavOpen.value ? 'hidden' : 'auto'
  }
}

function closeMobileNav() {
  isMobileNavOpen.value = false
  if (import.meta.client) document.body.style.overflow = 'auto'
}

function isActive(path: string) {
  if (path.startsWith('#')) {
    return import.meta.client && route.path === localePath('/') && route.hash === path
  }
  return route.path === localePath(path)
}

// Close menus on route change
watch(() => route.path, closeMobileNav)
watch(() => route.fullPath, servicesDropdown.close)
</script>

<style scoped>
.nav-link {
  @apply transition-colors font-medium cursor-pointer text-secondary hover:text-primary border-b-2 border-transparent;
}
.nav-link-active {
  @apply text-primary border-primary;
}
</style>
