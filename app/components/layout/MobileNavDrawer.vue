<template>
  <!-- Mobile Navigation Overlay -->
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[99999] lg:hidden">
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99998] animate-fade-in"
        @click="closeDrawer"
      />

      <!-- Drawer -->
      <div
        class="fixed inset-0 md:inset-y-0 md:right-0 md:left-auto w-full md:w-80 md:max-w-[85vw] bg-white shadow-2xl overflow-y-auto z-[99999] animate-slide-in-right"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-5 md:p-6 border-b border-gray-100">
          <div class="flex items-center space-x-2">
            <NuxtImg
              src="/images/logo.png"
              alt="Edu.turkish"
              width="120"
              height="120"
              sizes="60px"
              loading="lazy"
              decoding="async"
              format="webp"
              :quality="78"
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
            <NuxtLink
              to="#services"
              :class="[
                'flex items-center px-4 py-4 rounded-xl transition-colors min-h-touch-48 text-base font-medium',
                isActive('#services')
                  ? 'bg-primary/10 text-primary border-l-4 border-primary'
                  : 'text-secondary hover:bg-gray-50',
              ]"
              @click="goToSection('#services')"
            >
              <Icon name="mdi:cog" class="mr-3 text-lg" />
              {{ t('nav.services') }}
            </NuxtLink>

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

function changeLocale(code: Opt['code']) {
  if (code !== currentLocale.value) {
    const path = switchLocalePath(code)
    if (path) navigateTo(path)
    closeDrawer()
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
function goToSection(hash: string) {
  navigateTo({ path: localePath('/'), hash })
  closeDrawer()
}

// Close drawer on escape key
onMounted(() => {
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
