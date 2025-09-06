<template>
  <section id="team" class="py-20">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-6">{{ t('about.team.title') }}</h2>
          <p class="text-lg text-gray-600 max-w-3xl mx-auto">
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
              <img 
                :src="member.photo" 
                :alt="member.name" 
                class="w-full h-64 object-cover"
              >
              <div class="absolute bottom-4 left-4 bg-white rounded-lg px-3 py-1">
                <span class="text-sm font-medium text-primary">{{ member.role }}</span>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-semibold text-secondary mb-2">{{ member.name }}</h3>
              <p class="text-gray-600 mb-4">{{ member.position }}</p>
              <p class="text-sm text-gray-500 leading-relaxed mb-4">
                {{ member.description }}
              </p>
              <div class="flex space-x-3">
                <span class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center cursor-pointer">
                  <Icon name="mdi:linkedin" class="text-blue-600" />
                </span>
                <span class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center cursor-pointer">
                  <Icon name="mdi:whatsapp" class="text-green-600" />
                </span>
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

interface TeamMember {
  id: number
  name: string
  position: string
  role: string
  description: string
  photo: string
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Алия Касымова',
    position: t('about.team.ceo_founder'),
    role: 'CEO',
    description: t('about.team.aliya_description'),
    photo: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg'
  },
  {
    id: 2,
    name: 'Дмитрий Волков',
    position: t('about.team.bachelor_consultant'),
    role: t('about.team.consultant'),
    description: t('about.team.dmitry_description'),
    photo: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg'
  },
  {
    id: 3,
    name: 'Айгуль Нурланова',
    position: t('about.team.master_consultant'),
    role: t('about.team.consultant'),
    description: t('about.team.aigul_description'),
    photo: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg'
  },
  {
    id: 4,
    name: 'Мехмет Озкан',
    position: t('about.team.university_manager'),
    role: t('about.team.manager'),
    description: t('about.team.mehmet_description'),
    photo: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg'
  },
  {
    id: 5,
    name: 'Анна Петрова',
    position: t('about.team.document_specialist'),
    role: t('about.team.specialist'),
    description: t('about.team.anna_description'),
    photo: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg'
  },
  {
    id: 6,
    name: 'Артем Козлов',
    position: t('about.team.support_manager'),
    role: t('about.team.support'),
    description: t('about.team.artem_description'),
    photo: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-4.jpg'
  }
]
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
