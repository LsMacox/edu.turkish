<template>
  <BaseSection padding="lg">
      <BaseSectionHeader
        :title="t(ns('title'))"
        :subtitle="t(ns('subtitle'))"
        align="center"
        margin-bottom="lg"
      />

      <BaseGrid :lg="2" gap="lg">
        <!-- Required Documents -->
        <BaseCard padding="xl" shadow="md" rounded="2xl">
          <h3 class="text-section-title mb-component-md">
            {{ t(ns('requiredDocuments.title')) }}
          </h3>
          <div class="space-component-md">
            <div
              v-for="document in requiredDocuments"
              :key="document.id"
              class="flex items-start gap-component-sm"
            >
              <BaseStatusBadge icon="ph:check" color="success" size="sm" class="mt-1" />
              <div>
                <h5 class="font-semibold text-secondary">{{ document.title }}</h5>
                <p class="text-body-sm">{{ document.description }}</p>
                <ul
                  v-if="document.formatRequirements?.length"
                  class="mt-2 text-body-sm text-meta list-disc list-inside"
                >
                  <li v-for="req in document.formatRequirements" :key="req">{{ req }}</li>
                </ul>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Exams and Language -->
        <div class="space-component-xl">
          <BaseCard padding="xl" shadow="md" rounded="2xl">
            <h3 class="text-section-title mb-component-md">
              {{ t(ns('examsAndLanguage.title')) }}
            </h3>

            <div :class="[CALLOUT_CLASSES.success.container, 'card-padding-sm mb-component-md']">
              <div class="flex items-center">
                <Icon name="ph:info" :class="[CALLOUT_CLASSES.success.icon, 'mr-2']" />
                <p :class="[CALLOUT_CLASSES.success.text, 'font-semibold']">
                  {{ t(ns('examsAndLanguage.goodNews')) }}
                </p>
              </div>
              <p class="text-green-700 mt-1">
                {{ t(ns('examsAndLanguage.goodNewsText')) }}
              </p>
            </div>

            <div class="space-component-md">
              <div
                v-for="requirement in examRequirements"
                :key="requirement.id"
                class="border-l-4 pl-4"
                :class="requirement.borderColor"
              >
                <h5 class="font-semibold text-secondary">{{ requirement.title }}</h5>
                <p class="text-body-sm">{{ requirement.description }}</p>
              </div>
            </div>
          </BaseCard>

          <BaseCard v-if="scholarships.length" padding="xl" shadow="md" rounded="2xl">
            <h3 class="text-card-title mb-component-sm">
              {{ t(ns('scholarships.title')) }}
            </h3>
            <div class="space-component-sm">
              <div
                v-for="scholarship in scholarships"
                :key="scholarship.id"
                class="flex justify-between items-center compact-padding rounded-button"
                :class="scholarship.bgColor"
              >
                <span class="font-medium text-secondary">{{ scholarship.name }}</span>
                <span class="badge-padding-sm rounded text-body-sm" :class="scholarship.badgeColor">{{
                  scholarship.discount
                }}</span>
              </div>
            </div>
          </BaseCard>

          <!-- Important Dates -->
          <BaseCard v-if="importantDates.length" padding="xl" shadow="md" rounded="2xl">
            <h3 class="text-card-title mb-component-sm">
              {{ t(ns('importantDates.title')) }}
            </h3>
            <div class="space-component-sm">
              <div
                v-for="deadline in importantDates"
                :key="deadline.id"
                :class="[CALLOUT_CLASSES.error.container, 'flex justify-between items-center compact-padding rounded-button']"
              >
                <div>
                  <span class="font-medium text-secondary">{{ deadline.event }}</span>
                  <span class="text-body-sm text-meta ml-2">({{ deadline.type }})</span>
                </div>
                <span class="badge-padding-sm bg-error-light text-red-800 rounded text-body-sm font-medium">{{
                  deadline.date
                }}</span>
              </div>
            </div>
          </BaseCard>
        </div>
      </BaseGrid>
  </BaseSection>
</template>

<script setup lang="ts">
import type { UniversityDetail } from '~~/lib/types'
import { namespace, key } from '~~/lib/i18n'
import { CALLOUT_CLASSES } from '~/composables/ui'
import { ADMISSION_BORDER_COLORS, SCHOLARSHIP_COLOR_SCHEMES } from '~/composables/domain'

const ns = namespace('admissionRequirements')

interface Props {
  admission?: UniversityDetail['admission']
}

const props = withDefaults(defineProps<Props>(), {
  admission: () => ({
    requirements: [],
    documents: [],
    deadlines: [],
    scholarships: [],
  }),
})

const { t } = useI18n()

const requiredDocuments = computed(() =>
  props.admission.documents.map((doc, _i) => ({
    id: doc.id,
    title: doc.name,
    description: doc.description,
    formatRequirements: doc.formatRequirements ?? [],
  })),
)

const examRequirements = computed(() =>
  props.admission.requirements
    .filter((r) => r.category === 'exam' || r.category === 'language')
    .map((r, i) => ({
      id: r.id,
      title: r.requirement,
      description: r.details ?? '',
      borderColor: ADMISSION_BORDER_COLORS[i % ADMISSION_BORDER_COLORS.length],
    })),
)

const scholarships = computed(() =>
  props.admission.scholarships.map((s, i) => {
    const colorScheme = SCHOLARSHIP_COLOR_SCHEMES[i % SCHOLARSHIP_COLOR_SCHEMES.length]!
    return {
      id: s.id,
      name: s.name,
      discount: `${t(key('range.to'))} ${s.coveragePercentage}%`,
      bgColor: colorScheme.bgColor,
      badgeColor: colorScheme.badgeColor,
    }
  }),
)

const importantDates = computed(() =>
  props.admission.deadlines.map((d) => ({
    id: d.id,
    event: d.event,
    date: d.date,
    type: d.deadlineType,
  })),
)
</script>
