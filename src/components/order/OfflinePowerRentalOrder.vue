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
    :order-types='[OrderType.Offline, OrderType.Airdrop]' @order-selected='onOrderClick'
  />
  <q-dialog
    v-model='updatingPowerRentalOrder'
    @hide='onUpdateMenuHide'
    position='right'
  >
    <q-card>
      <q-card-section>{{ $t('MSG_ORDER_INFO') }}</q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_ORDER_ID') }}: {{ candidatePowerRentalOrder?.OrderID }}</q-item-label>
        <q-item-label>{{ $t('MSG_USER_ID') }}: {{ candidatePowerRentalOrder?.UserID }}</q-item-label>
        <q-item-label>{{ $t('MSG_EMAIL_ADDRESS') }}: {{ candidatePowerRentalOrder?.EmailAddress }}</q-item-label>
        <q-item-label>{{ $t('MSG_PHONE_NO') }}: {{ candidatePowerRentalOrder?.PhoneNO }}</q-item-label>
        <q-item-label>{{ $t('MSG_UNITS') }}: {{ candidatePowerRentalOrder?.Units }}</q-item-label>
        <q-item-label>{{ $t('MSG_PAYMENT_AMOUNT') }}: {{ candidatePowerRentalOrder?.PaymentAmountUSD }} USD</q-item-label>
        <q-item-label>{{ $t('MSG_CREATED_AT') }}: {{ candidatePowerRentalOrder?.CreatedAt }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_GOOD_NAME') }}: {{ candidatePowerRentalOrder?.AppGoodName }}</q-item-label>
        <q-item-label>{{ $t('MSG_PERIOD_DAYS') }}: {{ Math.floor(candidatePowerRentalOrder?.DurationSeconds / 24 / 60 / 60) }}</q-item-label>
        <q-item-label>{{ $t('MSG_ORDER_TYPE') }}: {{ candidatePowerRentalOrder?.OrderType }}</q-item-label>
        <q-item-label>{{ $t('MSG_ORDER_STATE') }}: {{ candidatePowerRentalOrder?.OrderState }}</q-item-label>
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' @click='onCancelOrder' :label='$t("MSG_CANCEL_ORDER")' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancelCancel' />
      </q-item>
    </q-card>
  </q-dialog>
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
          :required-app-good-ids='[]'
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
import { defineAsyncComponent, computed, ref, onMounted } from 'vue'
import { OrderType } from 'src/npoolstore/order/const'

const OrderPage = defineAsyncComponent(() => import('src/components/billing/Order.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))
const AppUserSelector = defineAsyncComponent(() => import('src/components/user/AppUserSelector.vue'))

const appPowerRental = computed(() => sdk.appPowerRental.appPowerRental(target.value?.AppGoodID))
const maxPurchaseUnits = computed(() => sdk.appPowerRental.purchaseLimit(target.value?.AppGoodID))

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

const _order = order.useOrderStore()
const onSubmit = () => {
  if (Number(target.value?.Units) > maxPurchaseUnits.value) return
  sdk.powerRentalOrder.createUserPowerRentalOrder({
    ...target.value,
    AppGoodStockID: appPowerRental.value?.AppGoodStockID as string
  }, (error: boolean) => {
    if (error) {
      return
    }
    _order.$reset()
    sdk.getOrders(0, 0)
    onMenuHide()
  })
}

const candidatePowerRentalOrder = ref(undefined as unknown as powerrentalorder.PowerRentalOrder)
const updatingPowerRentalOrder = ref(false)

const onOrderClick = (_order: order.Order) => {
  candidatePowerRentalOrder.value = sdk.powerRentalOrder.powerRentalOrder(_order.EntID) as powerrentalorder.PowerRentalOrder
  updatingPowerRentalOrder.value = true
}

const onUpdateMenuHide = () => {
  updatingPowerRentalOrder.value = false
}

onMounted(() => {
  if (!sdk.powerRentalOrder.powerRentalOrders().length) {
    sdk.powerRentalOrder.getPowerRentalOrders(0, 0)
  }
})

const onCancelOrder = () => {
  sdk.powerRentalOrder.updatePowerRentalOrder(candidatePowerRentalOrder.value, undefined, true, (error: boolean) => {
    if (error) return
    onUpdateMenuHide()
  })
}

const onCancelCancel = () => {
  onUpdateMenuHide()
}

</script>
