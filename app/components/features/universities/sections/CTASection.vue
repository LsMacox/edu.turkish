<template>
  <section id="final-cta" class="section-py-lg bg-gradient-to-r from-primary to-red-600">
    <div class="container text-center">
      <div class="max-w-4xl mx-auto text-white">
        <h2 class="text-4xl lg:text-5xl font-bold mb-6">
          {{ $t('universities_page.final_cta.title') }}
        </h2>
        <p class="text-xl mb-8 opacity-90">
          {{ $t('universities_page.final_cta.subtitle') }}
        </p>

        <div class="bg-white rounded-2xl card-padding-lg max-w-2xl mx-auto mb-8">
          <h3 class="text-2xl font-bold text-secondary mb-6">
            {{ $t('universities_page.final_cta.benefits_title') }}
          </h3>
          <div class="grid md:grid-cols-2 gap-4 text-left">
            <div class="flex items-center space-x-3">
              <Icon name="mdi:check-circle" class="text-green-500" />
              <span class="text-secondary">{{
                $t('universities_page.final_cta.benefits.consultation')
              }}</span>
            </div>
            <div class="flex items-center space-x-3">
              <Icon name="mdi:check-circle" class="text-green-500" />
              <span class="text-secondary">{{
                $t('universities_page.final_cta.benefits.university_selection')
              }}</span>
            </div>
            <div class="flex items-center space-x-3">
              <Icon name="mdi:check-circle" class="text-green-500" />
              <span class="text-secondary">{{
                $t('universities_page.final_cta.benefits.cost_calculation')
              }}</span>
            </div>
            <div class="flex items-center space-x-3">
              <Icon name="mdi:check-circle" class="text-green-500" />
              <span class="text-secondary">{{
                $t('universities_page.final_cta.benefits.admission_plan')
              }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <button
            class="bg-white text-primary px-12 py-4 rounded-xl font-bold text-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            @click="openApplicationForm"
          >
            {{ $t('universities_page.final_cta.button') }}
          </button>
          <p class="text-sm opacity-80">
            {{ $t('universities_page.final_cta.guarantee') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { FORM_SOURCES } from '~/types/preferences'
import type { ApplicationPreferences } from '~/types/preferences'

import { useApplicationModalStore } from '~/stores/applicationModal'

const modal = useApplicationModalStore()

const openApplicationForm = () => {
  // Простые предпочтения с информацией об источнике
  const simplePreferences: ApplicationPreferences = {
    source: 'universities_cta',
    description: FORM_SOURCES.universities_cta,
  }

  modal.openModal(simplePreferences)
}
</script>
