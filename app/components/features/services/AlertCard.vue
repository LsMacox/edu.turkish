<template>
  <div class="flex items-start gap-4">
    <!-- Icon -->
    <div
      :class="[
        'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
        variant === 'success' ? 'bg-success/10' : 'bg-warning/10',
      ]"
    >
      <Icon
        :name="iconName"
        :class="['w-5 h-5', variant === 'success' ? 'text-success' : 'text-warning-dark']"
      />
    </div>

    <!-- Content -->
    <div class="flex-grow min-w-0">
      <h3 class="font-semibold text-secondary text-base mb-1">
        {{ displayTitle }}
      </h3>
      <p class="text-sm text-gray-600 leading-relaxed">
        {{ displayContent }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  keyPrefix: string
  title?: string
  content?: string
  variant?: 'success' | 'warning'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'success',
})

const { t } = useI18n()

const iconName = computed(() =>
  props.variant === 'success' ? 'mdi:check-circle-outline' : 'mdi:alert-outline',
)

const displayTitle = computed(() => props.title || t(`${props.keyPrefix}.title`))
const displayContent = computed(() => props.content || t(`${props.keyPrefix}.content`))
</script>
