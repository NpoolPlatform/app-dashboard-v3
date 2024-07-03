<template>
  <AppPowerRental
    :title='"AppGoods"'
  />
  <AppGoodDisplayName />
  <AppGoodDisplayColor />
  <AppFee />
  <MalFunction />
  <AppDefaultGood />
</template>
<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AppPowerRental = defineAsyncComponent(() => import('src/components/good/AppPowerRental.vue'))
const AppGoodDisplayName = defineAsyncComponent(() => import('src/components/good/DisplayName.vue'))
const AppGoodDisplayColor = defineAsyncComponent(() => import('src/components/good/DisplayColor.vue'))
const AppFee = defineAsyncComponent(() => import('src/components/good/AppFee.vue'))
const AppDefaultGood = defineAsyncComponent(() => import('src/components/good/AppDefaultGood.vue'))
const MalFunction = defineAsyncComponent(() => import('src/components/good/MalFunction.vue'))

</script>
