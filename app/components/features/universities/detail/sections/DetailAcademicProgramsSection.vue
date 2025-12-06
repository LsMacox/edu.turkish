<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4 lg:px-6">
      <BaseSectionHeader
        :title="$t('academicPrograms.title')"
        :subtitle="$t('academicPrograms.subtitle')"
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
            {{ $t(`academicPrograms.tabs.${tab.key}`) }}
          </button>
        </div>
      </div>

      <!-- Program Tables -->
      <div v-if="filteredPrograms.length" class="bg-white rounded-2xl shadow-custom overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-background">
              <tr>
                <th class="px-6 py-4 text-left font-semibold text-secondary">
                  {{ $t('academicPrograms.table.programName') }}
                </th>
                <th class="px-6 py-4 text-center font-semibold text-secondary">
                  {{ $t('academicPrograms.table.language') }}
                </th>
                <th class="px-6 py-4 text-center font-semibold text-secondary">
                  {{ $t('academicPrograms.table.duration') }}
                </th>
                <th class="px-6 py-4 text-center font-semibold text-secondary">
                  {{ $t('academicPrograms.table.costPerYear') }}
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
                <td class="px-6 py-4 text-center text-gray-600">{{ formatDuration(program.durationYears) }}</td>
                <td class="px-6 py-4 text-center font-semibold text-primary">
                  {{ formatPrice(program.tuitionPerYear) }}
                </td>
              </tr>
            </tbody>
          </table>
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
          {{ $t('academicPrograms.emptyState.title') }}
        </h3>
        <p class="text-gray-600">{{ $t('academicPrograms.emptyState.description') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { UniversityProgram } from '~~/server/types/api/universities'
import { getLanguageBadgeClass } from '../../utils/styles'
import { useUniversityFormatters } from '../../composables/useUniversityFormatters'

interface Props {
  programs: UniversityProgram[]
}

const props = defineProps<Props>()
const { formatDuration, formatPrice } = useUniversityFormatters()

const activeTab = ref<'bachelor' | 'master'>('bachelor')

const tabs = [
  { key: 'bachelor' as const },
  { key: 'master' as const },
]

const filteredPrograms = computed(() =>
  props.programs.filter((p) => p.degreeType === activeTab.value)
)
</script>
