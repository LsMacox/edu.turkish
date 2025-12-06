<template>
  <div class="space-y-8 text-lg leading-relaxed text-gray-700">
    <template v-for="(block, index) in content" :key="index">
      <!-- eslint-disable vue/no-v-html, vue/no-v-text-v-html-on-component -->
      <component
        :is="`h${block.level}`"
        v-if="block.type === 'heading'"
        class="font-bold text-secondary mt-12 mb-6"
        :class="{
          'text-3xl md:text-4xl': block.level === 2,
          'text-2xl md:text-3xl': block.level === 3,
          'text-xl md:text-2xl': block.level >= 4
        }"
        v-html="block.text"
      />
      <!-- eslint-enable vue/no-v-html, vue/no-v-text-v-html-on-component -->

      <template v-else-if="block.type === 'paragraph'">
        <template v-if="hasWidget(block.text, 'UNIVERSITIES')">
          <!-- eslint-disable vue/no-v-html -->
          <p 
            v-if="stripWidget(block.text, 'UNIVERSITIES')" 
            class="mb-6" 
            v-html="stripWidget(block.text, 'UNIVERSITIES')" 
          />
          <!-- eslint-enable vue/no-v-html -->
          <LazyBlogWidgetsUniversitiesGridWidget />
        </template>
        <LazyBlogWidgetsPriceCardWidget 
          v-else-if="hasWidget(block.text, 'PRICE')" 
          :text="stripWidget(block.text, 'PRICE')"
        />
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-else class="mb-6" v-html="block.text" />
      </template>

      <LazyBlogContentContentList
        v-else-if="block.type === 'list'"
        :items="block.items"
        :ordered="block.ordered"
        :list-style="block.style"
      />

      <LazyBlogContentContentFaq
        v-else-if="block.type === 'faq'"
        :items="block.items"
      />

      <div
        v-else-if="block.type === 'quote'"
        class="my-10 p-8 bg-blue-50 rounded-2xl border-l-4 border-primary"
      >
        <p class="text-xl font-medium text-secondary italic mb-4">
          "{{ block.text }}"
        </p>
        <cite v-if="block.author" class="block text-sm font-bold text-primary uppercase tracking-wide not-italic">
          — {{ block.author }}
        </cite>
      </div>

      <figure v-else-if="block.type === 'image'" class="my-10">
        <NuxtImg
          :src="block.url"
          :alt="block.alt"
          class="rounded-2xl shadow-xl w-full object-cover"
          :class="block.width === 'full' ? 'aspect-video' : ''"
        />
        <figcaption v-if="block.caption" class="mt-3 text-center text-sm text-gray-500">
          {{ block.caption }}
        </figcaption>
      </figure>

      <div
        v-else-if="block.type === 'spacer'"
        :class="{
          'h-8': block.size === 'sm',
          'h-16': block.size === 'md',
          'h-24': block.size === 'lg',
          'h-32': block.size === 'xl',
        }"
      />

      <hr v-else-if="block.type === 'divider'" class="my-12 border-gray-200" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { BlogArticleContentBlock } from '~~/server/types/api'

const props = defineProps<{
  content: BlogArticleContentBlock[]
}>()

const hasWidget = (text: string, widgetName: string) => {
  return text.includes(`{{WIDGET:${widgetName}}}`)
}

const stripWidget = (text: string, widgetName: string) => {
  return text.replace(`{{WIDGET:${widgetName}}}`, '').trim()
}

</script>
