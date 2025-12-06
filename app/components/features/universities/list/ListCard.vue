<template>
  <article
    class="bg-white rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-out flex flex-col h-full"
  >
    <!-- Image -->
    <div class="relative overflow-hidden">
      <NuxtImg
        v-if="image"
        :src="image"
        :alt="title"
        class="w-full h-48 object-cover"
        width="600"
        height="400"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        loading="lazy"
        :placeholder="true"
        :quality="80"
        format="webp"
      />
      <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
        <Icon name="mdi:school" class="w-12 h-12 text-gray-400" />
      </div>
    </div>

    <div class="p-4 md:p-6 flex flex-col flex-1">
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <h3 class="text-base md:text-lg font-semibold text-secondary line-clamp-2">{{ title }}</h3>
        <div class="flex items-center gap-2 ml-2 flex-shrink-0">
          <BaseBadge v-if="featured" color="warning" size="sm">
            <Icon name="mdi:star" class="w-3 h-3 mr-1" />
            Featured
          </BaseBadge>
          <BaseBadge v-if="typeLabel" :color="typeBadgeColor" size="sm">
            {{ typeLabel }}
          </BaseBadge>
        </div>
      </div>

      <!-- Details -->
      <div class="space-y-2 mb-4">
        <div class="flex items-center text-sm text-gray-600">
          <Icon name="mdi:map-marker" class="text-primary w-4 mr-2" />
          <span>{{ city }}</span>
        </div>
        <div class="flex items-center text-sm text-gray-600">
          <Icon name="mdi:translate" class="text-primary w-4 mr-2" />
          <span>{{ languages.join(', ') }}</span>
        </div>
        <div class="flex items-center text-sm text-gray-600">
          <Icon name="mdi:currency-usd" class="text-primary w-4 mr-2" />
          <span v-if="formattedTuition !== '0'">от ${{ formattedTuition }}/год</span>
          <span v-else>Цена по запросу</span>
        </div>
        <div v-if="badgeData" class="flex items-center">
          <BaseBadge :color="badgeData.color" size="sm">{{ badgeData.label }}</BaseBadge>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-auto pt-4 space-y-2">
        <BaseButton :to="detailHref" size="md" full-width>
          {{ $t('universities_page.card.details_button') }}
        </BaseButton>
        <BaseButton variant="outline" size="md" full-width @click="openApplicationModal">
          {{ $t('universities_page.card.apply_button') }}
        </BaseButton>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { TYPE_LABEL_KEYS, TYPE_BADGE_COLORS, BADGE_COLOR_MAP } from '../utils/constants'
import { useUniversityFormatters } from '../composables/useUniversityFormatters'
import { slugify } from '~~/lib/text'
import { toNonNegativeNumber } from '~~/lib/number'
import type { SemanticColor } from '~/types/ui'

interface Props {
  title: string
  type?: string
  city?: string
  languages?: string[]
  tuition?: number | string
  badge?: string | { label?: string; labelKey?: string; color?: string }
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

const { t, te } = useI18n()
const localePath = useLocalePath()
const { openModal } = useApplicationModalStore()
const { formatNumber } = useUniversityFormatters()

const typeLabel = computed(() => {
  const key = TYPE_LABEL_KEYS[props.type]
  return key ? t(key) : ''
})

const typeBadgeColor = computed<SemanticColor>(() => TYPE_BADGE_COLORS[props.type] ?? 'neutral')

const tuitionValue = computed(() => toNonNegativeNumber(props.tuition) ?? 0)
const formattedTuition = computed(() =>
  tuitionValue.value > 0 ? formatNumber(tuitionValue.value) : '0',
)

const badgeData = computed(() => {
  if (!props.badge || typeof props.badge === 'string') return null
  const label = props.badge.labelKey && te(props.badge.labelKey)
    ? t(props.badge.labelKey)
    : props.badge.label
  if (!label) return null
  const color: SemanticColor = BADGE_COLOR_MAP[props.badge.color ?? ''] ?? 'neutral'
  return { label, color }
})

const detailHref = computed(() =>
  localePath(`/university/${props.slug || slugify(props.title)}`),
)

const openApplicationModal = () =>
  openModal({
    source: 'universities_cta',
    description: `${t('universities_page.card.application_description')} ${props.title}`,
    universityName: props.title,
    universityCity: props.city,
    universityTuition: tuitionValue.value || undefined,
  })
</script>
