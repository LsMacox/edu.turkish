<template>
  <article
    class="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 ease-out flex flex-col h-full"
  >
    <!-- Image with overlay -->
    <div class="relative overflow-hidden">
      <NuxtImg
        v-if="image"
        :src="image"
        :alt="title"
        class="w-full h-44 md:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        width="600"
        height="400"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        loading="lazy"
        :placeholder="true"
        :quality="80"
        format="webp"
      />
      <div v-else class="w-full h-44 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <Icon name="mdi:school" class="w-12 h-12 text-gray-400" />
      </div>
      
      <!-- Badges overlay -->
      <div class="absolute top-3 left-3 right-3 flex items-start justify-between">
        <div class="flex flex-wrap gap-1.5">
          <BaseBadge v-if="featured" color="warning" size="sm" class="shadow-sm">
            <Icon name="mdi:star" class="w-3 h-3 mr-1" />
            Featured
          </BaseBadge>
          <BaseBadge v-if="typeLabel" :color="typeBadgeColor" size="sm" class="shadow-sm backdrop-blur-sm">
            {{ typeLabel }}
          </BaseBadge>
        </div>
      </div>
      
      <!-- Price tag -->
      <div class="absolute bottom-3 right-3">
        <div class="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-sm">
          <span v-if="formattedTuition !== '0'" class="text-sm font-bold text-secondary">
            ${{ formattedTuition }}<span class="text-xs font-normal text-gray-500">/{{ t('universities_page.card.year') }}</span>
          </span>
          <span v-else class="text-xs font-medium text-gray-600">{{ t('universities_page.card.price_on_request') }}</span>
        </div>
      </div>
    </div>

    <div class="p-4 md:p-5 flex flex-col flex-1">
      <!-- Title -->
      <h3 class="text-base md:text-lg font-semibold text-secondary line-clamp-2 mb-3 group-hover:text-primary transition-colors">
        {{ title }}
      </h3>

      <!-- Details with icons -->
      <div class="space-y-2 mb-4 flex-1">
        <div class="flex items-center text-sm text-gray-600">
          <div class="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center mr-2.5 flex-shrink-0">
            <Icon name="mdi:map-marker" class="text-blue-500 w-4 h-4" />
          </div>
          <span class="truncate">{{ city }}</span>
        </div>
        <div class="flex items-center text-sm text-gray-600">
          <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center mr-2.5 flex-shrink-0">
            <Icon name="mdi:translate" class="text-emerald-500 w-4 h-4" />
          </div>
          <span class="truncate">{{ languages.join(', ') }}</span>
        </div>
        <div v-if="badgeData" class="pt-1">
          <BaseBadge :color="badgeData.color" size="sm">{{ badgeData.label }}</BaseBadge>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 pt-3 border-t border-gray-100">
        <BaseButton :to="detailHref" size="sm" class="flex-1">
          {{ t('universities_page.card.details_button') }}
        </BaseButton>
        <BaseButton variant="outline" size="sm" icon="mdi:send" class="flex-shrink-0 px-3" @click="openApplicationModal" />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { TYPE_BADGE_COLORS, BADGE_COLOR_MAP } from '~~/lib/universities/constants'
import { useUniversity } from '~/composables/universities/useUniversity'
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
const { openModal } = useApplicationModal()
const { formatNumber, getTypeLabel } = useUniversity()

const typeLabel = computed(() => (props.type ? getTypeLabel(props.type) : ''))

const typeBadgeColor = computed<SemanticColor>(() => TYPE_BADGE_COLORS[props.type] ?? 'neutral')

const tuitionValue = computed(() => toNonNegativeNumber(props.tuition) ?? 0)
const formattedTuition = computed(() =>
  tuitionValue.value > 0 ? formatNumber(tuitionValue.value) : '0',
)

const badgeData = computed(() => {
  if (!props.badge || typeof props.badge === 'string') return null
  const label =
    props.badge.labelKey && te(props.badge.labelKey) ? t(props.badge.labelKey) : props.badge.label
  if (!label) return null
  const color: SemanticColor = BADGE_COLOR_MAP[props.badge.color ?? ''] ?? 'neutral'
  return { label, color }
})

const detailHref = computed(() => localePath(`/university/${props.slug || slugify(props.title)}`))

const openApplicationModal = () =>
  openModal({
    source: 'universities_cta',
    description: `${t('universities_page.card.application_description')} ${props.title}`,
    universityName: props.title,
    universityCity: props.city,
    universityTuition: tuitionValue.value || undefined,
  })
</script>
