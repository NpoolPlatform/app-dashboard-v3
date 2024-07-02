<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_FEE")'
    :rows='appFees'
    :columns='appFeesColumns'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appfee.AppFee)'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_APP_DEFAULT_GOOD') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.AppGoodName' :label='$t("MSG_NAME")' />
        <q-input v-model='target.Banner' :label='$t("MSG_BANNER")' />
        <q-input v-model='target.ProductPage' :label='$t("MSG_PRODUCT_PAGE")' />
        <q-input v-model.number='target.UnitValue' :label='$t("MSG_UNIT_VALUE")' />
        <q-input v-model.number='target.MinOrderDurationSeconds' :label='$t("MSG_MIN_ORDER_DURATION_SECONDS")' />
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
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const appFees = computed(() => sdk.appFees.value)
const target = ref({} as appfee.AppFee)

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
