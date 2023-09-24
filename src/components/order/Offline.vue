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
  <OrderPage />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_OFFLINE_ORDER') }}</span>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_TOTAL') }}: {{ good?.GoodTotal }}</q-item-label>
        <q-item-label>{{ $t('MSG_LOCKED') }}: {{ good?.AppGoodLocked }}</q-item-label>
        <q-item-label>{{ $t('MSG_IN_SERVICE') }}: {{ good?.AppGoodInService }}</q-item-label>
        <AppGoodSelector v-model:id='target.AppGoodID' />
        <AppUserSelector v-model:id='target.TargetUserID' />
        <q-input
          v-model='target.Units' :label='$t("MSG_PURCHASE_UNITS")' type='number' min='1'
          :max='maxUnits'
          :suffix='good?.Unit'
          :rules='[ val => val <= maxUnits || `Max Purchase Units: ${maxUnits}`]'
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
        <LoadingButton :loading='true' @click='onSubmit' :label='$t("MSG_SUBMIT")' />
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
import { order, appgood, notify, appcoin } from 'src/npoolstore'
import { getCoins } from 'src/api/coin'
import { defineAsyncComponent, computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const OrderPage = defineAsyncComponent(() => import('src/components/billing/Order.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))
const AppUserSelector = defineAsyncComponent(() => import('src/components/user/AppUserSelector.vue'))

const coin = appcoin.useAppCoinStore()
const coins = computed(() => coin.coins(undefined))

const appGood = appgood.useAppGoodStore()
const good = computed(() => appGood.good(undefined, target.value?.AppGoodID))
const maxUnits = computed(() => !good.value ? 0 : (Number(good.value.GoodTotal) - Number(good.value.AppGoodLocked) - Number(good.value.AppGoodInService)))

const target = ref({
  OrderType: order.OrderType.Offline,
  Units: '1',
  InvestmentType: order.InvestmentType.FullPayment
} as order.CreateUserOrderRequest)

const showing = ref(false)

const onCreate = () => {
  showing.value = true
}

const onMenuHide = () => {
  showing.value = false
  target.value = {
    OrderType: order.OrderType.Offline,
    Units: '1',
    InvestmentType: order.InvestmentType.FullPayment
  } as order.CreateUserOrderRequest
}

const onCancel = () => {
  onMenuHide()
}

const _order = order.useOrderStore()
const onSubmit = (done: ()=> void) => {
  if (Number(target.value?.Units) > maxUnits.value) {
    console.log('purchase units', target.value?.Units, 'max units', maxUnits.value)
    done()
    return
  }
  _order.createUserOrder({
    ...target.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_ORDER'),
        Message: t('MSG_CREATE_ORDER_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

onMounted(() => {
  if (!coins.value?.length) {
    getCoins(0, 100)
  }
})
</script>
