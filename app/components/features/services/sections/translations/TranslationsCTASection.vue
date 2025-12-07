<template>
  <section class="py-12 sm:py-16 bg-primary">
    <div class="container mx-auto px-4 sm:px-6">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
          {{ title }}
        </h2>
        <button
          type="button"
          class="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
          @click="handleClick"
        >
          <Icon v-if="icon" :name="icon" class="w-5 h-5 mr-2" />
          {{ buttonText }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  buttonText: string
  icon?: string
  serviceName?: string
}>()

const { t } = useI18n()
const modal = useApplicationModal()

const handleClick = () => {
  modal.openModal({
    source: 'service_page',
    description: props.buttonText,
    serviceContext: {
      subServiceName: props.serviceName || t('services.document-translations.title'),
      source: 'service_page',
      sourceDescription: props.buttonText,
    },
  })
}
</script>
