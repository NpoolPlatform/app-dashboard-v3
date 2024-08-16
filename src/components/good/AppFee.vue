<template>
  <Fee />
  <q-table
    dense
    flat
    :title='$t("MSG_APP_FEE")'
    :rows='displayAppFees'
    :columns='appFeesColumns'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appfee.AppFee)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='goodName'
          :label='$t("MSG_GOOD_NAME")'
        />
      </div>
    </template>
  </q-table>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <q-input v-model='target.AppGoodName' :label='$t("MSG_NAME")' />
        <q-input v-model='target.Banner' :label='$t("MSG_BANNER")' />
        <q-input v-model='target.ProductPage' :label='$t("MSG_PRODUCT_PAGE")' />
        <q-input v-model.number='target.UnitValue' type='number' :label='$t("MSG_UNIT_VALUE")' />
        <q-input v-model.number='target.MinOrderDurationSeconds' type='number' :label='$t("MSG_MIN_ORDER_DURATION_SECONDS")' />
        <q-select :options='goodbase.CancelModes' v-model='target.CancelMode' :label='$t("MSG_CANCEL_MODE")' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { sdk, utils, appfee, goodbase } from 'src/npoolstore'
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const Fee = defineAsyncComponent(() => import('src/components/good/Fee.vue'))

const appFees = computed(() => sdk.appFees.value)
const target = ref({} as appfee.AppFee)

const goodName = ref('')
const displayAppFees = computed(() => {
  const name = goodName.value.toLowerCase()
  return appFees.value?.filter((el) => {
    return el.EntID.toLowerCase().includes(name) ||
          el.AppGoodName.toLowerCase().includes(name) ||
          el.AppGoodID.toLowerCase().includes(name) ||
          el.GoodID.toLowerCase().includes(name) ||
          el.GoodName.toLowerCase().includes(name)
  })
})

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)

const onMenuHide = () => {
  target.value = {} as appfee.AppFee
  showing.value = false
  submitting.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onRowClick = (row: appfee.AppFee) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onSubmit = () => {
  submitting.value = true
  sdk.updateAppFee(target.value, (error: boolean) => {
    submitting.value = false
    if (error) {
      return
    }
    onMenuHide()
  })
}

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
    name: 'AppGoodID',
    label: t('MSG_APP_GOOD_ID'),
    sortable: true,
    field: (row: appfee.AppFee) => row.AppGoodID
  },
  {
    name: 'AppGoodName',
    label: t('MSG_APP_GOOD_NAME'),
    sortable: true,
    field: (row: appfee.AppFee) => row.AppGoodName
  },
  {
    name: 'GOODTYPE',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: appfee.AppFee) => row.GoodType
  },
  {
    name: 'UnitValue',
    label: t('MSG_UNIT_VALUE'),
    sortable: true,
    field: (row: appfee.AppFee) => row.UnitValue
  },
  {
    name: 'DurationDisplayType',
    label: t('MSG_DURATION_DISPLAY_TYPE'),
    sortable: true,
    field: (row: appfee.AppFee) => row.DurationDisplayType
  },
  {
    name: 'MinOrderDurationSeconds',
    label: t('MSG_MIN_ORDER_DURATION_SECONDS'),
    sortable: true,
    field: (row: appfee.AppFee) => row.MinOrderDurationSeconds
  },
  {
    name: 'CancelMode',
    label: t('MSG_CANCEL_MODE'),
    sortable: true,
    field: (row: appfee.AppFee) => row.CancelMode
  },
  {
    name: 'ProductPage',
    label: t('MSG_PRODUCT_PAGE'),
    sortable: true,
    field: (row: appfee.AppFee) => row.ProductPage
  },
  {
    name: 'Banner',
    label: t('MSG_BANNER'),
    sortable: true,
    field: (row: appfee.AppFee) => row.Banner
  },
  {
    name: 'SettlementType',
    label: t('MSG_SETTLEMENT_TYPE'),
    sortable: true,
    field: (row: appfee.AppFee) => row.SettlementType
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
