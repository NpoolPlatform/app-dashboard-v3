<template>
  <q-table
    dense
    flat
    :title='displayTitle'
    :rows='appPowerRentals'
    :columns='appPowerRentalsColumns'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as apppowerrental.AppPowerRental)'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <q-input v-model='target.GoodName' :label='$t("MSG_GOOD_NAME")' />
        <q-input v-model='target.UnitPrice' :label='$t("MSG_UNIT_PRICE")' type='number' :min='0' />
        <q-input v-model='target.MinOrderAmount' :label='$t("MSG_MIN_ORDER_AMOUNT")' type='number' :min='0' />
        <q-input v-model='target.MaxOrderAmount' :label='$t("MSG_MAX_ORDER_AMOUNT")' type='number' :min='0' />
        <q-input v-model='target.MaxUserAmount' :label='$t("MSG_MAX_USER_AMOUNT")' type='number' :min='0' />
        <q-input v-model='target.MinOrderDurationSeconds' :label='$t("MSG_MIN_ORDER_DURATION_SECONDS")' type='number' :min='0' />
        <q-input v-model='target.MaxOrderDurationSeconds' :label='$t("MSG_MAX_ORDER_DURATION_SECONDS")' type='number' :min='0' />
      </q-card-section>
      <q-card-section>
        <q-select
          :options='goodbase.CancelModes'
          v-model='target.CancelMode'
          :label='$t("MSG_CANCEL_MODE")'
        />
        <q-input
          v-model.number='target.CancelableBeforeStartSeconds'
          :label='$t("MSG_CANCELLABLE_BEFORE_START")'
          type='number'
          :min='0'
          suffix='h'
          :disable='!sdk.appPowerRental.cancelable(target.AppGoodID)'
        />
        <q-select
          :options='goodbase.GoodSaleModes'
          v-model='target.SaleMode'
          :label='$t("MSG_SALE_MODE")'
        />
        <q-select
          :options='goodbase.StartModes'
          v-model='target.GoodStartMode'
          :label='$t("MSG_GOOD_START_MODE")'
        />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Banner' :label='$t("MSG_BANNER")' />
        <q-input v-model='target.ProductPage' :label='$t("MSG_PRODUCT_PAGE")' />
        <q-input v-model.number='target.DisplayIndex' :label='$t("MSG_DISPLAY_INDEX")' type='number' :min='0' />
      </q-card-section>
      <q-card-section>
        <div>
          <DateTimePicker v-model:date='target.SaleStartAt' label='MSG_SALE_START_AT' />
        </div>
        <div>
          <DateTimePicker v-model:date='target.SaleEndAt' label='MSG_SALE_END_AT' />
        </div>
        <DateTimePicker v-model:date='target.ServiceStartAt' label='MSG_SERVICE_START_AT' />
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.EnableSetCommission' :label='$t("MSG_ENABLE_SET_COMMISSION")' /></div>
        <div><q-toggle dense v-model='target.AppGoodPurchasable' :label='$t("MSG_ENABLE_PURCHASE")' /></div>
        <div><q-toggle dense v-model='target.EnableProductPage' :label='$t("MSG_ENABLE_PRODUCT_PAGE")' /></div>
        <div><q-toggle dense v-model='target.Visible' :label='$t("MSG_VISIBLE")' /></div>
        <div><q-toggle dense v-model='target.AppGoodOnline' :label='$t("MSG_ONLINE")' /></div>
        <div><q-toggle dense v-model='target.PackageWithRequireds' :label='$t("MSG_PACKAGE_WITH_REQUIREDS")' /></div>
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { sdk, utils, goodbase, apppowerrental } from 'src/npoolstore'
import { computed, defineProps, ref, toRef, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Props {
  goodTypes?: Array<goodbase.GoodType>
  title?: string
}

const props = defineProps<Props>()
const goodTypes = toRef(props, 'goodTypes')
const title = toRef(props, 'title')
const displayTitle = computed(() => title.value ? title.value : t('MSG_APP_GOODS'))

const appPowerRentals = computed(() => sdk.appPowerRental.appPowerRentals.value.filter((el) => {
  let display = true
  if (goodTypes.value !== undefined && goodTypes.value?.length > 0) {
    const index = goodTypes.value.findIndex((gl) => gl === el.GoodType)
    display = display && (index > -1)
  }
  return display
}))

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as apppowerrental.AppPowerRental)

const onRowClick = (row: apppowerrental.AppPowerRental) => {
  showing.value = true
  updating.value = true
  target.value = row
}

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as apppowerrental.AppPowerRental
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  submitting.value = true
  sdk.appPowerRental.updateAppPowerRental(target.value, (error: boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const appPowerRentalsColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.GoodID
  },
  {
    name: 'AppGoodID',
    label: t('MSG_APP_GOOD_ID'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.AppGoodID
  },
  {
    name: 'AppGoodName',
    label: t('MSG_APP_GOOD_NAME'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.AppGoodName
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.GoodType
  },
  {
    name: 'Visible',
    label: t('MSG_VISIBLE'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.Visible
  },
  {
    name: 'BenefitType',
    label: t('MSG_BENEFIT_TYPE'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.BenefitType
  },
  {
    name: 'ServiceStartAt',
    label: t('MSG_SERVICE_START_AT'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => utils.formatTime(row?.ServiceStartAt)
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => utils.formatTime(row?.CreatedAt)
  }
])
</script>
