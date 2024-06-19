<template>
  <OfflinePowerRentalOrder />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const OfflinePowerRentalOrder = defineAsyncComponent(() => import('src/components/order/OfflinePowerRentalOrder.vue'))

</script>

<style lang='sass' scoped>
</style>
