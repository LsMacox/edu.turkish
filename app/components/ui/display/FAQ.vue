<template>
  <section :class="sectionClasses">
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
        <div class="space-y-4">
          <div v-for="(faq, index) in items" :key="index" class="bg-white rounded-xl shadow-custom">
            <button
              class="w-full px-6 py-4 text-left font-semibold text-secondary hover:text-primary transition-colors flex items-center justify-between"
              @click="toggle(index)"
            >
              <span>{{ faq.question }}</span>
              <Icon
                :name="isOpen(index) ? 'mdi:chevron-up' : 'mdi:chevron-down'"
                class="transition-transform duration-200"
              />
            </button>
            <div v-show="isOpen(index)" class="px-6 pb-4 text-gray-600">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { FaqItem } from '~~/lib/types/entities/faq'
import { namespace } from '~~/lib/i18n'

const faqNs = namespace('home.faq')

interface Props {
  items?: FaqItem[]
  title?: string
  subtitle?: string
  background?: boolean
}

const { t, locale } = useI18n()

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  title: '',
  subtitle: '',
  background: true,
})

const displayTitle = computed(() => props.title || t(faqNs('title')))
const displaySubtitle = computed(() => props.subtitle || t(faqNs('subtitle')))

const openFaqs = ref<number[]>([])

watch(locale, () => {
  openFaqs.value = []
})

const toggle = (index: number) => {
  const currentIndex = openFaqs.value.indexOf(index)
  if (currentIndex > -1) {
    openFaqs.value.splice(currentIndex, 1)
  } else {
    openFaqs.value.push(index)
  }
}

const isOpen = (index: number) => openFaqs.value.includes(index)

const sectionClasses = computed(() => [props.background ? 'bg-background' : 'bg-transparent'])
</script>
