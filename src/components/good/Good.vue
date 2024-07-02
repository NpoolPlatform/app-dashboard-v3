<template>
  <GoodPage
    :good-types='[goodbase.GoodType.LegacyPowerRental, goodbase.GoodType.PowerRental]'
    :title='"PowerRental"'
  />
  <GoodPage
    :good-types='[goodbase.GoodType.TechniqueServiceFee, goodbase.GoodType.ElectricityFee]'
    :title='"Fee"'
  />
  <AppDefaultGood />
</template>
<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'
import { goodbase } from 'src/npoolstore'

const GoodPage = defineAsyncComponent(() => import('src/components/good/GoodBase.vue'))
const AppDefaultGood = defineAsyncComponent(() => import('src/components/good/AppDefaultGood.vue'))

</script>
