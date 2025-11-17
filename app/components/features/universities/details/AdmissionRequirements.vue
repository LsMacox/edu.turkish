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
                <div
                  v-if="document.formatRequirements && document.formatRequirements.length > 0"
                  class="mt-2"
                >
                  <ul class="text-xs text-gray-500 list-disc list-inside">
                    <li v-for="req in document.formatRequirements" :key="req">{{ req }}</li>
                  </ul>
                </div>
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

          <div class="bg-white rounded-2xl shadow-custom p-8">
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
          <div v-if="importantDates.length > 0" class="bg-white rounded-2xl shadow-custom p-8">
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
// Local minimal types to avoid cross-import issues
interface ScholarshipItem {
  name: string
  type: string
  coverage_percentage: number
}
interface DocumentItem {
  name: string
  description?: string
  is_mandatory: boolean
  format_requirements?: string[]
}
interface RequirementItem {
  category: string
  requirement: string
  details?: string
}
interface DeadlineItem {
  event: string
  date: string
  deadline_type: 'application' | 'document' | 'exam' | 'notification'
}

// Props from parent component
interface Props {
  admission?: {
    requirements: RequirementItem[]
    documents: DocumentItem[]
    deadlines: DeadlineItem[]
    scholarships: ScholarshipItem[]
  }
}

const props = withDefaults(defineProps<Props>(), {
  admission: () => ({
    requirements: [],
    documents: [],
    deadlines: [],
    scholarships: [],
  }),
})

// Transform API data for UI display
const requiredDocuments = computed(() => {
  return props.admission.documents.map((doc: DocumentItem, index: number) => ({
    key: `doc_${index}`,
    title: doc.name,
    description: doc.description,
    isMandatory: doc.is_mandatory,
    formatRequirements: doc.format_requirements || [],
  }))
})

const examRequirements = computed(() => {
  return props.admission.requirements
    .filter((req: RequirementItem) => req.category === 'exam' || req.category === 'language')
    .map((req: RequirementItem, index: number) => ({
      key: `req_${index}`,
      title: req.requirement,
      description: req.details || '',
      details: req.details || '',
      borderColor: ['border-blue-500', 'border-purple-500', 'border-orange-500'][index % 3],
    }))
})

const scholarships = computed(() => {
  const colorSchemes = [
    { bgColor: 'bg-yellow-50', badgeColor: 'bg-yellow-200 text-yellow-800' },
    { bgColor: 'bg-blue-50', badgeColor: 'bg-blue-200 text-blue-800' },
    { bgColor: 'bg-green-50', badgeColor: 'bg-green-200 text-green-800' },
    { bgColor: 'bg-purple-50', badgeColor: 'bg-purple-200 text-purple-800' },
  ]

  const { locale } = useI18n()
  const upTo = computed(() => {
    switch (locale.value as 'ru' | 'kk' | 'en' | 'tr') {
      case 'en':
        return 'up to'
      case 'kk':
        return 'дейін'
      case 'tr':
        return 'kadar'
      default:
        return 'до'
    }
  })

  return props.admission.scholarships.map((scholarship: ScholarshipItem, index: number) => ({
    key: `scholarship_${index}`,
    name: scholarship.name,
    discount: `${upTo.value} ${scholarship.coverage_percentage}%`,
    type: scholarship.type,
    ...colorSchemes[index % colorSchemes.length],
  }))
})

const importantDates = computed(() => {
  return props.admission.deadlines.map((deadline: DeadlineItem, index: number) => ({
    key: `deadline_${index}`,
    event: deadline.event,
    date: deadline.date,
    type: deadline.deadline_type,
  }))
})
</script>
