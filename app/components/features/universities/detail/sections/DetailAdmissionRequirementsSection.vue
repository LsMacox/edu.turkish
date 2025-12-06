<template>
  <section class="py-16 bg-background">
    <div class="container mx-auto px-4 lg:px-6">
      <BaseSectionHeader
        :title="$t('admissionRequirements.title')"
        :subtitle="$t('admissionRequirements.subtitle')"
        align="center"
        margin-bottom="lg"
      />

      <div class="grid lg:grid-cols-2 gap-12">
        <!-- Required Documents -->
        <div class="bg-white rounded-2xl shadow-custom p-8">
          <h3 class="text-2xl font-semibold text-secondary mb-6">
            {{ $t('admissionRequirements.requiredDocuments.title') }}
          </h3>
          <div class="space-y-4">
            <div
              v-for="document in requiredDocuments"
              :key="document.key"
              class="flex items-start space-x-3"
            >
              <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                <Icon name="ph:check" class="text-white text-xs" />
              </div>
              <div>
                <h5 class="font-semibold text-secondary">{{ document.title }}</h5>
                <p class="text-sm text-gray-600">{{ document.description }}</p>
                <ul
                  v-if="document.formatRequirements?.length"
                  class="mt-2 text-xs text-gray-500 list-disc list-inside"
                >
                  <li v-for="req in document.formatRequirements" :key="req">{{ req }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Exams and Language -->
        <div class="space-y-8">
          <div class="bg-white rounded-2xl shadow-custom p-8">
            <h3 class="text-2xl font-semibold text-secondary mb-6">
              {{ $t('admissionRequirements.examsAndLanguage.title') }}
            </h3>

            <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div class="flex items-center">
                <Icon name="ph:info" class="text-green-600 mr-2" />
                <p class="text-green-800 font-semibold">
                  {{ $t('admissionRequirements.examsAndLanguage.goodNews') }}
                </p>
              </div>
              <p class="text-green-700 mt-1">
                {{ $t('admissionRequirements.examsAndLanguage.goodNewsText') }}
              </p>
            </div>

            <div class="space-y-4">
              <div
                v-for="requirement in examRequirements"
                :key="requirement.key"
                class="border-l-4 pl-4"
                :class="requirement.borderColor"
              >
                <h5 class="font-semibold text-secondary">{{ requirement.title }}</h5>
                <p class="text-sm text-gray-600">{{ requirement.description }}</p>
              </div>
            </div>
          </div>

          <div v-if="scholarships.length" class="bg-white rounded-2xl shadow-custom p-8">
            <h3 class="text-card-title mb-4">
              {{ $t('admissionRequirements.scholarships.title') }}
            </h3>
            <div class="space-y-3">
              <div
                v-for="scholarship in scholarships"
                :key="scholarship.key"
                class="flex justify-between items-center p-3 rounded-lg"
                :class="scholarship.bgColor"
              >
                <span class="font-medium text-secondary">{{ scholarship.name }}</span>
                <span class="px-2 py-1 rounded text-sm" :class="scholarship.badgeColor">{{
                  scholarship.discount
                }}</span>
              </div>
            </div>
          </div>

          <!-- Important Dates -->
          <div v-if="importantDates.length" class="bg-white rounded-2xl shadow-custom p-8">
            <h3 class="text-card-title mb-4">
              {{ $t('admissionRequirements.importantDates.title') }}
            </h3>
            <div class="space-y-3">
              <div
                v-for="deadline in importantDates"
                :key="deadline.key"
                class="flex justify-between items-center p-3 border-l-4 border-red-500 bg-red-50 rounded-lg"
              >
                <div>
                  <span class="font-medium text-secondary">{{ deadline.event }}</span>
                  <span class="text-xs text-gray-500 ml-2">({{ deadline.type }})</span>
                </div>
                <span class="px-2 py-1 bg-red-200 text-red-800 rounded text-sm font-medium">{{
                  deadline.date
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { UniversityDetail } from '~~/server/types/api/universities'
import { BORDER_COLORS, SCHOLARSHIP_COLOR_SCHEMES } from '../../utils/styles'

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
  props.admission.documents.map((doc, i) => ({
    key: `doc_${i}`,
    title: doc.name,
    description: doc.description,
    formatRequirements: doc.format_requirements ?? [],
  }))
)

const examRequirements = computed(() =>
  props.admission.requirements
    .filter((r) => r.category === 'exam' || r.category === 'language')
    .map((r, i) => ({
      key: `req_${i}`,
      title: r.requirement,
      description: r.details ?? '',
      borderColor: BORDER_COLORS[i % BORDER_COLORS.length],
    }))
)

const scholarships = computed(() =>
  props.admission.scholarships.map((s, i) => {
    const colorScheme = SCHOLARSHIP_COLOR_SCHEMES[i % SCHOLARSHIP_COLOR_SCHEMES.length]!
    return {
      key: `scholarship_${i}`,
      name: s.name,
      discount: `${t('range.to')} ${s.coverage_percentage}%`,
      bgColor: colorScheme.bgColor,
      badgeColor: colorScheme.badgeColor,
    }
  })
)

const importantDates = computed(() =>
  props.admission.deadlines.map((d, i) => ({
    key: `deadline_${i}`,
    event: d.event,
    date: d.date,
    type: d.deadline_type,
  }))
)
</script>
