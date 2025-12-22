<template>
  <BaseSection padding="lg" bg="white">
      <BaseSectionHeader
        :title="t(ns('title'))"
        :subtitle="t(ns('subtitle'))"
        align="center"
        margin-bottom="lg"
      />

      <!-- Program Tabs -->
      <div class="flex justify-center mb-component-md">
        <div class="bg-background rounded-button compact-padding-xs flex gap-1">
          <BaseButton
            v-for="tab in tabs"
            :key="tab.key"
            :variant="activeTab === tab.key ? 'tab-active' : 'tab-inactive'"
            no-focus-ring
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </BaseButton>
        </div>
      </div>

      <!-- Program Tables -->
      <div v-if="filteredPrograms.length" class="relative">
        <BaseCard
          padding="none"
          shadow="md"
          rounded="2xl"
          :class="{ 'max-h-[400px] overflow-hidden': !isExpanded && shouldShowToggle }"
        >
          <BaseTable
            :columns="tableColumns"
            :data="filteredPrograms"
          >
            <template #cell-name="{ value }">
              <span class="font-medium text-secondary">{{ value }}</span>
            </template>
            <template #cell-language="{ row }">
              <span :class="getLanguageBadgeClass(row.language)">
                {{ row.language }}
              </span>
            </template>
            <template #cell-durationYears="{ row }">
              <span class="text-body-sm">{{ formatDuration(row.durationYears) }}</span>
            </template>
            <template #cell-tuitionPerYear="{ row }">
              <span class="font-semibold text-primary">{{ formatPrice(row.tuitionPerYear) }}</span>
            </template>
          </BaseTable>
        </BaseCard>

        <!-- Show All Overlay -->
        <div
          v-if="shouldShowToggle && !isExpanded"
          class="absolute bottom-0 left-0 right-0 h-32 gradient-fade-bottom rounded-b-2xl flex items-end justify-center pb-4"
        >
          <BaseButton
            variant="primary"
            size="md"
            icon="ph:caret-down"
            icon-position="right"
            class="shadow-card"
            @click="isExpanded = true"
          >
            {{ t(ns('showAll')) }}
          </BaseButton>
        </div>

        <!-- Collapse Button -->
        <div v-if="shouldShowToggle && isExpanded" class="flex justify-center mt-component-sm">
          <BaseButton
            variant="link"
            icon="ph:caret-up"
            icon-position="right"
            class="text-primary hover:text-error-dark font-semibold"
            @click="isExpanded = false"
          >
            {{ t(ns('collapse')) }}
          </BaseButton>
        </div>
      </div>

      <!-- Empty state -->
      <FeedbackEmptyState
        v-else
        icon="ph:graduation-cap"
        :title="t(ns('emptyState.title'))"
        :text="t(ns('emptyState.description'))"
      />
  </BaseSection>
</template>

<script setup lang="ts">
import type { UniversityProgram } from '~~/lib/types'
import { getLanguageBadgeClass } from '~/composables/domain'
import { useUniversity } from '~/composables/useUniversityHelpers'
import { namespace } from '~~/lib/i18n'

const ns = namespace('academicPrograms')

interface Props {
  programs: UniversityProgram[]
}

const props = defineProps<Props>()
const { t } = useI18n()
const { formatDuration, formatPrice } = useUniversity()

const tableColumns = computed(() => [
  { key: 'name', label: t(ns('table.programName')), align: 'left' as const },
  { key: 'language', label: t(ns('table.language')), align: 'center' as const },
  { key: 'durationYears', label: t(ns('table.duration')), align: 'center' as const },
  { key: 'tuitionPerYear', label: t(ns('table.costPerYear')), align: 'center' as const },
])

const activeTab = ref<'bachelor' | 'master'>('bachelor')
const isExpanded = ref(false)

const tabs = computed(() => [
  { key: 'bachelor' as const, label: t(ns('tabs.bachelor')) },
  { key: 'master' as const, label: t(ns('tabs.master')) },
])

const filteredPrograms = computed(() =>
  props.programs.filter((p) => p.degreeType === activeTab.value),
)

const shouldShowToggle = computed(() => filteredPrograms.value.length > 5)

watch(activeTab, () => {
  isExpanded.value = false
})
</script>
