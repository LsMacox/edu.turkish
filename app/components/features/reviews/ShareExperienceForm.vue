<template>
  <section id="share-experience" class="section-py bg-white">
    <div class="container mx-auto container-padding-narrow">
      <div class="text-center mb-8 md:mb-12">
        <h2 class="text-section-title mb-6">
          {{ t(ns('title')) }}
          <span class="text-primary">{{ t(ns('titleAccent')) }}</span>
        </h2>
        <p class="text-section-subtitle max-w-3xl mx-auto">
          {{ t(ns('description')) }}
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div
          class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 md:p-8 lg:p-12 shadow-custom"
        >
          <form class="space-y-6 md:space-y-8" @submit.prevent.stop="submitReview">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <!-- Name -->
              <div>
                <label :for="nameFieldId" class="block text-sm font-semibold text-secondary mb-2">
                  {{ t(formNs('name.label')) }}
                </label>
                <BaseTextField
                  :id="nameFieldId"
                  v-model="form.name"
                  type="text"
                  :placeholder="t(formNs('name.placeholder'))"
                  :error="nameError"
                  icon="mdi:account"
                />
              </div>

              <!-- Reviewer Type -->
              <div>
                <label
                  :for="reviewerTypeFieldId"
                  class="block text-sm font-semibold text-secondary mb-2"
                >
                  {{ t(formNs('reviewerType.label')) }}
                </label>
                <BaseSelect :id="reviewerTypeFieldId" v-model="form.reviewerType">
                  <option value="">
                    {{ t(formNs('reviewerType.placeholder')) }}
                  </option>
                  <option value="student">
                    {{ t(formNs('reviewerType.student')) }}
                  </option>
                  <option value="parent">
                    {{ t(formNs('reviewerType.parent')) }}
                  </option>
                </BaseSelect>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <!-- University -->
              <div>
                <label
                  :for="universityFieldId"
                  class="block text-sm font-semibold text-secondary mb-2"
                >
                  {{ t(formNs('university.label')) }}
                </label>
                <BaseSelect
                  :id="universityFieldId"
                  v-model="form.university"
                  :disabled="isLoadingUniversities"
                >
                  <option value="">
                    {{
                      isLoadingUniversities
                        ? t(formNs('university.loading'))
                        : t(formNs('university.placeholder'))
                    }}
                  </option>
                  <option
                    v-for="university in universities"
                    :key="university.id"
                    :value="university.title"
                  >
                    {{ university.title }}
                  </option>
                  <option value="other">
                    {{ t(formNs('university.other')) }}
                  </option>
                </BaseSelect>
                <p v-if="universityError" class="mt-1 text-sm text-red-600">
                  {{ universityError }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <!-- Faculty -->
              <div>
                <label
                  :for="facultyFieldId"
                  class="block text-sm font-semibold text-secondary mb-2"
                >
                  {{ t(formNs('faculty.label')) }}
                </label>
                <BaseTextField
                  :id="facultyFieldId"
                  v-model="form.faculty"
                  type="text"
                  :placeholder="t(formNs('faculty.placeholder'))"
                  icon="mdi:school"
                />
              </div>

              <!-- Year -->
              <div>
                <label :for="yearFieldId" class="block text-sm font-semibold text-secondary mb-2">
                  {{ t(formNs('year.label')) }}
                </label>
                <BaseSelect :id="yearFieldId" v-model="form.year">
                  <option value="">
                    {{ t(formNs('year.placeholder')) }}
                  </option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="other">
                    {{ t(formNs('year.earlier')) }}
                  </option>
                </BaseSelect>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <!-- Rating -->
              <div>
                <label :for="ratingFieldId" class="block text-sm font-semibold text-secondary mb-2">
                  {{ t(formNs('rating.label')) }}
                </label>
                <BaseSelect :id="ratingFieldId" v-model="form.rating">
                  <option value="">
                    {{ t(formNs('rating.placeholder')) }}
                  </option>
                  <option value="5">
                    {{ t(formNs('rating.excellent')) }}
                  </option>
                  <option value="4">{{ t(formNs('rating.good')) }}</option>
                  <option value="3">
                    {{ t(formNs('rating.satisfactory')) }}
                  </option>
                  <option value="2">{{ t(formNs('rating.poor')) }}</option>
                  <option value="1">
                    {{ t(formNs('rating.veryPoor')) }}
                  </option>
                </BaseSelect>
                <p v-if="ratingError" class="mt-1 text-sm text-red-600">
                  {{ ratingError }}
                </p>
              </div>

              <!-- Contact -->
              <div>
                <label
                  :for="contactFieldId"
                  class="block text-sm font-semibold text-secondary mb-2"
                >
                  {{ t(formNs('contact.label')) }}
                </label>
                <BaseTextField
                  :id="contactFieldId"
                  v-model="form.contact"
                  type="text"
                  :placeholder="t(formNs('contact.placeholder'))"
                  icon="mdi:email"
                />
              </div>
            </div>

            <!-- Review Text -->
            <div>
              <label class="block text-sm font-semibold text-secondary mb-2" :for="reviewFieldId">
                {{ t(formNs('review.label')) }}
              </label>
              <textarea
                :id="reviewFieldId"
                v-model="form.review"
                name="review"
                rows="6"
                :placeholder="t(formNs('review.placeholder'))"
                :class="[
                  'w-full px-4 py-3 bg-white border border-gray-300 rounded-xl',
                  'focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none',
                  'font-medium text-secondary placeholder-gray-400 transition-all duration-200 resize-none',
                  reviewError ? 'border-red-300 focus:ring-red-500 focus:border-red-300' : '',
                ]"
              />
              <p v-if="reviewError" class="mt-1 text-sm text-red-600">
                {{ reviewError }}
              </p>
            </div>

            <!-- Helpful aspects -->
            <fieldset class="p-0 m-0 border-0">
              <legend class="block text-sm font-semibold text-secondary mb-4">
                {{ t(formNs('helpful.label')) }}
              </legend>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                <BaseCheckbox
                  v-for="aspect in helpfulAspects"
                  :key="aspect"
                  :checked="form.helpfulAspects.includes(aspect)"
                  @update:checked="toggleHelpful(aspect)"
                >
                  {{ t(helpfulAspectKeys[aspect]) }}
                </BaseCheckbox>
              </div>
            </fieldset>

            <!-- Recommendation -->
            <fieldset class="p-0 m-0 border-0">
              <legend class="block text-sm font-semibold text-secondary mb-4">
                {{ t(formNs('recommend.label')) }}
              </legend>
              <div class="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-6">
                <label
                  class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    v-model="form.recommendation"
                    type="radio"
                    name="recommend"
                    value="yes"
                    class="text-primary focus:ring-primary"
                  />
                  <span class="text-secondary text-sm md:text-base">{{
                    t(formNs('recommend.yes'))
                  }}</span>
                </label>
                <label
                  class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    v-model="form.recommendation"
                    type="radio"
                    name="recommend"
                    value="maybe"
                    class="text-primary focus:ring-primary"
                  />
                  <span class="text-secondary text-sm md:text-base">{{
                    t(formNs('recommend.maybe'))
                  }}</span>
                </label>
                <label
                  class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    v-model="form.recommendation"
                    type="radio"
                    name="recommend"
                    value="no"
                    class="text-primary focus:ring-primary"
                  />
                  <span class="text-secondary text-sm md:text-base">{{
                    t(formNs('recommend.no'))
                  }}</span>
                </label>
              </div>
            </fieldset>

            <!-- Submit Button -->
            <div class="flex justify-center pt-4 md:pt-6">
              <button
                type="submit"
                :disabled="isSubmitting"
                class="w-full md:w-auto bg-primary text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                @click.prevent="submitReview"
              >
                {{
                  isSubmitting
                    ? t(formNs('submitting'))
                    : t(formNs('submit'))
                }}
              </button>
            </div>
          </form>
        </div>

        <!-- Success message -->
        <div
          v-if="submitted"
          class="mt-6 md:mt-8 bg-green-50 border border-green-200 rounded-xl p-4 md:p-6 text-center"
        >
          <Icon name="mdi:check-circle" class="text-green-500 text-3xl md:text-4xl mb-3 md:mb-4" />
          <h3 class="text-lg md:text-xl font-bold text-green-800 mb-2">
            {{ t(ns('success.title')) }}
          </h3>
          <p class="text-sm md:text-base text-green-700">
            {{ t(ns('success.message')) }}
          </p>
        </div>

        <!-- Error message -->
        <div
          v-if="submissionError"
          class="mt-6 md:mt-8 bg-red-50 border border-red-200 rounded-xl p-4 md:p-6 text-center"
        >
          <Icon name="mdi:alert-circle" class="text-red-500 text-3xl md:text-4xl mb-3 md:mb-4" />
          <h3 class="text-lg md:text-xl font-bold text-red-800 mb-2">
            {{ t(ns('error.title')) }}
          </h3>
          <p class="text-sm md:text-base text-red-700">
            {{ submissionError }}
          </p>
          <button
            class="mt-4 text-red-600 hover:text-red-800 font-semibold"
            @click="submissionError = ''"
          >
            {{ t(ns('error.dismiss')) }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { parsePositiveInt } from '~~/lib/utils/number'
import type { UserType } from '@prisma/client'
import { useFormSubmit } from '~/composables/useFormSubmit'
import { namespace } from '~~/lib/i18n'
import { storeToRefs } from 'pinia'
import { useUniversitiesStore } from '~/stores/universities'

const { t } = useI18n()
const ns = namespace('reviews.shareExperience')
const formNs = namespace('reviews.shareExperience.form')
const universitiesStore = useUniversitiesStore()
const { universities: storeUniversities, loading: storeLoading } = storeToRefs(universitiesStore)

const nameFieldId = useId()
const reviewerTypeFieldId = useId()
const universityFieldId = useId()
const facultyFieldId = useId()
const yearFieldId = useId()
const ratingFieldId = useId()
const contactFieldId = useId()
const reviewFieldId = useId()

interface ReviewForm {
  name: string
  university: string
  faculty: string
  year: string
  rating: string
  contact: string
  review: string
  helpfulAspects: string[]
  recommendation: string
  reviewerType: UserType | ''
}

const form = reactive<ReviewForm>({
  name: '',
  university: '',
  faculty: '',
  year: '',
  rating: '',
  contact: '',
  review: '',
  helpfulAspects: [],
  recommendation: '',
  reviewerType: '',
})

const {
  isSubmitting,
  getFieldError,
  clearAllErrors,
  submit,
} = useFormSubmit()

const nameError = computed(() => getFieldError('name'))
const universityError = computed(() => getFieldError('university'))
const ratingError = computed(() => getFieldError('rating'))
const reviewError = computed(() => getFieldError('review'))

const submitted = ref(false)
const submissionError = ref('')

// Use store universities with computed for reactivity
const universities = computed(() =>
  storeUniversities.value.map((uni) => ({
    id: uni.id,
    title: uni.title,
  })),
)
const isLoadingUniversities = computed(() => storeLoading.value)

const helpfulAspectKeys = {
  documents: formNs('helpful.aspects.documents'),
  language: formNs('helpful.aspects.language'),
  'exam-prep': formNs('helpful.aspects.exam-prep'),
  'university-choice': formNs('helpful.aspects.university-choice'),
  visa: formNs('helpful.aspects.visa'),
  accommodation: formNs('helpful.aspects.accommodation'),
  support: formNs('helpful.aspects.support'),
  consultation: formNs('helpful.aspects.consultation'),
} as const

const helpfulAspects = Object.keys(helpfulAspectKeys) as (keyof typeof helpfulAspectKeys)[]

function toggleHelpful(value: string) {
  const index = form.helpfulAspects.indexOf(value)
  if (index > -1) {
    form.helpfulAspects.splice(index, 1)
  } else {
    form.helpfulAspects.push(value)
  }
}

onMounted(async () => {
  await universitiesStore.fetchUniversities({ limit: 100, overrides: { sort: 'alpha' } as any })
})

async function submitReview() {
  submissionError.value = ''

  await submit({
    submitFn: async () => {
      const numericYear = form.year && /^\d{4}$/.test(form.year) ? form.year : undefined
      const reviewData = {
        name: form.name.trim(),
        university: form.university,
        faculty: form.faculty.trim() || undefined,
        year: numericYear,
        rating: parsePositiveInt(form.rating) ?? 0,
        contact: form.contact.trim() || undefined,
        review: form.review.trim(),
        helpfulAspects: form.helpfulAspects.length > 0 ? form.helpfulAspects : undefined,
        recommendation: form.recommendation || undefined,
        type: (form.reviewerType || 'student') as UserType,
      }

      return await ($fetch as typeof $fetch<{ success: boolean }>)('/api/v1/reviews', {
        method: 'POST',
        body: reviewData,
      })
    },
    onSuccess: () => {
      submitted.value = true

      setTimeout(() => {
        Object.assign(form, {
          name: '',
          university: '',
          faculty: '',
          year: '',
          rating: '',
          contact: '',
          review: '',
          helpfulAspects: [],
          recommendation: '',
          reviewerType: '',
        })
        clearAllErrors()
        submitted.value = false
      }, 3000)
    },
    onError: (error: any) => {
      submissionError.value = error?.data?.message || t(ns('errors.generic'))
    },
  })
}
</script>
