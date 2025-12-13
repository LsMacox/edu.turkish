<template>
  <footer class="bg-white section-py">
    <div class="container mx-auto container-padding-narrow">
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        <!-- About Us -->
        <div>
          <h3 class="text-xl font-semibold text-secondary mb-6">{{ t(footer('about_us')) }}</h3>
          <ul class="space-y-3">
            <li v-for="link in aboutLinks" :key="link.hash">
              <NuxtLink :to="localePath('/about') + link.hash" class="footer-link">
                {{ t(link.label) }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Universities -->
        <div>
          <h3 class="text-xl font-semibold text-secondary mb-6">{{ t(footer('universities')) }}</h3>
          <ul class="space-y-3">
            <li v-for="city in cities" :key="city.value">
              <button class="footer-link" @click="handleCityClick(city.value)">
                {{ t(city.label) }}
              </button>
            </li>
            <li>
              <button class="footer-link" @click="handleAllUniversitiesClick">
                {{ t(footer('all_universities')) }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="text-xl font-semibold text-secondary mb-6">{{ t(footer('support')) }}</h3>
          <ul class="space-y-3">
            <li v-for="link in supportLinks" :key="link.to">
              <NuxtLink :to="localePath(link.to)" class="footer-link">
                {{ t(link.label) }}
              </NuxtLink>
            </li>
          </ul>

          <!-- Social Links -->
          <div class="mt-6">
            <p class="text-sm text-gray-700 mb-3">{{ t(footer('social_networks')) }}</p>
            <div class="flex space-x-3">
              <a
                v-for="social in socialLinks"
                :key="social.name"
                :href="social.href"
                target="_blank"
                :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center text-white transition-colors',
                  social.bg,
                ]"
                :aria-label="social.name"
                @click.prevent="handleSocialClick(social.href)"
              >
                <Icon :name="social.icon" />
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
              :src="ASSETS.logo"
              alt="Edu.turkish"
              width="60"
              height="60"
              loading="lazy"
              decoding="async"
              class="h-[60px] w-[60px] mr-3"
              sizes="60px"
              format="webp"
            />
            <span class="text-xl font-bold text-secondary">Edu.turkish</span>
          </div>
          <div class="text-center md:text-right">
            <p class="text-gray-700">{{ t(footer('copyright')) }}</p>
            <p class="text-sm text-gray-600 mt-1">{{ t(footer('licensed_agency')) }}</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useContactChannels } from '~/composables/useContactChannels'
import { useUniversitiesStore } from '~/stores/universities'
import { useFingerprint } from '~/composables/useFingerprint'
import { ASSETS } from '~~/lib/config/assets'
import { namespace } from '~~/lib/i18n'

const footer = namespace('footer')
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const { channels } = useContactChannels()
const { openWithFingerprint } = useFingerprint()

const aboutLinks = [
  { hash: '#who-we-are', label: footer('who_we_are') },
  { hash: '#team', label: footer('our_team') },
  { hash: '#contacts', label: footer('contacts') },
]

const cities = [
  { value: 'Стамбул', label: footer('istanbul') },
  { value: 'Анкара', label: footer('ankara') },
  { value: 'Измир', label: footer('izmir') },
  { value: 'Анталия', label: footer('antalya') },
]

const supportLinks = [
  { to: '/faq', label: footer('faq') },
  { to: '/reviews', label: footer('reviews') },
  { to: '/contract', label: footer('contract') },
  { to: '/privacy-policy', label: footer('privacy_policy') },
]

const socialLinks = computed(() => [
  {
    name: 'WhatsApp',
    href: channels.value.whatsapp.href,
    icon: 'mdi:whatsapp',
    bg: 'bg-green-500 hover:bg-green-600',
  },
  {
    name: 'Telegram',
    href: channels.value.telegram.href,
    icon: 'mdi:telegram',
    bg: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    name: 'Instagram',
    href: channels.value.instagram.href,
    icon: 'mdi:instagram',
    bg: 'bg-pink-500 hover:bg-pink-600',
  },
])

const isUniversitiesPage = computed(() => route.path.startsWith(localePath('/universities')))

const handleCityClick = async (city: string) => {
  if (isUniversitiesPage.value) {
    useUniversitiesStore().setCityFilter(city, { scrollToTop: true })
  } else {
    await router.push(localePath({ path: '/universities', query: { city } }))
  }
}

const handleAllUniversitiesClick = async () => {
  if (isUniversitiesPage.value) {
    useUniversitiesStore().resetFilters({ scrollToTop: true })
  } else {
    await router.push(localePath('/universities'))
  }
}

const handleSocialClick = (href: string) => openWithFingerprint(href, '_blank')
</script>

<style scoped>
.footer-link {
  @apply text-gray-700 hover:text-primary transition-colors;
}
</style>
