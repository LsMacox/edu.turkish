<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          {{ t(svc('title')) }}
        </h1>
        <div class="bg-white rounded-lg shadow-md p-8 mt-8">
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

const svc = namespace('services.sat-courses')
const { t } = useI18n()

useHead({
  title: t(svc('title')),
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: t(svc('title')),
        description: t(svc('subtitle')),
        provider: {
          '@type': 'Organization',
          name: 'Edu.turkish',
          sameAs: 'https://edu-turkish.com',
        },
      }),
    },
  ],
})
</script>
