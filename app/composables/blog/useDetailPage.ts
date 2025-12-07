import type { BlogArticleQuickFact, BlogArticleContentBlock } from '~~/server/types/api'
import { useContentParser } from '~/composables/useContentParser'

export interface DetailPageItem {
  title: string
  slug: string
  image: string | null
  imageAlt?: string
  heroImage: string | null
  heroImageAlt?: string
  heroKicker?: string
  heroSubtitle?: string
  heroLocation?: string
  excerpt?: string
  publishedAt: string
  readingTimeMinutes?: number | null
  content: BlogArticleContentBlock[]
  quickFacts: BlogArticleQuickFact[]
  tags: string[]
  category: {
    key: string
    label: string
  }
}

export interface DetailPageOptions {
  /** Route name for generating URLs */
  routeName: string
  /** i18n key prefix for quick facts translations */
  i18nPrefix: string
  /** i18n key prefix for share translations (defaults to parent of i18nPrefix) */
  shareI18nPrefix?: string
  /** Whether to include reading time in quick facts */
  includeReadingTime?: boolean
  /** Whether to include published date in quick facts */
  includePublishedDate?: boolean
}

/**
 * Composable for shared logic between article and program detail pages
 */
export function useDetailPage<T extends DetailPageItem>(
  item: Ref<T | null> | ComputedRef<T | null>,
  options: DetailPageOptions,
) {
  const { t, formatDate } = useI18nHelpers()
  const localePath = useLocalePath()
  const { show: showToast } = useToast()
  const requestUrl = useRequestURL()

  const {
    routeName,
    i18nPrefix,
    shareI18nPrefix,
    includeReadingTime = false,
    includePublishedDate = false,
  } = options

  // Derive share prefix from i18nPrefix if not provided
  // e.g., 'article.quickFacts' -> 'article', 'programs.detail' -> 'programs.detail'
  const resolvedSharePrefix = shareI18nPrefix ?? i18nPrefix.replace(/\.quickFacts$/, '')

  // Content parsing
  const contentRef = computed(() => unref(item)?.content ?? [])
  const { tableOfContents } = useContentParser(contentRef)

  // Hero image handling with fallback
  const failedHero = ref(false)

  const heroImage = computed(() => unref(item)?.heroImage ?? null)

  const resolvedHeroImage = computed(() => {
    const data = unref(item)
    if (!data) return null
    if (failedHero.value) return data.image ?? null
    return heroImage.value ?? data.image ?? null
  })

  const heroImageAlt = computed(() => {
    const data = unref(item)
    return data?.heroImageAlt ?? data?.imageAlt ?? data?.title ?? ''
  })

  const heroSubtitle = computed(() => {
    const data = unref(item)
    return data?.heroSubtitle ?? data?.excerpt ?? ''
  })

  const heroKicker = computed(() => {
    const data = unref(item)
    return data?.heroKicker ?? data?.category.label ?? ''
  })

  const onHeroImageError = () => {
    failedHero.value = true
  }

  // Hero meta items (date, reading time, location)
  const heroMeta = computed(() => {
    const data = unref(item)
    if (!data) return []

    const result: Array<{ icon: string; label: string }> = []

    if (data.publishedAt) {
      result.push({ icon: 'mdi:calendar', label: formatDate(data.publishedAt) })
    }

    if (data.readingTimeMinutes) {
      result.push({
        icon: 'mdi:clock-outline',
        label: t('blog.articles.readingTime', { minutes: data.readingTimeMinutes }),
      })
    }

    if (data.heroLocation) {
      result.push({ icon: 'mdi:map-marker-radius-outline', label: data.heroLocation })
    }

    return result
  })

  // Quick facts with deduplication
  const quickFacts = computed<BlogArticleQuickFact[]>(() => {
    const data = unref(item)
    if (!data) return []

    const result: BlogArticleQuickFact[] = []
    const seen = new Set<string>()

    const addFact = (fact: BlogArticleQuickFact) => {
      const title = fact.title?.trim()
      const value = fact.value?.trim()

      if (!title || !value) return

      const key = title.toLowerCase()
      if (seen.has(key)) return

      seen.add(key)
      result.push({ title, value, icon: fact.icon })
    }

    // Category
    addFact({
      title: t(`${i18nPrefix}.category`),
      value: data.category.label,
      icon: 'mdi:tag-outline',
    })

    // Published date
    if (includePublishedDate && data.publishedAt) {
      addFact({
        title: t(`${i18nPrefix}.published`),
        value: formatDate(data.publishedAt),
        icon: 'mdi:calendar',
      })
    }

    // Reading time
    if (includeReadingTime && data.readingTimeMinutes) {
      addFact({
        title: t(`${i18nPrefix}.readingTime`),
        value: t('blog.articles.readingTime', { minutes: data.readingTimeMinutes }),
        icon: 'mdi:clock-outline',
      })
    }

    // Custom quick facts
    for (const fact of data.quickFacts) {
      addFact(fact)
    }

    return result
  })

  // Tags
  const tags = computed(() => unref(item)?.tags ?? [])

  // URL generation
  const itemPath = computed(() => {
    const data = unref(item)
    if (!data) return '/'
    return localePath({ name: routeName, params: { slug: data.slug } })
  })

  const itemUrl = computed(() => {
    const path = itemPath.value
    if (import.meta.client) {
      return new URL(path, window.location.origin).toString()
    }
    return new URL(path, requestUrl.origin).toString()
  })

  // Share links
  const shareLinks = computed(() => {
    const url = itemUrl.value
    const title = unref(item)?.title ?? ''

    return [
      {
        label: 'Telegram',
        icon: 'mdi:telegram',
        href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      },
      {
        label: 'WhatsApp',
        icon: 'mdi:whatsapp',
        href: `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`,
      },
    ]
  })

  const copyShareLink = async () => {
    try {
      if (import.meta.client && navigator?.clipboard) {
        await navigator.clipboard.writeText(itemUrl.value)
        showToast(t(`${resolvedSharePrefix}.share.copySuccess`), { type: 'success' })
      } else {
        throw new Error('Clipboard API unavailable')
      }
    } catch {
      showToast(t(`${resolvedSharePrefix}.share.copyError`), { type: 'error' })
    }
  }

  return {
    // Content
    tableOfContents,
    // Hero
    resolvedHeroImage,
    heroImageAlt,
    heroSubtitle,
    heroKicker,
    heroMeta,
    onHeroImageError,
    // Quick facts & tags
    quickFacts,
    tags,
    // Sharing
    itemPath,
    itemUrl,
    shareLinks,
    copyShareLink,
  }
}
