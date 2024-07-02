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
    :good-types='[goodbase.GoodType.TechniqueServiceFee, goodbase.GoodType.ElectricityFee]'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_OFFLINE_FEE_ORDER') }}</span>
      </q-card-section>
      <q-card-section>
        <AppFeeSelector v-model:app-good-id='target.AppGoodID' />
        <AppUserSelector v-model:id='target.TargetUserID' />
        <q-input
          v-model='target.DurationSeconds' :label='$t("MSG_DURATIONS")' type='number' min='1'
          :suffix='sdk.durationUnit(appFee?.DurationDisplayType as goodbase.GoodDurationType)'
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
        <q-btn :loading='submitting' @click='onSubmit' :label='$t("MSG_SUBMIT")' />
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
import { feeorder, order, sdk, goodbase } from 'src/npoolstore'
import { defineAsyncComponent, computed, ref } from 'vue'

const OrderPage = defineAsyncComponent(() => import('src/components/billing/Order.vue'))
const AppFeeSelector = defineAsyncComponent(() => import('src/components/fee/AppFeeSelector.vue'))
const AppUserSelector = defineAsyncComponent(() => import('src/components/user/AppUserSelector.vue'))

const appFee = computed(() => sdk.appFee(target.value?.AppGoodID))

// TODO: support select parent order

const target = ref({
  OrderType: order.OrderType.Offline
} as feeorder.CreateUserFeeOrderRequest)

const showing = ref(false)
const submitting = ref(false)

const onCreate = () => {
  showing.value = true
}

const onMenuHide = () => {
  showing.value = false
  target.value = {
    OrderType: order.OrderType.Offline
  } as feeorder.CreateUserFeeOrderRequest
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  submitting.value = true
  sdk.createUserFeeOrder(target.value, (error: boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}
</script>
