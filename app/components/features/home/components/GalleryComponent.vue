<template>
  <section id="instagram-gallery" class="py-16">
    <div class="container mx-auto px-4 lg:px-6">
      <div class="text-center mb-12">
        <h2 class="text-3xl lg:text-4xl font-bold text-secondary mb-4">Наши студенты</h2>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">Следите за историями успеха в Instagram</p>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div class="aspect-square rounded-xl overflow-hidden hover-lift">
          <img class="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/a26eb64ea3-09c0d08dd16e2f90619d.png" alt="Happy student with acceptance letter from Turkish university, celebration moment" loading="lazy" decoding="async" />
        </div>
        <div class="aspect-square rounded-xl overflow-hidden hover-lift">
          <img class="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/dbb442f9ee-ce7eba4b4960146db10a.png" alt="Group of international students at Turkish university campus" loading="lazy" decoding="async" />
        </div>
        <div class="aspect-square rounded-xl overflow-hidden hover-lift">
          <img class="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/0880995ea6-d6dedf4c92dd12564294.png" alt="Student visa approval document and passport, success story" loading="lazy" decoding="async" />
        </div>
        <div class="aspect-square rounded-xl overflow-hidden hover-lift">
          <img class="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/00422f2547-911759db3fa296dcfb47.png" alt="Turkish university graduation ceremony, international students celebrating" loading="lazy" decoding="async" />
        </div>
        <div class="aspect-square rounded-xl overflow-hidden hover-lift">
          <img class="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/cf01a50476-6e6002be5bec8a6f2b9c.png" alt="Student dorm room in Turkey, comfortable living space" loading="lazy" decoding="async" />
        </div>
        <div class="aspect-square rounded-xl overflow-hidden hover-lift">
          <img class="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/f70c32bc00-29222ef1ecb1d31579cc.png" alt="Beautiful Istanbul cityscape with university buildings" loading="lazy" decoding="async" />
        </div>
        <div class="aspect-square rounded-xl overflow-hidden hover-lift">
          <img class="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/ac216abdac-21447a489ba7c6ff578a.png" alt="Students studying in modern Turkish university library" loading="lazy" decoding="async" />
        </div>
        <div class="aspect-square rounded-xl overflow-hidden hover-lift">
          <img class="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/7f108483c1-4f9c7b6afc5b5bd47e5e.png" alt="International student orientation day at Turkish university" loading="lazy" decoding="async" />
        </div>
        <div class="aspect-square rounded-xl overflow-hidden hover-lift">
          <img class="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/e5acf5ab91-4366e997250e9d9caf3e.png" alt="Student receiving scholarship award at Turkish university" loading="lazy" decoding="async" />
        </div>
        <div class="aspect-square rounded-xl overflow-hidden hover-lift">
          <img class="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/1f3dcd7a4e-26a7d8d42fadba16a36b.png" alt="Turkish university campus during spring, beautiful architecture" loading="lazy" decoding="async" />
        </div>
        <div class="aspect-square rounded-xl overflow-hidden hover-lift">
          <img class="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/959a74dc15-db18a3e4aff7e6f98cfc.png" alt="Group photo of Edu.turkish team with successful students" loading="lazy" decoding="async" />
        </div>
        <div class="aspect-square rounded-xl overflow-hidden hover-lift">
          <img class="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/a98882a3d5-6c6ea09128dfcb3bc3ba.png" alt="Student testimonial screenshot from social media, positive review" loading="lazy" decoding="async" />
        </div>
      </div>
      
      <div class="text-center mt-8">
        <a href="https://www.instagram.com/edu.turkish" target="_blank" class="inline-flex items-center space-x-2 bg-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors">
          <Icon name="mdi:instagram" />
          <span>Подписаться на Instagram</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Instagram gallery section
</script>

<style scoped>
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}
</style>
