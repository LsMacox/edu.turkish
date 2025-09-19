<template>
  <div
    class="bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out flex flex-col h-full university-card"
    :aria-label="`University card for ${title}`"
  >
    <div class="relative overflow-hidden">
      <NuxtImg 
        v-if="image" 
        :src="image" 
        :alt="title + ' campus'" 
        class="w-full h-48 object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        loading="lazy"
        decoding="async"
        :placeholder="true"
        :quality="78"
        format="webp"
      />
      
      <div 
        v-else 
        class="w-full h-48 bg-gray-200 flex items-center justify-center"
      >
        <Icon name="mdi:school" class="w-12 h-12 text-gray-400" />
      </div>
    </div>
    
    <div class="p-4 md:p-6 flex flex-col flex-1">
      <UniversityCardHeader 
        :title="title"
        :type="type"
        :type-label="typeLabel"
        :featured="featured"
      />

      <UniversityCardDetails
        :city="city"
        :languages="languages"
        :tuition="tuition"
        :badge="badge"
      />

      <UniversityCardActions
        :detail-href="detailHref"
        :apply-label="$t('universities_page.card.apply_button')"
        :detail-label="$t('universities_page.card.details_button')"
        @apply="openApplicationModal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import UniversityCardHeader from './UniversityCardHeader.vue'
import UniversityCardDetails from './UniversityCardDetails.vue'
import UniversityCardActions from './UniversityCardActions.vue'

interface Props {
  title: string
  type?: string
  city?: string
  languages?: string[]
  tuition?: number | string
  badge?: string | { label: string; color?: string }
  image?: string
  slug?: string
  featured?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  featured: false,
  type: '',
  city: '',
  languages: () => [],
  tuition: '',
  badge: '',
  image: '',
  slug: ''
})

const { t } = useI18n()

const imageSizes = computed(() => {
  return '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
})

const imageClasses = computed(() => {
  return 'w-full h-40 md:h-48 object-cover transition-transform duration-300 hover:scale-105'
})

const typeLabel = computed(() => {
  switch (props.type) {
    case 'state':
      return t('universities_page.card.types.state')
    case 'private':
      return t('universities_page.card.types.private')
    case 'tech':
      return t('universities_page.card.types.tech')
    case 'elite':
      return t('universities_page.card.types.elite')
    default:
      return ''
  }
})

const localePath = useLocalePath()

const detailHref = computed(() => {
  const slug = props.slug || props.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  return localePath(`/university/${slug}`)
})

import { useApplicationModalStore } from '~/stores/applicationModal'

const applicationModalStore = useApplicationModalStore()
const { openModal } = applicationModalStore

const openApplicationModal = () => {
  openModal({
    source: 'universities_cta',
    description: `${t('universities_page.card.application_description')} ${props.title}`,
    universityName: props.title,
    universityCity: props.city,
    universityTuition: typeof props.tuition === 'number' ? props.tuition : undefined,
    timestamp: new Date(),
    metadata: {
      type: props.type,
      languages: props.languages,
      featured: props.featured
    }
  })
}
</script>
