<template>
  <div class='row'>
    <LangSwitcher />
    <AvatarDropdown v-if='logined' />
  </div>
</template>

<script setup lang='ts'>
import { user } from 'src/npoolstore'
import { defineAsyncComponent } from 'vue'

const AvatarDropdown = defineAsyncComponent(() => import('src/components/avatar/AvatarDropdown.vue'))
const LangSwitcher = defineAsyncComponent(() => import('src/components/lang/LangSwitcher.vue'))

const loginedUser = user.useLocalUserStore()
const logined = loginedUser.logined

</script>

<style lang='sass' scoped>
</style>
