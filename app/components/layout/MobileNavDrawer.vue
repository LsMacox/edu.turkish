<template>
  <!-- Mobile Navigation Overlay -->
  <Teleport to="body">
    <div v-if="isVisible" class="fixed inset-0 z-[99999] lg:hidden">
      <!-- Backdrop -->
      <div
        :class="['fixed inset-0 bg-black/50 backdrop-blur-sm z-[99998]', backdropAnimationClass]"
        @click="closeDrawer"
      />

      <!-- Drawer -->
      <div
        :class="[
          'fixed inset-0 md:inset-y-0 md:right-0 md:left-auto w-full md:w-80 md:max-w-[85vw] bg-white shadow-2xl overflow-y-auto z-[99999]',
          drawerAnimationClass,
        ]"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchCancel"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-5 md:p-6 border-b border-gray-100">
          <div class="flex items-center space-x-2">
            <img
              :src="cdnUrl('c905b440-9cea-4b23-8576-f1787a84d356.png')"
              alt="Edu.turkish"
              width="60"
              height="60"
              loading="lazy"
              decoding="async"
              class="h-[60px] w-[60px]"
            />
            <span class="text-lg md:text-xl font-bold text-secondary">Edu.turkish</span>
          </div>
          <button
            class="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-colors flex-shrink-0"
            aria-label="Close navigation"
            @click="closeDrawer"
          >
            <Icon name="mdi:close" class="text-gray-500 text-2xl" />
          </button>
        </div>

        <!-- Navigation Links -->
        <nav class="px-5 md:px-6 py-6 md:py-8">
          <div class="space-y-2">
            <div class="rounded-xl overflow-hidden">
              <button
                type="button"
                :class="[
                  'flex w-full items-center px-4 py-4 transition-colors min-h-touch-48 text-base font-medium border-l-4',
                  servicesMenuOpen || isServiceRouteActive
                    ? 'bg-primary/10 text-primary border-primary'
                    : 'text-secondary hover:bg-gray-50 border-transparent',
                ]"
                :aria-expanded="servicesMenuOpen"
                aria-controls="mobile-services-menu"
                @click="toggleServicesOpen"
              >
                <div class="flex items-center flex-1 text-left">
                  <Icon name="mdi:cog" class="mr-3 text-lg" />
                  <span>{{ t('nav.services') }}</span>
                </div>
                <Icon
                  name="mdi:chevron-down"
                  class="ml-2 text-lg transition-transform"
                  :class="{ 'rotate-180': servicesMenuOpen }"
                />
              </button>
              <transition name="accordion">
                <div v-if="servicesMenuOpen" id="mobile-services-menu" class="bg-gray-50">
                  <NuxtLink
                    v-for="link in serviceLinks"
                    :key="link.path"
                    :to="link.path"
                    class="flex items-center px-12 py-3 text-sm text-secondary border-l-4 border-transparent transition-colors"
                    :class="
                      isServiceLinkActive(link.path)
                        ? 'border-primary text-primary bg-primary/5'
                        : 'hover:bg-white'
                    "
                    @click="closeDrawer"
                  >
                    <span class="flex-1 text-left">{{ link.label }}</span>
                    <Icon name="mdi:chevron-right" class="text-lg text-gray-400" />
                  </NuxtLink>
                </div>
              </transition>
            </div>

            <NuxtLink
              :to="localePath('/universities')"
              :class="[
                'flex items-center px-4 py-4 rounded-xl transition-colors min-h-touch-48 text-base font-medium',
                isActive('/universities')
                  ? 'bg-primary/10 text-primary border-l-4 border-primary'
                  : 'text-secondary hover:bg-gray-50',
              ]"
              @click="closeDrawer"
            >
              <Icon name="mdi:school" class="mr-3 text-lg" />
              {{ t('nav.universities') }}
            </NuxtLink>

            <NuxtLink
              :to="localePath('/reviews')"
              :class="[
                'flex items-center px-4 py-4 rounded-xl transition-colors min-h-touch-48 text-base font-medium',
                isActive('/reviews')
                  ? 'bg-primary/10 text-primary border-l-4 border-primary'
                  : 'text-secondary hover:bg-gray-50',
              ]"
              @click="closeDrawer"
            >
              <Icon name="mdi:star" class="mr-3 text-lg" />
              {{ t('nav.reviews') }}
            </NuxtLink>

            <NuxtLink
              :to="localePath('/blog')"
              :class="[
                'flex items-center px-4 py-4 rounded-xl transition-colors min-h-touch-48 text-base font-medium',
                isActive('/blog')
                  ? 'bg-primary/10 text-primary border-l-4 border-primary'
                  : 'text-secondary hover:bg-gray-50',
              ]"
              @click="closeDrawer"
            >
              <Icon name="mdi:notebook-edit-outline" class="mr-3 text-lg" />
              {{ t('nav.blog') }}
            </NuxtLink>

            <NuxtLink
              :to="localePath('/about')"
              :class="[
                'flex items-center px-4 py-4 rounded-xl transition-colors min-h-touch-48 text-base font-medium',
                isActive('/about')
                  ? 'bg-primary/10 text-primary border-l-4 border-primary'
                  : 'text-secondary hover:bg-gray-50',
              ]"
              @click="closeDrawer"
            >
              <Icon name="mdi:information" class="mr-3 text-lg" />
              {{ t('nav.about') }}
            </NuxtLink>

            <NuxtLink
              :to="localePath('/faq')"
              :class="[
                'flex items-center px-4 py-4 rounded-xl transition-colors min-h-touch-48 text-base font-medium',
                isActive('/faq')
                  ? 'bg-primary/10 text-primary border-l-4 border-primary'
                  : 'text-secondary hover:bg-gray-50',
              ]"
              @click="closeDrawer"
            >
              <Icon name="mdi:help-circle" class="mr-3 text-lg" />
              {{ t('nav.faq') }}
            </NuxtLink>
          </div>
        </nav>

        <!-- Language Switcher -->
        <div class="px-5 md:px-6 pb-4">
          <div class="border-t border-gray-100 pt-6">
            <h3 class="text-sm font-semibold text-gray-700 mb-4">{{ t('nav.language') }}</h3>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="opt in options"
                :key="opt.code"
                type="button"
                class="flex items-center justify-center px-4 py-3 rounded-xl transition-colors min-h-touch-44 text-sm font-medium"
                :class="
                  opt.code === currentLocale
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                "
                @click="changeLocale(opt.code)"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Social Links -->
        <div class="px-5 md:px-6 pb-5 md:pb-6">
          <div class="border-t border-gray-100 pt-6">
            <h3 class="text-sm font-semibold text-gray-700 mb-4">{{ t('nav.social') }}</h3>
            <div class="flex gap-3">
              <a
                :href="channels?.whatsapp?.href"
                target="_blank"
                class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white hover:bg-green-600 transition-colors min-h-touch-44 min-w-touch-44"
                aria-label="WhatsApp"
              >
                <Icon name="mdi:whatsapp" class="text-lg" />
              </a>
              <a
                :href="channels?.telegramBot?.href"
                target="_blank"
                class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white hover:bg-blue-600 transition-colors min-h-touch-44 min-w-touch-44"
                aria-label="Telegram"
              >
                <Icon name="mdi:telegram" class="text-lg" />
              </a>
              <a
                :href="instagramChannel.href"
                target="_blank"
                class="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center text-white hover:bg-pink-600 transition-colors min-h-touch-44 min-w-touch-44"
                aria-label="Instagram"
              >
                <Icon name="mdi:instagram" class="text-lg" />
              </a>
            </div>
          </div>
        </div>

        <!-- CTA Button -->
        <div class="px-5 md:px-6 pb-8 md:pb-6">
          <button
            class="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-red-600 active:bg-red-700 transition-colors min-h-[52px] shadow-lg active:shadow-md"
            @click="handleCTAClick"
          >
            {{ t('cta.apply') }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { SupportedLocale } from '~~/lib/locales'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const modal = useApplicationModalStore()
const route = useRoute()
const { t } = useI18n()
const { channels, getChannel } = useContactChannels()
const instagramChannel = getChannel('instagram')
const { cdnUrl } = useCdn()

const i18n = useI18n<{ messages: Record<string, any> }, SupportedLocale>()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

type Opt = { code: SupportedLocale; label: string }
const options: Opt[] = [
  { code: 'ru', label: 'Русский' },
  { code: 'kk', label: 'Қазақ' },
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
]

const currentLocale = computed(() => i18n.locale.value)
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

const servicesMenuOpen = ref(false)
const SERVICES_MENU_STORAGE_KEY = 'mobileServicesMenuOpen'
const isServiceRouteActive = computed(
  () => serviceLinks.value.some((link) => link.path === route.path) || route.hash === '#services',
)

const closeAnimationDuration = 300
const touchStartX = ref<number | null>(null)
const touchDeltaX = ref(0)
const SWIPE_THRESHOLD = 80
const isVisible = ref(props.isOpen)
const isClosing = ref(false)

const drawerAnimationClass = computed(() =>
  isClosing.value ? 'animate-slide-out-left' : 'animate-slide-in-right',
)
const backdropAnimationClass = computed(() =>
  isClosing.value ? 'animate-fade-out' : 'animate-fade-in',
)

let closeTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.isOpen,
  (value) => {
    if (value) {
      if (closeTimer) {
        clearTimeout(closeTimer)
        closeTimer = null
      }
      isVisible.value = true
      requestAnimationFrame(() => {
        isClosing.value = false
      })
    } else if (isVisible.value) {
      isClosing.value = true
      closeTimer = setTimeout(() => {
        isVisible.value = false
        isClosing.value = false
        closeTimer = null
      }, closeAnimationDuration)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  if (closeTimer) {
    clearTimeout(closeTimer)
  }
})

function changeLocale(code: Opt['code']) {
  if (code !== currentLocale.value) {
    const path = switchLocalePath(code)
    if (path) navigateTo(path)
    closeDrawer()
  }
}

function isServiceLinkActive(path: string) {
  return route.path === path
}

function toggleServicesOpen() {
  servicesMenuOpen.value = !servicesMenuOpen.value
  if (import.meta.client) {
    localStorage.setItem(SERVICES_MENU_STORAGE_KEY, String(servicesMenuOpen.value))
  }
}

function closeDrawer() {
  emit('close')
}

function handleCTAClick() {
  modal.openModal()
  closeDrawer()
}

// Active state for nav links (supports hash sections on home and full paths)
function isActive(to: string) {
  if (to.startsWith('#')) {
    return route.path === localePath('/') && route.hash === to
  }
  return route.path === localePath(to)
}

// Navigate to home page with specific section hash from any route
function onTouchStart(event: TouchEvent) {
  if (!props.isOpen) return

  const touch = event.touches[0]
  if (touch) {
    touchStartX.value = touch.clientX
    touchDeltaX.value = 0
  }
}

function onTouchMove(event: TouchEvent) {
  if (touchStartX.value === null) return

  const touch = event.touches[0]
  if (touch) {
    touchDeltaX.value = touchStartX.value - touch.clientX
  }
}

function onTouchEnd() {
  if (touchStartX.value !== null && touchDeltaX.value >= SWIPE_THRESHOLD) {
    closeDrawer()
  }
  resetTouch()
}

function onTouchCancel() {
  resetTouch()
}

function resetTouch() {
  touchStartX.value = null
  touchDeltaX.value = 0
}

// Close drawer on escape key
onMounted(() => {
  // Initialize from saved state; if none, open by default on services routes
  if (import.meta.client) {
    const saved = localStorage.getItem(SERVICES_MENU_STORAGE_KEY)
    if (saved === 'true' || saved === 'false') {
      servicesMenuOpen.value = saved === 'true'
    } else if (isServiceRouteActive.value) {
      servicesMenuOpen.value = true
    }
  }

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
      closeDrawer()
    }
  }

  document.addEventListener('keydown', handleEscape)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})

// Block body scroll when drawer is open
watch(
  () => props.isOpen,
  (isOpen) => {
    if (import.meta.client) {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  },
  { immediate: true },
)
</script>
