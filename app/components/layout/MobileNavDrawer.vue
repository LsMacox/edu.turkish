<template>
  <!-- Mobile Navigation Overlay -->
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isOpen" class="fixed inset-0 z-[99999] lg:hidden">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99998]" @click="closeDrawer" />

        <!-- Drawer -->
        <div
          class="fixed inset-0 md:inset-y-0 md:right-0 md:left-auto w-full md:w-80 md:max-w-[85vw] bg-white shadow-2xl overflow-y-auto z-[99999]"
          @touchstart.passive="onTouchStart"
          @touchmove.passive="onTouchMove"
          @touchend="resetTouch"
          @touchcancel="resetTouch"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-5 md:p-6 border-b border-gray-100">
            <NuxtLink
              :to="localePath('/')"
              class="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              @click="closeDrawer"
            >
              <NuxtImg
                :src="ASSETS.logo"
                alt="Edu.turkish"
                width="60"
                height="60"
                loading="lazy"
                decoding="async"
                class="h-[60px] w-[60px]"
                sizes="60px"
                format="webp"
              />
              <span class="text-lg md:text-xl font-bold text-secondary">Edu.turkish</span>
            </NuxtLink>
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
                v-for="link in navLinks"
                :key="link.path"
                :to="localePath(link.path)"
                :class="[
                  'flex items-center px-4 py-4 rounded-xl transition-colors min-h-touch-48 text-base font-medium',
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-secondary hover:bg-gray-50',
                ]"
                @click="closeDrawer"
              >
                <Icon :name="link.icon" class="mr-3 text-lg" />
                {{ t(link.labelKey) }}
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
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { SupportedLocale } from '~~/lib/locales'
import { ASSETS } from '~~/lib/assets'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()

const route = useRoute()
const { t } = useI18n()
const i18n = useI18n<{ messages: Record<string, any> }, SupportedLocale>()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

// Language options
const options: { code: SupportedLocale; label: string }[] = [
  { code: 'ru', label: 'Русский' },
  { code: 'kk', label: 'Қазақ' },
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
]

const currentLocale = computed(() => i18n.locale.value)

// Navigation links
const navLinks = [
  { path: '/universities', icon: 'mdi:school', labelKey: 'nav.universities' },
  { path: '/programs', icon: 'mdi:book-education', labelKey: 'nav.programs' },
  { path: '/reviews', icon: 'mdi:star', labelKey: 'nav.reviews' },
  { path: '/blog', icon: 'mdi:notebook-edit-outline', labelKey: 'nav.blog' },
  { path: '/about', icon: 'mdi:information', labelKey: 'nav.about' },
  { path: '/faq', icon: 'mdi:help-circle', labelKey: 'nav.faq' },
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

const servicesMenuOpen = ref(false)
const isServiceRouteActive = computed(
  () => serviceLinks.value.some((link) => link.path === route.path) || route.hash === '#services',
)

const closeDrawer = () => emit('close')

// Swipe handling
const { onTouchStart, onTouchMove, resetTouch } = useSwipeClose(closeDrawer)

function changeLocale(code: SupportedLocale) {
  if (code !== currentLocale.value) {
    const path = switchLocalePath(code)
    if (path) navigateTo(path)
    closeDrawer()
  }
}

const isServiceLinkActive = (path: string) => route.path === path
const toggleServicesOpen = () => {
  servicesMenuOpen.value = !servicesMenuOpen.value
}
const isActive = (to: string) => route.path === localePath(to)

// Escape key & body scroll lock
onMounted(() => {
  if (isServiceRouteActive.value) servicesMenuOpen.value = true

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) closeDrawer()
  }
  document.addEventListener('keydown', handleEscape)
  onUnmounted(() => document.removeEventListener('keydown', handleEscape))
})

watch(
  () => props.isOpen,
  (open) => {
    if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
  },
  { immediate: true },
)
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-enter-active > div:last-child,
.drawer-leave-active > div:last-child {
  transition: transform 0.3s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from > div:last-child {
  transform: translateX(100%);
}
.drawer-leave-to > div:last-child {
  transform: translateX(-100%);
}
</style>
