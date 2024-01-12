<template>
  <ArticleContent />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const ArticleContent = defineAsyncComponent(() => import('src/components/cms/ArticleContent.vue'))

</script>

<style lang='sass' scoped>
</style>
