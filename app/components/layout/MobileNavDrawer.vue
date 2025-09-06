<template>
  <!-- Mobile Navigation Overlay -->
  <Teleport to="body">
    <div 
      v-if="isOpen"
      class="fixed inset-0 z-[99999] lg:hidden"
    >
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99998] animate-fade-in"
        @click="closeDrawer"
      />
      
      <!-- Drawer -->
      <div 
        class="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto z-[99999] animate-slide-in-right"
      >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-100">
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
          <span class="text-xl font-bold text-secondary">Edu.turkish</span>
        </div>
        <button 
          @click="closeDrawer"
          class="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors min-h-touch-44 min-w-touch-44"
          aria-label="Close navigation"
        >
          <Icon name="mdi:close" class="text-gray-500 text-xl" />
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="px-6 py-8">
        <div class="space-y-2">
          <NuxtLink
            to="#services"
            @click="goToSection('#services')"
            :class="[
              'flex items-center px-4 py-4 rounded-xl transition-colors min-h-touch-48 text-base font-medium',
              isActive('#services') ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-secondary hover:bg-gray-50'
            ]"
          >
            <Icon name="mdi:cog" class="mr-3 text-lg" />
            {{ t('nav.services') }}
          </NuxtLink>
          
          <NuxtLink
            :to="localePath('/universities')"
            :class="[
              'flex items-center px-4 py-4 rounded-xl transition-colors min-h-touch-48 text-base font-medium',
              isActive('/universities') ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-secondary hover:bg-gray-50'
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
              isActive('/reviews') ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-secondary hover:bg-gray-50'
            ]"
            @click="closeDrawer"
          >
            <Icon name="mdi:star" class="mr-3 text-lg" />
            {{ t('nav.reviews') }}
          </NuxtLink>
          
          <NuxtLink
            :to="localePath('/about')"
            :class="[
              'flex items-center px-4 py-4 rounded-xl transition-colors min-h-touch-48 text-base font-medium',
              isActive('/about') ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-secondary hover:bg-gray-50'
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
              isActive('/faq') ? 'bg-primary/10 text-primary border-l-4 border-primary' : 'text-secondary hover:bg-gray-50'
            ]"
            @click="closeDrawer"
          >
            <Icon name="mdi:help-circle" class="mr-3 text-lg" />
            {{ t('nav.faq') }}
          </NuxtLink>
        </div>
      </nav>

      <!-- Language Switcher -->
      <div class="px-6 pb-4">
        <div class="border-t border-gray-100 pt-6">
          <h3 class="text-sm font-semibold text-gray-700 mb-4">{{ t('nav.language') }}</h3>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="opt in options"
              :key="opt.code"
              type="button"
              class="flex items-center justify-center px-4 py-3 rounded-xl transition-colors min-h-touch-44 text-sm font-medium"
              :class="opt.code === currentLocale ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
              @click="changeLocale(opt.code)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Social Links -->
      <div class="px-6 pb-6">
        <div class="border-t border-gray-100 pt-6">
          <h3 class="text-sm font-semibold text-gray-700 mb-4">{{ t('nav.social') }}</h3>
          <div class="flex gap-3">
            <a 
              href="https://wa.me/905438679950" 
              target="_blank"
              class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white hover:bg-green-600 transition-colors min-h-touch-44 min-w-touch-44" 
              aria-label="WhatsApp"
            >
              <Icon name="mdi:whatsapp" class="text-lg" />
            </a>
            <a 
              href="https://t.me/eduturkish" 
              target="_blank"
              class="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white hover:bg-blue-600 transition-colors min-h-touch-44 min-w-touch-44" 
              aria-label="Telegram"
            >
              <Icon name="mdi:telegram" class="text-lg" />
            </a>
            <a 
              href="https://www.instagram.com/edu.turkish" 
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
      <div class="px-6 pb-safe-bottom">
        <button 
          @click="handleCTAClick" 
          class="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-red-600 transition-colors min-h-touch-48 shadow-lg"
        >
          {{ t('cta.apply') }}
        </button>
      </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

import { useApplicationModalStore } from '~/stores/applicationModal'

const modal = useApplicationModalStore()
const route = useRoute()
const { t } = useI18n()

const i18n = useI18n<{ messages: Record<string, any> }, 'ru' | 'kz' | 'en' | 'tr'>()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()

type Opt = { code: 'ru' | 'kz' | 'en' | 'tr'; label: string }
const options: Opt[] = [
  { code: 'ru', label: 'Русский' },
  { code: 'kz', label: 'Қазақ' },
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' }
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
  console.log('MobileNavDrawer: Closing drawer')
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
</script>