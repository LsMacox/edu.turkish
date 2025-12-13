<template>
  <section
    id="who-are-you"
    :class="[!props.inModal ? 'section-py bg-background mt-10 md:mt-16' : '']"
  >
    <div :class="[props.inModal ? '' : 'container']">
      <div :class="[props.inModal ? '' : 'max-w-4xl mx-auto']">
        <BaseSectionHeader
          v-if="!props.inModal"
          :title="t(whoNs('title'))"
          :subtitle="t(whoNs('subtitle'))"
          align="center"
          margin-bottom="lg"
        />
        <div
          :class="[
            'space-y-5 md:space-y-8',
            props.inModal ? 'flex flex-col min-h-[60vh]' : 'card-surface',
          ]"
        >
          <div class="space-y-4">
            <h3 v-if="!props.inModal" class="text-card-title hidden md:block">
              {{ t(whoNs('title')) }}
            </h3>
            <div class="grid md:grid-cols-2 gap-2.5 md:gap-4">
              <button
                :class="[
                  'p-3 md:p-4 border-2 rounded-xl md:hover:scale-105 transition-all text-left min-h-touch-44 md:min-h-auto',
                  answers.userType === 'student'
                    ? 'border-primary bg-red-50'
                    : 'border-gray-200 hover:border-primary hover:bg-red-50',
                ]"
                @click="selectOption('userType', 'student')"
              >
                <div class="flex items-center gap-2 md:gap-3">
                  <BaseIconBadge icon="mdi:school" color="blue" size="md" rounded="xl" />
                  <div>
                    <p class="font-semibold text-secondary">{{ t(whoNs('student')) }}</p>
                    <p class="text-sm text-gray-500">{{ t(whoNs('student_desc')) }}</p>
                  </div>
                </div>
              </button>
              <button
                :class="[
                  'p-3 md:p-4 border-2 rounded-xl md:hover:scale-105 transition-all text-left min-h-touch-44 md:min-h-auto',
                  answers.userType === 'parent'
                    ? 'border-primary bg-red-50'
                    : 'border-gray-200 hover:border-primary hover:bg-red-50',
                ]"
                @click="selectOption('userType', 'parent')"
              >
                <div class="flex items-center gap-2 md:gap-3">
                  <BaseIconBadge icon="mdi:heart" color="purple" size="md" rounded="xl" />
                  <div>
                    <p class="font-semibold text-secondary">{{ t(whoNs('parent')) }}</p>
                    <p class="text-sm text-gray-500">{{ t(whoNs('parent_desc')) }}</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-card-title">
              {{ t(whoNs('university_chosen')) }}
            </h3>
            <div class="grid md:grid-cols-2 gap-2.5 md:gap-4">
              <button
                :class="[
                  'p-3 md:p-4 border-2 rounded-xl transition-all min-h-touch-44 md:min-h-auto text-sm md:text-base',
                  answers.universityChosen === 'yes'
                    ? 'border-primary bg-red-50'
                    : 'border-gray-200 hover:border-primary hover:bg-red-50',
                ]"
                @click="selectOption('universityChosen', 'yes')"
              >
                {{ t(whoNs('yes_know')) }}
              </button>
              <button
                :class="[
                  'p-3 md:p-4 border-2 rounded-xl transition-all min-h-touch-44 md:min-h-auto text-sm md:text-base',
                  answers.universityChosen === 'no'
                    ? 'border-primary bg-red-50'
                    : 'border-gray-200 hover:border-primary hover:bg-red-50',
                ]"
                @click="selectOption('universityChosen', 'no')"
              >
                {{ t(whoNs('no_help')) }}
              </button>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-card-title">
              {{ t(whoNs('language_interest')) }}
            </h3>
            <div class="grid md:grid-cols-2 gap-2.5 md:gap-4">
              <button
                :class="[
                  'p-3 md:p-4 border-2 rounded-xl transition-all min-h-touch-44 md:min-h-auto text-sm md:text-base',
                  answers.language === 'turkish'
                    ? 'border-primary bg-red-50'
                    : 'border-gray-200 hover:border-primary hover:bg-red-50',
                ]"
                @click="selectOption('language', 'turkish')"
              >
                {{ t(whoNs('turkish')) }}
              </button>
              <button
                :class="[
                  'p-3 md:p-4 border-2 rounded-xl transition-all min-h-touch-44 md:min-h-auto text-sm md:text-base',
                  answers.language === 'english'
                    ? 'border-primary bg-red-50'
                    : 'border-gray-200 hover:border-primary hover:bg-red-50',
                ]"
                @click="selectOption('language', 'english')"
              >
                {{ t(whoNs('english')) }}
              </button>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-card-title">
              {{ t(whoNs('scholarship_help')) }}
            </h3>
            <div class="grid md:grid-cols-2 gap-2.5 md:gap-4">
              <button
                :class="[
                  'p-3 md:p-4 border-2 rounded-xl transition-all min-h-touch-44 md:min-h-auto text-sm md:text-base',
                  answers.scholarship === 'yes'
                    ? 'border-primary bg-red-50'
                    : 'border-gray-200 hover:border-primary hover:bg-red-50',
                ]"
                @click="selectOption('scholarship', 'yes')"
              >
                {{ t(whoNs('yes_important')) }}
              </button>
              <button
                :class="[
                  'p-3 md:p-4 border-2 rounded-xl transition-all min-h-touch-44 md:min-h-auto text-sm md:text-base',
                  answers.scholarship === 'no'
                    ? 'border-primary bg-red-50'
                    : 'border-gray-200 hover:border-primary hover:bg-red-50',
                ]"
                @click="selectOption('scholarship', 'no')"
              >
                {{ t(whoNs('no_ready_pay')) }}
              </button>
            </div>
          </div>

          <div v-if="isFormComplete" class="bg-green-50 border border-green-200 rounded-xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <Icon name="mdi:check-circle" class="text-green-600 text-xl" />
              <h4 class="text-lg font-semibold text-green-800">
                {{ t(whoNs('profile_ready')) }}
              </h4>
            </div>
            <div class="text-sm text-green-700 space-y-1">
              <p>• {{ t(whoNs('type')) }}: {{ getUserTypeText }}</p>
              <p>• {{ t(whoNs('university')) }}: {{ getUniversityText }}</p>
              <p>• {{ t(whoNs('language')) }}: {{ getLanguageText }}</p>
              <p>• {{ t(whoNs('scholarship')) }}: {{ getScholarshipText }}</p>
            </div>
          </div>

          <div
            :class="[
              'flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-2.5',
              props.inModal ? 'mt-auto pt-3 md:pt-4' : 'pt-5',
            ]"
          >
            <button
              v-if="isFormComplete"
              class="bg-primary text-white px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold text-sm md:text-lg hover:bg-red-600 transition-all shadow-lg w-full sm:w-auto min-h-touch-44 md:min-h-touch-48"
              @click="openApplicationForm"
            >
              {{ t(whoNs('get_offer')) }}
            </button>
            <NuxtLink
              v-if="!props.inModal"
              to="#universities"
              class="bg-white border-2 border-primary text-primary px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold text-sm md:text-lg hover:bg-primary hover:text-white transition-all w-full sm:w-auto min-h-touch-44 md:min-h-touch-48 text-center"
            >
              {{ t(whoNs('view_universities')) }}
            </NuxtLink>
            <button
              v-else
              type="button"
              class="bg-white border-2 border-primary text-primary px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold text-sm md:text-lg hover:bg-primary hover:text-white transition-all w-full sm:w-auto min-h-touch-44 md:min-h-touch-48 text-center"
              @click="handleViewUniversitiesClick"
            >
              {{ t(whoNs('view_universities')) }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'

// Step-by-step questionnaire section with logic
const whoNs = namespace('home.who')

const props = withDefaults(
  defineProps<{
    inModal?: boolean
  }>(),
  {
    inModal: false,
  },
)

const emit = defineEmits<{
  (e: 'view-universities-click'): void
}>()

const { t } = useI18n()

const answers = ref({
  userType: '',
  universityChosen: '',
  language: '',
  scholarship: '',
})

const selectOption = (key: keyof typeof answers.value, value: string) => {
  answers.value[key] = value
}

const isFormComplete = computed(() => {
  return Object.values(answers.value).every((answer) => answer !== '')
})

const getUserTypeText = computed(() => {
  return answers.value.userType === 'student' ? t(whoNs('student')) : t(whoNs('parent'))
})

const getUniversityText = computed(() => {
  return answers.value.universityChosen === 'yes'
    ? t(whoNs('already_chosen'))
    : t(whoNs('need_help_choosing'))
})

const getLanguageText = computed(() => {
  return answers.value.language === 'turkish' ? t(whoNs('turkish')) : t(whoNs('english'))
})

const getScholarshipText = computed(() => {
  return answers.value.scholarship === 'yes'
    ? t(whoNs('scholarship_required'))
    : t(whoNs('ready_pay_self'))
})

const modal = useApplicationModal()

const openApplicationForm = () => {
  modal.openModal({
    source: 'home_questionnaire',
    description: 'Заявка на основе анкеты с главной страницы',
    userType: answers.value.userType as 'student' | 'parent',
    universityChosen: answers.value.universityChosen,
    language: answers.value.language as 'turkish' | 'english' | 'both',
    scholarship: answers.value.scholarship as 'yes' | 'no',
  })
}

const handleViewUniversitiesClick = () => {
  emit('view-universities-click')
}
</script>
