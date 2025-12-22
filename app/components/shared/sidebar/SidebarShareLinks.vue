<template>
  <div :class="['rounded-responsive bg-surface card-padding', containerClass]">
    <h3 class="section-label">
      <Icon name="mdi:share-variant" class="text-icon-lg" />
      {{ title }}
    </h3>
    <p v-if="description" class="mt-component-xs text-body-sm text-meta">
      {{ description }}
    </p>
    <div class="mt-component-sm flex flex-wrap gap-component-sm">
      <a
        v-for="link in links"
        :key="link.label"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-component-sm rounded-button border border-gray-200 bg-white px-3 py-2 text-body-sm font-medium text-body-sm shadow-button transition-default hover:border-primary hover:text-primary hover:shadow-card"
      >
        <Icon :name="link.icon" class="text-icon" />
        {{ link.label }}
      </a>
      <BaseButton
        v-if="showCopyLink"
        variant="secondary"
        size="sm"
        icon="mdi:link-variant"
        class="shadow-button hover:border-primary hover:text-primary hover:shadow-card"
        @click="$emit('copy-link')"
      >
        {{ copyLinkText }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface ShareLink {
  label: string
  href: string
  icon: string
}

withDefaults(defineProps<{
  title: string
  description?: string
  links: ShareLink[]
  showCopyLink?: boolean
  copyLinkText?: string
  containerClass?: string
}>(), {
  showCopyLink: true,
  copyLinkText: 'Copy link',
  containerClass: '',
})

defineEmits<{
  'copy-link': []
}>()
</script>
