<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4 lg:px-6">
      <BaseSectionHeader
        :title="t(ns('title'))"
        :subtitle="t(ns('subtitle'))"
        align="center"
        margin-bottom="lg"
      />

      <!-- Program Tabs -->
      <div class="flex justify-center mb-8">
        <div class="bg-background rounded-xl p-1 flex space-x-1">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            :class="[
              'px-6 py-3 rounded-lg font-semibold transition-colors',
              activeTab === tab.key
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:text-secondary',
            ]"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Program Tables -->
      <div v-if="filteredPrograms.length" class="relative">
        <div
          class="bg-white rounded-2xl shadow-custom overflow-hidden"
          :class="{ 'max-h-[400px] overflow-hidden': !isExpanded && shouldShowToggle }"
        >
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-background">
                <tr>
                  <th class="px-6 py-4 text-left font-semibold text-secondary">
                    {{ t(ns('table.programName')) }}
                  </th>
                  <th class="px-6 py-4 text-center font-semibold text-secondary">
                    {{ t(ns('table.language')) }}
                  </th>
                  <th class="px-6 py-4 text-center font-semibold text-secondary">
                    {{ t(ns('table.duration')) }}
                  </th>
                  <th class="px-6 py-4 text-center font-semibold text-secondary">
                    {{ t(ns('table.costPerYear')) }}
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="(program, index) in filteredPrograms"
                  :key="index"
                  :class="[index % 2 === 1 ? 'bg-gray-50' : '']"
                >
                  <td class="px-6 py-4 font-medium text-secondary">{{ program.name }}</td>
                  <td class="px-6 py-4 text-center">
                    <span :class="getLanguageBadgeClass(program.language)">
                      {{ program.language }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center text-gray-600">
                    {{ formatDuration(program.durationYears) }}
                  </td>
                  <td class="px-6 py-4 text-center font-semibold text-primary">
                    {{ formatPrice(program.tuitionPerYear) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Show All Overlay -->
        <div
          v-if="shouldShowToggle && !isExpanded"
          class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent rounded-b-2xl flex items-end justify-center pb-4"
        >
          <button
            class="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors shadow-lg flex items-center gap-2"
            @click="isExpanded = true"
          >
            <span>{{ t(ns('showAll')) }}</span>
            <Icon name="ph:caret-down" class="text-lg" />
          </button>
        </div>

        <!-- Collapse Button -->
        <div v-if="shouldShowToggle && isExpanded" class="flex justify-center mt-4">
          <button
            class="text-primary font-semibold hover:text-red-600 transition-colors flex items-center gap-2"
            @click="isExpanded = false"
          >
            <span>{{ t(ns('collapse')) }}</span>
            <Icon name="ph:caret-up" class="text-lg" />
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-12">
        <div
          class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <Icon name="ph:graduation-cap" class="text-gray-400 text-2xl" />
        </div>
        <h3 class="text-card-title mb-2">
          {{ t(ns('emptyState.title')) }}
        </h3>
        <p class="text-gray-600">{{ t(ns('emptyState.description')) }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { UniversityProgram } from '~~/lib/types'
import { getLanguageBadgeClass } from '~~/lib/domain/universities/constants'
import { useUniversity } from '~/composables/useUniversityHelpers'
import { namespace } from '~~/lib/i18n'

const ns = namespace('academicPrograms')

interface Props {
  programs: UniversityProgram[]
}

const props = defineProps<Props>()
const { t } = useI18n()
const { formatDuration, formatPrice } = useUniversity()

const activeTab = ref<'bachelor' | 'master'>('bachelor')
const isExpanded = ref(false)

const tabs = computed(() => [
  { key: 'bachelor' as const, label: t(ns('tabs.bachelor')) },
  { key: 'master' as const, label: t(ns('tabs.master')) },
])

const filteredPrograms = computed(() =>
  props.programs.filter((p) => p.degreeType === activeTab.value),
)

// Show toggle when more than 5 programs
const shouldShowToggle = computed(() => filteredPrograms.value.length > 5)

// Reset expanded state when tab changes
watch(activeTab, () => {
  isExpanded.value = false
})
</script>
