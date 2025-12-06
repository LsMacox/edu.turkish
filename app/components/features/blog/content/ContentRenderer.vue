<template>
  <div :class="containerClass">
    <template v-for="(block, index) in normalizedContent" :key="`${block.type}-${index}`">
      <!-- Heading -->
      <!-- eslint-disable vue/no-v-html, vue/no-v-text-v-html-on-component -->
      <component
        :is="getHeadingTag(block.level)"
        v-if="block.type === 'heading'"
        :id="block.id"
        :class="headingClass(block.level)"
        v-html="block.text"
      />
      <!-- eslint-enable vue/no-v-html, vue/no-v-text-v-html-on-component -->

      <!-- Paragraph with widget support -->
      <template v-else-if="block.type === 'paragraph'">
        <!-- UNIVERSITIES widget -->
        <template v-if="enableWidgets && hasWidget(block.text, 'UNIVERSITIES')">
          <!-- eslint-disable vue/no-v-html -->
          <p 
            v-if="stripWidget(block.text, 'UNIVERSITIES')" 
            :class="paragraphClass" 
            v-html="stripWidget(block.text, 'UNIVERSITIES')" 
          />
          <!-- eslint-enable vue/no-v-html -->
          <LazyBlogUniversitiesGridWidget />
        </template>

        <!-- PRICE widget -->
        <LazyBlogPriceCardWidget 
          v-else-if="enableWidgets && hasWidget(block.text, 'PRICE')" 
          :text="stripWidget(block.text, 'PRICE')"
        />

        <!-- PROSCONS widget -->
        <LazyBlogProsConsWidget
          v-else-if="enableWidgets && hasProsConsWidget(block.text)"
          :data="parseProsConsWidget(block.text)"
        />

        <!-- GALLERY widget -->
        <LazyBlogImageGalleryWidget
          v-else-if="enableWidgets && hasGalleryWidget(block.text)"
          :data="parseGalleryWidget(block.text)"
        />

        <!-- Regular paragraph -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-else :class="paragraphClass" v-html="block.text" />
      </template>

      <!-- List -->
      <BlogContentList
        v-else-if="block.type === 'list'"
        :items="block.items"
        :ordered="block.ordered"
        :list-style="block.style"
      />

      <!-- FAQ -->
      <BlogContentFaq
        v-else-if="block.type === 'faq'"
        :items="block.items"
      />

      <!-- Image -->
      <figure v-else-if="block.type === 'image'" :class="imageContainerClass">
        <img
          :src="block.url"
          :alt="block.alt || fallbackAlt"
          :class="imageClass(block.width)"
          loading="lazy"
        />
        <!-- eslint-disable vue/no-v-html -->
        <figcaption
          v-if="block.caption"
          :class="captionClass(block.width)"
          v-html="block.caption"
        />
        <!-- eslint-enable vue/no-v-html -->
      </figure>

      <!-- Quote -->
      <blockquote
        v-else-if="block.type === 'quote'"
        :class="quoteClass"
      >
        <Icon v-if="variant === 'article'" name="mdi:format-quote-open" class="text-2xl text-primary" />
        <p v-if="variant === 'powerpage'" class="text-xl font-medium text-secondary italic mb-4">
          "{{ block.text }}"
        </p>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-else class="font-medium text-secondary" v-html="block.text" />
        <cite v-if="block.author" :class="citeClass">
          <template v-if="variant === 'powerpage'">— </template>{{ block.author }}
        </cite>
      </blockquote>

      <!-- Spacer -->
      <div
        v-else-if="block.type === 'spacer'"
        :class="spacerClass(block.size)"
      />

      <!-- Divider -->
      <hr v-else-if="block.type === 'divider'" :class="dividerClass" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { BlogArticleContentBlock } from '~~/server/types/api'
import { useContentParser, getHeadingTag } from '~/composables/useContentParser'

export type ContentVariant = 'article' | 'powerpage'

const props = withDefaults(defineProps<{
  content: BlogArticleContentBlock[]
  variant?: ContentVariant
  enableWidgets?: boolean
  fallbackAlt?: string
}>(), {
  variant: 'article',
  enableWidgets: false,
  fallbackAlt: '',
})

const contentRef = computed(() => props.content)
const { normalizedContent } = useContentParser(contentRef)

// Widget helpers
const hasWidget = (text: string, widgetName: string) => {
  return text.includes(`{{WIDGET:${widgetName}}}`)
}

const stripWidget = (text: string, widgetName: string) => {
  return text.replace(`{{WIDGET:${widgetName}}}`, '').trim()
}

// PROSCONS widget helpers
const PROSCONS_PREFIX = '{{WIDGET:PROSCONS:'

const hasProsConsWidget = (text: string) => {
  return text.includes(PROSCONS_PREFIX)
}

const extractProsConsJson = (text: string): string | null => {
  const start = text.indexOf(PROSCONS_PREFIX)
  if (start === -1) return null

  let depth = 0
  const jsonStart = start + PROSCONS_PREFIX.length

  for (let i = jsonStart; i < text.length; i++) {
    if (text[i] === '{') depth++
    else if (text[i] === '}') {
      depth--
      if (depth === 0) {
        return text.substring(jsonStart, i + 1)
      }
    }
  }
  return null
}

const parseProsConsWidget = (text: string) => {
  const json = extractProsConsJson(text)
  if (json) {
    try {
      return JSON.parse(json)
    } catch {
      return { pros: [], cons: [] }
    }
  }
  return { pros: [], cons: [] }
}

// GALLERY widget helpers
const GALLERY_PREFIX = '{{WIDGET:GALLERY:'

const hasGalleryWidget = (text: string) => {
  return text.includes(GALLERY_PREFIX)
}

const extractGalleryJson = (text: string): string | null => {
  const start = text.indexOf(GALLERY_PREFIX)
  if (start === -1) return null

  let depth = 0
  const jsonStart = start + GALLERY_PREFIX.length

  for (let i = jsonStart; i < text.length; i++) {
    if (text[i] === '{') depth++
    else if (text[i] === '}') {
      depth--
      if (depth === 0) {
        return text.substring(jsonStart, i + 1)
      }
    }
  }
  return null
}

const parseGalleryWidget = (text: string) => {
  const json = extractGalleryJson(text)
  if (json) {
    try {
      return JSON.parse(json)
    } catch {
      return { images: [] }
    }
  }
  return { images: [] }
}

// Variant-based classes
const containerClass = computed(() => {
  if (props.variant === 'powerpage') {
    return 'space-y-8 text-lg leading-relaxed text-gray-700'
  }
  return 'space-y-6'
})

const headingClass = (level: number) => {
  if (props.variant === 'powerpage') {
    return [
      'font-bold text-secondary mt-12 mb-6',
      {
        'text-3xl md:text-4xl': level === 2,
        'text-2xl md:text-3xl': level === 3,
        'text-xl md:text-2xl': level >= 4,
      },
    ]
  }
  return 'scroll-mt-24 text-2xl font-semibold text-secondary lg:text-3xl'
}

const paragraphClass = computed(() => {
  if (props.variant === 'powerpage') {
    return 'mb-6'
  }
  return 'leading-relaxed text-gray-600'
})

const imageContainerClass = computed(() => {
  if (props.variant === 'powerpage') {
    return 'my-10'
  }
  return 'space-y-3'
})

const imageClass = (width?: 'standard' | 'wide' | 'full') => {
  if (props.variant === 'powerpage') {
    return [
      'rounded-2xl shadow-xl w-full object-cover',
      { 'aspect-video': width === 'full' },
    ]
  }
  return [
    'object-cover',
    width === 'full'
      ? '-mx-6 w-[calc(100%+3rem)] max-w-none rounded-none lg:-mx-10 lg:w-[calc(100%+5rem)]'
      : 'w-full rounded-2xl',
  ]
}

const captionClass = (width?: 'standard' | 'wide' | 'full') => {
  if (props.variant === 'powerpage') {
    return 'mt-3 text-center text-sm text-gray-500'
  }
  return [
    'text-sm text-gray-500',
    { 'px-6 lg:px-10': width === 'full' },
  ]
}

const quoteClass = computed(() => {
  if (props.variant === 'powerpage') {
    return 'my-10 p-8 bg-blue-50 rounded-2xl border-l-4 border-primary'
  }
  return 'space-y-2 rounded-xl bg-gradient-to-br from-primary/5 via-white to-secondary/5 p-5 shadow-sm'
})

const citeClass = computed(() => {
  if (props.variant === 'powerpage') {
    return 'block text-sm font-bold text-primary uppercase tracking-wide not-italic'
  }
  return 'block text-sm text-gray-500'
})

const spacerClass = (size: 'sm' | 'md' | 'lg' | 'xl') => {
  if (props.variant === 'powerpage') {
    return {
      'h-8': size === 'sm',
      'h-16': size === 'md',
      'h-24': size === 'lg',
      'h-32': size === 'xl',
    }
  }
  return {
    'h-4': size === 'sm',
    'h-8': size === 'md',
    'h-12': size === 'lg',
    'h-16': size === 'xl',
  }
}

const dividerClass = computed(() => {
  if (props.variant === 'powerpage') {
    return 'my-12 border-gray-200'
  }
  return 'border-gray-100 my-4'
})
</script>
