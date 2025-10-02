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
          class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl card-padding-lg hover:shadow-xl transition-shadow"
        >
          <div class="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6">
            <Icon name="mdi:trophy" class="text-white text-2xl" />
          </div>
          <h3 class="text-card-title mb-4">
            {{ $t('universities_page.scholarships.types.government.title') }}
          </h3>
          <p class="text-gray-600 mb-4">
            {{ $t('universities_page.scholarships.types.government.description') }}
          </p>
          <div class="space-y-2 text-sm">
            <div class="flex items-center">
              <Icon name="mdi:check" class="text-green-500 w-4 h-4" />
              <span class="ml-2">{{
                $t('universities_page.scholarships.types.government.benefits.full_tuition')
              }}</span>
            </div>
            <div class="flex items-center">
              <Icon name="mdi:check" class="text-green-500 w-4 h-4" />
              <span class="ml-2">{{
                $t('universities_page.scholarships.types.government.benefits.monthly_allowance')
              }}</span>
            </div>
            <div class="flex items-center">
              <Icon name="mdi:check" class="text-green-500 w-4 h-4" />
              <span class="ml-2">{{
                $t('universities_page.scholarships.types.government.benefits.health_insurance')
              }}</span>
            </div>
          </div>
        </div>

        <div
          class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl card-padding-lg hover:shadow-xl transition-shadow"
        >
          <div class="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
            <Icon name="mdi:school" class="text-white text-2xl" />
          </div>
          <h3 class="text-card-title mb-4">
            {{ $t('universities_page.scholarships.types.university.title') }}
          </h3>
          <p class="text-gray-600 mb-4">
            {{ $t('universities_page.scholarships.types.university.description') }}
          </p>
          <div class="space-y-2 text-sm">
            <div class="flex items-center">
              <Icon name="mdi:check" class="text-green-500 w-4 h-4" />
              <span class="ml-2">{{
                $t('universities_page.scholarships.types.university.benefits.tuition_discount')
              }}</span>
            </div>
            <div class="flex items-center">
              <Icon name="mdi:check" class="text-green-500 w-4 h-4" />
              <span class="ml-2">{{
                $t('universities_page.scholarships.types.university.benefits.academic_merit')
              }}</span>
            </div>
            <div class="flex items-center">
              <Icon name="mdi:check" class="text-green-500 w-4 h-4" />
              <span class="ml-2">{{
                $t('universities_page.scholarships.types.university.benefits.sports_achievement')
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
