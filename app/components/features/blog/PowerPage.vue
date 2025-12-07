<template>
  <div class="power-page bg-white">
    <section
      class="relative min-h-[60vh] md:min-h-[80vh] flex items-center justify-center text-center overflow-hidden bg-slate-900 text-white"
    >
      <div v-if="resolvedHeroImage" class="absolute inset-0 z-0">
        <NuxtImg
          :src="resolvedHeroImage"
          :alt="heroImageAlt"
          class="w-full h-full object-cover opacity-30"
          format="webp"
          @error="onHeroImageError"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"
        />
      </div>

      <div class="container relative z-10 px-4 py-12 md:py-20">
        <span
          v-if="article.category"
          class="inline-block px-4 py-1 mb-4 md:mb-6 text-xs md:text-sm font-bold tracking-wider uppercase bg-primary text-white rounded-full"
        >
          {{ article.category.label }}
        </span>
        <h1
          class="max-w-4xl mx-auto text-3xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl mb-6 md:mb-8"
        >
          {{ article.title }}
        </h1>
        <p
          v-if="article.excerpt"
          class="max-w-2xl mx-auto text-base md:text-2xl text-gray-200 leading-relaxed mb-8 md:mb-10"
        >
          {{ article.excerpt }}
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            class="w-full sm:w-auto px-8 py-4 text-base md:text-lg font-bold text-white bg-primary rounded-full hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg hover:shadow-primary/50 min-w-[200px]"
            @click="scrollToConsultation"
          >
            {{ t('power_page.cta.consult') }}
          </button>
          <NuxtLink
            :to="localePath('/universities')"
            class="w-full sm:w-auto px-8 py-4 text-base md:text-lg font-bold text-white border-2 border-white/20 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all min-w-[200px]"
          >
            {{ t('power_page.cta.universities') }}
          </NuxtLink>
        </div>

        <div
          v-if="quickFacts.length"
          class="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto border-t border-white/10 pt-8"
        >
          <div v-for="fact in quickFacts" :key="fact.title" class="text-center">
            <div class="text-2xl md:text-3xl font-bold text-primary">{{ fact.value }}</div>
            <div class="text-xs md:text-sm text-gray-400">{{ fact.title }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-12 md:py-20">
      <div class="container px-4 mx-auto max-w-4xl">
        <BlogContentRenderer
          :content="article.content"
          variant="powerpage"
          :enable-widgets="true"
          :fallback-alt="article.title"
        />
      </div>
    </section>

    <BlogStickyCtaWidget @click="scrollToConsultation" />
  </div>
</template>

<script setup lang="ts">
import type { BlogArticleDetail } from '~~/server/types/api'
import { useDetailPage } from '~/composables/blog/useDetailPage'
const props = defineProps<{
  article: BlogArticleDetail
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const { openModal } = useApplicationModal()

// Use shared detail page composable for unified logic
const articleRef = computed(() => props.article)
const { resolvedHeroImage, heroImageAlt, onHeroImageError, quickFacts } = useDetailPage(
  articleRef,
  {
    routeName: 'articles-slug',
    i18nPrefix: 'power_page.quickFacts',
    includeReadingTime: false,
    includePublishedDate: false,
  },
)

const scrollToConsultation = () => {
  openModal()
}
</script>
