<template>
  <div
    ref="cardRef"
    class="bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out flex flex-col h-full university-card"
    :aria-label="`University card for ${title}`"
  >
    <div class="relative overflow-hidden">
      <NuxtImg
        v-if="image && isVisible"
        :src="image"
        :alt="title + ' campus'"
        class="w-full h-48 object-cover"
        width="600"
        height="400"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        loading="lazy"
        decoding="async"
        :placeholder="true"
        :quality="80"
        format="webp"
        densities="x1 x2"
      />

      <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
        <Icon name="mdi:school" class="w-12 h-12 text-gray-400" />
      </div>
    </div>

    <div class="p-4 md:p-6 flex flex-col flex-1">
      <UniversitiesUniversityCardHeader
        :title="title"
        :type="type"
        :type-label="typeLabel"
        :featured="featured"
      />

      <UniversitiesUniversityCardDetails
        :city="city"
        :languages="languages"
        :tuition="tuition"
        :badge="badge"
      />

      <UniversitiesUniversityCardActions
        :detail-href="detailHref"
        :apply-label="$t('universities_page.card.apply_button')"
        :detail-label="$t('universities_page.card.details_button')"
        @apply="openApplicationModal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  type?: string
  city?: string
  languages?: string[]
  tuition?: number | string
  badge?: string | { label?: string; labelKey?: string; color: string }
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
  slug: '',
})

const { t } = useI18n()

// Lazy loading logic
const cardRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

onMounted(() => {
  if (!('IntersectionObserver' in window)) {
    isVisible.value = true
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer.disconnect()
        }
      })
    },
    {
      rootMargin: '50px',
      threshold: 0.1,
    },
  )

  if (cardRef.value) {
    observer.observe(cardRef.value)
  }

  onUnmounted(() => {
    observer.disconnect()
  })
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
  const slug =
    props.slug ||
    props.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

  return localePath(`/university/${slug}`)
})

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
      featured: props.featured,
    },
  })
}
</script>
