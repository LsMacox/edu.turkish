<template>
  <BaseSection padding="lg" bg="primary-gradient" max-width="4xl">
        <div class="text-center mb-component-lg">
          <h2 class="text-hero mb-component-md text-white">
            {{ t(ns('title'), { universityName: university.title }) }}
          </h2>
          <p class="text-hero-subtitle text-white/90">
            {{ t(ns('subtitle')) }}
          </p>
        </div>

        <BaseCard padding="xl" shadow="xl" rounded="2xl">
          <form
            id="university-cta-form"
            class="space-component-lg"
            @submit.prevent="submitApplication"
          >
            <div class="grid md:grid-cols-2 gap-component-lg">
              <div>
                <label class="block text-label mb-label" :for="nameFieldId">
                  {{ t(ns('form.name_label')) }}
                </label>
                <BaseTextField
                  :id="nameFieldId"
                  v-model="form.name"
                  name="name"
                  type="text"
                  :placeholder="t(ns('form.name_placeholder'))"
                  :error="nameError"
                />
              </div>
              <div>
                <label class="block text-label mb-label" :for="phoneFieldId">
                  {{ t(ns('form.phone_label')) }}
                </label>
                <BaseTextField
                  :id="phoneFieldId"
                  v-model="form.phone"
                  name="phone"
                  type="tel"
                  required
                  :placeholder="t(ns('form.phone_placeholder'))"
                  autocomplete="tel"
                  :maxlength="18"
                  :error="phoneError"
                  @input="onPhoneInput"
                  @keydown="onPhoneKeydown"
                />
              </div>
            </div>

            <div>
              <label class="block text-label mb-label" :for="emailFieldId">
                {{ t(ns('form.email_label')) }}
              </label>
              <BaseTextField
                :id="emailFieldId"
                v-model="form.email"
                name="email"
                type="email"
                :placeholder="t(ns('form.email_placeholder'))"
                :error="emailError"
              />
            </div>

            <div class="grid md:grid-cols-2 gap-component-lg">
              <div>
                <label
                  class="block text-label mb-label"
                  :for="programFieldId"
                >
                  {{ t(ns('form.program_label')) }} *
                </label>
                <BaseSelect
                  :id="programFieldId"
                  v-model="form.program"
                  name="program"
                  required
                  :error="programError"
                >
                  <option value="">{{ t(ns('form.program_placeholder')) }}</option>
                  <option
                    v-for="(program, index) in availablePrograms"
                    :key="`${index}-${program}`"
                    :value="program"
                  >
                    {{ program }}
                  </option>
                  <option value="other">{{ t(ns('form.program_other')) }}</option>
                </BaseSelect>
              </div>
              <div>
                <label class="block text-label mb-label" :for="levelFieldId">
                  {{ t(ns('form.level_label')) }}
                </label>
                <BaseSelect :id="levelFieldId" v-model="form.level" name="level">
                  <option value="bachelor">{{ t(ns('form.level_bachelor')) }}</option>
                  <option value="master">{{ t(ns('form.level_master')) }}</option>
                </BaseSelect>
              </div>
            </div>

            <div>
              <label class="block text-label mb-label" :for="commentFieldId">
                {{ t(ns('form.comment_label')) }}
              </label>
              <BaseTextarea
                :id="commentFieldId"
                v-model="form.comment"
                name="comment"
                :rows="4"
                :placeholder="t(ns('form.comment_placeholder'))"
                :error="commentError"
              />
            </div>

            <BaseCheckbox v-model="form.privacyAgreed">
              {{ t(ns('form.privacy_agreement')) }}
            </BaseCheckbox>

            <div class="text-center">
              <BaseButton
                type="submit"
                variant="primary"
                size="lg"
                :loading="isSubmitting"
                :disabled="isSubmitting || !form.privacyAgreed"
                class="shadow-card hover:scale-105 transition-transform"
              >
                {{ isSubmitting ? t(ns('form.submitting')) : t(ns('form.submit_button')) }}
              </BaseButton>
              <p class="text-body-sm text-meta mt-component-sm">
                {{ t(ns('form.response_time')) }}
              </p>
            </div>
          </form>
        </BaseCard>
  </BaseSection>
</template>

<script setup lang="ts">
import type { UniversityDetail } from '~~/lib/types'
import { useApplicationForm } from '~/composables/useUniversityApplicationForm'
import { namespace } from '~~/lib/i18n'

const ns = namespace('applicationCTA')

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
