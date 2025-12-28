<template>
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-default">
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
              class="nav-link flex items-center gap-component-xs"
              :class="
                servicesDropdown.isOpen.value || isServiceRouteActive ? 'nav-link-active' : ''
              "
              @click.prevent="servicesDropdown.toggle"
            >
              {{ t(navNs('services')) }}
              <Icon
                :name="servicesDropdown.isOpen.value ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                class="text-icon-xs"
              />
            </button>

            <Transition name="fade">
              <div
                v-if="servicesDropdown.isOpen.value"
                class="absolute left-0 top-full z-50 pt-2"
                @mouseenter="servicesDropdown.open"
                @mouseleave="servicesDropdown.scheduleClose"
              >
                <div class="w-64 rounded-button border border-default bg-white shadow-dropdown py-2">
                  <NuxtLink
                    v-for="link in serviceLinks"
                    :key="link.path"
                    :to="link.path"
                    class="block px-4 py-2 text-sm transition-color"
                    :class="[
                      route.path === link.path
                        ? 'text-primary bg-primary/10'
                        : 'text-secondary hover:bg-surface',
                      link.highlight ? 'font-semibold' : ''
                    ]"
                    @click="servicesDropdown.close"
                  >
                    {{ link.label }}
                    <Icon v-if="link.highlight" name="mdi:star" class="inline text-icon-xs text-warning ml-1" />
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
            {{ link.label }}
          </NuxtLink>
        </nav>

        <!-- Right Section -->
        <div class="flex items-center space-x-3 md:space-x-4">
          <!-- Desktop Language Switcher -->
          <div ref="localeElRef" class="relative hidden md:block">
            <button
              type="button"
              class="flex items-center gap-component-sm px-3 py-2 rounded-lg bg-background hover:bg-surface-elevated transition-color text-sm font-medium text-secondary min-h-touch-44"
              @click="localeDropdown.toggle"
            >
              <Icon name="mdi:web" class="text-icon-xs" />
              {{ currentLocaleLabel }}
              <Icon
                :name="localeDropdown.isOpen.value ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                class="text-icon-xs text-hint"
              />
            </button>

            <Transition name="fade">
              <div v-if="localeDropdown.isOpen.value" class="absolute right-0 top-full z-50 pt-2">
                <div class="min-w-[140px] rounded-button border border-default bg-white shadow-dropdown py-1">
                  <button
                    v-for="opt in localeOptions"
                    :key="opt.code"
                    type="button"
                    class="w-full flex items-center gap-component-md px-4 py-2.5 text-sm transition-color"
                    :class="
                      opt.code === currentLocale
                        ? 'text-primary bg-primary/5 font-medium'
                        : 'text-secondary hover:bg-surface'
                    "
                    @click="changeLocale(opt.code)"
                  >
                    <span class="w-5 text-center text-xs text-hint">{{ opt.code.toUpperCase() }}</span>
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
              class="flex items-center gap-component-sm px-3 py-2 rounded-lg bg-background hover:bg-surface-elevated transition-color text-sm font-medium text-secondary min-h-touch-44"
              @click="currencyDropdown.toggle"
            >
              {{ currencySymbol }}
              <Icon
                :name="currencyDropdown.isOpen.value ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                class="text-icon-xs"
              />
            </button>

            <Transition name="fade">
              <div v-if="currencyDropdown.isOpen.value" class="absolute right-0 top-full z-50 pt-2">
                <div class="w-40 rounded-button border border-default bg-white shadow-dropdown py-2">
                  <button
                    v-for="curr in currencyOptions"
                    :key="curr.code"
                    type="button"
                    class="w-full text-left px-4 py-2 text-sm transition-color"
                    :class="
                      curr.code === currency
                        ? 'text-primary bg-primary/10'
                        : 'text-secondary hover:bg-surface'
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
          <BaseButton
            variant="icon"
            :icon="isMobileNavOpen ? 'mdi:close' : 'mdi:menu'"
            aria-label="Toggle menu"
            rounded="xl"
            class="lg:hidden w-12 h-12"
            @click="toggleMobileNav"
          />
        </div>
      </div>
    </div>

    <MobileNavDrawer :is-open="isMobileNavOpen" @close="closeMobileNav" />
  </header>
</template>

<script setup lang="ts">
import type { SupportedLocale } from '~~/lib/config/locales'
import type { SupportedCurrency as Currency } from '~~/lib/config/currency'
import { ASSETS } from '~~/lib/config/assets'
import { namespace } from '~~/lib/i18n'

const navNs = namespace('nav')
const currencyNs = namespace('currency.selector')

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
const navLinks = computed(() => [
  { path: '/universities', label: t(navNs('universities')) },
  { path: '/programs', label: t(navNs('programs')) },
  { path: '/reviews', label: t(navNs('reviews')) },
  { path: '/blog', label: t(navNs('blog')) },
  { path: '/about', label: t(navNs('about')) },
  { path: '/faq', label: t(navNs('faq')) },
])

const serviceLinks = computed(() => [
  {
    label: t(navNs('servicesDropdown.relocation')),
    path: localePath('/services/relocation-in-turkey'),
    highlight: true,
  },
  { label: t(navNs('servicesDropdown.trYosCourses')), path: localePath('/services/tr-yos-courses') },
  { label: t(navNs('servicesDropdown.satCourses')), path: localePath('/services/sat-courses') },
  {
    label: t(navNs('servicesDropdown.languageCourse')),
    path: localePath('/services/turkish-english-course'),
  },
  {
    label: t(navNs('servicesDropdown.documentTranslations')),
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
  { code: 'KZT' as Currency, label: t(currencyNs('KZT')) },
  { code: 'TRY' as Currency, label: t(currencyNs('TRY')) },
  { code: 'RUB' as Currency, label: t(currencyNs('RUB')) },
  { code: 'USD' as Currency, label: t(currencyNs('USD')) },
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
