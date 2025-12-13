<template>
  <section id="breaking-fears" class="section-py bg-background">
    <div class="container mx-auto container-padding-narrow">
      <BaseSectionHeader
        :title="t(fearsNs('title'))"
        :subtitle="t(fearsNs('subtitle'))"
        align="center"
        margin-bottom="lg"
      />

      <div class="columns-1 md:columns-2 lg:columns-3 gap-8">
        <div v-scroll-reveal class="card-surface break-inside-avoid mb-8">
          <BaseIconBadge icon="mdi:alert-circle" color="red" size="md" class="mb-6" />
          <div class="space-y-3">
            <button type="button" class="w-full text-left" @click="toggleFear(1)">
              <p class="text-gray-600 text-sm">{{ t(fearsNs('fear_label')) }}</p>
              <div class="mt-1 flex items-center justify-between">
                <span class="text-card-title">{{ t(fearsNs('fear1_title')) }}</span>
                <span class="ml-3 text-gray-400 text-xl leading-none">
                  <span v-if="openFearIndex === 1">−</span>
                  <span v-else>+</span>
                </span>
              </div>
              <p class="mt-1 text-sm text-gray-500 italic">{{ t(fearsNs('fear1_quote')) }}</p>
            </button>
            <div v-if="openFearIndex === 1" class="border-t pt-3">
              <p class="text-gray-700 whitespace-pre-line">
                {{ t(fearsNs('fear1_answer')) }}
              </p>
            </div>
          </div>
        </div>

        <div v-scroll-reveal class="card-surface break-inside-avoid mb-8">
          <BaseIconBadge icon="mdi:translate" color="blue" size="md" class="mb-6" />
          <div class="space-y-3">
            <button type="button" class="w-full text-left" @click="toggleFear(2)">
              <p class="text-gray-600 text-sm">{{ t(fearsNs('fear_label')) }}</p>
              <div class="mt-1 flex items-center justify-between">
                <span class="text-card-title">{{ t(fearsNs('fear2_title')) }}</span>
                <span class="ml-3 text-gray-400 text-xl leading-none">
                  <span v-if="openFearIndex === 2">−</span>
                  <span v-else>+</span>
                </span>
              </div>
              <p class="mt-1 text-sm text-gray-500 italic">{{ t(fearsNs('fear2_quote')) }}</p>
            </button>
            <div v-if="openFearIndex === 2" class="border-t pt-3">
              <p class="text-gray-700 whitespace-pre-line">
                {{ t(fearsNs('fear2_answer')) }}
              </p>
            </div>
          </div>
        </div>

        <div class="card-surface break-inside-avoid mb-8">
          <BaseIconBadge icon="mdi:clock-alert" color="orange" size="md" class="mb-6" />
          <div class="space-y-3">
            <button type="button" class="w-full text-left" @click="toggleFear(3)">
              <p class="text-gray-600 text-sm">{{ t(fearsNs('fear_label')) }}</p>
              <div class="mt-1 flex items-center justify-between">
                <span class="text-card-title">{{ t(fearsNs('fear3_title')) }}</span>
                <span class="ml-3 text-gray-400 text-xl leading-none">
                  <span v-if="openFearIndex === 3">−</span>
                  <span v-else>+</span>
                </span>
              </div>
              <p class="mt-1 text-sm text-gray-500 italic">{{ t(fearsNs('fear3_quote')) }}</p>
            </button>
            <div v-if="openFearIndex === 3" class="border-t pt-3">
              <p class="text-gray-700 whitespace-pre-line">
                {{ t(fearsNs('fear3_answer')) }}
              </p>
            </div>
          </div>
        </div>

        <div class="card-surface break-inside-avoid mb-8">
          <BaseIconBadge icon="mdi:currency-usd" color="purple" size="md" class="mb-6" />
          <div class="space-y-3">
            <button type="button" class="w-full text-left" @click="toggleFear(4)">
              <p class="text-gray-600 text-sm">{{ t(fearsNs('fear_label')) }}</p>
              <div class="mt-1 flex items-center justify-between">
                <span class="text-card-title">{{ t(fearsNs('fear4_title')) }}</span>
                <span class="ml-3 text-gray-400 text-xl leading-none">
                  <span v-if="openFearIndex === 4">−</span>
                  <span v-else>+</span>
                </span>
              </div>
              <p class="mt-1 text-sm text-gray-500 italic">{{ t(fearsNs('fear4_quote')) }}</p>
            </button>
            <div v-if="openFearIndex === 4" class="border-t pt-3">
              <p class="text-gray-700 whitespace-pre-line">
                {{ t(fearsNs('fear4_answer')) }}
              </p>
            </div>
          </div>
        </div>

        <div class="card-surface break-inside-avoid mb-8">
          <BaseIconBadge icon="mdi:close-circle" color="green" size="md" class="mb-6" />
          <div class="space-y-3">
            <button type="button" class="w-full text-left" @click="toggleFear(5)">
              <p class="text-gray-600 text-sm">{{ t(fearsNs('fear_label')) }}</p>
              <div class="mt-1 flex items-center justify-between">
                <span class="text-card-title">{{ t(fearsNs('fear5_title')) }}</span>
                <span class="ml-3 text-gray-400 text-xl leading-none">
                  <span v-if="openFearIndex === 5">−</span>
                  <span v-else>+</span>
                </span>
              </div>
              <p class="mt-1 text-sm text-gray-500 italic">{{ t(fearsNs('fear5_quote')) }}</p>
            </button>
            <div v-if="openFearIndex === 5" class="border-t pt-3">
              <p class="text-gray-700 whitespace-pre-line">
                {{ t(fearsNs('fear5_answer')) }}
              </p>
            </div>
          </div>
        </div>

        <div class="card-surface break-inside-avoid mb-8">
          <BaseIconBadge icon="mdi:home" color="yellow" size="md" class="mb-6" />
          <div class="space-y-3">
            <button type="button" class="w-full text-left" @click="toggleFear(6)">
              <p class="text-gray-600 text-sm">{{ t(fearsNs('fear_label')) }}</p>
              <div class="mt-1 flex items-center justify-between">
                <span class="text-card-title">{{ t(fearsNs('fear6_title')) }}</span>
                <span class="ml-3 text-gray-400 text-xl leading-none">
                  <span v-if="openFearIndex === 6">−</span>
                  <span v-else>+</span>
                </span>
              </div>
              <p class="mt-1 text-sm text-gray-500 italic">{{ t(fearsNs('fear6_quote')) }}</p>
            </button>
            <div v-if="openFearIndex === 6" class="border-t pt-3">
              <p class="text-gray-700 whitespace-pre-line">
                {{ t(fearsNs('fear6_answer')) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'

// Breaking fears section
const fearsNs = namespace('home.fears')
const { t } = useI18n()

const openFearIndex = ref<number | null>(null)

const toggleFear = (index: number) => {
  openFearIndex.value = openFearIndex.value === index ? null : index
}
</script>
