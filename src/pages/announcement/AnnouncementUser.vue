<template>
  <AnnouncementUser />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const AnnouncementUser = defineAsyncComponent(() => import('src/components/announcement/AnnouncementUser.vue'))

</script>

<style lang='sass' scoped>
</style>
