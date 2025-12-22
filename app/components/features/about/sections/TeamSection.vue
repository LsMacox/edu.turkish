<template>
  <BaseSection id="team" padding="lg" max-width="6xl">
        <BaseSectionHeader
          :title="t(teamNs('title'))"
          :subtitle="t(teamNs('subtitle'))"
          align="center"
          max-width="full"
        />

        <BaseGrid :md="2" :lg="3" gap="lg">
          <BaseCard
            v-for="member in teamMembers"
            :key="member.id"
            padding="none"
            shadow="md"
            rounded="2xl"
            hover="lift"
          >
            <div class="relative">
              <NuxtImg
                :src="member.photo"
                :alt="member.name"
                class="w-full h-64 object-cover rounded-lg"
                loading="lazy"
                decoding="async"
                sizes="(max-width: 1024px) 100vw, 33vw"
                format="webp"
              />
              <div class="absolute bottom-4 left-4 bg-white rounded-button badge-padding-sm">
                <span class="text-body-sm font-medium text-primary">{{ member.role }}</span>
              </div>
            </div>
            <div class="card-padding">
              <h3 class="text-card-title mb-component-xs">{{ member.name }}</h3>
              <p class="text-card-subtitle mb-component-sm">{{ member.position }}</p>
              <p class="text-body-sm text-meta mb-component-sm">
                {{ member.description }}
              </p>
              <div v-if="member.linkedin || member.whatsapp" class="flex gap-component-sm">
                <a
                  v-if="member.linkedin"
                  :href="member.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="step-badge-sm bg-info-light cursor-pointer"
                  :aria-label="t(linksNs('linkedin'), { name: member.name })"
                >
                  <Icon name="mdi:linkedin" class="text-info-dark" />
                </a>
                <a
                  v-if="member.whatsapp"
                  :href="`https://wa.me/${member.whatsapp}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="step-badge-sm bg-success-light cursor-pointer"
                  :aria-label="t(linksNs('whatsapp'), { name: member.name })"
                >
                  <Icon name="mdi:whatsapp" class="text-success-dark" />
                </a>
              </div>
            </div>
          </BaseCard>
        </BaseGrid>
  </BaseSection>
</template>

<script setup lang="ts">
import { ASSETS } from '~~/lib/config/assets'
import { namespace } from '~~/lib/i18n'

const teamNs = namespace('about.team')
const membersNs = namespace('about.team.members')
const linksNs = namespace('about.team.links')
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
    name: t(membersNs('hakim.name')),
    position: t(membersNs('hakim.position')),
    role: t(membersNs('hakim.role')),
    description: t(membersNs('hakim.description')),
    photo: ASSETS.about.team.hakim,
  },
  {
    id: 2,
    name: t(membersNs('nazrin.name')),
    position: t(membersNs('nazrin.position')),
    role: t(membersNs('nazrin.role')),
    description: t(membersNs('nazrin.description')),
    photo: ASSETS.about.team.nazrin,
  },
  {
    id: 3,
    name: t(membersNs('adam.name')),
    position: t(membersNs('adam.position')),
    role: t(membersNs('adam.role')),
    description: t(membersNs('adam.description')),
    photo: ASSETS.about.team.adam,
    linkedin: 'https://www.linkedin.com/in/adam-zugiraev/',
  },
  {
    id: 4,
    name: t(membersNs('nargiz.name')),
    position: t(membersNs('nargiz.position')),
    role: t(membersNs('nargiz.role')),
    description: t(membersNs('nargiz.description')),
    photo: ASSETS.about.team.nargiz,
  },
])
</script>
