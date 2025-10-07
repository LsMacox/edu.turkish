<template>
  <section v-if="campusImages.length > 0" class="py-16 bg-white">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="text-center mb-12">
        <h2 class="text-section-title mb-4">
          {{ $t('universityDetail.campusLife.title') }}
        </h2>
        <p class="text-section-subtitle">{{ $t('universityDetail.campusLife.subtitle') }}</p>
      </div>

      <div
        v-if="campusImages.length > 0"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <div
          v-for="(image, index) in campusImages"
          :key="index"
          class="aspect-square rounded-xl overflow-hidden hover-lift cursor-pointer"
          @click="openImageModal(image)"
        >
          <img class="w-full h-full object-cover" :src="image.src" :alt="image.alt" >
        </div>
      </div>

      <!-- Facilities Grid -->
      <div class="mt-16">
        <h3 class="text-2xl font-bold text-secondary text-center mb-8">
          {{ $t('universityDetail.campusLife.infrastructure') }}
        </h3>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <template v-if="realFacilities.length > 0">
            <!-- Реальные объекты инфраструктуры из API -->
            <div
              v-for="facility in realFacilities"
              :key="facility.id"
              class="bg-white rounded-xl shadow-custom p-6 text-center hover-lift"
            >
              <div
                class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                :class="getFacilityIconBg(detectFacilityType(facility))"
              >
                <Icon
                  :name="facility.icon || getFacilityIcon(detectFacilityType(facility))"
                  class="text-2xl"
                  :class="getFacilityIconColor(detectFacilityType(facility))"
                />
              </div>
              <h4 class="font-semibold text-secondary mb-2">{{ facility.name }}</h4>
              <p class="text-gray-600 text-sm">{{ facility.description }}</p>
              <div v-if="facility.capacity || facility.area" class="mt-2 text-xs text-gray-500">
                <span v-if="facility.capacity"
                  >{{ $t('universityDetail.campusLife.capacity') }}: {{ facility.capacity }}</span
                >
                <span v-if="facility.area" class="ml-2"
                  >{{ $t('universityDetail.campusLife.area') }}: {{ facility.area }}м²</span
                >
              </div>
            </div>
          </template>

          <template v-else>
            <!-- Fallback: показываем стандартные объекты если нет данных из API -->
            <div
              v-for="facility in defaultFacilities"
              :key="facility.key"
              class="bg-white rounded-xl shadow-custom p-6 text-center hover-lift"
            >
              <div
                class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                :class="facility.iconBg"
              >
                <Icon :name="facility.icon" class="text-2xl" :class="facility.iconColor" />
              </div>
              <h4 class="font-semibold text-secondary mb-2">
                {{ $t(`universityDetail.campusLife.facilities.${facility.key}.name`) }}
              </h4>
              <p class="text-gray-600 text-sm">
                {{ $t(`universityDetail.campusLife.facilities.${facility.key}.description`) }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { UniversityDetailFrontend } from '~/stores/universityDetail'

interface Props {
  university?: UniversityDetailFrontend
}

const props = defineProps<Props>()

// Локальный UI-тип для объектов инфраструктуры (добавляем необязательное поле icon)
type FacilityItemUI = {
  id: number | string
  name: string
  description: string
  type?: string | null
  capacity?: number | null
  area?: number | null
  icon?: string | null
}

// Получаем реальные объекты инфраструктуры из API
const realFacilities = computed<FacilityItemUI[]>(() => {
  const facilities = props.university?.campus_life?.facilities
  if (!Array.isArray(facilities)) {
    return []
  }
  return facilities as FacilityItemUI[]
})

interface CampusGalleryItem {
  url?: string | null
  alt?: string | null
  title?: string | null
}

type CampusImage = {
  src: string
  alt: string
}

const campusImages = computed<CampusImage[]>(() => {
  const apiImages = (props.university?.campus_life?.gallery ?? []) as CampusGalleryItem[]
  return apiImages
    .filter(
      (item): item is CampusGalleryItem & { url: string } =>
        typeof item.url === 'string' && item.url.trim().length > 0,
    )
    .map((item) => ({
      src: item.url,
      alt: item.alt || item.title || 'Фото кампуса университета',
    }))
})

const defaultFacilities = [
  {
    key: 'library',
    icon: 'ph:books',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    key: 'laboratories',
    icon: 'ph:flask',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    key: 'sportsCenter',
    icon: 'ph:barbell',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
  },
  {
    key: 'dormitories',
    icon: 'ph:bed',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    key: 'cafeteria',
    icon: 'ph:fork-knife',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  {
    key: 'wifi',
    icon: 'ph:wifi-high',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
  },
  {
    key: 'medicalCenter',
    icon: 'ph:first-aid',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
  },
  {
    key: 'transport',
    icon: 'ph:bus',
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    key: 'studentClubs',
    icon: 'ph:users-three',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
]

// Функции для определения иконок по типу объекта
const getFacilityIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    academic: 'ph:books',
    recreational: 'ph:users-three',
    accommodation: 'ph:bed',
    dining: 'ph:fork-knife',
    sports: 'ph:barbell',
    medical: 'ph:first-aid',
    transport: 'ph:bus',
    technology: 'ph:wifi-high',
    support: 'ph:gear',
  }
  return iconMap[type] || 'ph:buildings'
}

const getFacilityIconBg = (type: string) => {
  const bgMap: Record<string, string> = {
    academic: 'bg-blue-100',
    recreational: 'bg-yellow-100',
    accommodation: 'bg-purple-100',
    dining: 'bg-red-100',
    sports: 'bg-orange-100',
    medical: 'bg-pink-100',
    transport: 'bg-indigo-100',
    technology: 'bg-teal-100',
    support: 'bg-gray-100',
  }
  return bgMap[type] || 'bg-gray-100'
}

const getFacilityIconColor = (type: string) => {
  const colorMap: Record<string, string> = {
    academic: 'text-blue-600',
    recreational: 'text-yellow-600',
    accommodation: 'text-purple-600',
    dining: 'text-red-600',
    sports: 'text-orange-600',
    medical: 'text-pink-600',
    transport: 'text-indigo-600',
    technology: 'text-teal-600',
    support: 'text-gray-600',
  }
  return colorMap[type] || 'text-gray-600'
}

// Попытка определить тип объекта по названию, если с бэка пришёл общий 'support'
const detectFacilityType = (facility: FacilityItemUI): string => {
  const providedType = (facility?.type || '').toString()
  if (providedType && providedType !== 'support') return providedType

  const name = (facility?.name || '').toString().toLowerCase()
  if (!name) return 'support'

  if (name.includes('общежит') || name.includes('yurt') || name.includes('dorm'))
    return 'accommodation'
  if (name.includes('библиотек') || name.includes('library') || name.includes('kitap'))
    return 'academic'
  if (name.includes('лаборат') || name.includes('laboratuvar') || name.includes('lab'))
    return 'academic'
  if (
    name.includes('столов') ||
    name.includes('кафе') ||
    name.includes('yemek') ||
    name.includes('cafeteria')
  )
    return 'dining'
  if (
    name.includes('спорт') ||
    name.includes('gym') ||
    name.includes('fitness') ||
    name.includes('spor')
  )
    return 'sports'
  if (
    name.includes('wi') ||
    name.includes('интернет') ||
    name.includes('wifi') ||
    name.includes('wi‑fi') ||
    name.includes('wi-fi')
  )
    return 'technology'
  if (
    name.includes('мед') ||
    name.includes('sağlık') ||
    name.includes('medical') ||
    name.includes('health')
  )
    return 'medical'
  if (
    name.includes('транспорт') ||
    name.includes('bus') ||
    name.includes('otobüs') ||
    name.includes('ulasim')
  )
    return 'transport'
  if (name.includes('клуб') || name.includes('club') || name.includes('kulüp'))
    return 'recreational'
  return 'support'
}

const openImageModal = (_image: CampusImage) => {
  // Здесь можно реализовать модальное окно для просмотра изображений
  // TODO: implement modal preview if needed
}
</script>
