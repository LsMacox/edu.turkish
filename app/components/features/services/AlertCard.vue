<template>
  <section :class="['mb-16', variant === 'warning' ? '' : '']">
    <div
      :class="[
        'bg-white rounded-2xl p-8 md:p-12 shadow-card border border-gray-100',
        variant === 'warning' ? 'border-l-4 border-l-warning' : '',
      ]"
    >
      <div class="max-w-4xl mx-auto">
        <div class="md:flex md:items-start md:space-x-8">
          <!-- Icon -->
          <div class="flex-shrink-0 mb-6 md:mb-0">
            <div
              :class="[
                'w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center',
                variant === 'success' ? 'bg-success-light/50' : 'bg-warning-light/50',
              ]"
            >
              <Icon
                :name="iconName"
                :class="[
                  'w-8 h-8 md:w-10 md:h-10',
                  variant === 'success' ? 'text-success' : 'text-warning-dark',
                ]"
              />
            </div>
          </div>

          <!-- Content -->
          <div class="flex-grow">
            <h2 class="text-section-title mb-4 text-left">
              {{ displayTitle }}
            </h2>
            <p class="text-body text-gray-600">
              {{ displayContent }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
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
