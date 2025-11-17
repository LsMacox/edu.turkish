<template>
  <section id="who-we-are" class="pt-20">
    <div class="container mx-auto container-padding-narrow">
      <div class="max-w-6xl mx-auto">
        <BaseSectionHeader
          :title="t('about.who_we_are.title')"
          :subtitle="t('about.who_we_are.subtitle')"
          align="center"
          margin-bottom="lg"
        />

        <div class="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div>
            <NuxtImg
              class="w-full object-cover rounded-2xl shadow-custom"
              :src="cdnUrl('f6893c58-7e43-4518-a403-139b942125f2.jpg')"
              alt="Modern education consultancy office"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 1024px) 100vw, 50vw"
              format="webp"
            />
          </div>
          <div class="space-y-8">
            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <BaseIconBadge
                  icon="mdi:trophy"
                  color="blue"
                  size="md"
                  rounded="xl"
                  class="flex-shrink-0"
                />
                <div>
                  <h3 class="text-card-title mb-2">
                    {{ t('about.who_we_are.experienced_agency') }}
                  </h3>
                  <p class="text-gray-600">{{ t('about.who_we_are.experienced_agency_desc') }}</p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <BaseIconBadge
                  icon="mdi:school"
                  color="green"
                  size="md"
                  rounded="xl"
                  class="flex-shrink-0"
                />
                <div>
                  <h3 class="text-card-title mb-2">
                    {{ t('about.who_we_are.students_enrolled') }}
                  </h3>
                  <p class="text-gray-600">{{ t('about.who_we_are.students_enrolled_desc') }}</p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <BaseIconBadge
                  icon="mdi:file-document"
                  color="purple"
                  size="md"
                  rounded="xl"
                  class="flex-shrink-0"
                />
                <div>
                  <h3 class="text-card-title mb-2">
                    {{ t('about.who_we_are.official_work') }}
                  </h3>
                  <p class="text-gray-600">{{ t('about.who_we_are.official_work_desc') }}</p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <BaseIconBadge
                  icon="mdi:hand-heart"
                  color="orange"
                  size="md"
                  rounded="xl"
                  class="flex-shrink-0"
                />
                <div>
                  <h3 class="text-card-title mb-2">
                    {{ t('about.who_we_are.comprehensive_help') }}
                  </h3>
                  <p class="text-gray-600">{{ t('about.who_we_are.comprehensive_help_desc') }}</p>
                </div>
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
const { cdnUrl } = useCdn()
</script>
