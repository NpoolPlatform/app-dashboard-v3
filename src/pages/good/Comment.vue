<template>
  <Comment />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const Comment = defineAsyncComponent(() => import('src/components/good/GoodComment.vue'))

</script>
