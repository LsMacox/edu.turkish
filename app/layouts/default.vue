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
  </div>
</template>

<script setup lang="ts">

// Default layout wrapper
const modal = useApplicationModalStore()

const { locale } = useI18n()
const config = useRuntimeConfig()
const route = useRoute()
useHead(() => {
  const metrikaId = config.public.yandexMetrikaId

  return {
    htmlAttrs: { lang: locale.value },
    link: [{ rel: 'canonical', href: config.public.siteUrl + route.path }],
    ...(metrikaId
      ? {
          noscript: [
            {
              key: 'yandex-metrika-noscript',
              innerHTML: `<div><img src="https://mc.yandex.ru/watch/${metrikaId}" style="position:absolute; left:-9999px;" alt="" /></div>`,
            },
          ],
          __dangerouslyDisableSanitizersByTagID: {
            'yandex-metrika-noscript': ['innerHTML'],
          },
        }
      : {}),
  }
})
</script>
