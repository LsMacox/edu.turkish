<template>
  <section id="appreciated-services" class="py-16">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-4">За что нас больше всего ценят</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">Наиболее часто упоминаемые достоинства в отзывах студентов</p>
      </div>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="service in services" 
          :key="service.id"
          class="bg-white rounded-2xl shadow-custom p-6 hover-lift"
        >
          <div class="flex items-center mb-4">
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
              :class="service.iconBg"
            >
              <Icon :name="service.icon" :class="service.iconColor" class="text-xl" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-secondary">{{ service.title }}</h3>
              <p class="text-sm text-gray-500">Упоминается в {{ service.percentage }}% отзывов</p>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div 
              class="h-3 rounded-full transition-all duration-1000 ease-out"
              :class="service.barColor"
              :style="{ width: `${service.percentage}%` }"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Service {
  id: number
  title: string
  percentage: number
  icon: string
  iconBg: string
  iconColor: string
  barColor: string
}

const services: Service[] = [
  {
    id: 1,
    title: 'Понятное объяснение',
    percentage: 89,
    icon: 'mdi:comment-text-outline',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    barColor: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'Быстрая поддержка',
    percentage: 85,
    icon: 'mdi:clock-fast',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    barColor: 'bg-green-500'
  },
  {
    id: 3,
    title: 'Персональный подход',
    percentage: 82,
    icon: 'mdi:account-tie',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    barColor: 'bg-purple-500'
  },
  {
    id: 4,
    title: 'Надёжность',
    percentage: 79,
    icon: 'mdi:shield-check',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    barColor: 'bg-orange-500'
  },
  {
    id: 5,
    title: 'Экспертность',
    percentage: 76,
    icon: 'mdi:school',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    barColor: 'bg-yellow-500'
  },
  {
    id: 6,
    title: 'Забота о клиентах',
    percentage: 73,
    icon: 'mdi:heart',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    barColor: 'bg-pink-500'
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
