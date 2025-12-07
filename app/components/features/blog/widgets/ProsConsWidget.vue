<template>
  <div class="my-8 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
    <!-- Title -->
    <h3
      v-if="data.title"
      class="px-6 py-4 text-xl font-bold text-secondary border-b border-gray-100"
    >
      {{ data.title }}
    </h3>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200">
      <button
        :class="[
          'flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-colors',
          activeTab === 'pros'
            ? 'bg-green-50 text-green-700 border-b-2 border-green-500'
            : 'text-gray-500 hover:bg-gray-50',
        ]"
        @click="activeTab = 'pros'"
      >
        <Icon name="mdi:check-circle" class="text-lg" />
        {{ t('blog.pros_cons.pros') }}
      </button>
      <button
        :class="[
          'flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-colors',
          activeTab === 'cons'
            ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500'
            : 'text-gray-500 hover:bg-gray-50',
        ]"
        @click="activeTab = 'cons'"
      >
        <Icon name="mdi:alert" class="text-lg" />
        {{ t('blog.pros_cons.cons') }}
      </button>
    </div>

    <!-- Content -->
    <div class="p-6">
      <!-- Pros -->
      <div v-show="activeTab === 'pros'" class="space-y-4">
        <div v-for="(item, index) in data.pros" :key="`pro-${index}`" class="flex gap-3">
          <div
            class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center"
          >
            <Icon name="mdi:check" class="text-green-600 text-sm" />
          </div>
          <div>
            <p class="font-semibold text-gray-800">{{ item.title }}</p>
            <p v-if="item.description" class="text-gray-600 mt-1">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <!-- Cons -->
      <div v-show="activeTab === 'cons'" class="space-y-4">
        <div v-for="(item, index) in data.cons" :key="`con-${index}`" class="flex gap-3">
          <div
            class="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center"
          >
            <Icon name="mdi:alert" class="text-amber-600 text-sm" />
          </div>
          <div>
            <p class="font-semibold text-gray-800">{{ item.title }}</p>
            <p v-if="item.description" class="text-gray-600 mt-1">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProsConsData } from '~/types/blog/widgets'

defineProps<{
  data: ProsConsData
}>()

const { t } = useI18n()
const activeTab = ref<'pros' | 'cons'>('pros')
</script>
