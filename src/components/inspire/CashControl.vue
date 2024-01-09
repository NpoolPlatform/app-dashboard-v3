<template>
  <q-table
    dense
    flat
    :title='$t("MSG_CASH_CONTROL")'
    :rows='displayCashControls'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='columns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { cashcontrol, sdk, utils } from 'src/npoolstore'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _cashcontrol = cashcontrol.useCashControlStore()
const username = ref('')
const cashcontrols = computed(() => _cashcontrol.cashcontrols())
const displayCashControls = computed(() => _cashcontrol.cashcontrols().filter((el) => {
  return el.CouponID?.includes(username.value) ||
               el.CouponName?.includes(username.value)
}))

onMounted(() => {
  if (!cashcontrols.value?.length) {
    sdk.getAppCashControls(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => row.AppID
  },
  {
    name: 'ControlType',
    label: t('MSG_CONTROL_TYPE'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => row.ControlType
  },
  {
    name: 'CouponID',
    label: t('MSG_COUPON_ID'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => row.CouponID
  },
  {
    name: 'CouponName',
    label: t('MSG_COUPON_NAME'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => row.CouponName
  },
  {
    name: 'CouponType',
    label: t('MSG_COUPON_TYPE'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => row.CouponType
  },
  {
    name: 'CouponDenomination',
    label: t('MSG_DENOMINATION'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => row.CouponDenomination
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: cashcontrol.CashControl) => utils.formatTime(row.UpdatedAt)
  }
])

</script>
