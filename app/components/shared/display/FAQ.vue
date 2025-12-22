<template>
  <!-- Section mode (default) -->
  <section v-if="!bare" :class="sectionClasses">
    <div class="container">
      <div v-if="displayTitle || displaySubtitle" class="text-center mb-12">
        <h2 v-if="displayTitle" class="text-section-title mb-4">
          {{ displayTitle }}
        </h2>
        <p v-if="displaySubtitle" class="text-section-subtitle max-w-2xl mx-auto">
          {{ displaySubtitle }}
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="space-y-3">
          <div
            v-for="(faq, index) in items"
            :key="getItemKey(faq, index)"
            class="accordion-item"
            :class="isOpen(faq, index) ? 'accordion-item-open' : 'accordion-item-closed'"
          >
            <button
              class="w-full flex items-center justify-between p-5 text-left transition-color group"
              @click="toggle(faq, index)"
            >
              <slot name="question" :item="faq" :index="index" :is-open="isOpen(faq, index)">
                <span
                  class="accordion-trigger"
                  :class="isOpen(faq, index) ? 'accordion-trigger-open' : 'accordion-trigger-closed'"
                >
                  {{ faq.question }}
                </span>
              </slot>
              <Icon
                name="mdi:chevron-down"
                class="accordion-chevron"
                :class="isOpen(faq, index) ? 'rotate-180' : ''"
              />
            </button>
            <div
              class="grid transition-default ease-in-out"
              :class="isOpen(faq, index) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
            >
              <div class="overflow-hidden">
                <slot name="answer" :item="faq" :index="index" :is-open="isOpen(faq, index)">
                  <!-- eslint-disable vue/no-v-html -->
                  <div v-if="htmlContent" class="px-5 pb-5 accordion-content" v-html="faq.answer" />
                  <p v-else class="px-5 pb-5 accordion-answer">{{ faq.answer }}</p>
                  <!-- eslint-enable vue/no-v-html -->
                </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Bare mode (no section wrapper, for embedding in content) -->
  <div v-else class="w-full space-y-3">
    <div
      v-for="(faq, index) in items"
      :key="getItemKey(faq, index)"
      class="accordion-item"
      :class="isOpen(faq, index) ? 'accordion-item-open' : 'accordion-item-closed'"
    >
      <button
        class="w-full flex items-center justify-between p-5 text-left transition-color group min-h-touch-44"
        @click="toggle(faq, index)"
      >
        <slot name="question" :item="faq" :index="index" :is-open="isOpen(faq, index)">
          <span
            class="accordion-trigger"
            :class="isOpen(faq, index) ? 'accordion-trigger-open' : 'accordion-trigger-closed'"
          >
            {{ faq.question }}
          </span>
        </slot>
        <Icon
          name="mdi:chevron-down"
          class="accordion-chevron"
          :class="isOpen(faq, index) ? 'rotate-180' : ''"
        />
      </button>
      <div
        class="grid transition-default ease-in-out"
        :class="isOpen(faq, index) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
      >
        <div class="overflow-hidden">
          <div class="px-5 pb-5">
            <slot name="answer" :item="faq" :index="index" :is-open="isOpen(faq, index)">
              <!-- eslint-disable vue/no-v-html -->
              <div v-if="htmlContent" class="accordion-content" v-html="faq.answer" />
              <p v-else class="accordion-answer">{{ faq.answer }}</p>
              <!-- eslint-enable vue/no-v-html -->
            </slot>

            <slot name="extra" :item="faq" :index="index" :is-open="isOpen(faq, index)" />
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import type { FaqItem } from '~~/lib/types/entities/faq'

type OpenState = number[] | Record<string | number, boolean>

interface Props {
  items?: FaqItem[]
  title?: string
  subtitle?: string
  background?: boolean
  accordion?: boolean
  htmlContent?: boolean
  bare?: boolean
  modelValue?: OpenState
  itemKey?: string
}

const { locale } = useI18n()

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  title: '',
  subtitle: '',
  background: true,
  accordion: false,
  htmlContent: false,
  bare: false,
  modelValue: undefined,
  itemKey: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: OpenState]
}>()

const isExternalState = computed(() => props.modelValue !== undefined)

const displayTitle = computed(() => props.title)
const displaySubtitle = computed(() => props.subtitle)

const internalOpenFaqs = ref<number[]>([])

watch(locale, () => {
  internalOpenFaqs.value = []
})

const getItemKey = (item: FaqItem, index: number): string | number => {
  if (props.itemKey && item[props.itemKey as keyof FaqItem] !== undefined) {
    return item[props.itemKey as keyof FaqItem] as string | number
  }
  return index
}

const toggle = (item: FaqItem, index: number) => {
  const key = getItemKey(item, index)
  
  if (isExternalState.value) {
    const current = props.modelValue!
    if (Array.isArray(current)) {
      const newState = current.includes(key as number)
        ? current.filter(k => k !== key)
        : props.accordion ? [key as number] : [...current, key as number]
      emit('update:modelValue', newState)
    } else {
      const newState = { ...current, [key]: !current[key] }
      if (props.accordion && !current[key]) {
        Object.keys(newState).forEach(k => { newState[k] = k === String(key) })
      }
      emit('update:modelValue', newState)
    }
  } else {
    const currentIndex = internalOpenFaqs.value.indexOf(index)
    if (currentIndex > -1) {
      internalOpenFaqs.value.splice(currentIndex, 1)
    } else {
      if (props.accordion) {
        internalOpenFaqs.value = [index]
      } else {
        internalOpenFaqs.value.push(index)
      }
    }
  }
}

const isOpen = (item: FaqItem, index: number): boolean => {
  if (isExternalState.value) {
    const key = getItemKey(item, index)
    const current = props.modelValue!
    if (Array.isArray(current)) {
      return current.includes(key as number)
    }
    return !!current[key]
  }
  return internalOpenFaqs.value.includes(index)
}

const sectionClasses = computed(() => [props.background ? 'bg-background' : 'bg-transparent'])
</script>

