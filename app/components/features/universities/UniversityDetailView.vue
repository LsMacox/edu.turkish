<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <section class="relative h-[600px] bg-gradient-to-br from-blue-50 to-purple-50">
      <div class="absolute inset-0">
        <img
          class="w-full h-full object-cover opacity-20"
          :src="university.heroImage"
          :alt="`${university.name} campus`"
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
              <span class="text-sm font-medium text-secondary">{{ university.type }}</span>
            </div>
          </div>

          <h1 class="text-4xl lg:text-6xl font-bold text-secondary mb-6">
            {{ university.name }}
          </h1>

          <p class="text-xl lg:text-2xl text-gray-600 mb-8 max-w-2xl">
            {{ university.description }}
          </p>

          <div class="flex flex-col sm:flex-row gap-4">
            <button
              class="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-600 transition-all shadow-lg hover-lift"
              @click="
                openApplicationModal({
                  source: 'university_detail',
                  description: `Заявка с детальной страницы университета: ${university.name}`,
                  universityName: university.name,
                })
              "
            >
              {{ $t('universityDetail.applyButton') }}
            </button>
            <a
              :href="whatsappChannel.href"
              target="_blank"
              class="bg-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-600 transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <Icon name="ph:whatsapp-logo" />
              <span>{{ $t('universityDetail.whatsappButton') }}</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Key Information Section -->
    <section class="py-12 md:py-16 bg-white">
      <div class="container mx-auto px-4 lg:px-6">
        <BaseSectionHeader
          :title="$t('universityDetail.keyInformation.title')"
          :subtitle="$t('universityDetail.keyInformation.subtitle')"
          align="center"
          margin-bottom="lg"
        />

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <div class="bg-white rounded-xl md:rounded-2xl shadow-custom p-4 md:p-6 text-center hover-lift">
            <div
              class="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4"
            >
              <Icon name="ph:map-pin" class="text-blue-600 text-xl md:text-2xl" />
            </div>
            <h3 class="text-card-title mb-1 md:mb-2">
              {{ $t('universityDetail.keyInformation.city') }}
            </h3>
            <p class="text-gray-600 text-sm md:text-base">{{ university.keyInfo.city }}</p>
          </div>

          <div class="bg-white rounded-xl md:rounded-2xl shadow-custom p-4 md:p-6 text-center hover-lift">
            <div
              class="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4"
            >
              <Icon name="ph:calendar" class="text-green-600 text-xl md:text-2xl" />
            </div>
            <h3 class="text-card-title mb-1 md:mb-2">
              {{ $t('universityDetail.keyInformation.foundedYear') }}
            </h3>
            <p class="text-gray-600 text-sm md:text-base">{{ university.keyInfo.foundedYear }}</p>
          </div>

          <div class="bg-white rounded-xl md:rounded-2xl shadow-custom p-4 md:p-6 text-center hover-lift">
            <div
              class="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4"
            >
              <Icon name="ph:currency-dollar" class="text-purple-600 text-xl md:text-2xl" />
            </div>
            <h3 class="text-card-title mb-1 md:mb-2">
              {{ $t('universityDetail.keyInformation.cost') }}
            </h3>
            <p class="text-gray-600 text-sm md:text-base">
              {{
                $t('universityDetail.keyInformation.costFrom', {
                  cost:
                    '$' +
                    (university.keyInfo.priceFrom || 0)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
                })
              }}
            </p>
          </div>

          <div class="bg-white rounded-xl md:rounded-2xl shadow-custom p-4 md:p-6 text-center hover-lift">
            <div
              class="w-12 h-12 md:w-16 md:h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4"
            >
              <Icon name="ph:translate" class="text-orange-600 text-xl md:text-2xl" />
            </div>
            <h3 class="text-card-title mb-1 md:mb-2">
              {{ $t('universityDetail.keyInformation.languages') }}
            </h3>
            <p class="text-gray-600 text-sm md:text-base">{{ university.keyInfo.languages.join(', ') }}</p>
          </div>

          <div class="bg-white rounded-xl md:rounded-2xl shadow-custom p-4 md:p-6 text-center hover-lift">
            <div
              class="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4"
            >
              <Icon name="ph:users" class="text-red-600 text-xl md:text-2xl" />
            </div>
            <h3 class="text-card-title mb-1 md:mb-2">
              {{ $t('universityDetail.keyInformation.students') }}
            </h3>
            <p class="text-gray-600 text-sm md:text-base">
              {{
                university.keyInfo.studentsCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
              }}
            </p>
          </div>

          <div class="bg-white rounded-xl md:rounded-2xl shadow-custom p-4 md:p-6 text-center hover-lift">
            <div
              class="w-12 h-12 md:w-16 md:h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4"
            >
              <Icon name="ph:house" class="text-yellow-600 text-xl md:text-2xl" />
            </div>
            <h3 class="text-card-title mb-1 md:mb-2">
              {{ $t('universityDetail.keyInformation.accommodation') }}
            </h3>
            <p class="text-gray-600 text-sm md:text-base">{{ university.keyInfo.accommodation }}</p>
          </div>

          <div class="bg-white rounded-xl md:rounded-2xl shadow-custom p-4 md:p-6 text-center hover-lift">
            <div
              class="w-12 h-12 md:w-16 md:h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4"
            >
              <Icon name="ph:trophy" class="text-teal-600 text-xl md:text-2xl" />
            </div>
            <h3 class="text-card-title mb-1 md:mb-2">
              {{ $t('universityDetail.keyInformation.ranking') }}
            </h3>
            <p class="text-gray-600 text-sm md:text-base">{{ university.keyInfo.ranking }}</p>
          </div>

          <div class="bg-white rounded-xl md:rounded-2xl shadow-custom p-4 md:p-6 text-center hover-lift">
            <div
              class="w-12 h-12 md:w-16 md:h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4"
            >
              <Icon name="ph:globe" class="text-indigo-600 text-xl md:text-2xl" />
            </div>
            <h3 class="text-card-title mb-1 md:mb-2">
              {{ $t('universityDetail.keyInformation.internationalStudents') }}
            </h3>
            <p class="text-gray-600 text-sm md:text-base">{{ university.keyInfo.internationalStudents }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About University Section -->
    <section class="py-16 bg-background">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="max-w-4xl mx-auto">
          <BaseSectionHeader
            :title="$t('universityDetail.aboutUniversity.title')"
            align="center"
            margin-bottom="lg"
          />

          <div class="space-y-8">
            <div class="bg-white rounded-2xl shadow-custom p-8">
              <h3 class="text-2xl font-semibold text-secondary mb-4">
                {{ $t('universityDetail.aboutUniversity.history') }}
              </h3>
              <p class="text-card-body">
                {{ university.about.history }}
              </p>
            </div>

            <div class="bg-white rounded-2xl shadow-custom p-8">
              <h3 class="text-2xl font-semibold text-secondary mb-4">
                {{ $t('universityDetail.aboutUniversity.campus') }}
              </h3>
              <p class="text-card-body">
                {{ university.about.campus }}
              </p>
            </div>

            <div class="bg-white rounded-2xl shadow-custom p-8">
              <h3 class="text-2xl font-semibold text-secondary mb-4">
                {{ $t('universityDetail.aboutUniversity.strongPrograms') }}
              </h3>
              <div class="grid md:grid-cols-2 gap-6">
                <div v-for="category in university.strongPrograms" :key="category.category">
                  <h4 class="text-card-title mb-3">{{ category.category }}</h4>
                  <ul class="text-gray-600 space-y-1">
                    <li v-for="program in category.programs" :key="program">• {{ program }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-custom p-8">
              <h3 class="text-2xl font-semibold text-secondary mb-4">
                {{ $t('universityDetail.aboutUniversity.advantages') }}
              </h3>
              <div class="grid md:grid-cols-2 gap-6">
                <div
                  v-for="(advantage, index) in university.about.advantages"
                  :key="index"
                  class="space-y-4"
                >
                  <div class="flex items-start space-x-3">
                    <div
                      class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1 flex-shrink-0"
                    >
                      <Icon name="ph:check" class="text-white text-xs flex-shrink-0" />
                    </div>
                    <div>
                      <h5 class="font-semibold text-secondary">{{ advantage.title }}</h5>
                      <p class="text-sm text-gray-600">{{ advantage.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Academic Programs Section -->
    <AcademicPrograms :programs="university.academicPrograms" />

    <!-- Admission Requirements Section -->
    <AdmissionRequirements :admission="university.admission" />

    <!-- Campus Life Section -->
    <CampusLife :university="university" />

    <!-- FAQ Section -->
    <FAQ :key="locale" />

    <!-- Application CTA Section -->
    <ApplicationCTA :university="university" />

    <!-- Application Modal is mounted globally in default layout -->
  </div>
</template>

<script setup lang="ts">
import type { UniversityDetailFrontend } from '~/types/university-detail'
import { useApplicationModalStore } from '~/stores/applicationModal'
import { useContactChannels } from '~/composables/useContactChannels'

interface Props {
  university: UniversityDetailFrontend
}

defineProps<Props>()

const { locale } = useI18n()

const applicationModalStore = useApplicationModalStore()
const { openModal: openApplicationModal } = applicationModalStore

const { getChannel } = useContactChannels()
const whatsappChannel = getChannel('whatsapp')
</script>
