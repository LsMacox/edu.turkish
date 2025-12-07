<template>
  <section class="py-20 bg-gradient-to-r from-primary to-red-600">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12 text-white">
          <h2 class="text-4xl lg:text-5xl font-bold mb-6">
            {{ t('applicationCTA.title', { universityName: university.title }) }}
          </h2>
          <p class="text-xl opacity-90">
            {{ t('applicationCTA.subtitle') }}
          </p>
        </div>

        <div class="bg-white rounded-2xl shadow-2xl p-8 lg:p-12">
          <form class="space-y-6" @submit.prevent="submitApplication">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-secondary mb-2" :for="nameFieldId">
                  {{ t('applicationCTA.form.name_label') }}
                </label>
                <BaseTextField
                  :id="nameFieldId"
                  v-model="form.name"
                  name="name"
                  type="text"
                  :placeholder="t('applicationCTA.form.name_placeholder')"
                  :error="nameError"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-secondary mb-2" :for="phoneFieldId">
                  {{ t('applicationCTA.form.phone_label') }}
                </label>
                <div class="relative">
                  <input
                    :id="phoneFieldId"
                    v-model="form.phone"
                    name="phone"
                    type="tel"
                    required
                    :placeholder="t('applicationCTA.form.phone_placeholder')"
                    inputmode="tel"
                    autocomplete="tel"
                    maxlength="18"
                    :class="[
                      'w-full px-4 py-3 bg-white rounded-xl focus:outline-none font-medium text-secondary placeholder-gray-400 transition-all duration-200',
                      phoneError
                        ? 'border border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                        : 'border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent',
                    ]"
                    :aria-invalid="!!phoneError"
                    @input="onPhoneInput"
                    @keydown="onPhoneKeydown"
                  />
                </div>
                <p v-if="phoneError" class="mt-2 text-sm text-red-600">{{ phoneError }}</p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-secondary mb-2" :for="emailFieldId">
                {{ t('applicationCTA.form.email_label') }}
              </label>
              <BaseTextField
                :id="emailFieldId"
                v-model="form.email"
                name="email"
                type="email"
                :placeholder="t('applicationCTA.form.email_placeholder')"
                :error="emailError"
              />
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  class="block text-sm font-semibold text-secondary mb-2"
                  :for="programFieldId"
                >
                  {{ t('applicationCTA.form.program_label') }} *
                </label>
                <BaseSelect
                  :id="programFieldId"
                  v-model="form.program"
                  name="program"
                  required
                  :error="programError"
                >
                  <option value="">{{ t('applicationCTA.form.program_placeholder') }}</option>
                  <option
                    v-for="(program, index) in availablePrograms"
                    :key="`${index}-${program}`"
                    :value="program"
                  >
                    {{ program }}
                  </option>
                  <option value="other">{{ t('applicationCTA.form.program_other') }}</option>
                </BaseSelect>
              </div>
              <div>
                <label class="block text-sm font-semibold text-secondary mb-2" :for="levelFieldId">
                  {{ t('applicationCTA.form.level_label') }}
                </label>
                <BaseSelect :id="levelFieldId" v-model="form.level" name="level">
                  <option value="bachelor">{{ t('applicationCTA.form.level_bachelor') }}</option>
                  <option value="master">{{ t('applicationCTA.form.level_master') }}</option>
                </BaseSelect>
              </div>
            </div>

            <div>
              <label class="block text-sm font-semibold text-secondary mb-2" :for="commentFieldId">
                {{ t('applicationCTA.form.comment_label') }}
              </label>
              <textarea
                :id="commentFieldId"
                v-model="form.comment"
                name="comment"
                rows="4"
                :class="[
                  'w-full px-4 py-3 bg-white rounded-xl focus:outline-none font-medium text-secondary placeholder-gray-400 transition-all duration-200 resize-none',
                  commentError
                    ? 'border border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    : 'border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent',
                ]"
                :aria-invalid="!!commentError"
                :placeholder="t('applicationCTA.form.comment_placeholder')"
              ></textarea>
              <p v-if="commentError" class="mt-2 text-sm text-red-600">{{ commentError }}</p>
            </div>

            <BaseCheckbox
              :checked="form.privacyAgreed"
              @update:checked="form.privacyAgreed = $event"
            >
              {{ t('applicationCTA.form.privacy_agreement') }}
            </BaseCheckbox>

            <div class="text-center">
              <button
                type="submit"
                :disabled="isSubmitting || !form.privacyAgreed"
                class="bg-primary text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none"
              >
                <span v-if="!isSubmitting">{{ t('applicationCTA.form.submit_button') }}</span>
                <span v-else class="flex items-center justify-center space-x-2">
                  <Icon name="ph:spinner" class="animate-spin" />
                  <span>{{ t('applicationCTA.form.submitting') }}</span>
                </span>
              </button>
              <p class="text-sm text-gray-500 mt-3">
                {{ t('applicationCTA.form.response_time') }}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { UniversityDetail } from '~~/server/types/api/universities'
import { useApplicationForm } from '~/composables/universities/useApplicationForm'

const nameFieldId = useId()
const phoneFieldId = useId()
const emailFieldId = useId()
const programFieldId = useId()
const levelFieldId = useId()
const commentFieldId = useId()

interface Props {
  university: UniversityDetail
}

const props = defineProps<Props>()
const { t } = useI18n()

const {
  form,
  isSubmitting,
  onPhoneInput,
  onPhoneKeydown,
  fieldErrors,
  availablePrograms,
  submitApplication,
} = useApplicationForm({
  university: toRef(props, 'university'),
  source: 'university_detail',
})

// Destructure field errors for template convenience
const nameError = fieldErrors.name
const phoneError = fieldErrors.phone
const emailError = fieldErrors.email
const programError = fieldErrors.program
const commentError = fieldErrors.comment
</script>
