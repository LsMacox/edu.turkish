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
          class="absolute inset-0 gradient-overlay-hero"
        />
      </div>

      <div class="container relative z-10 container-padding-narrow section-py-lg">
        <BaseBadge
          v-if="article.category"
          color="primary"
          variant="solid"
          class="mb-component-md"
        >
          {{ article.category.label }}
        </BaseBadge>
        <h1
          class="max-w-4xl mx-auto text-3xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl mb-component-lg"
        >
          {{ article.title }}
        </h1>
        <p
          v-if="article.excerpt"
          class="max-w-2xl mx-auto text-body-lg md:text-2xl text-white/80 leading-relaxed mb-component-lg"
        >
          {{ article.excerpt }}
        </p>

        <div class="flex flex-col sm:flex-row gap-component-lg justify-center items-center">
          <BaseButton
            variant="primary"
            size="xl"
            rounded="full"
            class="w-full sm:w-auto shadow-card hover:shadow-primary/50 hover:scale-105 transition-scale min-w-[200px]"
            @click="scrollToConsultation"
          >
            {{ t(ctaNs('consult')) }}
          </BaseButton>
          <BaseButton
            variant="outline"
            size="xl"
            rounded="full"
            :to="localePath('/universities')"
            class="w-full sm:w-auto !border-white/20 !bg-white/10 !text-white backdrop-blur-sm hover:!bg-white/20 min-w-[200px]"
          >
            {{ t(ctaNs('universities')) }}
          </BaseButton>
        </div>

        <div
          v-if="quickFacts.length"
          class="mt-section-lg grid grid-cols-2 md:grid-cols-4 gap-component-lg max-w-4xl mx-auto border-t border-white/10 pt-component-lg"
        >
          <div v-for="fact in quickFacts" :key="fact.title" class="text-center">
            <div class="text-2xl md:text-3xl font-bold text-primary">{{ fact.value }}</div>
            <div class="text-body-sm text-hint">{{ fact.title }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section-py-lg">
      <div class="container container-padding-narrow mx-auto max-w-4xl">
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
import type { BlogArticleDetail } from '~~/lib/types'
import { useDetailPage } from '~/composables/useBlogDetailPage'
import { namespace, key } from '~~/lib/i18n'

const ctaNs = namespace('blog.powerPage.cta')
const props = defineProps<{
  article: BlogArticleDetail
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const { openModal } = useApplicationModal()

const articleRef = computed(() => props.article)
const { resolvedHeroImage, heroImageAlt, onHeroImageError, quickFacts } = useDetailPage(
  articleRef,
  {
    routeName: 'articles-slug',
    i18nKeys: {
      category: key('blog.powerPage.quickFacts.category'),
      published: key('blog.powerPage.quickFacts.published'),
      readingTime: key('blog.powerPage.quickFacts.readingTime'),
      copySuccess: key('blog.powerPage.share.copySuccess'),
      copyError: key('blog.powerPage.share.copyError'),
    },
    includeReadingTime: false,
    includePublishedDate: false,
  },
)

const scrollToConsultation = () => {
  openModal({
    source: 'blog_article_cta',
    description: `${t(ctaNs('mobile_title'))} - ${props.article.title}`
  })
}
</script>
