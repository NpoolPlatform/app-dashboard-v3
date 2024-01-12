<template>
  <CoinInfo />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const CoinInfo = defineAsyncComponent(() => import('src/components/cms/Category.vue'))

</script>

<style lang='sass' scoped>
</style>
