<template>
  <div class="mt-16">
    <div class="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8 md:p-12 text-center">
      <h2 class="text-2xl md:text-3xl font-bold mb-4">{{ title }}</h2>
      <p class="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
        {{ description }}
      </p>
      <a
        :href="buttonUrl"
        class="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl"
      >
        {{ buttonText }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
interface DiagnosticTestSectionProps {
  keyPrefix: string
  title?: string
}

const props = withDefaults(defineProps<DiagnosticTestSectionProps>(), {
  title: '',
})

const { t } = useI18n()

const title = computed(() => props.title || t(`${props.keyPrefix}.title`))

const description = computed(() => t(`${props.keyPrefix}.description`))

const buttonText = computed(() => t(`${props.keyPrefix}.buttonText`))

const buttonUrl = computed(() => t(`${props.keyPrefix}.buttonUrl`))
</script>
