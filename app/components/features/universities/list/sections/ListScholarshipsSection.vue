<template>
  <section id="scholarships" class="section-py bg-gradient-to-b from-gray-50 to-white">
    <div class="container">
      <BaseSectionHeader
        :title="t('universities_page.scholarships.title')"
        :subtitle="t('universities_page.scholarships.subtitle')"
        align="center"
        margin-bottom="lg"
      />

      <div class="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
        <div
          v-for="scholarship in scholarships"
          :key="scholarship.key"
          class="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden
                 transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:border-gray-200"
        >
          <!-- Decorative gradient bar -->
          <div 
            class="h-1.5 w-full"
            :class="scholarship.barGradient"
          />
          
          <div class="p-6 lg:p-8">
            <!-- Header with icon and badge -->
            <div class="flex items-start justify-between mb-5">
              <div 
                class="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                :class="scholarship.iconBg"
              >
                <Icon :name="scholarship.icon" class="text-white text-2xl" />
              </div>
              <span 
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                :class="scholarship.badgeClass"
              >
                <Icon :name="scholarship.badgeIcon" class="w-3.5 h-3.5 mr-1" />
                {{ t(`universities_page.scholarships.types.${scholarship.key}.badge`) }}
              </span>
            </div>

            <!-- Title -->
            <h3 class="text-xl font-semibold text-secondary mb-3 group-hover:text-primary transition-colors">
              {{ t(`universities_page.scholarships.types.${scholarship.key}.title`) }}
            </h3>
            
            <!-- Description -->
            <p class="text-gray-600 text-sm leading-relaxed mb-5">
              {{ t(`universities_page.scholarships.types.${scholarship.key}.description`) }}
            </p>

            <!-- Benefits list -->
            <div class="space-y-3">
              <div 
                v-for="benefit in scholarship.benefits" 
                :key="benefit" 
                class="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 group-hover:bg-gray-50 transition-colors"
              >
                <div 
                  class="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  :class="scholarship.checkBg"
                >
                  <Icon name="mdi:check" class="w-3.5 h-3.5 text-white" />
                </div>
                <span class="text-sm text-gray-700 leading-relaxed">
                  {{ t(`universities_page.scholarships.types.${scholarship.key}.benefits.${benefit}`) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()

const scholarships = [
  {
    key: 'government',
    icon: 'mdi:trophy',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    barGradient: 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600',
    badgeClass: 'bg-blue-50 text-blue-700',
    badgeIcon: 'mdi:star',
    checkBg: 'bg-blue-500',
    benefits: ['full_tuition', 'monthly_allowance', 'health_insurance'],
  },
  {
    key: 'university',
    icon: 'mdi:school',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    barGradient: 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600',
    badgeClass: 'bg-emerald-50 text-emerald-700',
    badgeIcon: 'mdi:account-school',
    checkBg: 'bg-emerald-500',
    benefits: ['tuition_discount', 'academic_merit', 'sports_achievement'],
  },
] as const
</script>
