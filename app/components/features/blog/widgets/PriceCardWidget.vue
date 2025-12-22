<template>
  <div
    class="my-8 card-padding bg-gradient-to-br from-green-50 to-emerald-50 rounded-card text-center max-w-md mx-auto"
    :class="BORDER_COLOR_CLASSES.success"
  >
    <h3 :class="['text-card-title mb-component-xs', SEMANTIC_TEXT_COLORS.success]">
      {{ t(ns('title')) }}
    </h3>
    <div class="flex items-end justify-center gap-component-xs mb-component-xs">
      <span :class="['text-3xl md:text-4xl font-bold', SEMANTIC_TEXT_COLORS.success]"> $2,500 </span>
      <span class="text-price font-medium text-green-700/80 mb-0.5">
        / {{ t(ns('year')) }}
      </span>
    </div>
    <p v-if="text" class="text-body-sm text-green-800/80">
      {{ text }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'
import { SEMANTIC_TEXT_COLORS, BORDER_COLOR_CLASSES } from '~/composables/ui'

const ns = namespace('blog.powerPage.price')

defineProps<{
  text?: string
}>()

const { t } = useI18n()
</script>
