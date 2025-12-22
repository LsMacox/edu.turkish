<template>
  <label
    v-if="label"
    :for="forId"
    :class="['block text-secondary', sizeClasses.text, !noMargin && sizeClasses.margin]"
  >
    {{ label }}
    <span v-if="required" class="text-error ml-1" aria-label="required">*</span>
  </label>
</template>

<script setup lang="ts">
import type { Size5 } from '~/types/ui'

interface Props {
  label?: string
  forId?: string
  required?: boolean
  size?: Size5
  noMargin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  size: 'md',
  noMargin: false,
})

const sizeClasses = useFieldLabelSizeClasses(() => props.size)
</script>
