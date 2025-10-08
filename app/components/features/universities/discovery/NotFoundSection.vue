<template>
  <section id="not-found" class="py-16 bg-background">
    <div class="container">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-12 text-center">
        <div
          class="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-8"
        >
          <Icon name="mdi:magnify" class="text-orange-600 text-3xl" />
        </div>

        <BaseSectionHeader
          :title="$t('universities_page.not_found.title')"
          :subtitle="$t('universities_page.not_found.subtitle')"
          align="center"
          margin-bottom="lg"
        />

        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <div class="text-center">
            <div
              class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3"
            >
              <Icon name="mdi:account-tie" class="text-blue-600" />
            </div>
            <p class="text-sm text-gray-600">
              {{ $t('universities_page.not_found.features.consultation') }}
            </p>
          </div>
          <div class="text-center">
            <div
              class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3"
            >
              <Icon name="mdi:format-list-bulleted" class="text-green-600" />
            </div>
            <p class="text-sm text-gray-600">
              {{ $t('universities_page.not_found.features.selection') }}
            </p>
          </div>
          <div class="text-center">
            <div
              class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3"
            >
              <Icon name="mdi:clock" class="text-purple-600" />
            </div>
            <p class="text-sm text-gray-600">
              {{ $t('universities_page.not_found.features.quick_response') }}
            </p>
          </div>
        </div>

        <button
          class="bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-colors shadow-lg"
          @click="openApplicationForm"
        >
          {{ $t('universities_page.not_found.button') }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { FORM_SOURCES } from '~/types/preferences'

import { useApplicationModalStore } from '~/stores/applicationModal'

const modal = useApplicationModalStore()

const openApplicationForm = () => {
  // Простые предпочтения с информацией об источнике
  const simplePreferences = {
    source: 'universities_not_found' as const,
    description: FORM_SOURCES.universities_not_found,
  }

  modal.openModal(simplePreferences)
}
</script>
