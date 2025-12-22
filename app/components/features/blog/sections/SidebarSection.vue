<template>
  <div class="space-component-lg lg:sticky lg:top-24 lg:self-start">
    <BaseCard variant="bordered">
      <h3
        class="flex items-center gap-component-sm text-body-sm font-bold uppercase tracking-wide text-hint"
      >
        <Icon name="mdi:fire" class="text-icon-lg text-orange-500" />
        {{ popular.title }}
      </h3>
      <nav class="mt-component-md space-component-sm">
        <component
          :is="item.slug ? NuxtLink : 'div'"
          v-for="(item, index) in popular.items"
          :key="item.id"
          :to="item.slug ? articleLink(item.slug) : undefined"
          class="group flex w-full items-center gap-component-md rounded-button list-item-padding text-body-sm text-left transition-default hover:bg-primary/5"
          :class="{ 'cursor-default': !item.slug }"
        >
          <span
            class="toc-badge bg-surface-elevated text-meta group-hover:bg-primary group-hover:text-white transition-color"
          >
            {{ index + 1 }}
          </span>
          <div class="min-w-0 flex-1">
            <span
              class="line-clamp-2 text-body-sm group-hover:text-secondary transition-color block"
            >
              {{ item.title }}
            </span>
            <span v-if="item.date" class="text-body-sm text-hint block">
              {{ item.date }}
            </span>
          </div>
        </component>
      </nav>
    </BaseCard>

    <BaseCard variant="bordered">
      <h3
        class="flex items-center gap-component-sm text-body-sm font-bold uppercase tracking-wide text-hint"
      >
        <Icon name="mdi:link-variant" class="text-icon-lg" />
        {{ quickLinks.title }}
      </h3>
      <ClientOnly>
        <div class="mt-component-md space-component-sm">
          <button
            v-for="link in quickLinks.items"
            :key="link.id"
            type="button"
            class="group flex w-full items-center gap-component-md rounded-button list-item-padding text-body-sm text-left transition-default hover:bg-primary/5"
            @click="$emit('quick-link', link.id)"
          >
            <span
              class="toc-badge bg-surface-elevated text-meta group-hover:bg-primary group-hover:text-white transition-color"
            >
              <Icon :name="quickLinkIcon(link.id)" class="text-icon-sm" />
            </span>
            <span class="text-body-sm group-hover:text-secondary transition-color">
              {{ link.label }}
            </span>
          </button>
        </div>
      </ClientOnly>
    </BaseCard>
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
