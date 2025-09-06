<template>
  <div class="min-h-dvh flex flex-col bg-white text-secondary font-sans">
    <SiteHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
    
    <!-- Application Modal -->
    <ApplicationModal
      :is-open="modal.isOpen"
      :user-preferences="modal.userPreferences"
      @close="modal.closeModal"
      @submit="modal.submitApplication"
    />
    
    <!-- Global Toasts -->
    <UiFeedbackUiToast />
    
    <!-- Yandex.Metrika noscript -->
    <noscript v-if="config.public.yandexMetrikaId">
      <div>
        <img 
          :src="`https://mc.yandex.ru/watch/${config.public.yandexMetrikaId}`" 
          style="position:absolute; left:-9999px;" 
          alt=""
        />
      </div>
    </noscript>
  </div>
</template>

<script setup lang="ts">
import { useApplicationModalStore } from '~/stores/applicationModal'

// Default layout wrapper
const modal = useApplicationModalStore()

const { locale } = useI18n()
const config = useRuntimeConfig()
const route = useRoute()
useHead(() => ({
  htmlAttrs: { lang: locale.value },
  link: [
    { rel: 'canonical', href: config.public.siteUrl + route.path }
  ]
}))
</script>
