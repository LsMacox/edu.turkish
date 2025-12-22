<template>
  <BaseSection id="who-we-are" padding="xl" max-width="6xl">
    <div class="container-padding-narrow">
      <div class="max-w-6xl mx-auto">
        <BaseSectionHeader
          :title="t(whoWeAreNs('title'))"
          :subtitle="t(whoWeAreNs('subtitle'))"
          align="center"
          margin-bottom="lg"
        />

        <BaseGrid :lg="2" gap="lg" align="center" class="mb-component-lg">
          <div>
            <NuxtImg
              class="w-full object-cover rounded-card shadow-elevated"
              :src="ASSETS.about.whoWeAreImage"
              alt="Modern education consultancy office"
              loading="lazy"
              decoding="async"
              sizes="(max-width: 1024px) 100vw, 50vw"
              format="webp"
            />
          </div>
          <div class="space-component-lg">
            <div class="space-component-md">
              <div class="flex items-start gap-component-md">
                <BaseIconBox
                  icon="mdi:trophy"
                  color="info"
                  size="md"
                  rounded="xl"
                  class="flex-shrink-0"
                />
                <div>
                  <h3 class="text-card-title mb-component-xs">
                    {{ t(whoWeAreNs('experienced_agency')) }}
                  </h3>
                  <p class="text-body-sm">{{ t(whoWeAreNs('experienced_agency_desc')) }}</p>
                </div>
              </div>

              <div class="flex items-start gap-component-md">
                <BaseIconBox
                  icon="mdi:school"
                  color="success"
                  size="md"
                  rounded="xl"
                  class="flex-shrink-0"
                />
                <div>
                  <h3 class="text-card-title mb-component-xs">
                    {{ t(whoWeAreNs('students_enrolled')) }}
                  </h3>
                  <p class="text-body-sm">{{ t(whoWeAreNs('students_enrolled_desc')) }}</p>
                </div>
              </div>

              <div class="flex items-start gap-component-md">
                <BaseIconBox
                  icon="mdi:file-document"
                  color="secondary"
                  size="md"
                  rounded="xl"
                  class="flex-shrink-0"
                />
                <div>
                  <h3 class="text-card-title mb-component-xs">
                    {{ t(whoWeAreNs('official_work')) }}
                  </h3>
                  <p class="text-body-sm">{{ t(whoWeAreNs('official_work_desc')) }}</p>
                </div>
              </div>

              <div class="flex items-start gap-component-md">
                <BaseIconBox
                  icon="mdi:hand-heart"
                  color="warning"
                  size="md"
                  rounded="xl"
                  class="flex-shrink-0"
                />
                <div>
                  <h3 class="text-card-title mb-component-xs">
                    {{ t(whoWeAreNs('comprehensive_help')) }}
                  </h3>
                  <p class="text-body-sm">{{ t(whoWeAreNs('comprehensive_help_desc')) }}</p>
                </div>
              </div>
            </div>
          </div>
        </BaseGrid>
      </div>
    </div>
  </BaseSection>
</template>

<script setup lang="ts">
import { ASSETS } from '~~/lib/config/assets'
import { namespace } from '~~/lib/i18n'

const whoWeAreNs = namespace('about.who_we_are')
const { t } = useI18n()
</script>
