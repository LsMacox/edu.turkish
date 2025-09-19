<template>
  <section id="cta" class="py-20">
    <div class="container">
      <div
        class="bg-primary text-white rounded-2xl p-10 md:p-14 grid gap-6 md:grid-cols-2 items-center"
      >
        <div>
          <h2 class="text-3xl font-bold mb-2">Готовы начать поступление?</h2>
          <p class="text-white/90">
            Оставьте заявку, и наш менеджер свяжется с вами в течение дня.
          </p>
        </div>
        <div class="flex md:justify-end">
          <button
            class="inline-flex items-center justify-center bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors"
            @click="modal.openModal()"
          >
            Подать заявку
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useApplicationModalStore } from '~/stores/applicationModal'

const modal = useApplicationModalStore()
</script>
