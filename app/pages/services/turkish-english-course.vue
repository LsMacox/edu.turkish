<template>
  <div class="min-h-screen bg-gray-50 section-py-lg">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          {{ t(svc('title')) }}
        </h1>
        <div class="bg-white rounded-lg shadow-card p-8 mt-8">
          <p class="text-xl text-gray-600">
            {{ t(svc('temporarilyUnavailable')) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'
import { useServiceHead } from '~/composables/useServiceHead'

const svc = namespace('services.turkish-english-course')
const metaNs = namespace('services.turkish-english-course.meta')
const { t } = useI18n()

useServiceHead({
  title: () => t(metaNs('title')),
  description: () => t(metaNs('description')),
  schemaType: ['Course'],
})
</script>
