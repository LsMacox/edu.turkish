<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <section class="relative h-[600px] bg-gradient-to-br from-blue-50 to-purple-50">
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
      <div class="relative z-10 container mx-auto px-4 lg:px-6 h-full flex items-center">
        <div class="max-w-4xl">
          <div class="mb-6">
            <div
              class="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm"
            >
              <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Icon name="ph:building" class="text-white text-sm" />
              </div>
              <span class="text-sm font-medium text-secondary">{{ typeText }}</span>
            </div>
          </div>

          <h1 class="text-4xl lg:text-6xl font-bold text-secondary mb-6">
            {{ university.title }}
          </h1>

          <p class="text-xl lg:text-2xl text-gray-600 mb-8 max-w-2xl">
            {{ university.description }}
          </p>

          <div class="flex flex-col sm:flex-row gap-4">
            <button
              class="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-600 transition-all shadow-lg hover-lift"
              @click="handleApplyClick"
            >
              {{ $t('universityDetail.applyButton') }}
            </button>
            <a
              :href="whatsapp.href"
              target="_blank"
              class="bg-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-600 transition-all shadow-lg flex items-center justify-center space-x-2"
              @click.prevent="handleWhatsappClick"
            >
              <Icon name="ph:whatsapp-logo" />
              <span>{{ $t('universityDetail.whatsappButton') }}</span>
            </a>
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
import type { UniversityDetail } from '~~/server/types/api/universities'
import { useApplicationModalStore } from '~/stores/applicationModal'
import { useContactChannels } from '~/composables/useContactChannels'
import { useFingerprint } from '~/composables/useFingerprint'

interface Props {
  university: UniversityDetail
}

const props = defineProps<Props>()
const { t, locale } = useI18n()

const heroImageSrc = computed(() => props.university.heroImage || props.university.image)

const typeText = computed(() =>
  t(`universityDetail.universityType.${props.university.type}`) || props.university.type
)

const applicationModalStore = useApplicationModalStore()
const { openModal: openApplicationModal } = applicationModalStore

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
