<template>
  <div
    role="alert"
    :class="[
      'rounded-card border',
      layout === 'horizontal' ? 'flex items-start gap-component-lg card-padding-lg' : 'card-padding-lg',
      colorClasses.container,
    ]"
  >
    <!-- Horizontal layout: icon container -->
    <div
      v-if="layout === 'horizontal' && effectiveIcon"
      :class="[
        'flex-shrink-0 step-badge',
        variant === 'success' ? 'bg-green-100' :
        variant === 'warning' ? 'bg-amber-100' :
        variant === 'error' ? 'bg-red-100' :
        'bg-blue-100'
      ]"
    >
      <Icon
        :name="effectiveIcon"
        :class="['text-icon', colorClasses.icon]"
      />
    </div>

    <!-- Horizontal layout: content -->
    <div v-if="layout === 'horizontal'" class="flex-grow min-w-0">
      <h4 v-if="title" :class="['text-card-title-sm mb-1', colorClasses.title]">
        {{ title }}
      </h4>
      <div :class="['text-card-body-sm', colorClasses.content]">
        <slot />
      </div>
    </div>

    <!-- Default layout -->
    <template v-else>
      <div v-if="title || icon" class="flex items-center gap-component-md mb-4">
        <Icon
          v-if="icon"
          :name="icon"
          :class="['text-icon', colorClasses.icon]"
        />
        <h4 v-if="title" :class="['text-card-title-sm', colorClasses.title]">
          {{ title }}
        </h4>
      </div>
      <div :class="['text-card-body-sm', colorClasses.content]">
        <slot />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { BaseAlertProps } from '~/types/ui'
import { ALERT_COLORS } from '~/composables/ui'

const props = withDefaults(defineProps<BaseAlertProps>(), {
  variant: 'success',
  layout: 'default',
})

const colorClasses = computed(() => {
  return ALERT_COLORS[props.variant] || ALERT_COLORS.success
})

const effectiveIcon = computed(() => {
  if (props.icon) return props.icon
  return props.variant === 'success' ? 'mdi:check-circle-outline' : 'mdi:alert-outline'
})
</script>
