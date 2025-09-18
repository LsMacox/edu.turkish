<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div class="space-y-4">
              <h1 class="text-4xl lg:text-5xl font-bold text-secondary leading-tight">
                {{ hero.title }}
                <span class="text-primary">{{ hero.titleAccent }}</span>
              </h1>
              <p class="text-lg text-gray-600 leading-relaxed">
                {{ hero.description }}
              </p>
            </div>

            <!-- Stats -->
            <div class="flex flex-wrap gap-6 text-sm">
              <div
                v-for="(stat, index) in hero.stats"
                :key="index"
                class="flex items-center space-x-2 text-secondary"
              >
                <Icon :name="stat.icon" class="text-lg text-primary" />
                <span class="font-medium">{{ stat.label }}</span>
              </div>
            </div>

            <!-- Search Bar -->
            <div class="relative max-w-md">
              <Icon name="mdi:magnify" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="hero.searchPlaceholder"
                class="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
            </div>
          </div>

          <div class="relative">
            <div class="bg-white rounded-3xl shadow-custom p-8">
              <NuxtImg
                :src="heroImage"
                :alt="hero.imageAlt"
                class="w-full h-96 object-cover rounded-2xl"
                loading="lazy"
                decoding="async"
                format="webp"
              />
            </div>
            <div class="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 max-w-xs">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon name="mdi:lightbulb-on-outline" class="text-blue-600" />
                </div>
                <div>
                  <p class="text-sm font-semibold text-secondary">{{ hero.highlight.title }}</p>
                  <p class="text-xs text-gray-500">{{ hero.highlight.subtitle }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Filters -->
    <section class="py-8 bg-white border-b border-gray-100">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="flex flex-wrap justify-center gap-3">
          <button
            v-for="category in filterCategories"
            :key="category.key"
            type="button"
            class="px-6 py-2 rounded-full border font-medium transition-all min-h-touch-44"
            :class="activeCategory === category.key
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'border-gray-300 text-secondary hover:border-primary hover:text-primary'"
            :aria-pressed="activeCategory === category.key"
            @click="setActiveCategory(category.key)"
          >
            {{ category.label }}
          </button>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-16 bg-background">
      <div class="container mx-auto px-4 lg:px-6">
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Articles -->
          <div class="lg:col-span-2">
            <h2 class="text-2xl font-bold text-secondary mb-8">{{ t('blog.articles.title') }}</h2>

            <div class="grid md:grid-cols-2 gap-8 mb-12">
              <article
                v-if="featuredArticle && shouldShowFeatured"
                class="md:col-span-2 bg-white rounded-2xl shadow-custom overflow-hidden hover-lift"
              >
                <NuxtImg
                  :src="featuredArticle.image"
                  :alt="featuredArticle.imageAlt"
                  class="w-full h-64 object-cover"
                  loading="lazy"
                  decoding="async"
                  format="webp"
                />
                <div class="p-8">
                  <div class="flex flex-wrap items-center gap-2 mb-4 text-sm text-gray-500">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      :class="categoryBadgeClass(featuredArticle.category)"
                    >
                      {{ categoryLabel(featuredArticle.category) }}
                    </span>
                    <span>{{ featuredArticle.date }}</span>
                    <span v-if="featuredArticle.readingTime">• {{ featuredArticle.readingTime }}</span>
                  </div>
                  <h3 class="text-2xl font-bold text-secondary mb-4">{{ featuredArticle.title }}</h3>
                  <p class="text-gray-600 leading-relaxed mb-6">{{ featuredArticle.excerpt }}</p>
                  <button type="button" class="text-primary font-semibold hover:underline">
                    {{ t('blog.articles.readMore') }}
                  </button>
                </div>
              </article>

              <article
                v-for="article in filteredArticles"
                :key="article.id"
                class="bg-white rounded-2xl shadow-custom overflow-hidden hover-lift"
              >
                <NuxtImg
                  :src="article.image"
                  :alt="article.imageAlt"
                  class="w-full h-48 object-cover"
                  loading="lazy"
                  decoding="async"
                  format="webp"
                />
                <div class="p-6">
                  <div class="flex flex-wrap items-center gap-2 mb-3 text-sm text-gray-500">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                      :class="categoryBadgeClass(article.category)"
                    >
                      {{ categoryLabel(article.category) }}
                    </span>
                    <span>{{ article.date }}</span>
                  </div>
                  <h3 class="text-xl font-semibold text-secondary mb-3">{{ article.title }}</h3>
                  <p class="text-gray-600 text-sm mb-4">{{ article.excerpt }}</p>
                  <button type="button" class="text-primary font-semibold hover:underline text-sm">
                    {{ t('blog.articles.readMore') }}
                  </button>
                </div>
              </article>
            </div>

            <div class="text-center">
              <button
                type="button"
                class="bg-white border-2 border-primary text-primary px-8 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all"
              >
                {{ t('blog.articles.loadMore') }}
              </button>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1 space-y-8">
            <div class="bg-white rounded-2xl shadow-custom p-8">
              <div class="flex items-center mb-6">
                <Icon name="mdi:fire" class="text-orange-500 text-xl mr-3" />
                <h3 class="text-xl font-bold text-secondary">{{ sidebarPopular.title }}</h3>
              </div>
              <div class="space-y-6">
                <article
                  v-for="(item, index) in sidebarPopular.items"
                  :key="index"
                  class="pb-4"
                  :class="index !== sidebarPopular.items.length - 1 ? 'border-b border-gray-100' : ''"
                >
                  <h4 class="font-semibold text-secondary mb-2 text-sm leading-tight">{{ item.title }}</h4>
                  <div class="flex items-center text-xs text-gray-500">
                    <span>{{ item.date }}</span>
                    <span class="mx-2">•</span>
                    <span>{{ item.views }}</span>
                  </div>
                </article>
              </div>
            </div>

            <div class="bg-gradient-to-br from-primary to-red-600 rounded-2xl p-8 text-white">
              <div class="text-center">
                <Icon name="mdi:email-outline" class="text-3xl mb-4" />
                <h3 class="text-xl font-bold mb-3">{{ newsletter.title }}</h3>
                <p class="text-sm opacity-90 mb-6">{{ newsletter.description }}</p>
                <form class="space-y-4" @submit.prevent="handleNewsletterSubmit">
                  <input
                    v-model="newsletterEmail"
                    type="email"
                    :placeholder="newsletter.placeholder"
                    class="w-full px-4 py-3 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-white text-secondary"
                  >
                  <button
                    type="submit"
                    class="w-full bg-white text-primary py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                  >
                    {{ newsletter.button }}
                  </button>
                </form>
                <p class="text-xs opacity-75 mt-4">{{ newsletter.disclaimer }}</p>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-custom p-8">
              <h3 class="text-xl font-bold text-secondary mb-6">{{ quickLinks.title }}</h3>
              <div class="space-y-4">
                <button
                  v-for="link in quickLinks.items"
                  :key="link.id"
                  type="button"
                  class="flex items-center space-x-3 text-gray-600 hover:text-primary transition-colors w-full text-left"
                  @click="handleQuickLinkClick(link)"
                >
                  <Icon :name="quickLinkIcon(link.id)" class="w-5" />
                  <span class="text-sm font-medium">{{ link.label }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useApplicationModalStore } from '~/stores/applicationModal'

definePageMeta({
  layout: 'default',
  name: 'BlogPage'
})

const { t, tm } = useI18n()
const router = useRouter()
const localePath = useLocalePath()
const applicationModalStore = useApplicationModalStore()

useHead(() => ({
  title: t('blog.meta.title'),
  meta: [
    { name: 'description', content: t('blog.meta.description') },
    { property: 'og:title', content: t('blog.meta.title') },
    { property: 'og:description', content: t('blog.meta.description') },
    { property: 'og:type', content: 'website' }
  ]
}))

type HeroHighlight = { title: string; subtitle: string }
type HeroStat = { icon: string; label: string }
type HeroContent = {
  title: string
  titleAccent: string
  description: string
  searchPlaceholder: string
  imageAlt: string
  highlight: HeroHighlight
  stats: HeroStat[]
}

type BlogCategory = { label: string; showInFilters?: boolean }

type ArticleId =
  | 'visaGuide'
  | 'learnTurkish'
  | 'topUniversities'
  | 'fullScholarship'
  | 'studyCost'
  | 'housingIstanbul'
  | 'applicationGuide'
  | 'examChoice'
  | 'adaptation'

type ArticleContent = {
  title: string
  excerpt: string
  date: string
  imageAlt: string
  readingTime?: string
}

type ArticleConfig = {
  id: ArticleId
  category: string
  image: string
}

type TranslatedArticle = ArticleConfig & ArticleContent

type SidebarPopular = {
  title: string
  items: { title: string; date: string; views: string }[]
}

type NewsletterContent = {
  title: string
  description: string
  placeholder: string
  button: string
  disclaimer: string
}

type QuickLinksContent = {
  title: string
  items: { id: string; label: string }[]
}

const heroImage = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/ce3ce224a4-fadffc2f2c09d25befe6.png'

const articleConfigs: ArticleConfig[] = [
  {
    id: 'visaGuide',
    category: 'visas',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/4d45d15c4c-2f7df3cd5c6d26f67f4d.png'
  },
  {
    id: 'learnTurkish',
    category: 'exams',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/da2d1c6632-cf413938afbc3fab1ded.png'
  },
  {
    id: 'topUniversities',
    category: 'rankings',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/57489031df-a0c5d805a5c769e79e85.png'
  },
  {
    id: 'fullScholarship',
    category: 'scholarships',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e3901b0bf7-9a8ad8119465cdbbdbe0.png'
  },
  {
    id: 'studyCost',
    category: 'cost',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/af90cf6ff7-bebc6b59bbc09cfdceda.png'
  },
  {
    id: 'housingIstanbul',
    category: 'life',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/87e795516e-e01ab643ecae05c53996.png'
  },
  {
    id: 'applicationGuide',
    category: 'applications',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/0dd499ea10-24904ac07ef05238b5a7.png'
  },
  {
    id: 'examChoice',
    category: 'exams',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e66dae170a-2ce9fb303ed0b339b596.png'
  },
  {
    id: 'adaptation',
    category: 'life',
    image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/481982dfd9-487c04dee7cf597e1ff9.png'
  }
]

const featuredArticleId: ArticleId = 'visaGuide'

const categoryStyles: Record<string, string> = {
  visas: 'bg-blue-100 text-blue-800',
  exams: 'bg-green-100 text-green-800',
  scholarships: 'bg-yellow-100 text-yellow-800',
  cost: 'bg-orange-100 text-orange-800',
  life: 'bg-teal-100 text-teal-800',
  applications: 'bg-indigo-100 text-indigo-800',
  rankings: 'bg-purple-100 text-purple-800'
}

const quickLinkIcons: Record<string, string> = {
  universities: 'mdi:school-outline',
  checklist: 'mdi:file-document-check-outline',
  reviews: 'mdi:comment-quote-outline',
  consultation: 'mdi:headset'
}

const hero = computed<HeroContent>(() => {
  const value = tm('blog.hero') as Partial<HeroContent> | undefined
  return {
    title: value?.title ?? '',
    titleAccent: value?.titleAccent ?? '',
    description: value?.description ?? '',
    searchPlaceholder: value?.searchPlaceholder ?? '',
    imageAlt: value?.imageAlt ?? '',
    highlight: value?.highlight ?? { title: '', subtitle: '' },
    stats: value?.stats ?? []
  }
})

const categoriesMap = computed<Record<string, BlogCategory>>(() => (tm('blog.categories') as Record<string, BlogCategory>) || {})
const categoryOrder = computed<string[]>(() => (tm('blog.categoryOrder') as string[]) || [])

const filterCategories = computed(() => {
  const order = categoryOrder.value.length > 0 ? categoryOrder.value : Object.keys(categoriesMap.value)
  return order
    .map((key) => ({ key, ...(categoriesMap.value[key] || { label: key }) }))
    .filter((category) => category.showInFilters !== false)
})

const activeCategory = ref('all')

watchEffect(() => {
  if (!filterCategories.value.some((category) => category.key === activeCategory.value)) {
    activeCategory.value = filterCategories.value[0]?.key ?? 'all'
  }
})

const setActiveCategory = (key: string) => {
  activeCategory.value = key
}

const articleItems = computed<Record<string, ArticleContent>>(() => (tm('blog.articles.items') as Record<string, ArticleContent>) || {})

const translatedArticles = computed<TranslatedArticle[]>(() =>
  articleConfigs.map((config) => {
    const content = articleItems.value[config.id] || ({} as ArticleContent)
    return {
      ...config,
      title: content.title ?? '',
      excerpt: content.excerpt ?? '',
      date: content.date ?? '',
      imageAlt: content.imageAlt ?? '',
      readingTime: content.readingTime
    }
  })
)

const featuredArticle = computed(() => translatedArticles.value.find((article) => article.id === featuredArticleId))

const shouldShowFeatured = computed(() => {
  if (!featuredArticle.value) {
    return false
  }
  return activeCategory.value === 'all' || featuredArticle.value.category === activeCategory.value
})

const filteredArticles = computed(() => {
  const list = translatedArticles.value.filter((article) => article.id !== featuredArticleId)
  if (activeCategory.value === 'all') {
    return list
  }
  return list.filter((article) => article.category === activeCategory.value)
})

const categoryLabel = (key: string) => categoriesMap.value[key]?.label ?? ''
const categoryBadgeClass = (key: string) => categoryStyles[key] ?? 'bg-gray-100 text-gray-600'

const sidebarPopular = computed<SidebarPopular>(() => {
  const value = tm('blog.sidebar.popular') as SidebarPopular | undefined
  return {
    title: value?.title ?? '',
    items: value?.items ?? []
  }
})

const newsletter = computed<NewsletterContent>(() => {
  const value = tm('blog.sidebar.newsletter') as NewsletterContent | undefined
  return {
    title: value?.title ?? '',
    description: value?.description ?? '',
    placeholder: value?.placeholder ?? '',
    button: value?.button ?? '',
    disclaimer: value?.disclaimer ?? ''
  }
})

const quickLinks = computed<QuickLinksContent>(() => {
  const value = tm('blog.sidebar.quickLinks') as QuickLinksContent | undefined
  return {
    title: value?.title ?? '',
    items: value?.items ?? []
  }
})

const searchQuery = ref('')
const newsletterEmail = ref('')

const quickLinkIcon = (id: string) => quickLinkIcons[id] ?? 'mdi:arrow-right'

const handleNewsletterSubmit = () => {
  if (newsletterEmail.value) {
    console.log('Blog newsletter subscribe:', newsletterEmail.value)
    newsletterEmail.value = ''
  }
}

const handleQuickLinkClick = async (link: { id: string; label: string }) => {
  switch (link.id) {
    case 'universities':
      await router.push(localePath('/universities'))
      break
    case 'checklist':
      await router.push(localePath({ path: '/faq', query: { category: 'documents' } }))
      break
    case 'reviews':
      await router.push(localePath('/reviews'))
      break
    case 'consultation':
      applicationModalStore.openModal()
      break
    default:
      console.warn('Unhandled quick link click:', link.id)
  }
}
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
</style>
