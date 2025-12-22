<template>
  <BaseSection id="reviews">
      <BaseSectionHeader
        :title="t(reviewsNs('title'))"
        :subtitle="t(reviewsNs('subtitle'))"
        align="center"
        margin-bottom="lg"
      />

      <div v-if="reviewsError" class="text-center text-error mb-component-lg">
        {{ t(reviewsNs('error')) }}
      </div>
      <div v-else-if="pending" class="text-center text-meta mb-component-lg">
        {{ t(reviewsNs('loading')) }}
      </div>
      <div v-else-if="!featuredReviews.length" class="text-center text-meta mb-component-lg">
        {{ t(reviewsNs('empty')) }}
      </div>
      <BaseGrid v-else :md="2" :lg="3" gap="lg" class="mb-component-lg">
        <BaseCard
          v-for="review in featuredReviews"
          :key="review.id"
          variant="surface"
          class="flex flex-col"
        >
          <div class="mb-component-md">
            <h3 class="font-semibold text-secondary">{{ review.name }}</h3>
            <p v-if="review.university" class="text-body-sm text-meta">{{ review.university }}</p>
          </div>

          <div class="flex mb-component-sm">
            <Icon
              v-for="i in 5"
              :key="i"
              name="mdi:star"
              :class="i <= review.rating ? 'star-active' : 'star-inactive'"
            />
          </div>

          <p class="text-body">{{ review.quote }}</p>
        </BaseCard>
      </BaseGrid>

      <div class="text-center">
        <BaseButton
          variant="outline"
          size="lg"
          :to="localePath('/reviews')"
        >
          {{ t(reviewsNs('read_more')) }}
        </BaseButton>
      </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'

// Reviews section with student testimonials loaded from API
const reviewsNs = namespace('home.reviews')
const { t, locale } = useI18n()
const localePath = useLocalePath()

interface ReviewListResponse<T> {
  data?: T[]
}

interface FeaturedReviewItem {
  id: number | string
  name: string
  university?: string
  rating: number
  quote: string
}

const {
  data: reviews,
  pending,
  error: reviewsError,
  refresh,
} = await useFetch<ReviewListResponse<FeaturedReviewItem>>('/api/v1/reviews', {
  query: computed(() => ({
    featured: true,
    limit: 3,
    lang: locale.value,
    mediaType: 'text',
  })),
  headers: computed(() => ({ 'Accept-Language': locale.value })),
})

const featuredReviews = computed(() => reviews.value?.data ?? [])

watch(
  () => locale.value,
  () => {
    refresh()
  },
)

if (reviewsError.value) {
  console.error('Failed to load featured reviews:', reviewsError.value)
}
</script>
