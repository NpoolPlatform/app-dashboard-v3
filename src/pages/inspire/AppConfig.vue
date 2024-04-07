<template>
  <AppConfig />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AppConfig = defineAsyncComponent(() => import('src/components/inspire/AppConfig.vue'))

</script>

<style lang='sass' scoped>
</style>
