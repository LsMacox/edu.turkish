<template>
  <section id="map" class="py-16">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-4">Университеты на карте</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">Выберите город и изучите доступные университеты</p>
      </div>
      
      <div class="bg-white rounded-2xl shadow-custom p-8">
        <div class="relative">
          <img class="w-full h-96 object-cover rounded-xl" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/755a3d52cf-d33b22696c4656d49cbc.png" alt="Interactive map of Turkey with university locations marked, educational infographic style">
          
          <!-- Map Markers -->
          <div 
            class="absolute top-1/4 left-1/3 w-4 h-4 bg-primary rounded-full animate-pulse cursor-pointer" 
            title="Istanbul Universities"
            @click="selectCity('istanbul')"
          ></div>
          <div 
            class="absolute top-1/3 left-1/2 w-4 h-4 bg-primary rounded-full animate-pulse cursor-pointer" 
            title="Ankara Universities"
            @click="selectCity('ankara')"
          ></div>
          <div 
            class="absolute top-1/2 left-1/4 w-4 h-4 bg-primary rounded-full animate-pulse cursor-pointer" 
            title="Izmir Universities"
            @click="selectCity('izmir')"
          ></div>
          <div 
            class="absolute bottom-1/3 right-1/3 w-4 h-4 bg-primary rounded-full animate-pulse cursor-pointer" 
            title="Antalya Universities"
            @click="selectCity('antalya')"
          ></div>
          
          <!-- Info Card -->
          <div class="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-4 max-w-xs">
            <h4 class="font-semibold text-secondary mb-2">{{ selectedCityInfo.name }}</h4>
            <p class="text-sm text-gray-600 mb-3">{{ selectedCityInfo.count }}+ университетов</p>
            <div class="space-y-1 text-xs text-gray-500">
              <div v-for="university in selectedCityInfo.universities" :key="university">
                • {{ university }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-6 grid md:grid-cols-4 gap-4">
          <button 
            v-for="city in cities" 
            :key="city.id"
            @click="selectCity(city.id)"
            :class="[
              'p-4 rounded-xl font-medium transition-colors',
              selectedCity === city.id 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ city.name }} ({{ city.count }})
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Interactive map section
const selectedCity = ref('istanbul')

const cities = [
  { id: 'istanbul', name: 'Стамбул', count: 25 },
  { id: 'ankara', name: 'Анкара', count: 18 },
  { id: 'izmir', name: 'Измир', count: 12 },
  { id: 'antalya', name: 'Анталия', count: 8 }
]

const cityInfo = {
  istanbul: {
    name: 'Стамбул',
    count: 25,
    universities: [
      'Istanbul University',
      'Bogazici University', 
      'Sabanci University',
      'Koc University'
    ]
  },
  ankara: {
    name: 'Анкара',
    count: 18,
    universities: [
      'METU Ankara',
      'Bilkent University',
      'Ankara University',
      'Hacettepe University'
    ]
  },
  izmir: {
    name: 'Измир',
    count: 12,
    universities: [
      'Izmir University',
      'Ege University',
      'DEU University',
      'Yasar University'
    ]
  },
  antalya: {
    name: 'Анталия',
    count: 8,
    universities: [
      'Akdeniz University',
      'Antalya University',
      'Alanya University',
      'International University'
    ]
  }
}

const selectedCityInfo = computed(() => {
  return cityInfo[selectedCity.value as keyof typeof cityInfo]
})

const selectCity = (cityId: string) => {
  selectedCity.value = cityId
}
</script>

<style scoped>
.shadow-custom {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
