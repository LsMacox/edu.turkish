<template>
  <footer class="bg-white py-16">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <!-- About Us -->
        <div>
          <h3 class="text-xl font-semibold text-secondary mb-6">{{ $t('footer.about_us') }}</h3>
          <ul class="space-y-3">
            <li><NuxtLink :to="localePath('/about') + '#who-we-are'" class="text-gray-700 hover:text-primary transition-colors">{{ $t('footer.who_we_are') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/about') + '#team'" class="text-gray-700 hover:text-primary transition-colors">{{ $t('footer.our_team') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/about') + '#contacts'" class="text-gray-700 hover:text-primary transition-colors">{{ $t('footer.contacts') }}</NuxtLink></li>
          </ul>
        </div>
        
        <!-- Universities -->
        <div>
          <h3 class="text-xl font-semibold text-secondary mb-6">{{ $t('footer.universities') }}</h3>
          <ul class="space-y-3">
            <li><button @click="handleCityClick('Стамбул')" class="text-gray-700 hover:text-primary transition-colors">{{ $t('footer.istanbul') }}</button></li>
            <li><button @click="handleCityClick('Анкара')" class="text-gray-700 hover:text-primary transition-colors">{{ $t('footer.ankara') }}</button></li>
            <li><button @click="handleCityClick('Измир')" class="text-gray-700 hover:text-primary transition-colors">{{ $t('footer.izmir') }}</button></li>
            <li><button @click="handleCityClick('Анталия')" class="text-gray-700 hover:text-primary transition-colors">{{ $t('footer.antalya') }}</button></li>
            <li><button @click="handleAllUniversitiesClick" class="text-gray-700 hover:text-primary transition-colors">{{ $t('footer.all_universities') }}</button></li>
          </ul>
        </div>
        
        <!-- Support -->
        <div>
          <h3 class="text-xl font-semibold text-secondary mb-6">{{ $t('footer.support') }}</h3>
          <ul class="space-y-3">
            <li><NuxtLink :to="localePath('/faq')" class="text-gray-700 hover:text-primary transition-colors">{{ $t('footer.faq') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/reviews')" class="text-gray-700 hover:text-primary transition-colors">{{ $t('footer.reviews') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/contract')" class="text-gray-700 hover:text-primary transition-colors">{{ $t('footer.contract') }}</NuxtLink></li>
            <li><NuxtLink :to="localePath('/privacy-policy')" class="text-gray-700 hover:text-primary transition-colors">{{ $t('footer.privacy_policy') }}</NuxtLink></li>
          </ul>
          
          <!-- Social Links -->
          <div class="mt-6">
            <p class="text-sm text-gray-700 mb-3">{{ $t('footer.social_networks') }}</p>
            <div class="flex space-x-3">
              <a href="https://wa.me/905438679950" target="_blank" class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white hover:bg-green-600 transition-colors" aria-label="WhatsApp">
                <Icon name="mdi:whatsapp" />
              </a>
              <a href="https://t.me/eduturkish" target="_blank" class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white hover:bg-blue-600 transition-colors" aria-label="Telegram">
                <Icon name="mdi:telegram" />
              </a>
              <a href="https://www.instagram.com/edu.turkish" target="_blank" class="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white hover:bg-pink-600 transition-colors" aria-label="Instagram">
                <Icon name="mdi:instagram" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Bottom Section -->
      <div class="border-t border-gray-300 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center mb-4 md:mb-0">
            <NuxtImg 
              src="/images/logo.png" 
              alt="Edu.turkish" 
              width="120"
              height="120"
              sizes="60px"
              loading="lazy"
              decoding="async"
              format="webp"
              :quality="78"
              class="h-[60px] w-[60px] mr-3"
            />
            <span class="text-xl font-bold text-secondary">Edu.turkish</span>
          </div>
          
          <div class="text-center md:text-right">
            <p class="text-gray-700">{{ $t('footer.copyright') }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ $t('footer.licensed_agency') }}</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useUniversitiesStore } from '~/stores/universities'

const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

// Use universities store only if on universities page (locale-aware)
const isUniversitiesPage = computed(() => route.path.startsWith(localePath('/universities')))

const handleCityClick = async (city: string) => {
  if (isUniversitiesPage.value) {
    // If already on universities page, use store method with scroll
    const universitiesStore = useUniversitiesStore()
    universitiesStore.setCityFilterFromFooter(city)
  } else {
    // Navigate to universities page with city filter and scroll to top
    await router.push(localePath({ path: '/universities', query: { city } }))
  }
}

const handleAllUniversitiesClick = async () => {
  if (isUniversitiesPage.value) {
    // If already on universities page, reset filters with scroll
    const universitiesStore = useUniversitiesStore()
    universitiesStore.resetFiltersFromFooter()
  } else {
    // Navigate to universities page and scroll to top
    await router.push(localePath('/universities'))
  }
}
</script>
