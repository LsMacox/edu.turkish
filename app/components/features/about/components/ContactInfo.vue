<template>
  <section id="contacts" class="py-20">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-6">{{ $t('about.contact.title') }}</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
            {{ $t('about.contact.subtitle') }}
          </p>
        </div>
        
        <div class="grid lg:grid-cols-3 gap-8 mb-16">
          <div class="bg-white rounded-2xl shadow-custom p-8 text-center hover-lift">
            <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="mdi:whatsapp" class="text-green-600 text-2xl" />
            </div>
            <h3 class="text-xl font-semibold text-secondary mb-4">WhatsApp</h3>
            <p class="text-gray-600 mb-4">{{ $t('about.contact.channels.whatsapp.description') }}</p>
            <a href="https://wa.me/905438679950" target="_blank" class="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors">
              {{ $t('about.contact.channels.whatsapp.button') }}
            </a>
          </div>
          
          <div class="bg-white rounded-2xl shadow-custom p-8 text-center hover-lift">
            <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="mdi:telegram" class="text-blue-600 text-2xl" />
            </div>
            <h3 class="text-xl font-semibold text-secondary mb-4">Telegram</h3>
            <p class="text-gray-600 mb-4">{{ $t('about.contact.channels.telegram.description') }}</p>
            <a href="https://t.me/eduturkish" target="_blank" class="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors">
              {{ $t('about.contact.channels.telegram.button') }}
            </a>
          </div>
          
          <div class="bg-white rounded-2xl shadow-custom p-8 text-center hover-lift">
            <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Icon name="mdi:email" class="text-red-600 text-2xl" />
            </div>
            <h3 class="text-xl font-semibold text-secondary mb-4">Email</h3>
            <p class="text-gray-600 mb-4">edu.turkish2018@gmail.com</p>
            <a href="mailto:edu.turkish2018@gmail.com" class="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors">
              {{ $t('about.contact.channels.email.button') }}
            </a>
          </div>
        </div>
        
        <div class="grid lg:grid-cols-2 gap-8">
          <div class="bg-white rounded-2xl shadow-custom p-8">
            <h3 class="text-xl font-semibold text-secondary mb-6">{{ $t('about.contact.offices.title') }}</h3>
            <div class="space-y-6">
              <div>
                <h4 class="font-semibold text-secondary mb-2">{{ $t('about.contact.offices.almaty.city') }}</h4>
                <p class="text-gray-600">{{ $t('about.contact.offices.almaty.address') }}</p>
                <p class="text-gray-600">{{ $t('about.contact.offices.almaty.phone') }}</p>
              </div>
              <div>
                <h4 class="font-semibold text-secondary mb-2">{{ $t('about.contact.offices.istanbul.city') }}</h4>
                <p class="text-gray-600">{{ $t('about.contact.offices.istanbul.address') }}</p>
                <p class="text-gray-600">{{ $t('about.contact.offices.istanbul.phone') }}</p>
              </div>
              <div>
                <h4 class="font-semibold text-secondary mb-2">{{ $t('about.contact.offices.moscow.city') }}</h4>
                <p class="text-gray-600">{{ $t('about.contact.offices.moscow.address') }}</p>
                <p class="text-gray-600">{{ $t('about.contact.offices.moscow.phone') }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white rounded-2xl shadow-custom p-8">
            <h3 class="text-xl font-semibold text-secondary mb-6">{{ $t('about.contact.schedule.title') }}</h3>
            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('about.contact.schedule.weekdays') }}</span>
                <span class="font-semibold text-secondary">{{ $t('about.contact.schedule.weekdays_time') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('about.contact.schedule.saturday') }}</span>
                <span class="font-semibold text-secondary">{{ $t('about.contact.schedule.saturday_time') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ $t('about.contact.schedule.sunday') }}</span>
                <span class="font-semibold text-secondary">{{ $t('about.contact.schedule.sunday_time') }}</span>
              </div>
              <div class="border-t pt-4">
                <div class="flex items-center space-x-2 text-green-600">
                  <Icon name="mdi:clock" />
                  <span class="font-medium">{{ $t('about.contact.schedule.support_24_7') }}</span>
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
</script>

<style scoped>
.shadow-custom { 
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); 
}

.hover-lift { 
  transition: transform 0.3s ease, box-shadow 0.3s ease; 
}

.hover-lift:hover { 
  transform: translateY(-4px); 
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12); 
}
</style>
