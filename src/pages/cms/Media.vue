<template>
  <Media />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Media = defineAsyncComponent(() => import('src/components/cms/Media.vue'))

</script>

<style lang='sass' scoped>
</style>
