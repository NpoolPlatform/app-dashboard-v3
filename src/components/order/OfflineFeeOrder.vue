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
        <q-item-label>{{ $t('MSG_USER_EMAIL_ADDRESS') }}: {{ appOrder?.EmailAddress }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <OrderSelector
          v-model:order-id='target.ParentOrderID'
          :order-states='[order.OrderState.PAID, order.OrderState.IN_SERVICE]'
          :good-types='[
            goodbase.GoodType.PowerRental,
            goodbase.GoodType.LegacyPowerRental
          ]'
        />
        <AppGoodSelector
          v-model:app-good-id='target.AppGoodID'
          :required-app-good-ids='requiredAppGoodIds'
        />
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
import { feeorder, order, sdk, goodbase } from 'src/npoolstore'
import { defineAsyncComponent, computed, ref, onMounted, watch } from 'vue'

const OrderPage = defineAsyncComponent(() => import('src/components/billing/Order.vue'))
const OrderSelector = defineAsyncComponent(() => import('src/components/order/OrderSelector.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))

const appFees = computed(() => sdk.appFees.value.sort((a, b) => a.CreatedAt > b.CreatedAt ? -1 : 1))
const appFee = computed(() => sdk.appFee(target.value?.AppGoodID))
const appOrder = computed(() => sdk.appOrder(target.value.ParentOrderID))

const target = ref({ OrderType: order.OrderType.Offline } as feeorder.CreateUserFeeOrderRequest)

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

const _order = order.useOrderStore()
const onSubmit = () => {
  submitting.value = true
  target.value.TargetUserID = appOrder.value?.UserID as string
  target.value.DurationSeconds = target.value.DurationSeconds * sdk.durationUnitSeconds(appFee?.value?.DurationDisplayType as goodbase.GoodDurationType)
  sdk.createUserFeeOrder(target.value, (error: boolean) => {
    submitting.value = false
    if (error) return
    _order.$reset()
    sdk.getOrders(0, 0)
    onMenuHide()
  })
}

const requireds = sdk.requiredAppGoods
const requiredAppGoodIds = ref([] as Array<string>)

watch(() => appOrder.value?.AppGoodID, () => {
  requiredAppGoodIds.value = [] as Array<string>
  requireds.value.forEach((el) => {
    if (appOrder.value?.AppGoodID === el.MainAppGoodID) {
      requiredAppGoodIds.value.push(el.RequiredAppGoodID)
    }
  })
})

onMounted(() => {
  if (!requireds.value.length) {
    sdk.getRequiredAppGoods(0, 0)
  }
  if (!appFees.value.length) {
    sdk.getAppFees(0, 0)
  }
})
</script>
