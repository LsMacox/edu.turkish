<template>
  <section id="contacts" class="py-20">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-section-title mb-6">
            {{ $t('about.contact.title') }}
          </h2>
          <p class="text-section-subtitle max-w-3xl mx-auto">
            {{ $t('about.contact.subtitle') }}
          </p>
        </div>

        <div class="grid lg:grid-cols-3 gap-8 mb-16">
          <div class="bg-white rounded-2xl shadow-custom p-8 text-center hover-lift">
            <div
              class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Icon name="mdi:whatsapp" class="text-green-600 text-2xl" />
            </div>
            <h3 class="text-card-title mb-4">WhatsApp</h3>
            <p class="text-gray-600 mb-4">
              {{ $t('about.contact.channels.whatsapp.description') }}
            </p>
            <a
              :href="channels?.whatsapp?.href"
              target="_blank"
              class="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
            >
              {{ $t('about.contact.channels.whatsapp.button') }}
            </a>
          </div>

          <div class="bg-white rounded-2xl shadow-custom p-8 text-center hover-lift">
            <div
              class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Icon name="mdi:telegram" class="text-blue-600 text-2xl" />
            </div>
            <h3 class="text-card-title mb-4">Telegram</h3>
            <p class="text-gray-600 mb-4">
              {{ $t('about.contact.channels.telegram.description') }}
            </p>
            <a
              :href="channels?.telegramBot?.href"
              target="_blank"
              class="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              {{ $t('about.contact.channels.telegram.button') }}
            </a>
          </div>

          <div class="bg-white rounded-2xl shadow-custom p-8 text-center hover-lift">
            <div
              class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <Icon name="mdi:email" class="text-red-600 text-2xl" />
            </div>
            <h3 class="text-card-title mb-4">Email</h3>
            <p class="text-gray-600 mb-4">edu.turkish2018@gmail.com</p>
            <a
              href="mailto:edu.turkish2018@gmail.com"
              class="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
            >
              {{ $t('about.contact.channels.email.button') }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useContactChannels } from '~/composables/useContactChannels'

const { channels } = useContactChannels()
</script>
