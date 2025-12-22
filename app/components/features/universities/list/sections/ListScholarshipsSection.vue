<template>
  <BaseSection id="scholarships" bg="gradient-down">
      <BaseSectionHeader
        :title="t(ns('title'))"
        :subtitle="t(ns('subtitle'))"
        align="center"
        margin-bottom="lg"
      />

      <BaseGrid :md="2" gap="lg" class="max-w-5xl mx-auto">
        <div
          v-for="scholarship in scholarships"
          :key="scholarship.key"
          class="group relative bg-white rounded-card border border-default overflow-hidden
                 transition-default ease-out hover:shadow-card-hover hover:-translate-y-1 hover:border-muted"
        >
          <!-- Decorative gradient bar -->
          <div 
            class="h-1.5 w-full"
            :class="scholarship.barGradient"
          />
          
          <div class="card-padding-lg">
            <!-- Header with icon and badge -->
            <div class="flex items-start justify-between mb-component-md">
              <div 
                class="avatar-lg flex items-center justify-center transition-scale group-hover:scale-110"
                :class="scholarship.iconBg"
              >
                <Icon :name="scholarship.icon" class="text-white text-icon-lg" />
              </div>
              <span 
                class="badge-category"
                :class="scholarship.badgeClass"
              >
                <Icon :name="scholarship.badgeIcon" class="w-3.5 h-3.5 mr-1" />
                {{ scholarship.badge }}
              </span>
            </div>

            <!-- Title -->
            <h3 :class="['text-card-title mb-component-sm', TEXT_HOVER_CLASSES]">
              {{ scholarship.title }}
            </h3>
            
            <!-- Description -->
            <p class="text-body-sm mb-component-md">
              {{ scholarship.description }}
            </p>

            <!-- Benefits list -->
            <div class="space-component-sm">
              <div 
                v-for="benefit in scholarship.benefits" 
                :key="benefit" 
                class="flex items-start gap-component-md compact-padding rounded-button bg-surface/80 group-hover:bg-surface transition-color"
              >
                <div 
                  class="w-6 h-6 rounded-badge flex items-center justify-center flex-shrink-0 mt-0.5"
                  :class="scholarship.checkBg"
                >
                  <Icon name="mdi:check" class="text-icon-xs text-white" />
                </div>
                <span class="text-body-sm">
                  {{ benefit }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </BaseGrid>
  </BaseSection>
</template>

<script setup lang="ts">
import { namespace } from '~~/lib/i18n'
import { TEXT_HOVER_CLASSES } from '~/composables/ui/useHover'

const { t } = useI18n()
const ns = namespace('universities.list.scholarships')

const nsTypes = namespace('universities.list.scholarships.types')

const scholarships = computed(() => [
  {
    key: 'government',
    icon: 'mdi:trophy',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    barGradient: 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600',
    badgeClass: 'bg-blue-50 text-blue-700',
    badgeIcon: 'mdi:star',
    checkBg: 'bg-blue-500',
    title: t(nsTypes('government.title')),
    badge: t(nsTypes('government.badge')),
    description: t(nsTypes('government.description')),
    benefits: [
      t(nsTypes('government.benefits.full_tuition')),
      t(nsTypes('government.benefits.monthly_allowance')),
      t(nsTypes('government.benefits.health_insurance')),
    ],
  },
  {
    key: 'university',
    icon: 'mdi:school',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    barGradient: 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600',
    badgeClass: 'bg-emerald-50 text-emerald-700',
    badgeIcon: 'mdi:account-school',
    checkBg: 'bg-emerald-500',
    title: t(nsTypes('university.title')),
    badge: t(nsTypes('university.badge')),
    description: t(nsTypes('university.description')),
    benefits: [
      t(nsTypes('university.benefits.tuition_discount')),
      t(nsTypes('university.benefits.academic_merit')),
      t(nsTypes('university.benefits.sports_achievement')),
    ],
  },
])
</script>
