<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-4">
          {{ $t('academicPrograms.title') }}
        </h2>
        <p class="text-lg text-gray-600">{{ $t('academicPrograms.subtitle') }}</p>
      </div>

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
      <div class="bg-white rounded-2xl shadow-custom overflow-hidden">
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
                <td class="px-6 py-4 text-center text-gray-600">{{ program.duration }}</td>
                <td class="px-6 py-4 text-center font-semibold text-primary">
                  ${{ program.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredPrograms.length === 0" class="text-center py-12">
        <div
          class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <Icon name="ph:graduation-cap" class="text-gray-400 text-2xl" />
        </div>
        <h3 class="text-lg font-semibold text-secondary mb-2">
          {{ $t('academicPrograms.emptyState.title') }}
        </h3>
        <p class="text-gray-600">{{ $t('academicPrograms.emptyState.description') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useUniversityDetailStore, type UniversityProgram } from '~/stores/universityDetail'

interface Props {
  programs: UniversityProgram[]
}

const props = defineProps<Props>()
const universityDetailStore = useUniversityDetailStore()
const { getProgramsByLevel } = universityDetailStore

const activeTab = ref<'bachelor' | 'master'>('bachelor')

const tabs = [
  { key: 'bachelor' as const, label: 'Бакалавриат' },
  { key: 'master' as const, label: 'Магистратура' },
]

const filteredPrograms = computed(() => getProgramsByLevel(props.programs, activeTab.value))

const getLanguageBadgeClass = (language: string) => {
  const baseClasses = 'px-2 py-1 rounded-lg text-sm'

  switch (language) {
    case 'EN':
      return `${baseClasses} bg-blue-100 text-blue-800`
    case 'TR':
      return `${baseClasses} bg-green-100 text-green-800`
    case 'EN/TR':
      return `${baseClasses} bg-purple-100 text-purple-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
