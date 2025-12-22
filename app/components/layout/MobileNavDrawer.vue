<template>
  <!-- Mobile Navigation Overlay -->
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isOpen" class="fixed inset-0 z-[99999] lg:hidden">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/30 z-[99998]"
          @click="closeDrawer"
        />

        <!-- Drawer Panel -->
        <div
          class="fixed inset-y-0 right-0 w-[80vw] max-w-[300px] bg-white z-[99999] flex flex-col"
          @touchstart.passive="onTouchStart"
          @touchmove.passive="onTouchMove"
          @touchend="resetTouch"
          @touchcancel="resetTouch"
        >
          <!-- Header -->
          <div class="flex items-center justify-between px-4 h-14 border-b border-default">
            <NuxtLink
              :to="localePath('/')"
              class="flex items-center gap-component-sm"
              @click="closeDrawer"
            >
              <NuxtImg
                :src="ASSETS.logo"
                alt="Edu.turkish"
                width="36"
                height="36"
                loading="lazy"
                decoding="async"
                class="h-9 w-9"
                sizes="36px"
                format="webp"
              />
              <span class="text-base font-semibold text-secondary">Edu.turkish</span>
            </NuxtLink>
            <BaseButton
              variant="icon-close-md"
              icon="mdi:close"
              aria-label="Close navigation"
              no-focus-ring
              class="w-9 h-9"
              @click="closeDrawer"
            />
          </div>

          <!-- Navigation -->
          <nav class="flex-1 overflow-y-auto px-3 py-3">
            <!-- Services -->
            <button
              type="button"
              class="w-full flex items-center justify-between px-3 py-3 rounded-button transition-color font-semibold"
              :class="[
                servicesMenuOpen || isServiceRouteActive
                  ? 'bg-primary/5 text-primary'
                  : 'text-secondary hover:bg-surface',
              ]"
              :aria-expanded="servicesMenuOpen"
              @click="toggleServicesOpen"
            >
              <div class="flex items-center gap-component-md">
                <Icon name="mdi:briefcase-outline" class="text-icon-sm opacity-70" />
                <span class="font-medium">{{ t(navNs('services')) }}</span>
              </div>
              <Icon
                name="mdi:chevron-down"
                class="text-icon-sm transition-scale-fast"
                :class="{ 'rotate-180': servicesMenuOpen }"
              />
            </button>

            <Transition name="accordion">
              <div v-if="servicesMenuOpen" class="ml-8 mt-1 space-y-0.5">
                <NuxtLink
                  v-for="link in serviceLinks"
                  :key="link.path"
                  :to="link.path"
                  class="block px-3 py-2.5 rounded-lg text-sm transition-color"
                  :class="[
                    isServiceLinkActive(link.path)
                      ? 'text-primary font-medium bg-primary/5'
                      : 'text-meta hover:text-secondary hover:bg-surface',
                  ]"
                  @click="closeDrawer"
                >
                  {{ link.label }}
                </NuxtLink>
              </div>
            </Transition>

            <!-- Divider -->
            <div class="my-2 mx-3 h-px bg-surface-elevated" />

            <!-- Main Links -->
            <div class="space-y-0.5">
              <NuxtLink
                v-for="link in navLinks"
                :key="link.path"
                :to="localePath(link.path)"
                class="flex items-center gap-component-md px-3 py-3 rounded-button transition-color"
                :class="[
                  isActive(link.path)
                    ? 'bg-primary/5 text-primary'
                    : 'text-secondary hover:bg-surface',
                ]"
                @click="closeDrawer"
              >
                <Icon :name="link.icon" class="text-icon-sm opacity-70" />
                <span class="font-medium">{{ link.label }}</span>
              </NuxtLink>
            </div>
          </nav>

          <!-- Language Switcher -->
          <div class="px-4 py-4 border-t border-default">
            <div class="flex gap-component-sm">
              <BaseButton
                v-for="opt in options"
                :key="opt.code"
                :variant="opt.code === currentLocale ? 'primary' : 'chip-pill'"
                size="sm"
                rounded="lg"
                class="flex-1"
                @click="changeLocale(opt.code)"
              >
                {{ opt.shortLabel }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { SupportedLocale } from '~~/lib/config/locales'
import { ASSETS } from '~~/lib/config/assets'
import { namespace } from '~~/lib/i18n'

const navNs = namespace('nav')

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()

const route = useRoute()
const { t } = useI18n()
const i18n = useI18n<{ messages: Record<string, any> }, SupportedLocale>()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

// Language options
const options: { code: SupportedLocale; shortLabel: string }[] = [
  { code: 'ru', shortLabel: 'RU' },
  { code: 'kk', shortLabel: 'ҚЗ' },
  { code: 'en', shortLabel: 'EN' },
  { code: 'tr', shortLabel: 'TR' },
]

const currentLocale = computed(() => i18n.locale.value)

// Navigation links with icons
const navLinks = computed(() => [
  { path: '/universities', label: t(navNs('universities')), icon: 'mdi:school' },
  { path: '/programs', label: t(navNs('programs')), icon: 'mdi:book-education' },
  { path: '/reviews', label: t(navNs('reviews')), icon: 'mdi:star' },
  { path: '/blog', label: t(navNs('blog')), icon: 'mdi:newspaper-variant' },
  { path: '/about', label: t(navNs('about')), icon: 'mdi:information' },
  { path: '/faq', label: t(navNs('faq')), icon: 'mdi:help-circle' },
])

const serviceLinks = computed(() => [
  {
    label: t(navNs('servicesDropdown.relocation')),
    path: localePath('/services/relocation-in-turkey'),
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
/* Drawer animation - slides from right, closes to right */
.drawer-enter-active {
  transition: opacity 0.25s ease-out;
}
.drawer-enter-active > div:last-child {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.drawer-leave-active {
  transition: opacity 0.2s ease-in;
}
.drawer-leave-active > div:last-child {
  transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from > div:last-child,
.drawer-leave-to > div:last-child {
  transform: translateX(100%);
}

/* Accordion animation for services submenu */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.2s ease-out;
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 300px;
}
</style>
