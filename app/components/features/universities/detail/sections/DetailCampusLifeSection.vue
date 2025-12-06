<template>
  <section v-if="hasContent" class="py-16 bg-white">
    <div class="container mx-auto px-4 lg:px-6">
      <BaseSectionHeader
        :title="$t('universityDetail.campusLife.title')"
        :subtitle="$t('universityDetail.campusLife.subtitle')"
        align="center"
        margin-bottom="lg"
      />

      <div
        v-if="campusImages.length"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <div
          v-for="(image, index) in campusImages"
          :key="index"
          class="aspect-square rounded-xl overflow-hidden hover-lift cursor-pointer"
        >
          <NuxtImg
            class="w-full h-full object-cover"
            :src="image.src"
            :alt="image.alt"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            format="webp"
          />
        </div>
      </div>

      <!-- Facilities Grid -->
      <div v-if="realFacilities.length" :class="{ 'mt-16': campusImages.length }">
        <h3 class="text-2xl font-bold text-secondary text-center mb-8">
          {{ $t('universityDetail.campusLife.infrastructure') }}
        </h3>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(facility, i) in realFacilities"
            :key="`facility-${i}`"
            class="bg-white rounded-xl shadow-custom p-6 text-center hover-lift"
          >
            <div
              class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              :class="getFacilityStyleForItem(facility).bg"
            >
              <Icon
                :name="getFacilityStyleForItem(facility).icon"
                class="text-2xl"
                :class="getFacilityStyleForItem(facility).color"
              />
            </div>
            <h4 class="font-semibold text-secondary mb-2">{{ facility.name }}</h4>
            <p class="text-gray-600 text-sm">{{ facility.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type {
  UniversityDetail,
  UniversityCampusFacility,
} from '~~/server/types/api/universities'
import { getFacilityStyle } from '../../utils/styles'

interface Props {
  university?: UniversityDetail
}

const props = defineProps<Props>()

const realFacilities = computed(() => props.university?.campusLife?.facilities ?? [])

const campusImages = computed(() =>
  (props.university?.campusLife?.gallery ?? [])
    .filter((item) => item.url?.trim())
    .map((item) => ({ src: item.url, alt: item.alt || item.title || '' }))
)

const hasContent = computed(() => campusImages.value.length > 0 || realFacilities.value.length > 0)

const getFacilityStyleForItem = (facility: UniversityCampusFacility) => {
  const type = (facility as { type?: string }).type ?? 'default'
  return getFacilityStyle(type)
}
</script>
