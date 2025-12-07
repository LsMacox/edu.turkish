import type { TableOfContentsItem } from '~/composables/useContentParser'

export interface UseTableOfContentsScrollspyOptions {
  /** Offset from top of viewport to trigger section change (default: 150) */
  offset?: number
  /** Offset from top when scrolling to section (default: 100) */
  scrollOffset?: number
  /** Delay before re-enabling scroll listener after programmatic scroll (default: 600) */
  scrollDelay?: number
}

/**
 * Composable for Table of Contents scrollspy functionality
 * Tracks active section based on scroll position and provides smooth scroll to sections
 */
export function useTableOfContentsScrollspy(
  tableOfContents: Ref<TableOfContentsItem[]> | ComputedRef<TableOfContentsItem[]>,
  options: UseTableOfContentsScrollspyOptions = {},
) {
  const { offset = 150, scrollOffset = 100, scrollDelay = 600 } = options

  const activeSectionId = ref('')
  const isScrollingProgrammatically = ref(false)

  const updateActiveSection = () => {
    if (isScrollingProgrammatically.value) return

    let currentId = ''
    let foundCount = 0

    for (const section of tableOfContents.value) {
      const element = document.getElementById(section.id)
      if (element) {
        foundCount++
        const rect = element.getBoundingClientRect()
        if (rect.top <= offset) {
          currentId = section.id
        }
      }
    }

    if (foundCount === 0 && tableOfContents.value.length > 0) {
      console.warn(
        '[ToC] No elements found. Expected IDs:',
        tableOfContents.value.map((s) => s.id),
      )
    }

    if (!currentId && tableOfContents.value.length > 0) {
      currentId = tableOfContents.value[0]?.id ?? ''
    }

    activeSectionId.value = currentId
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (!element) {
      console.warn('[ToC] Element not found:', id)
      return
    }

    isScrollingProgrammatically.value = true
    activeSectionId.value = id

    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - scrollOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })

    setTimeout(() => {
      isScrollingProgrammatically.value = false
    }, scrollDelay)
  }

  let scrollTimeout: ReturnType<typeof setTimeout> | null = null

  const onScroll = () => {
    if (isScrollingProgrammatically.value) return

    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }
    scrollTimeout = setTimeout(() => {
      updateActiveSection()
      scrollTimeout = null
    }, 50)
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    setTimeout(() => {
      updateActiveSection()
    }, 200)
  })

  watch(tableOfContents, () => {
    nextTick(() => {
      if (!isScrollingProgrammatically.value) {
        updateActiveSection()
      }
    })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    if (scrollTimeout) clearTimeout(scrollTimeout)
  })

  return {
    activeSectionId,
    scrollToSection,
  }
}
