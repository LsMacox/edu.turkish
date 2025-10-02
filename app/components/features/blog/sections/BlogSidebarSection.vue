<template>
  <div class="space-y-8">
    <div class="bg-white rounded-2xl shadow-custom p-8">
      <div class="flex items-center mb-6">
        <Icon name="mdi:fire" class="text-orange-500 text-xl mr-3" />
        <h3 class="text-card-title">{{ popular.title }}</h3>
      </div>
      <div class="space-y-6">
        <article
          v-for="(item, index) in popular.items"
          :key="item.id"
          class="pb-4"
          :class="index !== popular.items.length - 1 ? 'border-b border-gray-100' : ''"
        >
          <NuxtLink
            v-if="item.slug"
            :to="articleLink(item.slug)"
            class="block font-semibold text-secondary mb-2 text-sm leading-tight hover:text-primary transition-colors"
          >
            {{ item.title }}
          </NuxtLink>
          <p v-else class="font-semibold text-secondary mb-2 text-sm leading-tight">
            {{ item.title }}
          </p>
          <div class="flex items-center text-xs text-gray-500 gap-2">
            <span v-if="item.date">{{ item.date }}</span>
            <template v-if="item.date && item.views">
              <span>•</span>
            </template>
            <span v-if="item.views">{{ item.views }}</span>
          </div>
        </article>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-custom p-8">
      <h3 class="text-card-title mb-6">{{ quickLinks.title }}</h3>
      <ClientOnly>
        <div class="space-y-4">
          <button
            v-for="link in quickLinks.items"
            :key="link.id"
            type="button"
            class="flex items-center space-x-3 text-gray-600 hover:text-primary transition-colors w-full text-left"
            @click="$emit('quick-link', link.id)"
          >
            <Icon :name="'' + quickLinkIcon(link.id)" class="w-5" />
            <span class="text-sm font-medium">{{ link.label }}</span>
          </button>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
type SidebarPopularItem = {
  id: string | number
  slug: string | null
  title: string
  date: string
  views: string
}

type SidebarPopular = {
  title: string
  items: SidebarPopularItem[]
}

type QuickLinksContent = {
  title: string
  items: { id: string; label: string }[]
}

defineProps<{
  popular: SidebarPopular
  quickLinks: QuickLinksContent
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

