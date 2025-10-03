<template>
  <section id="share-experience" class="section-py bg-white">
    <div class="container mx-auto container-padding-narrow">
      <div class="text-center mb-8 md:mb-12">
        <h2 class="text-section-title mb-6">
          {{ $t('reviews.shareExperience.title') }}
          <span class="text-primary">{{ $t('reviews.shareExperience.titleAccent') }}</span>
        </h2>
        <p class="text-section-subtitle max-w-3xl mx-auto">
          {{ $t('reviews.shareExperience.description') }}
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
                <label class="block text-sm font-semibold text-secondary mb-2">
                  {{ $t('reviews.shareExperience.form.name.label') }}
                </label>
                <BaseTextField
                  v-model="form.name"
                  type="text"
                  :placeholder="$t('reviews.shareExperience.form.name.placeholder')"
                  :error="errors.name"
                  icon="mdi:account"
                />
              </div>

              <!-- Reviewer Type -->
              <div>
                <label class="block text-sm font-semibold text-secondary mb-2">
                  {{ $t('reviews.shareExperience.form.reviewerType.label') }}
                </label>
                <BaseSelect v-model="form.reviewerType">
                  <option value="">
                    {{ $t('reviews.shareExperience.form.reviewerType.placeholder') }}
                  </option>
                  <option value="student">
                    {{ $t('reviews.shareExperience.form.reviewerType.student') }}
                  </option>
                  <option value="parent">
                    {{ $t('reviews.shareExperience.form.reviewerType.parent') }}
                  </option>
                </BaseSelect>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <!-- University -->
              <div>
                <label class="block text-sm font-semibold text-secondary mb-2">
                  {{ $t('reviews.shareExperience.form.university.label') }}
                </label>
                <BaseSelect v-model="form.university" :disabled="isLoadingUniversities">
                  <option value="">
                    {{
                      isLoadingUniversities
                        ? $t('reviews.shareExperience.form.university.loading')
                        : $t('reviews.shareExperience.form.university.placeholder')
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
                    {{ $t('reviews.shareExperience.form.university.other') }}
                  </option>
                </BaseSelect>
                <p v-if="errors.university" class="mt-1 text-sm text-red-600">
                  {{ errors.university }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <!-- Faculty -->
              <div>
                <label class="block text-sm font-semibold text-secondary mb-2">
                  {{ $t('reviews.shareExperience.form.faculty.label') }}
                </label>
                <BaseTextField
                  v-model="form.faculty"
                  type="text"
                  :placeholder="$t('reviews.shareExperience.form.faculty.placeholder')"
                  icon="mdi:school"
                />
              </div>

              <!-- Year -->
              <div>
                <label class="block text-sm font-semibold text-secondary mb-2">
                  {{ $t('reviews.shareExperience.form.year.label') }}
                </label>
                <BaseSelect v-model="form.year">
                  <option value="">
                    {{ $t('reviews.shareExperience.form.year.placeholder') }}
                  </option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                  <option value="other">
                    {{ $t('reviews.shareExperience.form.year.earlier') }}
                  </option>
                </BaseSelect>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <!-- Rating -->
              <div>
                <label class="block text-sm font-semibold text-secondary mb-2">
                  {{ $t('reviews.shareExperience.form.rating.label') }}
                </label>
                <BaseSelect v-model="form.rating">
                  <option value="">
                    {{ $t('reviews.shareExperience.form.rating.placeholder') }}
                  </option>
                  <option value="5">
                    {{ $t('reviews.shareExperience.form.rating.excellent') }}
                  </option>
                  <option value="4">{{ $t('reviews.shareExperience.form.rating.good') }}</option>
                  <option value="3">
                    {{ $t('reviews.shareExperience.form.rating.satisfactory') }}
                  </option>
                  <option value="2">{{ $t('reviews.shareExperience.form.rating.poor') }}</option>
                  <option value="1">
                    {{ $t('reviews.shareExperience.form.rating.veryPoor') }}
                  </option>
                </BaseSelect>
                <p v-if="errors.rating" class="mt-1 text-sm text-red-600">
                  {{ errors.rating }}
                </p>
              </div>

              <!-- Contact -->
              <div>
                <label class="block text-sm font-semibold text-secondary mb-2">
                  {{ $t('reviews.shareExperience.form.contact.label') }}
                </label>
                <BaseTextField
                  v-model="form.contact"
                  type="text"
                  :placeholder="$t('reviews.shareExperience.form.contact.placeholder')"
                  icon="mdi:email"
                />
              </div>
            </div>

            <!-- Review Text -->
            <div>
              <label class="block text-sm font-semibold text-secondary mb-2">
                {{ $t('reviews.shareExperience.form.review.label') }}
              </label>
              <textarea
                v-model="form.review"
                rows="6"
                :placeholder="$t('reviews.shareExperience.form.review.placeholder')"
                :class="[
                  'w-full px-4 py-3 bg-white border border-gray-300 rounded-xl',
                  'focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none',
                  'font-medium text-secondary placeholder-gray-400 transition-all duration-200 resize-none',
                  errors.review ? 'border-red-300 focus:ring-red-500 focus:border-red-300' : '',
                ]"
              />
              <p v-if="errors.review" class="mt-1 text-sm text-red-600">
                {{ errors.review }}
              </p>
            </div>

            <!-- Helpful aspects -->
            <div>
              <label class="block text-sm font-semibold text-secondary mb-4">
                {{ $t('reviews.shareExperience.form.helpful.label') }}
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                <BaseCheckbox
                  v-for="aspect in helpfulAspects"
                  :key="aspect.value"
                  :checked="form.helpful.includes(aspect.value)"
                  @update:checked="toggleHelpful(aspect.value)"
                >
                  {{ $t(`reviews.shareExperience.form.helpful.aspects.${aspect.value}`) }}
                </BaseCheckbox>
              </div>
            </div>

            <!-- Recommendation -->
            <div>
              <label class="block text-sm font-semibold text-secondary mb-4">
                {{ $t('reviews.shareExperience.form.recommend.label') }}
              </label>
              <div class="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-6">
                <label
                  class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    v-model="form.recommend"
                    type="radio"
                    name="recommend"
                    value="yes"
                    class="text-primary focus:ring-primary"
                  />
                  <span class="text-secondary text-sm md:text-base">{{
                    $t('reviews.shareExperience.form.recommend.yes')
                  }}</span>
                </label>
                <label
                  class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    v-model="form.recommend"
                    type="radio"
                    name="recommend"
                    value="maybe"
                    class="text-primary focus:ring-primary"
                  />
                  <span class="text-secondary text-sm md:text-base">{{
                    $t('reviews.shareExperience.form.recommend.maybe')
                  }}</span>
                </label>
                <label
                  class="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <input
                    v-model="form.recommend"
                    type="radio"
                    name="recommend"
                    value="no"
                    class="text-primary focus:ring-primary"
                  />
                  <span class="text-secondary text-sm md:text-base">{{
                    $t('reviews.shareExperience.form.recommend.no')
                  }}</span>
                </label>
              </div>
            </div>

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
                    ? $t('reviews.shareExperience.form.submitting')
                    : $t('reviews.shareExperience.form.submit')
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
            {{ $t('reviews.shareExperience.success.title') }}
          </h3>
          <p class="text-sm md:text-base text-green-700">
            {{ $t('reviews.shareExperience.success.message') }}
          </p>
        </div>

        <!-- Error message -->
        <div
          v-if="submissionError"
          class="mt-6 md:mt-8 bg-red-50 border border-red-200 rounded-xl p-4 md:p-6 text-center"
        >
          <Icon name="mdi:alert-circle" class="text-red-500 text-3xl md:text-4xl mb-3 md:mb-4" />
          <h3 class="text-lg md:text-xl font-bold text-red-800 mb-2">
            {{ $t('reviews.shareExperience.error.title') }}
          </h3>
          <p class="text-sm md:text-base text-red-700">
            {{ submissionError }}
          </p>
          <button
            class="mt-4 text-red-600 hover:text-red-800 font-semibold"
            @click="submissionError = ''"
          >
            {{ $t('reviews.shareExperience.error.dismiss') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { UserType } from '../../../../types/domain'
interface ReviewForm {
  name: string
  university: string
  faculty: string
  year: string
  rating: string
  contact: string
  review: string
  helpful: string[]
  recommend: string
  reviewerType: UserType | ''
}

interface University {
  id: number
  title: string
}

const form = reactive<ReviewForm>({
  name: '',
  university: '',
  faculty: '',
  year: '',
  rating: '',
  contact: '',
  review: '',
  helpful: [],
  recommend: '',
  reviewerType: '',
})

const errors = reactive({
  name: '',
  university: '',
  rating: '',
  review: '',
})

const isSubmitting = ref(false)
const submitted = ref(false)
const submissionError = ref('')
const universities = ref<University[]>([])
const isLoadingUniversities = ref(true)

const helpfulAspects = [
  { value: 'documents' },
  { value: 'language' },
  { value: 'exam-prep' },
  { value: 'university-choice' },
  { value: 'visa' },
  { value: 'accommodation' },
  { value: 'support' },
  { value: 'consultation' },
]

function toggleHelpful(value: string) {
  const index = form.helpful.indexOf(value)
  if (index > -1) {
    form.helpful.splice(index, 1)
  } else {
    form.helpful.push(value)
  }
}

const { t } = useI18n()

// Load universities on component mount
onMounted(async () => {
  try {
    const { data } = await $fetch('/api/v1/universities', {
      query: { limit: 100, sort: 'alpha' },
    })
    universities.value = data.map((uni: any) => ({
      id: uni.id,
      title: uni.title,
    }))
  } catch (error) {
    console.error('Failed to load universities:', error)
  } finally {
    isLoadingUniversities.value = false
  }
})

function validateForm(): boolean {
  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  if (!form.name.trim()) {
    errors.name = t('reviews.shareExperience.validation.nameRequired')
    isValid = false
  }

  if (!form.university) {
    errors.university = t('reviews.shareExperience.validation.universityRequired')
    isValid = false
  }

  if (!form.rating) {
    errors.rating = t('reviews.shareExperience.validation.ratingRequired')
    isValid = false
  }

  if (!form.review.trim() || form.review.trim().length < 50) {
    errors.review = t('reviews.shareExperience.validation.reviewRequired')
    isValid = false
  }

  return isValid
}

async function submitReview() {
  if (!validateForm()) {
    submissionError.value = t('reviews.shareExperience.errors.validation')
    return
  }

  isSubmitting.value = true
  submissionError.value = ''

  try {
    // Prepare data for API
    const numericYear = form.year && /^\d{4}$/.test(form.year) ? form.year : undefined
    const reviewData = {
      name: form.name.trim(),
      university: form.university,
      faculty: form.faculty.trim() || undefined,
      year: numericYear,
      rating: parseInt(form.rating),
      contact: form.contact.trim() || undefined,
      review: form.review.trim(),
      helpful: form.helpful.length > 0 ? form.helpful : undefined,
      recommend: form.recommend || undefined,
      type: (form.reviewerType || 'student') as UserType,
    }

    // Submit to API
    const data = await $fetch('/api/v1/reviews', {
      method: 'POST',
      body: reviewData,
    })

    if (data.success) {
      submitted.value = true

      // Reset form after successful submission
      setTimeout(() => {
        Object.assign(form, {
          name: '',
          university: '',
          faculty: '',
          year: '',
          rating: '',
          contact: '',
          review: '',
          helpful: [],
          recommend: '',
          reviewerType: '',
        })
        submitted.value = false
      }, 5000)
    } else {
      throw new Error(data.message || 'Failed to submit review')
    }
  } catch (error: any) {
    console.error('Error submitting review:', error)

    // Handle validation errors
    if (error.statusCode === 400) {
      submissionError.value = t('reviews.shareExperience.errors.validation')
    } else {
      submissionError.value = error.data?.message || t('reviews.shareExperience.errors.generic')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>
