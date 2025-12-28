<template>
  <Transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="translate-y-20 opacity-0 scale-50"
    enter-to-class="translate-y-0 opacity-100 scale-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="translate-y-0 opacity-100 scale-100"
    leave-to-class="translate-y-20 opacity-0 scale-50"
  >
    <a
      v-if="isMounted"
      :href="whatsapp.href"
      target="_blank"
      rel="noopener noreferrer nofollow"
      aria-label="Написать в WhatsApp"
      class="floating-whatsapp fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 group icon-container-md bg-[#25D366] shadow-floating hover:shadow-[0_6px_16px_rgba(37,211,102,0.4)] hover:-translate-y-1 transition-default ease-out print:hidden"
      @click="trackClick"
    >
      <!-- Pulse Animation Ring -->
      <span
        class="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping"
        style="animation-duration: 2s"
      ></span>

      <!-- Icon Container -->
      <div class="relative z-10 text-white drop-shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-8 h-8"
        >
          <path
            d="M12.0117 2C6.50574 2 2.02344 6.47837 2.02344 11.9825C2.02344 13.7446 2.48225 15.4625 3.35528 16.9746L2.00306 21.9083L7.05505 20.5834C8.52381 21.3864 10.2162 21.8228 11.9994 21.8228H12.0029C17.5099 21.8228 21.9911 17.3459 21.9911 11.8418C21.9911 9.21387 20.9677 6.74437 19.111 4.88868C17.2518 3.03125 14.7818 2.00125 12.0117 2ZM12.0046 20.1505H12.0011C10.4179 20.1505 8.86527 19.7255 7.50878 18.9205L7.18692 18.7292L4.19431 19.5139L4.99306 16.5977L4.78415 16.2642C3.90465 14.8639 3.44103 13.2389 3.44103 11.5668C3.44103 7.1955 6.99377 3.63962 12.0134 3.63962C14.3003 3.63962 16.4502 4.53037 18.0667 6.14787C19.685 7.76287 20.5746 9.91012 20.5746 12.1988C20.5746 16.9125 16.7312 20.1505 12.0046 20.1505ZM17.4789 14.9504C17.1785 14.8004 15.703 14.0754 15.4281 13.9754C15.1533 13.8754 14.9529 13.8254 14.7526 14.1254C14.5522 14.4254 13.9766 15.1004 13.8012 15.3004C13.6259 15.5004 13.4505 15.5254 13.1501 15.3754C12.8497 15.2254 11.8829 14.9089 10.7376 13.8872C9.85178 13.0972 9.25329 12.1214 9.07794 11.8214C8.90258 11.5214 9.06038 11.3589 9.21116 11.2089C9.34617 11.0751 9.511 10.8601 9.66179 10.6851C9.81257 10.5101 9.86167 10.3851 9.96161 10.1851C10.0616 9.98512 10.0107 9.81012 9.93529 9.66012C9.86026 9.51012 9.2589 8.03512 9.00817 7.43512C8.76517 6.85012 8.51902 6.93012 8.33317 6.93012C8.15782 6.93012 7.95792 6.93012 7.75732 6.93012C7.55672 6.93012 7.23147 7.00512 6.95618 7.30512C6.6809 7.60512 5.90414 8.33012 5.90414 9.80512C5.90414 11.2801 6.98073 12.7051 7.13151 12.9051C7.28229 13.1051 9.2589 16.1426 12.2852 17.4501C13.0058 17.7614 13.5686 17.9464 14.0052 18.0851C14.7311 18.3151 15.3938 18.2826 15.92 18.2039C16.5056 18.1164 17.7297 17.4639 17.9804 16.7639C18.2311 16.0639 18.2311 15.4639 18.1557 15.3389C18.0803 15.2139 17.8798 15.1004 17.5794 14.9504H17.4789Z"
          />
        </svg>
      </div>

      <!-- Tooltip/Label on Hover (Desktop only) -->
      <div
        class="absolute right-full mr-4 top-1/2 -translate-y-1/2 badge-padding bg-white text-secondary text-body-sm font-medium rounded-button shadow-card opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-default whitespace-nowrap pointer-events-none hidden md:block"
      >
        <span class="relative z-10">{{ whatsapp.cta }}</span>
        <!-- Triangle arrow -->
        <div
          class="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white transform rotate-45"
        ></div>
      </div>
    </a>
  </Transition>
</template>

<script setup lang="ts">
const { getChannel } = useContactChannels()
const whatsapp = getChannel('whatsapp')

// Use mounted state to trigger entrance animation
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

const trackClick = () => {
  // TODO: Add analytics event here if needed
  // e.g. gtag('event', 'contact_whatsapp', { ... })
}
</script>

<style>
@media (max-width: 768px) {
  body.has-sticky-cta .floating-whatsapp {
    bottom: 130px !important;
    transition: bottom 0.3s ease-out;
  }
}
</style>
