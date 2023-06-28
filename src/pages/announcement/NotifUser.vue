<template>
  <NotifUser />
</template>

<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const NotifUser = defineAsyncComponent(() => import('src/components/announcement/NotifUser.vue'))

</script>

<style lang='sass' scoped>
</style>
