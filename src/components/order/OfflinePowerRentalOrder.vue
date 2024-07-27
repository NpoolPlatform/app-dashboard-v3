<template>
  <div class='row'>
    <q-space />
    <q-btn
      dense
      flat
      class='btn flat'
      :label='$t("MSG_CREATE")'
      @click='onCreate'
    />
  </div>
  <OrderPage
    :good-types='[goodbase.GoodType.PowerRental, goodbase.GoodType.LegacyPowerRental]'
    :order-types='[OrderType.Offline]'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <q-item-label>{{ $t('MSG_TOTAL') }}: {{ appPowerRental?.GoodTotal }}</q-item-label>
        <q-item-label>{{ $t('MSG_LOCKED') }}: {{ appPowerRental?.AppGoodLocked }}</q-item-label>
        <q-item-label>{{ $t('MSG_IN_SERVICE') }}: {{ appPowerRental?.AppGoodInService }}</q-item-label>
        <AppGoodSelector
          v-model:app-good-id='target.AppGoodID'
          :good-types='[
            goodbase.GoodType.PowerRental,
            goodbase.GoodType.LegacyPowerRental
          ]'
        />
        <AppUserSelector v-model:user-id='target.TargetUserID' />
        <q-input
          v-model='target.Units' :label='$t("MSG_PURCHASE_UNITS")' type='number' min='1'
          :max='maxPurchaseUnits'
          :suffix='appPowerRental?.QuantityUnit'
          :rules='[ val => val <= maxPurchaseUnits || `Max purchase units: ${maxPurchaseUnits}`]'
        />
      </q-card-section>
      <q-card-section>
        <q-btn-toggle
          v-model='target.OrderType'
          rounded
          :options='[
            {label: order.OrderType.Offline, value: order.OrderType.Offline},
            {label: order.OrderType.Airdrop, value: order.OrderType.Airdrop}
          ]'
        />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' @click='onSubmit' :label='$t("MSG_SUBMIT")' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { order, powerrentalorder, sdk, goodbase } from 'src/npoolstore'
import { defineAsyncComponent, computed, ref } from 'vue'
import { OrderType } from 'src/npoolstore/order/const'

const OrderPage = defineAsyncComponent(() => import('src/components/billing/Order.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))
const AppUserSelector = defineAsyncComponent(() => import('src/components/user/AppUserSelector.vue'))

const appPowerRental = computed(() => sdk.appPowerRental(target.value?.AppGoodID))
const maxPurchaseUnits = computed(() => sdk.appPowerRentalMaxPurchasedUnits(target.value?.AppGoodID))

const target = ref({
  OrderType: order.OrderType.Offline,
  InvestmentType: order.InvestmentType.FullPayment
} as powerrentalorder.CreateUserPowerRentalOrderRequest)

const showing = ref(false)
const submitting = ref(false)

const onCreate = () => {
  showing.value = true
}

const onMenuHide = () => {
  showing.value = false
  target.value = {
    OrderType: order.OrderType.Offline,
    InvestmentType: order.InvestmentType.FullPayment
  } as powerrentalorder.CreateUserPowerRentalOrderRequest
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  if (Number(target.value?.Units) > maxPurchaseUnits.value) return
  sdk.createUserPowerRentalOrder({
    ...target.value,
    AppGoodStockID: appPowerRental.value?.AppGoodStockID as string
  }, (error: boolean, row?: powerrentalorder.PowerRentalOrder) => {
    console.log('resp: ', row)
    if (error) {
      return
    }
    onMenuHide()
  })
}
</script>
