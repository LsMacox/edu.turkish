<template>
  <section id="who-are-you" class="py-16 bg-background">
    <div class="container">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-4">{{ t('home.who.title') }}</h2>
          <p class="text-lg text-gray-600">{{ t('home.who.subtitle') }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow-custom p-8 space-y-8">
          <div class="space-y-4">
            <h3 class="text-xl font-semibold text-secondary">{{ t('home.who.title') }}</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <button 
                @click="selectOption('userType', 'student')"
                :class="[
                  'p-6 border-2 rounded-xl hover:scale-105 transition-all text-left',
                  answers.userType === 'student' 
                    ? 'border-primary bg-red-50' 
                    : 'border-gray-200 hover:border-primary hover:bg-red-50'
                ]"
              >
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-blue-100 rounded-xl grid place-items-center">
                    <Icon name="mdi:school" class="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <p class="font-semibold text-secondary">{{ t('home.who.student') }}</p>
                    <p class="text-sm text-gray-500">{{ t('home.who.student_desc') }}</p>
                  </div>
                </div>
              </button>
              <button 
                @click="selectOption('userType', 'parent')"
                :class="[
                  'p-6 border-2 rounded-xl hover:scale-105 transition-all text-left',
                  answers.userType === 'parent' 
                    ? 'border-primary bg-red-50' 
                    : 'border-gray-200 hover:border-primary hover:bg-red-50'
                ]"
              >
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-purple-100 rounded-xl grid place-items-center">
                    <Icon name="mdi:heart" class="text-purple-600 text-lg" />
                  </div>
                  <div>
                    <p class="font-semibold text-secondary">{{ t('home.who.parent') }}</p>
                    <p class="text-sm text-gray-500">{{ t('home.who.parent_desc') }}</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-xl font-semibold text-secondary">{{ t('home.who.university_chosen') }}</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <button 
                @click="selectOption('universityChosen', 'yes')"
                :class="[
                  'p-4 border-2 rounded-xl transition-all',
                  answers.universityChosen === 'yes' 
                    ? 'border-primary bg-red-50' 
                    : 'border-gray-200 hover:border-primary hover:bg-red-50'
                ]"
              >
                {{ t('home.who.yes_know') }}
              </button>
              <button 
                @click="selectOption('universityChosen', 'no')"
                :class="[
                  'p-4 border-2 rounded-xl transition-all',
                  answers.universityChosen === 'no' 
                    ? 'border-primary bg-red-50' 
                    : 'border-gray-200 hover:border-primary hover:bg-red-50'
                ]"
              >
                {{ t('home.who.no_help') }}
              </button>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-xl font-semibold text-secondary">{{ t('home.who.language_interest') }}</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <button 
                @click="selectOption('language', 'turkish')"
                :class="[
                  'p-4 border-2 rounded-xl transition-all',
                  answers.language === 'turkish' 
                    ? 'border-primary bg-red-50' 
                    : 'border-gray-200 hover:border-primary hover:bg-red-50'
                ]"
              >
                {{ t('home.who.turkish') }}
              </button>
              <button 
                @click="selectOption('language', 'english')"
                :class="[
                  'p-4 border-2 rounded-xl transition-all',
                  answers.language === 'english' 
                    ? 'border-primary bg-red-50' 
                    : 'border-gray-200 hover:border-primary hover:bg-red-50'
                ]"
              >
                {{ t('home.who.english') }}
              </button>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-xl font-semibold text-secondary">{{ t('home.who.scholarship_help') }}</h3>
            <div class="grid md:grid-cols-2 gap-4">
              <button 
                @click="selectOption('scholarship', 'yes')"
                :class="[
                  'p-4 border-2 rounded-xl transition-all',
                  answers.scholarship === 'yes' 
                    ? 'border-primary bg-red-50' 
                    : 'border-gray-200 hover:border-primary hover:bg-red-50'
                ]"
              >
                {{ t('home.who.yes_important') }}
              </button>
              <button 
                @click="selectOption('scholarship', 'no')"
                :class="[
                  'p-4 border-2 rounded-xl transition-all',
                  answers.scholarship === 'no' 
                    ? 'border-primary bg-red-50' 
                    : 'border-gray-200 hover:border-primary hover:bg-red-50'
                ]"
              >
                {{ t('home.who.no_ready_pay') }}
              </button>
            </div>
          </div>

          <div v-if="isFormComplete" class="bg-green-50 border border-green-200 rounded-xl p-6">
            <div class="flex items-center gap-3 mb-4">
              <Icon name="mdi:check-circle" class="text-green-600 text-xl" />
              <h4 class="text-lg font-semibold text-green-800">{{ t('home.who.profile_ready') }}</h4>
            </div>
            <div class="text-sm text-green-700 space-y-1">
              <p>• {{ t('home.who.type') }}: {{ getUserTypeText }}</p>
              <p>• {{ t('home.who.university') }}: {{ getUniversityText }}</p>
              <p>• {{ t('home.who.language') }}: {{ getLanguageText }}</p>
              <p>• {{ t('home.who.scholarship') }}: {{ getScholarshipText }}</p>
            </div>
          </div>

          <div class="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button 
              v-if="isFormComplete"
              @click="openApplicationForm"
              class="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-600 transition-all shadow-lg w-full sm:w-auto min-h-touch-48"
            >
              {{ t('home.who.get_offer') }}
            </button>
            <NuxtLink to="#universities" class="bg-white border-2 border-primary text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary hover:text-white transition-all w-full sm:w-auto min-h-touch-48 text-center">
              {{ t('home.who.view_universities') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Step-by-step questionnaire section with logic
const { t } = useI18n()

const answers = ref({
  userType: '',
  universityChosen: '',
  language: '',
  scholarship: ''
})

const selectOption = (key: keyof typeof answers.value, value: string) => {
  answers.value[key] = value
}

const isFormComplete = computed(() => {
  return Object.values(answers.value).every(answer => answer !== '')
})

const getUserTypeText = computed(() => {
  return answers.value.userType === 'student' ? t('home.who.student') : t('home.who.parent')
})

const getUniversityText = computed(() => {
  return answers.value.universityChosen === 'yes' ? t('home.who.already_chosen') : t('home.who.need_help_choosing')
})

const getLanguageText = computed(() => {
  return answers.value.language === 'turkish' ? t('home.who.turkish') : t('home.who.english')
})

const getScholarshipText = computed(() => {
  return answers.value.scholarship === 'yes' ? t('home.who.scholarship_required') : t('home.who.ready_pay_self')
})

import { useApplicationModalStore } from '~/stores/applicationModal'

const modal = useApplicationModalStore()

const openApplicationForm = () => {
  // Создаем объект с данными анкеты в нужном формате
  const questionnairePreferences = {
    source: 'home_questionnaire',
    description: 'Заявка на основе анкеты с главной страницы',
    userType: answers.value.userType,
    universityChosen: answers.value.universityChosen, 
    language: answers.value.language,
    scholarship: answers.value.scholarship
  }
  
  modal.openModal(questionnairePreferences)
}
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
