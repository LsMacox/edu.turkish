<template>
  <BaseCard
    padding="none"
    shadow="none"
    rounded="lg"
    bordered
    full-height
    hover="lift"
    class="group flex flex-col"
  >
    <!-- Image with overlay -->
    <div class="relative overflow-hidden rounded-t-lg">
      <NuxtImg
        v-if="image"
        :src="image"
        :alt="title"
        :class="['w-full h-card-image md:h-card-image-md object-cover', IMAGE_HOVER_CLASSES]"
        width="600"
        height="400"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        loading="lazy"
        :placeholder="true"
        :quality="80"
        format="webp"
      />
      <div v-else class="w-full h-card-image md:h-card-image-md gradient-placeholder flex items-center justify-center">
        <Icon name="mdi:school" class="text-icon-2xl text-hint" />
      </div>
      
      <!-- Badges overlay -->
      <div class="absolute top-3 left-3 right-3 flex items-start justify-between">
        <div class="flex flex-wrap gap-component-xs">
          <BaseBadge v-if="featured" color="warning" size="sm" class="shadow-button">
            <Icon name="mdi:star" class="text-icon-xs mr-1" />
            Featured
          </BaseBadge>
          <BaseBadge v-if="typeLabel" :color="typeBadgeColor" size="sm" class="shadow-button backdrop-blur-sm">
            {{ typeLabel }}
          </BaseBadge>
        </div>
      </div>
      
      <!-- Price tag -->
      <div class="absolute bottom-3 right-3">
        <div class="price-tag">
          <span v-if="formattedTuition !== '0'" class="text-body-sm font-bold text-secondary">
            ${{ formattedTuition }}<span class="text-body-sm font-normal text-meta">/{{ t(card('year')) }}</span>
          </span>
          <span v-else class="text-body-sm font-medium">{{ t(card('price_on_request')) }}</span>
        </div>
      </div>
    </div>

    <div class="card-padding flex flex-col flex-1">
      <!-- Title -->
      <h3 :class="['text-card-title line-clamp-2 mb-component-sm', TEXT_HOVER_CLASSES]">
        {{ title }}
      </h3>

      <!-- Details with icons -->
      <div class="space-component-sm mb-component-md flex-1">
        <div class="flex items-center gap-component-sm text-body-sm">
          <BaseInfoBadge icon="mdi:map-marker" color="info" />
          <span class="truncate">{{ city }}</span>
        </div>
        <div class="flex items-center gap-component-sm text-body-sm">
          <BaseInfoBadge icon="mdi:translate" color="success" />
          <span class="truncate">{{ languages.join(', ') }}</span>
        </div>
        <div v-if="badgeData" class="pt-component-xs">
          <BaseBadge :color="badgeData.color" size="sm">{{ badgeData.label }}</BaseBadge>
        </div>
      </div>

      <!-- Actions -->
      <div
        :class="[
        'pt-component-sm mt-component-sm border-t border-default',
        compact ? 'flex flex-col gap-component-sm' : 'flex gap-component-sm'
      ]">
        <BaseButton :to="detailHref" size="md" :class="compact ? 'w-full' : 'flex-1'">
          {{ t(card('details_button')) }}
        </BaseButton>
        <BaseButton v-if="compact" variant="outline" size="md" class="w-full" @click="openApplicationModal">
          {{ t(card('apply_button')) }}
        </BaseButton>
        <BaseIconButton v-else variant="outline" size="md" icon="mdi:send" :aria-label="t(card('apply_button'))" class="!w-12 !h-12 !min-w-[48px] !min-h-[48px] shrink-0" @click="openApplicationModal" />
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { TYPE_BADGE_COLORS, BADGE_COLOR_MAP } from '~~/lib/domain/universities/constants'
import { useUniversity } from '~/composables/useUniversityHelpers'
import { toNonNegativeNumber } from '~~/lib/utils/number'
import { namespace } from '~~/lib/i18n'
import type { SemanticColor } from '~/types/ui'
import { TEXT_HOVER_CLASSES, IMAGE_HOVER_CLASSES } from '~/composables/ui/useHover'

const card = namespace('universities.list.card')

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
  compact?: boolean
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
  compact: false,
})

const { t } = useI18n()
const localePath = useLocalePath()
const { openModal } = useApplicationModal()
const { formatNumber, getTypeLabel } = useUniversity()

const typeLabel = computed(() => (props.type ? getTypeLabel(props.type) : ''))

const typeBadgeColor = computed<SemanticColor>(() => TYPE_BADGE_COLORS[props.type] ?? 'neutral')

const tuitionValue = computed(() => toNonNegativeNumber(props.tuition) ?? 0)
const formattedTuition = computed(() =>
  tuitionValue.value > 0 ? formatNumber(tuitionValue.value) : '0',
)

const getBadgeLabel = (labelKey: string): string | undefined => {
  const labels: Record<string, string> = {
    'universities.list.card.badges.scholarships': t(card('badges.scholarships')),
    'universities.list.card.badges.technical': t(card('badges.technical')),
  }
  return labels[labelKey]
}

const badgeData = computed(() => {
  if (!props.badge || typeof props.badge === 'string') return null
  const label = props.badge.labelKey
    ? getBadgeLabel(props.badge.labelKey)
    : props.badge.label
  if (!label) return null
  const color: SemanticColor = BADGE_COLOR_MAP[props.badge.color ?? ''] ?? 'neutral'
  return { label, color }
})

const detailHref = computed(() => localePath(`/university/${props.slug}`))

const openApplicationModal = () =>
  openModal({
    source: 'universities_cta',
    description: `${t(card('application_description'))} ${props.title}`,
    universityName: props.title,
  })
</script>
