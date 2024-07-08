<template>
  <AppPowerRental
    :title='"AppGoods"'
  />
  <AppFee />
</template>
<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AppPowerRental = defineAsyncComponent(() => import('src/components/good/AppPowerRental.vue'))
const AppFee = defineAsyncComponent(() => import('src/components/good/AppFee.vue'))

</script>
