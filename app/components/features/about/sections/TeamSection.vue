<template>
  <section id="team" class="section-py-lg bg-background">
    <div class="container mx-auto container-padding-narrow">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-section-title mb-6">
            {{ t('about.team.title') }}
          </h2>
          <p class="text-section-subtitle max-w-3xl mx-auto">
            {{ t('about.team.subtitle') }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="member in teamMembers"
            :key="member.id"
            class="bg-white rounded-2xl shadow-custom overflow-hidden hover-lift"
          >
            <div class="relative">
              <NuxtImg
                :src="member.photo"
                :alt="member.name"
                class="w-full h-64 object-cover"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 1024px) 100vw, 33vw"
                format="webp"
              />
              <div class="absolute bottom-4 left-4 bg-white rounded-lg px-3 py-1">
                <span class="text-sm font-medium text-primary">{{ member.role }}</span>
              </div>
            </div>
            <div class="card-padding">
              <h3 class="text-card-title mb-2">{{ member.name }}</h3>
              <p class="text-card-subtitle mb-4">{{ member.position }}</p>
              <p class="text-sm text-gray-500 leading-relaxed mb-4">
                {{ member.description }}
              </p>
              <div v-if="member.linkedin || member.whatsapp" class="flex space-x-3">
                <a
                  v-if="member.linkedin"
                  :href="member.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center cursor-pointer"
                  :aria-label="t('about.team.links.linkedin', { name: member.name })"
                >
                  <Icon name="mdi:linkedin" class="text-blue-600" />
                </a>
                <a
                  v-if="member.whatsapp"
                  :href="`https://wa.me/${member.whatsapp}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center cursor-pointer"
                  :aria-label="t('about.team.links.whatsapp', { name: member.name })"
                >
                  <Icon name="mdi:whatsapp" class="text-green-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ASSETS } from '~~/lib/assets'

const { t } = useI18n()

interface TeamMember {
  id: number
  name: string
  position: string
  role: string
  description: string
  photo: string
  linkedin?: string
  whatsapp?: string
}

const teamMembers = computed<TeamMember[]>(() => [
  {
    id: 1,
    name: t('about.team.members.hakim.name'),
    position: t('about.team.members.hakim.position'),
    role: t('about.team.members.hakim.role'),
    description: t('about.team.members.hakim.description'),
    photo: ASSETS.about.team.hakim,
  },
  {
    id: 2,
    name: t('about.team.members.nazrin.name'),
    position: t('about.team.members.nazrin.position'),
    role: t('about.team.members.nazrin.role'),
    description: t('about.team.members.nazrin.description'),
    photo: ASSETS.about.team.nazrin,
  },
  {
    id: 3,
    name: t('about.team.members.adam.name'),
    position: t('about.team.members.adam.position'),
    role: t('about.team.members.adam.role'),
    description: t('about.team.members.adam.description'),
    photo: ASSETS.about.team.adam,
    linkedin: 'https://www.linkedin.com/in/adam-zugiraev/',
  },
  {
    id: 4,
    name: t('about.team.members.nargiz.name'),
    position: t('about.team.members.nargiz.position'),
    role: t('about.team.members.nargiz.role'),
    description: t('about.team.members.nargiz.description'),
    photo: ASSETS.about.team.nargiz,
  },
])
</script>
