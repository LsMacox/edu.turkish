<template>
  <section id="how-to-choose" class="section-py bg-background">
    <div class="container">
      <BaseSectionHeader
        :title="$t('universities_page.how_to_choose.title')"
        :subtitle="$t('universities_page.how_to_choose.subtitle')"
        align="center"
        margin-bottom="lg"
      />

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div
          class="bg-white rounded-2xl shadow-lg card-padding-lg text-center hover:shadow-xl transition-shadow"
        >
          <div
            class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Icon name="mdi:map-marker" class="text-blue-600 text-2xl" />
          </div>
          <h3 class="text-card-title mb-4">
            {{ $t('universities_page.how_to_choose.tips.location.title') }}
          </h3>
          <p class="text-card-body">
            {{ $t('universities_page.how_to_choose.tips.location.description') }}
          </p>
        </div>

        <div
          class="bg-white rounded-2xl shadow-lg card-padding-lg text-center hover:shadow-xl transition-shadow"
        >
          <div
            class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Icon name="mdi:translate" class="text-green-600 text-2xl" />
          </div>
          <h3 class="text-card-title mb-4">
            {{ $t('universities_page.how_to_choose.tips.language.title') }}
          </h3>
          <p class="text-card-body">
            {{ $t('universities_page.how_to_choose.tips.language.description') }}
          </p>
        </div>

        <div
          class="bg-white rounded-2xl shadow-lg card-padding-lg text-center hover:shadow-xl transition-shadow"
        >
          <div
            class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Icon name="mdi:home" class="text-purple-600 text-2xl" />
          </div>
          <h3 class="text-card-title mb-4">
            {{ $t('universities_page.how_to_choose.tips.dormitory.title') }}
          </h3>
          <p class="text-card-body">
            {{ $t('universities_page.how_to_choose.tips.dormitory.description') }}
          </p>
        </div>

        <div
          class="bg-white rounded-2xl shadow-lg card-padding-lg text-center hover:shadow-xl transition-shadow"
        >
          <div
            class="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Icon name="mdi:star" class="text-orange-600 text-2xl" />
          </div>
          <h3 class="text-card-title mb-4">
            {{ $t('universities_page.how_to_choose.tips.rating.title') }}
          </h3>
          <p class="text-card-body">
            {{ $t('universities_page.how_to_choose.tips.rating.description') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
