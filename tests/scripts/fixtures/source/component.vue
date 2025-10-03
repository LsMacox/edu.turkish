<template>
  <div>
    <h1>{{ $t('pages.home.title') }}</h1>
    <button>{{ t('common.submit') }}</button>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
