<template>
  <div class="mt-component-lg">
    <BaseSectionHeader :title="title" />

    <div class="mt-component-lg bg-surface rounded-card card-padding-lg">
      <BaseGrid tag="dl" :md="2" gap="lg">
        <div
          v-for="detail in formatDetails"
          :key="detail.key"
          class="border-l-4 border-primary pl-4"
        >
          <dt class="text-body-sm font-semibold text-meta uppercase mb-1">
            {{ detail.label }}
          </dt>
          <dd class="text-body-lg text-secondary">
            {{ detail.value }}
          </dd>
        </div>
      </BaseGrid>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FormatDetail {
  key: string
  label: string
  value: string
}

interface FormatScheduleData {
  title: string
  items: FormatDetail[]
}

interface Props {
  data: FormatScheduleData
}

const props = defineProps<Props>()

const title = computed(() => props.data.title)
const formatDetails = computed(() => props.data.items)
</script>
