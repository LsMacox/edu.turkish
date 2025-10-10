<template>
  <div class="min-h-dvh flex flex-col bg-white text-secondary font-sans">
    <SiteHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />

    <ApplicationModal
      :is-open="modal.isOpen"
      :user-preferences="modal.userPreferences"
      @close="modal.closeModal"
      @submit="modal.submitApplication"
    />

    <!-- Global Toasts -->
    <UiFeedbackToast />

    <!-- Page loading overlay -->
    <UiFeedbackPageLoadingOverlay />
  </div>
</template>

<script setup lang="ts">
// Default layout wrapper
const modal = useApplicationModalStore()

const { locale } = useI18n()
const config = useRuntimeConfig()
const route = useRoute()
const localeHead = useLocaleHead({ dir: true, seo: true })

useHead(() => {
  const metrikaId = config.public.yandexMetrikaId
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

  if (metrikaId) {
    head.noscript = [
      {
        key: 'yandex-metrika-noscript',
        innerHTML: `<div><img src="https://mc.yandex.ru/watch/${metrikaId}" style="position:absolute; left:-9999px;" alt="" /></div>`,
      },
    ]
    head.__dangerouslyDisableSanitizersByTagID = {
      'yandex-metrika-noscript': ['innerHTML'],
    }
  }

  return head
})
</script>
