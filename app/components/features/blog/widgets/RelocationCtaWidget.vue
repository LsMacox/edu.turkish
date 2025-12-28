<template>
  <div class="rounded-card-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-6 md:p-8">
    <div class="flex flex-col md:flex-row items-center gap-component-lg">
      <div class="flex-shrink-0">
        <div class="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <Icon name="mdi:airplane-takeoff" class="text-3xl text-primary" />
        </div>
      </div>
      <div class="flex-1 text-center md:text-left">
        <h3 class="text-lg font-bold text-secondary mb-2">
          {{ t(ns('title')) }}
        </h3>
        <p class="text-body-sm text-meta">
          {{ t(ns('description')) }}
        </p>
      </div>
      <div class="flex-shrink-0">
        <BaseButton
          :to="localePath('/services/relocation-in-turkey')"
          variant="primary"
          size="lg"
        >
          {{ t(ns('button')) }}
          <Icon name="mdi:arrow-right" class="ml-2" />
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'

const ns = namespace('blog.article.relocationCta')
const { t } = useI18n()
const localePath = useLocalePath()
</script>
