<template>
  <div v-if="error || helperText" :class="sizeClasses.margin">
    <p
      v-if="error"
      :id="errorId"
      :class="[sizeClasses.text, 'text-error leading-relaxed flex items-start gap-component-xs']"
      role="alert"
      aria-live="polite"
    >
      <Icon name="mdi:alert-circle" :class="[sizeClasses.icon, 'mt-0.5 flex-shrink-0']" />
      {{ error }}
    </p>
    <p
      v-else-if="helperText"
      :id="helperId"
      :class="[sizeClasses.text, 'text-muted leading-relaxed']"
    >
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Size5 } from '~/types/ui'

interface Props {
  error?: string
  helperText?: string
  elementId: string
  size?: Size5
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const sizeClasses = useFieldMessageSizeClasses(() => props.size)

const errorId = computed(() => `${props.elementId}-error`)
const helperId = computed(() => `${props.elementId}-helper`)
</script>
