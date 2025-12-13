<template>
  <section class="py-16 bg-background">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="max-w-4xl mx-auto">
        <BaseSectionHeader
          :title="t(ns('title'))"
          align="center"
          margin-bottom="lg"
        />

        <div class="space-y-8">
          <div class="bg-white rounded-2xl shadow-custom p-8">
            <h3 class="text-2xl font-semibold text-secondary mb-4">
              {{ t(ns('history')) }}
            </h3>
            <p class="text-card-body">
              {{ university.about.history }}
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow-custom p-8">
            <h3 class="text-2xl font-semibold text-secondary mb-4">
              {{ t(ns('campus')) }}
            </h3>
            <p class="text-card-body">
              {{ university.about.mission }}
            </p>
          </div>

          <div
            v-if="university.about.advantages?.length"
            class="bg-white rounded-2xl shadow-custom p-8"
          >
            <h3 class="text-2xl font-semibold text-secondary mb-4">
              {{ t(ns('advantages')) }}
            </h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div
                v-for="(advantage, index) in university.about.advantages"
                :key="index"
                class="flex items-start space-x-3"
              >
                <div
                  class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 flex-shrink-0"
                >
                  <Icon name="ph:check" class="text-white text-xs flex-shrink-0" />
                </div>
                <div>
                  <h5 class="font-semibold text-secondary">{{ advantage.title }}</h5>
                  <p class="text-sm text-gray-600">{{ advantage.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { UniversityDetail } from '~~/lib/types'
import { namespace } from '~~/lib/i18n'

const ns = namespace('universities.detail.aboutUniversity')
const { t } = useI18n()

defineProps<{
  university: UniversityDetail
}>()
</script>
