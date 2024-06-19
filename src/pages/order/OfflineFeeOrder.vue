<template>
  <OfflineFeeOrder />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const OfflineFeeOrder = defineAsyncComponent(() => import('src/components/order/OfflineFeeOrder.vue'))

</script>

<style lang='sass' scoped>
</style>
