<template>
  <section class="py-20">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-6">
            {{ $t('about.whyChooseUs.title') }}
          </h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            {{ $t('about.whyChooseUs.subtitle') }}
          </p>
        </div>

        <div class="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div class="space-y-8">
            <div class="flex items-start space-x-4">
              <div
                class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <Icon name="mdi:school" class="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-secondary mb-2">
                  {{ $t('about.whyChooseUs.advantages.personal.title') }}
                </h3>
                <p class="text-gray-600">
                  {{ $t('about.whyChooseUs.advantages.personal.description') }}
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div
                class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <Icon name="mdi:handshake" class="text-green-600 text-xl" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-secondary mb-2">
                  {{ $t('about.whyChooseUs.advantages.direct.title') }}
                </h3>
                <p class="text-gray-600">
                  {{ $t('about.whyChooseUs.advantages.direct.description') }}
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div
                class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <Icon name="mdi:translate" class="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-secondary mb-2">
                  {{ $t('about.whyChooseUs.advantages.multilingual.title') }}
                </h3>
                <p class="text-gray-600">
                  {{ $t('about.whyChooseUs.advantages.multilingual.description') }}
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div
                class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0"
              >
                <Icon name="mdi:hand-heart" class="text-orange-600 text-xl" />
              </div>
              <div>
                <h3 class="text-xl font-semibold text-secondary mb-2">
                  {{ $t('about.whyChooseUs.advantages.support.title') }}
                </h3>
                <p class="text-gray-600">
                  {{ $t('about.whyChooseUs.advantages.support.description') }}
                </p>
              </div>
            </div>
          </div>
          <div>
            <img
              class="w-full h-96 object-cover rounded-2xl shadow-custom"
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/35f9c97132-5ca3689ed5ddf458915c.png"
              :alt="$t('about.whyChooseUs.imageAlt')"
            />
          </div>
        </div>

        <div
          class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white"
        >
          <div class="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 class="text-2xl lg:text-3xl font-bold mb-4">
                {{ $t('about.whyChooseUs.database.title') }}
              </h3>
              <p class="text-lg leading-relaxed mb-6">
                {{ $t('about.whyChooseUs.database.description') }}
              </p>
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <Icon name="mdi:check-circle" />
                  <span>{{ $t('about.whyChooseUs.database.features.universities') }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <Icon name="mdi:check-circle" />
                  <span>{{ $t('about.whyChooseUs.database.features.programs') }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <Icon name="mdi:check-circle" />
                  <span>{{ $t('about.whyChooseUs.database.features.scholarships') }}</span>
                </div>
              </div>
            </div>
            <div class="text-center">
              <div
                class="w-32 h-32 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4"
              >
                <Icon name="mdi:database" class="text-blue-600 text-4xl" />
              </div>
              <p class="text-sm opacity-90">{{ $t('about.whyChooseUs.database.exclusive') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
