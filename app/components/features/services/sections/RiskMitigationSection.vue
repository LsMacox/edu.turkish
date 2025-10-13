<template>
  <div>
    <BaseSectionHeader :title="title" />

    <div class="space-y-6 max-w-4xl mx-auto">
      <div
        v-for="(item, index) in risks"
        :key="index"
        class="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
      >
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <Icon name="mdi:alert-circle-outline" class="w-8 h-8 text-orange-500" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold mb-2 text-gray-900">{{ item.risk }}</h3>
            <div class="flex items-start gap-2">
              <Icon name="mdi:shield-check" class="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p class="text-gray-700">{{ item.mitigation }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { I18nKeyPrefix, RiskItem } from '~/types/services'

interface Props extends I18nKeyPrefix {
  title?: string
}

const props = defineProps<Props>()

const { t, tm } = useI18n()

const title = computed(() => props.title || t(`${props.keyPrefix}.title`))

const risks = computed(() => {
  const raw = (tm(`${props.keyPrefix}.risks`) || []) as unknown[]
  return raw.map((_, index) => ({
    risk: t(`${props.keyPrefix}.risks.${index}.risk`) as string,
    mitigation: t(`${props.keyPrefix}.risks.${index}.mitigation`) as string,
  })) as RiskItem[]
})
</script>
