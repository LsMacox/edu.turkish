import type { BlogArticleQuickFact, BlogArticleContentBlock } from '~~/lib/types'
import type { I18nKeyPath } from '~~/lib/i18n/schemas'
import { useContentParser } from '~/composables/useContentParser'
import { key } from '~~/lib/i18n'

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

export interface DetailPageI18nKeys {
  category: I18nKeyPath
  published: I18nKeyPath
  readingTime: I18nKeyPath
  copySuccess: I18nKeyPath
  copyError: I18nKeyPath
}

export interface DetailPageOptions {
  routeName: string
  i18nKeys: DetailPageI18nKeys
  includeReadingTime?: boolean
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
    i18nKeys,
    includeReadingTime = false,
    includePublishedDate = false,
  } = options

  const contentRef = computed(() => unref(item)?.content ?? [])
  const { tableOfContents } = useContentParser(contentRef)

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
        label: t(key('blog.articles.readingTime'), { minutes: data.readingTimeMinutes }),
      })
    }

    if (data.heroLocation) {
      result.push({ icon: 'mdi:map-marker-radius-outline', label: data.heroLocation })
    }

    return result
  })

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

    addFact({
      title: t(i18nKeys.category),
      value: data.category.label,
      icon: 'mdi:tag-outline',
    })

    if (includePublishedDate && data.publishedAt) {
      addFact({
        title: t(i18nKeys.published),
        value: formatDate(data.publishedAt),
        icon: 'mdi:calendar',
      })
    }

    if (includeReadingTime && data.readingTimeMinutes) {
      addFact({
        title: t(i18nKeys.readingTime),
        value: t(key('blog.articles.readingTime'), { minutes: data.readingTimeMinutes }),
        icon: 'mdi:clock-outline',
      })
    }

    for (const fact of data.quickFacts) {
      addFact(fact)
    }

    return result
  })

  const tags = computed(() => unref(item)?.tags ?? [])

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
        showToast(t(i18nKeys.copySuccess), { type: 'success' })
      } else {
        throw new Error('Clipboard API unavailable')
      }
    } catch {
      showToast(t(i18nKeys.copyError), { type: 'error' })
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
