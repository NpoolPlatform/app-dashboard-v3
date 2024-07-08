<template>
  <q-table
    dense
    flat
    :title='$t("MSG_REQUIRED_GOODS")'
    :rows='requireds'
    row-key='ID'
    :rows-per-page-options='[100]'
  />
</template>

<script setup lang='ts'>
import { onMounted } from 'vue'
import { sdk } from 'src/npoolstore'

const requireds = sdk.requiredGoods

onMounted(() => {
  if (!requireds.value.length) {
    sdk.getRequiredGoods(0, 0)
  }
})

</script>

<style lang='sass' scoped>
</style>
