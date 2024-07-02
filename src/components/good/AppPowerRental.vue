<template>
  <GoodBase
    :title='"AppGoods"'
  />
  <AppFee />
  <AppDefaultGood />
</template>
<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const GoodBase = defineAsyncComponent(() => import('src/components/good/GoodBase.vue'))
const AppFee = defineAsyncComponent(() => import('src/components/good/AppFee.vue'))
const AppDefaultGood = defineAsyncComponent(() => import('src/components/good/AppDefaultGood.vue'))

</script>
