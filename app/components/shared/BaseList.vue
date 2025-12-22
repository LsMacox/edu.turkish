<template>
  <div class="w-full my-4">
    <!-- Steps style -->
    <div v-if="listStyle === 'steps'" class="relative space-y-6">
      <!-- Vertical line -->
      <div
        class="absolute left-5 top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary/30 via-primary/20 to-primary/10 rounded-full"
      />
      <div
        v-for="(item, index) in items"
        :key="index"
        class="relative flex items-start gap-component-lg group"
      >
        <div
          class="relative z-10 step-badge bg-gradient-to-br from-primary to-primary/80 text-white shadow-card shadow-primary/25 shrink-0 transition-scale group-hover:scale-110"
        >
          {{ index + 1 }}
        </div>
        <div
          class="flex-1 card-padding-lg bg-white rounded-card border border-default shadow-button-lift hover:border-primary/20 transition-default"
        >
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="text-body leading-relaxed" v-html="item" />
        </div>
      </div>
    </div>

    <!-- Checklist style -->
    <ul v-else-if="listStyle === 'checklist'" class="space-y-3">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="flex items-start gap-component-lg p-4 bg-gradient-to-r from-green-50 to-emerald-50/50 rounded-card border border-green-100/80 hover:border-green-200 transition-color"
      >
        <span
          class="flex items-center justify-center w-6 h-6 rounded-badge bg-green-500 text-white shrink-0 mt-0.5"
        >
          <Icon name="mdi:check" class="text-icon-sm" />
        </span>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span class="text-body leading-relaxed" v-html="item" />
      </li>
    </ul>

    <!-- Standard list -->
    <component
      :is="ordered ? 'ol' : 'ul'"
      v-else
      class="space-y-3 text-body"
      :class="ordered ? 'list-decimal pl-6 marker:text-primary marker:font-semibold' : ''"
    >
      <li
        v-for="(item, i) in items"
        :key="i"
        class="leading-relaxed"
        :class="!ordered ? 'flex items-start gap-component-md' : ''"
      >
        <span v-if="!ordered" class="w-2 h-2 rounded-badge bg-primary/60 shrink-0 mt-2.5" />
        <!-- eslint-disable-next-line vue/no-v-html -->
        <span v-html="item" />
      </li>
    </component>
  </div>
</template>

<script setup lang="ts">
import type { BaseListProps } from '~/types/ui'

defineProps<BaseListProps>()
</script>
