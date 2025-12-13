<template>
  <div class="mt-16">
    <BaseSectionHeader :title="title" />

    <div class="mt-8 bg-gray-50 rounded-lg p-8">
      <dl class="grid gap-6 md:grid-cols-2">
        <div
          v-for="detail in formatDetails"
          :key="detail.key"
          class="border-l-4 border-primary pl-4"
        >
          <dt class="text-sm font-semibold text-gray-500 uppercase mb-1">
            {{ detail.label }}
          </dt>
          <dd class="text-lg text-gray-900">
            {{ detail.value }}
          </dd>
        </div>
      </dl>
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
