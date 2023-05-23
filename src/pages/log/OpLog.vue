<template>
  <OpLog />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const OpLog = defineAsyncComponent(() => import('src/components/log/OpLog.vue'))

</script>

<style lang='sass' scoped>
</style>
