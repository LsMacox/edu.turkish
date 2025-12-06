<template>
  <section id="scholarships" class="section-py">
    <div class="container">
      <BaseSectionHeader
        :title="$t('universities_page.scholarships.title')"
        :subtitle="$t('universities_page.scholarships.subtitle')"
        align="center"
        margin-bottom="lg"
      />

      <div class="grid md:grid-cols-2 gap-8">
        <div
          v-for="scholarship in scholarships"
          :key="scholarship.key"
          class="rounded-2xl card-padding-lg hover:shadow-xl transition-shadow"
          :class="scholarship.gradient"
        >
          <div
            class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            :class="scholarship.iconBg"
          >
            <Icon :name="scholarship.icon" class="text-white text-2xl" />
          </div>
          <h3 class="text-card-title mb-4">
            {{ $t(`universities_page.scholarships.types.${scholarship.key}.title`) }}
          </h3>
          <p class="text-gray-600 mb-4">
            {{ $t(`universities_page.scholarships.types.${scholarship.key}.description`) }}
          </p>
          <div class="space-y-2 text-sm">
            <div
              v-for="benefit in scholarship.benefits"
              :key="benefit"
              class="flex items-center"
            >
              <Icon name="mdi:check" class="text-green-500 w-4 h-4" />
              <span class="ml-2">{{
                $t(`universities_page.scholarships.types.${scholarship.key}.benefits.${benefit}`)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const scholarships = [
  {
    key: 'government',
    icon: 'mdi:trophy',
    iconBg: 'bg-blue-500',
    gradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
    benefits: ['full_tuition', 'monthly_allowance', 'health_insurance'],
  },
  {
    key: 'university',
    icon: 'mdi:school',
    iconBg: 'bg-green-500',
    gradient: 'bg-gradient-to-br from-green-50 to-green-100',
    benefits: ['tuition_discount', 'academic_merit', 'sports_achievement'],
  },
] as const
</script>
