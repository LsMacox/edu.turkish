<template>
  <div :class="styles.container">
    <template v-for="(block, index) in normalizedContent" :key="`${block.type}-${index}`">
      <!-- Heading -->
      <template v-if="block.type === 'heading'">
        <!-- eslint-disable vue/no-v-html, vue/no-v-text-v-html-on-component -->
        <component
          :is="getHeadingTag(block.level)"
          :id="block.id"
          :class="styles.heading(block.level)"
          v-html="block.text"
        />
        <!-- eslint-enable vue/no-v-html, vue/no-v-text-v-html-on-component -->
      </template>

      <!-- Paragraph with widget support -->
      <template v-else-if="block.type === 'paragraph'">
        <!-- Widget detected (using cached result) -->
        <template v-if="enableWidgets && widgetCache.get(block.text)">
          <!-- eslint-disable vue/no-v-html -->
          <p
            v-if="widgetTextBeforeCache.get(block.text)"
            :class="styles.paragraph"
            v-html="widgetTextBeforeCache.get(block.text)"
          />
          <!-- eslint-enable vue/no-v-html -->
          <component
            :is="widgetCache.get(block.text)!.component"
            v-bind="widgetCache.get(block.text)!.props"
          />
        </template>

        <!-- Regular paragraph -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-else :class="styles.paragraph" v-html="block.text" />
      </template>

      <!-- List -->
      <BlogContentList
        v-else-if="block.type === 'list'"
        :items="block.items"
        :ordered="block.ordered"
        :list-style="block.style"
      />

      <!-- FAQ -->
      <BlogContentFaq v-else-if="block.type === 'faq'" :items="block.items" />

      <!-- Image -->
      <figure v-else-if="block.type === 'image'" :class="styles.imageContainer">
        <img
          :src="block.url"
          :alt="block.alt || fallbackAlt"
          :class="styles.image(block.width)"
          loading="lazy"
        />
        <!-- eslint-disable vue/no-v-html -->
        <figcaption
          v-if="block.caption"
          :class="styles.caption(block.width)"
          v-html="block.caption"
        />
        <!-- eslint-enable vue/no-v-html -->
      </figure>

      <!-- Quote -->
      <blockquote v-else-if="block.type === 'quote'" :class="styles.quote">
        <Icon
          v-if="variant === 'article'"
          name="mdi:format-quote-open"
          class="absolute -left-1 -top-2 text-4xl text-primary/20"
        />
        <p v-if="variant === 'powerpage'" class="text-xl font-medium text-secondary italic mb-4">
          "{{ block.text }}"
        </p>
        <!-- eslint-disable vue/no-v-html -->
        <p
          v-else
          class="text-lg font-medium text-secondary italic leading-relaxed"
          v-html="block.text"
        />
        <!-- eslint-enable vue/no-v-html -->
        <cite v-if="block.author" :class="styles.cite">
          <template v-if="variant === 'powerpage'">— </template>
          <template v-else>— </template>
          {{ block.author }}
        </cite>
      </blockquote>

      <!-- Spacer -->
      <div v-else-if="block.type === 'spacer'" :class="styles.spacer(block.size)" />

      <!-- Divider -->
      <hr v-else-if="block.type === 'divider'" :class="styles.divider" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { BlogArticleContentBlock } from '~~/lib/types'
import { useContentParser, getHeadingTag } from '~/composables/useContentParser'
import { variantStyles, type ContentVariant } from '~~/lib/domain/blog/contentRendererStyles'
import {
  createWidgetRegistry,
  detectWidget as detectWidgetFn,
  getWidgetTextBefore as getWidgetTextBeforeFn,
  type WidgetMatch,
} from '~~/lib/domain/blog/widgetRegistry'

const props = withDefaults(
  defineProps<{
    content: BlogArticleContentBlock[]
    variant?: ContentVariant
    enableWidgets?: boolean
    fallbackAlt?: string
  }>(),
  {
    variant: 'article',
    enableWidgets: false,
    fallbackAlt: '',
  },
)

const contentRef = computed(() => props.content)
const { normalizedContent } = useContentParser(contentRef)

// Widget registry (created once)
const widgetRegistry = createWidgetRegistry()

// Cached widget detection - avoids repeated calls in template
const widgetCache = computed(() => {
  const cache = new Map<string, WidgetMatch | null>()
  if (!props.enableWidgets) return cache

  for (const block of normalizedContent.value) {
    if (block.type === 'paragraph') {
      const match = detectWidgetFn(block.text, widgetRegistry)
      if (match) cache.set(block.text, match)
    }
  }
  return cache
})

// Cached text-before-widget extraction
const widgetTextBeforeCache = computed(() => {
  const cache = new Map<string, string>()
  if (!props.enableWidgets) return cache

  for (const [text] of widgetCache.value) {
    const before = getWidgetTextBeforeFn(text, widgetRegistry)
    if (before) cache.set(text, before)
  }
  return cache
})

// Styles based on variant
const styles = computed(() => variantStyles[props.variant])
</script>
