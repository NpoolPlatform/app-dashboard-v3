<template>
  <AllocatedCoupon />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AllocatedCoupon = defineAsyncComponent(() => import('src/components/inspire/AllocatedCoupon.vue'))

</script>

<style lang='sass' scoped>
</style>
