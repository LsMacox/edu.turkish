<template>
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100">
    <div class="container mx-auto container-padding-narrow">
      <div class="flex items-center justify-between h-16 md:h-18">
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink :to="localePath('/')" class="flex items-center space-x-2 cursor-pointer">
            <NuxtImg
              src="/images/logo.png"
              alt="Edu.turkish"
              width="120"
              height="120"
              sizes="60px"
              :preload="true"
              fetchpriority="high"
              decoding="async"
              format="webp"
              :quality="78"
              class="h-[60px] w-[60px]"
            />
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-8">
          <NuxtLink
            to="#services"
            :class="[
              'transition-colors font-medium cursor-pointer',
              isActive('#services')
                ? 'text-primary border-b-2 border-primary pb-0.5'
                : 'text-secondary hover:text-primary',
            ]"
            @click.prevent="goToSection('#services')"
          >
            {{ t('nav.services') }}
          </NuxtLink>
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

          <!-- CTA Button -->
          <button
            class="bg-primary text-white px-3 md:px-6 py-2 md:py-2 rounded-lg md:rounded-xl hover:bg-red-600 transition-colors shadow-lg text-btn"
            @click="modal.openModal()"
          >
            {{ t('cta.apply') }}
          </button>

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
import { useApplicationModalStore } from '~/stores/applicationModal'

// Site header with navigation and language switcher
const modal = useApplicationModalStore()
const route = useRoute()

const i18n = useI18n<{ messages: Record<string, any> }, SupportedLocale>()
const { t } = i18n
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

// Mobile navigation state
const isMobileNavOpen = ref(false)

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

// Mobile navigation functions
function toggleMobileNav() {
  isMobileNavOpen.value = !isMobileNavOpen.value

  // Prevent body scroll when menu is open
  if (process.client) {
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
  if (process.client) {
    document.body.style.overflow = 'auto'
  }
}

// Active state for nav links (supports hash sections on home and full paths)
function isActive(to: string) {
  if (to.startsWith('#')) {
    // Only check hash on client side to prevent hydration mismatch
    return process.client && route.path === localePath('/') && route.hash === to
  }
  return route.path === localePath(to)
}

// Navigate to home page with specific section hash from any route
function goToSection(hash: string) {
  navigateTo({ path: localePath('/'), hash })
  closeMobileNav()
}

// Close mobile nav on route change
watch(
  () => route.path,
  () => {
    closeMobileNav()
  },
)
</script>
