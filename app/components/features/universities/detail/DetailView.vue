<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <section class="relative h-[600px] gradient-placeholder-media">
      <div class="absolute inset-0">
        <NuxtImg
          class="w-full h-full object-cover opacity-20"
          :src="heroImageSrc"
          :alt="`${university.title} campus`"
          loading="eager"
          decoding="async"
          format="webp"
        />
      </div>
      <div class="relative z-10 container mx-auto container-padding h-full flex items-center">
        <div class="max-w-4xl">
          <div class="mb-component-lg">
            <div
              class="inline-flex items-center gap-component-xs bg-white rounded-badge badge-padding-lg shadow-button"
            >
              <BaseStatusBadge icon="ph:building" color="info" size="md" />
              <span class="text-body-sm font-medium text-secondary">{{ typeText }}</span>
            </div>
          </div>

          <h1 class="text-hero mb-component-lg">
            {{ university.title }}
          </h1>

          <p class="text-hero-subtitle mb-component-lg max-w-2xl">
            {{ university.description }}
          </p>

          <div class="flex flex-col sm:flex-row gap-component-md">
            <BaseButton
              variant="primary"
              size="lg"
              class="shadow-card w-full sm:w-auto"
              @click="handleApplyClick"
            >
              {{ t(ns('applyButton')) }}
            </BaseButton>
            <BaseButton
              variant="whatsapp-cta"
              :href="whatsapp.href"
              rel="noopener noreferrer nofollow"
              target="_blank"
              icon="ph:whatsapp-logo"
              size="lg"
              no-focus-ring
              class="w-full sm:w-auto"
              @click.prevent="handleWhatsappClick"
            >
              {{ t(ns('whatsappButton')) }}
            </BaseButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Information Section -->
    <UniversitiesDetailKeyInfoSection :university="university" />

    <!-- About University Section -->
    <UniversitiesDetailAboutSection :university="university" />

    <!-- Academic Programs Section -->
    <UniversitiesDetailAcademicProgramsSection :programs="university.programs" />

    <!-- Admission Requirements Section -->
    <UniversitiesDetailAdmissionRequirementsSection :admission="university.admission" />

    <!-- Campus Life Section -->
    <UniversitiesDetailCampusLifeSection :university="university" />

    <!-- FAQ Section -->
    <UniversitiesDetailFAQSection :key="locale" />

    <!-- Application CTA Section -->
    <UniversitiesDetailApplicationCTASection :university="university" />
  </div>
</template>

<script setup lang="ts">
import type { UniversityDetail } from '~~/lib/types'
import { useContactChannels } from '~/composables/useContactChannels'
import { useFingerprint } from '~/composables/useFingerprint'
import { useUniversity } from '~/composables/useUniversityHelpers'
import { namespace } from '~~/lib/i18n'

interface Props {
  university: UniversityDetail
}

const props = defineProps<Props>()
const { t, locale } = useI18n()
const ns = namespace('universities.detail')
const { getTypeLabel } = useUniversity()

const heroImageSrc = computed(() => props.university.heroImage || props.university.image)

const typeText = computed(() => getTypeLabel(props.university.type))

const { openModal: openApplicationModal } = useApplicationModal()

const { getChannel } = useContactChannels()
const whatsapp = getChannel('whatsapp')

const { openWithFingerprint } = useFingerprint()

const handleApplyClick = () => {
  openApplicationModal({
    source: 'university_detail',
    description: `Заявка с детальной страницы университета: ${props.university.title}`,
    universityName: props.university.title,
  })
}

const handleWhatsappClick = () => openWithFingerprint(whatsapp.value.href, '_blank')
</script>
