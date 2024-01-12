<template>
  <Article />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Article = defineAsyncComponent(() => import('src/components/cms/Article.vue'))

</script>

<style lang='sass' scoped>
</style>
