<template>
  <div class="space-y-6 lg:sticky lg:top-24 lg:self-start">
    <div class="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-100/50">
      <h3
        class="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400"
      >
        <Icon name="mdi:fire" class="text-lg text-orange-500" />
        {{ popular.title }}
      </h3>
      <nav class="mt-4 space-y-1">
        <component
          :is="item.slug ? NuxtLink : 'div'"
          v-for="(item, index) in popular.items"
          :key="item.id"
          :to="item.slug ? articleLink(item.slug) : undefined"
          class="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-left transition-all hover:bg-primary/5"
          :class="{ 'cursor-default': !item.slug }"
        >
          <span
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold bg-gray-100 text-gray-500 group-hover:bg-primary group-hover:text-white transition-colors"
          >
            {{ index + 1 }}
          </span>
          <div class="min-w-0 flex-1">
            <span
              class="line-clamp-2 text-gray-600 group-hover:text-secondary transition-colors block"
            >
              {{ item.title }}
            </span>
            <span v-if="item.date" class="text-xs text-gray-400 block">
              {{ item.date }}
            </span>
          </div>
        </component>
      </nav>
    </div>

    <div class="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-gray-100/50">
      <h3
        class="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400"
      >
        <Icon name="mdi:link-variant" class="text-lg" />
        {{ quickLinks.title }}
      </h3>
      <ClientOnly>
        <div class="mt-4 space-y-1">
          <button
            v-for="link in quickLinks.items"
            :key="link.id"
            type="button"
            class="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-left transition-all hover:bg-primary/5"
            @click="$emit('quick-link', link.id)"
          >
            <span
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 group-hover:bg-primary group-hover:text-white transition-colors"
            >
              <Icon :name="quickLinkIcon(link.id)" class="text-sm" />
            </span>
            <span class="text-gray-600 group-hover:text-secondary transition-colors">
              {{ link.label }}
            </span>
          </button>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
const NuxtLink = resolveComponent('NuxtLink')

defineProps<{
  popular: {
    title: string
    items: Array<{ id: string | number; slug: string | null; title: string; date: string }>
  }
  quickLinks: {
    title: string
    items: Array<{ id: string; label: string }>
  }
}>()

defineEmits<{
  (e: 'quick-link', id: string): void
}>()

const localePath = useLocalePath()
const articleLink = (slug: string) => localePath({ name: 'articles-slug', params: { slug } })

const quickLinkIcons: Record<string, string> = {
  universities: 'mdi:school-outline',
  checklist: 'mdi:file-document-check-outline',
  reviews: 'mdi:comment-quote-outline',
  consultation: 'mdi:headset',
}

const quickLinkIcon = (id: string) => quickLinkIcons[id] ?? 'mdi:arrow-right'
</script>
