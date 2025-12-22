<template>
  <BaseSection id="share-experience" bg="white">
      <BaseSectionHeader
        :subtitle="t(ns('description'))"
        align="center"
        max-width="full"
      >
        <template #title>
          {{ t(ns('title')) }}
          <span class="text-primary">{{ t(ns('titleAccent')) }}</span>
        </template>
      </BaseSectionHeader>

      <div class="max-w-4xl mx-auto">
        <div
          class="gradient-placeholder-media rounded-card-lg card-padding-xl shadow-elevated"
        >
          <form class="space-component-xl" @submit.prevent.stop="submitReview">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-component-lg">
              <!-- Name -->
              <div>
                <label :for="nameFieldId" class="block text-label mb-label">
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
                  class="block text-label mb-label"
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

            <div class="grid grid-cols-1 md:grid-cols-2 gap-component-lg">
              <!-- University -->
              <div>
                <label
                  :for="universityFieldId"
                  class="block text-label mb-label"
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
                <p v-if="universityError" class="mt-inline-sm text-body-sm text-error">
                  {{ universityError }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-component-lg">
              <!-- Faculty -->
              <div>
                <label
                  :for="facultyFieldId"
                  class="block text-label mb-label"
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
                <label :for="yearFieldId" class="block text-label mb-label">
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

            <div class="grid grid-cols-1 md:grid-cols-2 gap-component-lg">
              <!-- Rating -->
              <div>
                <label :for="ratingFieldId" class="block text-label mb-label">
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
                <p v-if="ratingError" class="mt-inline-sm text-body-sm text-error">
                  {{ ratingError }}
                </p>
              </div>

              <!-- Contact -->
              <div>
                <label
                  :for="contactFieldId"
                  class="block text-label mb-label"
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
              <label class="block text-label mb-label" :for="reviewFieldId">
                {{ t(formNs('review.label')) }}
              </label>
              <BaseTextarea
                :id="reviewFieldId"
                v-model="form.review"
                name="review"
                :rows="6"
                :placeholder="t(formNs('review.placeholder'))"
                :error="reviewError"
              />
            </div>

            <!-- Helpful aspects -->
            <fieldset class="p-0 m-0 border-0">
              <legend class="block text-label mb-component-sm">
                {{ t(formNs('helpful.label')) }}
              </legend>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-component-sm">
                <BaseCheckbox
                  v-for="aspect in helpfulAspects"
                  :key="aspect"
                  :model-value="form.helpfulAspects.includes(aspect)"
                  @update:model-value="toggleHelpful(aspect)"
                >
                  {{ t(helpfulAspectKeys[aspect]) }}
                </BaseCheckbox>
              </div>
            </fieldset>

            <!-- Recommendation -->
            <fieldset class="p-0 m-0 border-0">
              <legend class="block text-label mb-component-sm">
                {{ t(formNs('recommend.label')) }}
              </legend>
              <div class="flex flex-col space-component-sm md:flex-row md:space-y-0 md:gap-component-lg">
                <BaseRadio v-model="form.recommendation" name="recommend" value="yes">
                  {{ t(formNs('recommend.yes')) }}
                </BaseRadio>
                <BaseRadio v-model="form.recommendation" name="recommend" value="maybe">
                  {{ t(formNs('recommend.maybe')) }}
                </BaseRadio>
                <BaseRadio v-model="form.recommendation" name="recommend" value="no">
                  {{ t(formNs('recommend.no')) }}
                </BaseRadio>
              </div>
            </fieldset>

            <!-- Submit Button -->
            <div class="flex justify-center pt-component-sm">
              <BaseButton
                type="submit"
                variant="primary"
                size="md"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                full-width
                class="md:w-auto md:!px-8 shadow-card max-w-md"
                @click.prevent="submitReview"
              >
                {{
                  isSubmitting
                    ? t(formNs('submitting'))
                    : t(formNs('submit'))
                }}
              </BaseButton>
            </div>
          </form>
        </div>

        <!-- Success message -->
        <BaseAlert
          v-if="submitted"
          variant="success"
          :title="t(ns('success.title'))"
          icon="mdi:check-circle"
          class="mt-component-md text-center"
        >
          {{ t(ns('success.message')) }}
        </BaseAlert>

        <!-- Error message -->
        <BaseAlert
          v-if="submissionError"
          variant="warning"
          :title="t(ns('error.title'))"
          icon="mdi:alert-circle"
          class="mt-component-md text-center"
        >
          {{ submissionError }}
          <BaseButton
            variant="link"
            class="mt-component-sm text-error hover:text-error-dark font-semibold"
            @click="submissionError = ''"
          >
            {{ t(ns('error.dismiss')) }}
          </BaseButton>
        </BaseAlert>
      </div>
  </BaseSection>
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
