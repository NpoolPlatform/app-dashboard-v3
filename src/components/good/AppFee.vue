<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_FEE")'
    :rows='appFees'
    :columns='appFeesColumns'
    row-key='ID'
    :rows-per-page-options='[100]'
  />
</template>

<script setup lang='ts'>
import { sdk, utils, appfee } from 'src/npoolstore'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const appFees = computed(() => sdk.appFees.value)

const appFeesColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appfee.AppFee) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: appfee.AppFee) => row.EntID
  },
  {
    name: 'GOODID',
    label: t('MSG_GOODID'),
    sortable: true,
    field: (row: appfee.AppFee) => row.GoodID
  },
  {
    name: 'GOODNAME',
    label: t('MSG_GOODNAME'),
    sortable: true,
    field: (row: appfee.AppFee) => row.GoodName
  },
  {
    name: 'GOODTYPE',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: appfee.AppFee) => row.GoodType
  },
  {
    name: 'DurationDisplayType',
    label: t('MSG_DURATION_DISPLAY_TYPE'),
    sortable: true,
    field: (row: appfee.AppFee) => row.DurationDisplayType
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: appfee.AppFee) => utils.formatTime(row?.CreatedAt)
  }
])

onMounted(() => {
  if (!appFees.value?.length) {
    sdk.getAppFees(0, 0)
  }
})
</script>
