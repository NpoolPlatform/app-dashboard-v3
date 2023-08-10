<template>
  <q-table
    dense
    flat
    :title='$t("MSG_OP_LOGS")'
    :rows='opLogs'
    row-key='ID'
    :rows-per-page-options='[100]'
  />
  <q-card-section class='bg-primary text-white'>
    {{ $t('MSG_ADVERTISEMENT_POSITION') }}
  </q-card-section>
</template>

<script setup lang='ts'>
import { oplog } from 'src/npoolstore'
import { computed, onMounted } from 'vue'

const log = oplog.useOpLogStore()
const opLogs = computed(() => log.OpLogs)

onMounted(() => {
  if (opLogs.value.length === 0) {
    getAppOpLogs(0, 500)
  }
})

const getAppOpLogs = (offset: number, limit: number) => {
  log.getAppOpLogs({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows: Array<oplog.OpLog>) => {
    if (error || rows.length === 0) {
      return
    }
    getAppOpLogs(offset + limit, limit)
  })
}
</script>
