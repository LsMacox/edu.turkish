<template>
  <div class="my-8 rounded-card border border-default bg-white shadow-button overflow-hidden">
    <!-- Title -->
    <h3
      v-if="data.title"
      class="table-cell text-card-title border-b border-default"
    >
      {{ data.title }}
    </h3>

    <!-- Tabs -->
    <div class="flex border-b border-default">
      <BaseButton
        variant="tab-pros"
        icon="mdi:check-circle"
        class="flex-1"
        :data-active="activeTab === 'pros' ? 'true' : undefined"
        no-focus-ring
        @click="activeTab = 'pros'"
      >
        {{ t(ns('pros')) }}
      </BaseButton>
      <BaseButton
        variant="tab-cons"
        icon="mdi:alert"
        class="flex-1"
        :data-active="activeTab === 'cons' ? 'true' : undefined"
        no-focus-ring
        @click="activeTab = 'cons'"
      >
        {{ t(ns('cons')) }}
      </BaseButton>
    </div>

    <!-- Content -->
    <div class="card-padding">
      <!-- Pros -->
      <div v-show="activeTab === 'pros'" class="space-component-md">
        <div v-for="(item, index) in data.pros" :key="`pro-${index}`" class="flex gap-component-md">
          <BaseStatusBadge icon="mdi:check" color="success" size="sm" variant="soft" />
          <div>
            <p class="font-semibold text-secondary">{{ item.title }}</p>
            <p v-if="item.description" class="text-body-sm mt-1">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <!-- Cons -->
      <div v-show="activeTab === 'cons'" class="space-component-md">
        <div v-for="(item, index) in data.cons" :key="`con-${index}`" class="flex gap-component-md">
          <BaseStatusBadge icon="mdi:alert" color="warning" size="sm" variant="soft" />
          <div>
            <p class="font-semibold text-secondary">{{ item.title }}</p>
            <p v-if="item.description" class="text-body-sm mt-1">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProsConsData } from '~/types/features/blog/widgets'
import { namespace } from '~~/lib/i18n'

const ns = namespace('blog.pros_cons')

defineProps<{
  data: ProsConsData
}>()

const { t } = useI18n()
const activeTab = ref<'pros' | 'cons'>('pros')
</script>
