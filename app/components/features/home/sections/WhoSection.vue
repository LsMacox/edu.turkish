<template>
  <section
    id="who-are-you"
    :class="[!props.inModal ? 'section-py bg-background mt-section-lg' : '']"
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
        <component
          :is="props.inModal ? 'div' : BaseCard"
          :variant="props.inModal ? undefined : 'surface'"
          :class="[
            'space-component-xl',
            props.inModal ? 'flex flex-col min-h-[60vh]' : '',
          ]"
        >
          <div class="space-component-md">
            <h3 v-if="!props.inModal" class="text-card-title hidden md:block">
              {{ t(whoNs('title')) }}
            </h3>
            <BaseGrid :md="2" gap="sm">
              <BaseCard
                :selected="answers.userType === 'student'"
                hover="scale"
                clickable
                padding="sm"
                shadow="none"
                rounded="lg"
                @click="selectOption('userType', 'student')"
              >
                <div class="flex items-center gap-component-sm">
                  <BaseIconBox icon="mdi:school" color="info" size="md" rounded="xl" />
                  <div>
                    <p class="font-semibold text-secondary">{{ t(whoNs('student')) }}</p>
                    <p class="text-body-sm text-meta">{{ t(whoNs('student_desc')) }}</p>
                  </div>
                </div>
              </BaseCard>
              <BaseCard
                :selected="answers.userType === 'parent'"
                hover="scale"
                clickable
                padding="sm"
                shadow="none"
                rounded="lg"
                @click="selectOption('userType', 'parent')"
              >
                <div class="flex items-center gap-component-sm">
                  <BaseIconBox icon="mdi:heart" color="secondary" size="md" rounded="xl" />
                  <div>
                    <p class="font-semibold text-secondary">{{ t(whoNs('parent')) }}</p>
                    <p class="text-body-sm text-meta">{{ t(whoNs('parent_desc')) }}</p>
                  </div>
                </div>
              </BaseCard>
            </BaseGrid>
          </div>

          <div class="space-component-md">
            <h3 class="text-card-title">
              {{ t(whoNs('university_chosen')) }}
            </h3>
            <BaseGrid :md="2" gap="sm">
              <BaseCard
                :selected="answers.universityChosen === 'yes'"
                class="text-body"
                clickable
                padding="sm"
                shadow="none"
                rounded="lg"
                @click="selectOption('universityChosen', 'yes')"
              >
                {{ t(whoNs('yes_know')) }}
              </BaseCard>
              <BaseCard
                :selected="answers.universityChosen === 'no'"
                class="text-body"
                clickable
                padding="sm"
                shadow="none"
                rounded="lg"
                @click="selectOption('universityChosen', 'no')"
              >
                {{ t(whoNs('no_help')) }}
              </BaseCard>
            </BaseGrid>
          </div>

          <div class="space-component-md">
            <h3 class="text-card-title">
              {{ t(whoNs('language_interest')) }}
            </h3>
            <BaseGrid :md="2" gap="sm">
              <BaseCard
                :selected="answers.language === 'turkish'"
                class="text-body"
                clickable
                padding="sm"
                shadow="none"
                rounded="lg"
                @click="selectOption('language', 'turkish')"
              >
                {{ t(whoNs('turkish')) }}
              </BaseCard>
              <BaseCard
                :selected="answers.language === 'english'"
                class="text-body"
                clickable
                padding="sm"
                shadow="none"
                rounded="lg"
                @click="selectOption('language', 'english')"
              >
                {{ t(whoNs('english')) }}
              </BaseCard>
            </BaseGrid>
          </div>

          <div class="space-component-md">
            <h3 class="text-card-title">
              {{ t(whoNs('scholarship_help')) }}
            </h3>
            <BaseGrid :md="2" gap="sm">
              <BaseCard
                :selected="answers.scholarship === 'yes'"
                class="text-body"
                clickable
                padding="sm"
                shadow="none"
                rounded="lg"
                @click="selectOption('scholarship', 'yes')"
              >
                {{ t(whoNs('yes_important')) }}
              </BaseCard>
              <BaseCard
                :selected="answers.scholarship === 'no'"
                class="text-body"
                clickable
                padding="sm"
                shadow="none"
                rounded="lg"
                @click="selectOption('scholarship', 'no')"
              >
                {{ t(whoNs('no_ready_pay')) }}
              </BaseCard>
            </BaseGrid>
          </div>

          <BaseAlert
            v-if="isFormComplete"
            variant="success"
            :title="t(whoNs('profile_ready'))"
            icon="mdi:check-circle"
          >
            <div class="space-component-sm">
              <p>• {{ t(whoNs('type')) }}: {{ getUserTypeText }}</p>
              <p>• {{ t(whoNs('university')) }}: {{ getUniversityText }}</p>
              <p>• {{ t(whoNs('language')) }}: {{ getLanguageText }}</p>
              <p>• {{ t(whoNs('scholarship')) }}: {{ getScholarshipText }}</p>
            </div>
          </BaseAlert>

          <div
            :class="[
              'flex flex-col sm:flex-row items-center justify-center gap-component-sm',
              props.inModal ? 'mt-auto pt-component-sm' : 'pt-component-md',
            ]"
          >
            <BaseButton
              v-if="isFormComplete"
              variant="primary"
              size="lg"
              class="w-full sm:w-auto shadow-card"
              @click="openApplicationForm"
            >
              {{ t(whoNs('get_offer')) }}
            </BaseButton>
            <BaseButton
              v-if="!props.inModal"
              variant="outline"
              size="lg"
              to="#universities"
              class="w-full sm:w-auto"
            >
              {{ t(whoNs('view_universities')) }}
            </BaseButton>
            <BaseButton
              v-else
              variant="outline"
              size="lg"
              class="w-full sm:w-auto"
              @click="handleViewUniversitiesClick"
            >
              {{ t(whoNs('view_universities')) }}
            </BaseButton>
          </div>
        </component>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'

const BaseCard = resolveComponent('BaseCard')
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
