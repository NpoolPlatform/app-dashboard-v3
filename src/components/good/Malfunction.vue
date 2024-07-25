<template>
  <q-table
    dense
    flat
    :title='$t("MSG_MALFUNCTIONS")'
    :rows='malfunctions'
    :columns='malfunctionColumns'
    row-key='ID'
    :rows-per-page-options='[100]'
  />
</template>

<script setup lang='ts'>
import { sdk, utils, goodmalfunction } from 'src/npoolstore'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const malfunctions = computed(() => sdk.goodMalfunctions.value)

const malfunctionColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.EntID
  },
  {
    name: 'GOODID',
    label: t('MSG_GOODID'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.GoodID
  },
  {
    name: 'GOODNAME',
    label: t('MSG_GOODNAME'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.GoodName
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.Title
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.Message
  },
  {
    name: 'GOODTYPE',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.GoodType
  },
  {
    name: 'StartAt',
    label: t('MSG_START_AT'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => utils.formatTime(row.StartAt)
  },
  {
    name: 'DurationSeconds',
    label: t('MSG_DURATION_SECONDS'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.DurationSeconds
  },
  {
    name: 'CompensatedOrders',
    label: t('MSG_COMPENSATE_SECONDS'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => row.CompensatedOrders
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: goodmalfunction.Malfunction) => utils.formatTime(row?.CreatedAt)
  }
])

onMounted(() => {
  if (!malfunctions.value?.length) {
    sdk.getMalfunctions(0, 0)
  }
})
</script>
