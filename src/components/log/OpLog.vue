<template>
  <q-table
    dense
    flat
    :title='$t("MSG_OP_LOGS")'
    :rows='opLogs'
    v-model:pagination='pagination'
    :rows-per-page-options='[10]'
    row-key='EntID'
    :loading='loading'
    @request='getLogs'
  />
</template>

<script setup lang='ts'>
import { sdk } from 'src/npoolstore'
import { computed, onMounted, ref } from 'vue'

interface Pagination {
  sortBy?: string
  descending?: boolean
  page: number
  rowsPerPage: number
  rowsNumber?: number
}

const opLogs = computed(() => sdk.opLogs.value)
const totalRows = computed(() => sdk.totalRows.value || 0)

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: totalRows.value
} as Pagination)

const loading = ref(false)
const getLogs = () => {
  loading.value = true
  sdk.getOpLogs(pagination.value.page, pagination.value.page++, () => {
    loading.value = false
  })
}

onMounted(() => {
  if (opLogs.value.length === 0) {
    sdk.getOpLogs(0, 1, (_: boolean, __: number, totalRows: number) => {
      pagination.value.rowsNumber = totalRows
    })
  }
})
</script>
