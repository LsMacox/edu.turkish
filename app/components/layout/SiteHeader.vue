<template>
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
    <div class="container mx-auto container-padding-narrow">
      <div class="flex items-center justify-between h-14 md:h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink :to="localePath('/')" class="flex items-center space-x-2 cursor-pointer">
            <NuxtImg
              :src="'c905b440-9cea-4b23-8576-f1787a84d356.png'"
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
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-8">
          <div
            ref="servicesDropdownRef"
            class="relative"
            @mouseenter="cancelCloseAndOpen()"
            @mouseleave="scheduleClose()"
            @focusin="openServicesMenu"
            @focusout="onServicesFocusOut"
          >
            <button
              type="button"
              :class="[
                'transition-colors font-medium cursor-pointer flex items-center gap-1 border-b-2 border-transparent',
                servicesMenuOpen || isServiceRouteActive
                  ? 'text-primary border-primary'
                  : 'text-secondary hover:text-primary',
              ]"
              aria-haspopup="menu"
              :aria-expanded="servicesMenuOpen"
              aria-controls="services-menu"
              @click.prevent="toggleServicesMenu"
              @keydown.enter.prevent="toggleServicesMenu"
              @keydown.space.prevent="toggleServicesMenu"
              @keydown.esc.prevent="closeServicesMenu"
            >
              <span>{{ t('nav.services') }}</span>
              <Icon
                :name="servicesMenuOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                class="text-base"
              />
            </button>

            <transition name="fade" mode="out-in">
              <div
                v-if="servicesMenuOpen"
                id="services-menu"
                class="absolute left-0 top-full z-50 pt-2"
                @mouseenter="cancelCloseAndOpen()"
                @mouseleave="scheduleClose()"
              >
                <div class="w-64 rounded-xl border border-gray-100 bg-white shadow-xl py-2">
                  <NuxtLink
                    v-for="link in serviceLinks"
                    :key="link.path"
                    :to="link.path"
                    class="block px-4 py-2 text-sm transition-colors"
                    :class="
                      isServiceLinkActive(link.path)
                        ? 'text-primary bg-primary/10'
                        : 'text-secondary hover:bg-gray-50'
                    "
                    @click="closeServicesMenu"
                  >
                    {{ link.label }}
                  </NuxtLink>
                </div>
              </div>
            </transition>
          </div>
          <NuxtLink
            :to="localePath('/universities')"
            :class="[
              'transition-colors font-medium cursor-pointer',
              isActive('/universities')
                ? 'text-primary border-b-2 border-primary pb-0.5'
                : 'text-secondary hover:text-primary',
            ]"
          >
            {{ t('nav.universities') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/reviews')"
            :class="[
              'transition-colors font-medium cursor-pointer',
              isActive('/reviews')
                ? 'text-primary border-b-2 border-primary pb-0.5'
                : 'text-secondary hover:text-primary',
            ]"
          >
            {{ t('nav.reviews') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/blog')"
            :class="[
              'transition-colors font-medium cursor-pointer',
              isActive('/blog')
                ? 'text-primary border-b-2 border-primary pb-0.5'
                : 'text-secondary hover:text-primary',
            ]"
          >
            {{ t('nav.blog') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/about')"
            :class="[
              'transition-colors font-medium cursor-pointer',
              isActive('/about')
                ? 'text-primary border-b-2 border-primary pb-0.5'
                : 'text-secondary hover:text-primary',
            ]"
          >
            {{ t('nav.about') }}
          </NuxtLink>
          <NuxtLink
            :to="localePath('/faq')"
            :class="[
              'transition-colors font-medium cursor-pointer',
              isActive('/faq')
                ? 'text-primary border-b-2 border-primary pb-0.5'
                : 'text-secondary hover:text-primary',
            ]"
          >
            {{ t('nav.faq') }}
          </NuxtLink>
        </nav>

        <!-- Right Section -->
        <div class="flex items-center space-x-3 md:space-x-4">
          <!-- Desktop Language Switcher -->
          <div
            class="relative hidden md:flex items-center bg-background rounded-lg h-9 min-w-[200px] overflow-hidden p-1"
          >
            <!-- Active slider -->
            <div
              class="absolute top-1 bottom-1 left-1 rounded-md bg-white shadow-sm transition-transform duration-300 ease-out will-change-transform pointer-events-none z-0"
              :style="sliderStyle"
              aria-hidden="true"
            />

            <!-- Options (grid for equal widths) -->
            <div class="grid grid-cols-4 gap-0 w-full relative">
              <button
                v-for="opt in options"
                :key="opt.code"
                type="button"
                class="relative z-10 text-sm font-medium px-0 select-none h-7 flex items-center justify-center rounded-md transition-colors duration-200 min-h-touch-44"
                :class="
                  opt.code === currentLocale
                    ? 'text-secondary'
                    : 'text-gray-500 hover:text-secondary'
                "
                :aria-current="opt.code === currentLocale ? 'true' : 'false'"
                @click="changeLocale(opt.code)"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <!-- Currency Selector (Desktop) -->
          <div ref="currencyDropdownRef" class="relative hidden md:block">
            <button
              type="button"
              class="flex items-center gap-2 px-3 py-2 rounded-lg bg-background hover:bg-gray-100 transition-colors text-sm font-medium text-secondary min-h-touch-44"
              @click="toggleCurrencyMenu"
              @keydown.esc="closeCurrencyMenu"
            >
              <span>{{ currencySymbol }}</span>
              <Icon
                :name="currencyMenuOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                class="text-base"
              />
            </button>

            <transition name="fade" mode="out-in">
              <div v-if="currencyMenuOpen" class="absolute right-0 top-full z-50 pt-2" @click.stop>
                <div class="w-40 rounded-xl border border-gray-100 bg-white shadow-xl py-2">
                  <button
                    v-for="curr in currencyOptions"
                    :key="curr.code"
                    type="button"
                    class="w-full text-left px-4 py-2 text-sm transition-colors"
                    :class="
                      curr.code === currencyRef
                        ? 'text-primary bg-primary/10'
                        : 'text-secondary hover:bg-gray-50'
                    "
                    @click="changeCurrency(curr.code)"
                  >
                    {{ curr.label }}
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <!-- Mobile Menu Button -->
          <button
            class="lg:hidden flex items-center justify-center w-12 h-12 rounded-xl hover:bg-gray-100 transition-colors min-h-touch-44 min-w-touch-44"
            aria-label="Toggle navigation menu"
            :aria-expanded="isMobileNavOpen"
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

    <!-- Mobile Navigation Drawer -->
    <MobileNavDrawer :is-open="isMobileNavOpen" @close="closeMobileNav" />
  </header>
</template>

<script setup lang="ts">
import type { SupportedLocale } from '~~/lib/locales'
import type { Currency } from '~/types/currency'

// Site header with navigation and language switcher
const route = useRoute()

const i18n = useI18n()
const { t } = i18n
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

// Currency management
const { currencyRef, setCurrency, getCurrencySymbol } = useCurrency()
const currencyMenuOpen = ref(false)

// Mobile navigation state
const isMobileNavOpen = ref(false)
const servicesMenuOpen = ref(false)
const servicesDropdownRef = ref<HTMLElement | null>(null)
const currencyDropdownRef = ref<HTMLElement | null>(null)
const closeTimer = ref<NodeJS.Timeout | null>(null)

const serviceLinks = computed(() => [
  {
    label: t('nav.servicesDropdown.relocation'),
    path: localePath('/services/relocation-in-turkey'),
  },
  {
    label: t('nav.servicesDropdown.trYosCourses'),
    path: localePath('/services/tr-yos-courses'),
  },
  {
    label: t('nav.servicesDropdown.satCourses'),
    path: localePath('/services/sat-courses'),
  },
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
  () => serviceLinks.value.some((link) => route.path === link.path) || route.hash === '#services',
)

type Opt = { code: SupportedLocale; label: string }
const options: Opt[] = [
  { code: 'ru', label: 'RU' },
  { code: 'kk', label: 'KZ' },
  { code: 'en', label: 'EN' },
  { code: 'tr', label: 'TR' },
]

const currentLocale = computed(() => i18n.locale.value)
const activeIndex = computed(() => options.findIndex((o) => o.code === currentLocale.value))

// Slider: 4 equal columns -> width = 25%, translateX(100% * index)
const sliderStyle = computed(() => ({
  width: 'calc((100% - 0.5rem) / 4)',
  transform: `translateX(${Math.max(0, activeIndex.value) * 100}%)`,
}))

function changeLocale(code: Opt['code']) {
  if (code !== currentLocale.value) {
    const path = switchLocalePath(code)
    if (path) navigateTo(path)
  }
}

// Currency selector
type CurrencyOpt = { code: Currency; label: string }
const currencyOptions = computed<CurrencyOpt[]>(() => [
  { code: 'KZT', label: t('currency.selector.KZT') as string },
  { code: 'TRY', label: t('currency.selector.TRY') as string },
  { code: 'RUB', label: t('currency.selector.RUB') as string },
  { code: 'USD', label: t('currency.selector.USD') as string },
])

const currencySymbol = computed(() => getCurrencySymbol())

function changeCurrency(code: Currency) {
  setCurrency(code)
  closeCurrencyMenu()
}

function toggleCurrencyMenu() {
  currencyMenuOpen.value = !currencyMenuOpen.value
}

function closeCurrencyMenu() {
  currencyMenuOpen.value = false
}

function openServicesMenu() {
  servicesMenuOpen.value = true
}

function closeServicesMenu() {
  servicesMenuOpen.value = false
}

function toggleServicesMenu() {
  servicesMenuOpen.value = !servicesMenuOpen.value
}

function cancelCloseAndOpen() {
  clearCloseTimer()
  openServicesMenu()
}

function scheduleClose() {
  clearCloseTimer()
  closeTimer.value = setTimeout(() => {
    closeServicesMenu()
    closeTimer.value = null
  }, 120)
}

function isServiceLinkActive(path: string) {
  return route.path === path
}

function onServicesFocusOut(event: FocusEvent) {
  const nextTarget = event.relatedTarget as Node | null
  if (servicesDropdownRef.value && nextTarget && servicesDropdownRef.value.contains(nextTarget)) {
    return
  }

  closeServicesMenu()
}

function clearCloseTimer() {
  if (closeTimer.value) {
    clearTimeout(closeTimer.value)
    closeTimer.value = null
  }
}

// Mobile navigation functions
function toggleMobileNav() {
  isMobileNavOpen.value = !isMobileNavOpen.value

  // Prevent body scroll when menu is open
  if (import.meta.client) {
    if (isMobileNavOpen.value) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }
}

function closeMobileNav() {
  isMobileNavOpen.value = false

  // Restore body scroll
  if (import.meta.client) {
    document.body.style.overflow = 'auto'
  }
}

// Active state for nav links (supports hash sections on home and full paths)
function isActive(to: string) {
  if (to.startsWith('#')) {
    // Only check hash on client side to prevent hydration mismatch
    return import.meta.client && route.path === localePath('/') && route.hash === to
  }
  return route.path === localePath(to)
}

// Navigate to home page with specific section hash from any route
// Close mobile nav on route change
watch(
  () => route.path,
  () => {
    closeMobileNav()
  },
)

watch(
  () => route.fullPath,
  () => {
    closeServicesMenu()
  },
)

function handleDocumentClick(event: MouseEvent) {
  const target = event.target as Node | null

  // Close services menu if clicking outside it
  if (servicesDropdownRef.value && !(target && servicesDropdownRef.value.contains(target))) {
    closeServicesMenu()
  }

  // Close currency menu if clicking outside it
  if (currencyDropdownRef.value && !(target && currencyDropdownRef.value.contains(target))) {
    closeCurrencyMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
  clearCloseTimer()
})
</script>
