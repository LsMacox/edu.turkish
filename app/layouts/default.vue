<template>
  <div class="min-h-dvh flex flex-col bg-white text-secondary font-sans">
    <noscript v-if="gtmId">
      <iframe
        :src="`https://www.googletagmanager.com/ns.html?id=${gtmId}`"
        height="0"
        width="0"
        style="display: none; visibility: hidden"
      ></iframe>
    </noscript>
    <SiteHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />

    <LazyApplicationModal
      v-if="modal.isOpen.value"
      :is-open="modal.isOpen.value"
      :user-preferences="modal.userPreferences.value"
      @close="modal.closeModal"
      @submit="modal.submitApplication"
    />

    <LazyExitIntentWhoModal
      v-if="showExitIntentModal"
      :is-open="showExitIntentModal"
      @close="showExitIntentModal = false"
    />

    <!-- Global Toasts -->
    <FeedbackToast />

    <!-- Floating Action Button -->
    <FloatingWhatsApp />

    <!-- Page loading overlay -->
    <FeedbackPageLoadingOverlay />
  </div>
</template>

<script setup lang="ts">
import { key } from '~~/lib/i18n'

// Default layout wrapper
const modal = useApplicationModal()

const { locale, t } = useI18n()
const config = useRuntimeConfig()
const gtmId = config.public.googleTagManagerId

// Set default site description from i18n (can be overridden by individual pages)
useSeoMeta({
  description: () => t(key('site.description')),
  ogDescription: () => t(key('site.description')),
  twitterDescription: () => t(key('site.description')),
})
const route = useRoute()
const localeHead = useLocaleHead({ dir: true, seo: true })

const showExitIntentModal = ref(false)

const EXIT_INTENT_STORAGE_KEY = 'exit_intent_who_shown'

const handleExitIntent = (event: MouseEvent) => {
  if (event.clientY > 0) return

  if (typeof window === 'undefined') return

  try {
    if (window.localStorage.getItem(EXIT_INTENT_STORAGE_KEY) === '1') return
  } catch {
    // ignore storage errors
  }

  try {
    window.localStorage.setItem(EXIT_INTENT_STORAGE_KEY, '1')
  } catch {
    // ignore storage errors
  }

  showExitIntentModal.value = true
}

onMounted(() => {
  if (!import.meta.client) return

  document.addEventListener('mouseleave', handleExitIntent)
})

onBeforeUnmount(() => {
  if (!import.meta.client) return

  document.removeEventListener('mouseleave', handleExitIntent)
})

useHead(() => {
  const headFromLocale = localeHead.value
  const canonicalHref = config.public.siteUrl + route.path

  const existingLinks = headFromLocale.link ?? []
  const links = [
    ...existingLinks.filter((link) => link.rel !== 'canonical'),
    { rel: 'canonical', href: canonicalHref },
  ]

  const head = {
    ...headFromLocale,
    htmlAttrs: {
      ...headFromLocale.htmlAttrs,
      lang: locale.value,
    },
    link: links,
  } as Record<string, unknown>

  return head
})
</script>
