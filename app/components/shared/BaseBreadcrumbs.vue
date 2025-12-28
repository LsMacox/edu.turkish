<template>
  <nav aria-label="Breadcrumb" class="text-body-sm text-meta">
    <ol class="flex items-center flex-wrap gap-component-xs">
      <li class="flex items-center">
        <NuxtLink
          :to="localePath('/')"
          class="hover:text-primary transition-color"
        >
          {{ t(ns('home')) }}
        </NuxtLink>
      </li>
      <li
        v-for="(crumb, index) in items"
        :key="crumb.path || index"
        class="flex items-center"
      >
        <Icon name="mdi:chevron-right" class="text-icon-xs mx-1 text-hint" />
        <NuxtLink
          v-if="crumb.path && index < items.length - 1"
          :to="localePath(crumb.path)"
          class="hover:text-primary transition-color"
        >
          {{ crumb.label }}
        </NuxtLink>
        <span v-else class="text-secondary font-medium">
          {{ crumb.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'

export interface BreadcrumbItem {
  label: string
  path?: string
}

defineProps<{
  items: BreadcrumbItem[]
}>()

const ns = namespace('breadcrumbs')
const { t } = useI18n()
const localePath = useLocalePath()
</script>
