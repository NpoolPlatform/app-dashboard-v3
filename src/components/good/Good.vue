<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COINS")'
    :rows='coins'
    :columns='coinColumns'
    row-key='ID'
    :rows-per-page-options='[100]'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOODS")'
    :rows='appGoods'
    :columns='appGoodsColumns'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appgood.Good)'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CREATE_APP_GOOD') }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.GoodName' :label='$t("MSG_GOOD_NAME")' />
        <q-input v-model='target.Price' :label='$t("MSG_PRICE")' type='number' :min='0' />
        <q-input v-model.number='target.PurchaseLimit' :label='$t("MSG_PURCHASE_LIMIT")' type='number' :min='0' />
        <q-input v-model.number='target.UserPurchaseLimit' :label='$t("MSG_USER_PURCHASE_LIMIT")' type='number' :min='0' />
        <q-input
          class='commission-percent'
          v-model='target.TechnicalFeeRatio'
          :label='$t("MSG_TECHNICALFEE_RATIO")'
          type='number'
          :min='0'
        />
        <q-input
          class='commission-percent'
          v-model='target.ElectricityFeeRatio'
          :label='$t("MSG_ELECTRICITYFEE_RATIO")'
          type='number'
          :min='0'
        />
        <!-- <q-input
          class='commission-percent'
          v-model.number='target.CommissionPercent'
          :label='$t("MSG_COMMISSION_PERCENT")'
          type='number'
          :min='0'
          suffix='%'
        /> -->
        <!-- <q-input
          class='commission-percent'
          v-model='target.DailyRewardAmount'
          :label='$t("MSG_DAILY_REWARD_AMOUNT")'
          type='number'
          :min='0'
        /> -->
      </q-card-section>
      <q-card-section>
        <q-select
          :options='appgood.CancelModes'
          v-model='target.CancelMode'
          :label='$t("MSG_CANCEL_MODE")'
        />
        <q-input
          v-model.number='target.CancellableBeforeStart'
          :label='$t("MSG_CANCELLABLE_BEFORE_START")'
          type='number'
          :min='0'
          suffix='h'
          :disable='target.CancelMode === appgood.CancelMode.UnCancellable'
        />
      </q-card-section>
      <q-card-section>
        <q-input v-model.number='target.DisplayIndex' :label='$t("MSG_DISPLAY_INDEX")' type='number' :min='0' />
        <q-input v-model='target.GoodBanner' :label='$t("MSG_GOOD_BANNER")' />
        <q-input v-model='target.ProductPage' :label='$t("MSG_PRODUCT_PAGE")' />
      </q-card-section>
      <q-card-section>
        <q-select
          label='MSG_DISPLAY_NAMES'
          filled
          v-model='target.DisplayNames'
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          input-debounce='0'
          new-value-mode='add'
        />
      </q-card-section>
      <q-card-section>
        <q-select
          label='MSG_DESCRIPTIONS'
          filled
          v-model='target.Descriptions'
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          input-debounce='0'
          new-value-mode='add'
        />
      </q-card-section>
      <q-card-section>
        <q-select
          label='MSG_DISPLAY_COLORS'
          filled
          v-model='target.DisplayColors'
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          input-debounce='0'
          new-value-mode='add'
        />
      </q-card-section>
      <q-card-section>
        <q-select
          label='MSG_POSTERS'
          filled
          v-model='target.Posters'
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          input-debounce='0'
          new-value-mode='add'
        />
      </q-card-section>
      <q-card-section>
        <div> <DateTimePicker v-model:date='target.SaleStartAt' label='MSG_SALE_START_AT' /></div>
        <div> <DateTimePicker v-model:date='target.SaleEndAt' label='MSG_SALE_END_AT' /></div>
        <DateTimePicker v-model:date='target.ServiceStartAt' label='MSG_SERVICE_START_AT' />
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.EnableSetCommission' :label='$t("MSG_ENABLE_SET_COMMISSION")' /></div>
        <div><q-toggle dense v-model='target.EnablePurchase' :label='$t("MSG_ENABLE_PURCHASE")' /></div>
        <div><q-toggle dense v-model='target.EnableProductPage' :label='$t("MSG_ENABLE_PRODUCT_PAGE")' /></div>
        <div><q-toggle dense v-model='target.Visible' :label='$t("MSG_VISIBLE")' /></div>
        <div><q-toggle dense v-model='target.Online' :label='$t("MSG_ONLINE")' /></div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>

  <AppDefaultGood />
</template>

<script setup lang='ts'>
import { appgood, appcoin, notify, utils } from 'src/npoolstore'
import { getCoins } from 'src/api/coin'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const AppDefaultGood = defineAsyncComponent(() => import('src/components/good/AppDefaultGood.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))

const coin = appcoin.useAppCoinStore()
const coins = computed(() => coin.coins(undefined))

const appGood = appgood.useAppGoodStore()
const appGoods = computed(() => appGood.goods())

const target = ref({} as appgood.Good)

const showing = ref(false)
const updating = ref(false)

const onMenuHide = () => {
  target.value = {} as appgood.Good
  showing.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onRowClick = (row: appgood.Good) => {
  target.value = { ...row }
  target.value.Posters = target.value?.AppGoodPosters
  updating.value = true
  showing.value = true
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAppGood(done) : createAppGood(done)
}

const updateTarget = computed(() => {
  return {
    ID: target.value.ID,
    EntID: target.value.EntID,
    Online: target.value.Online,
    Visible: target.value.Visible,
    GoodName: target.value.GoodName,
    Price: target.value.Price,
    DisplayIndex: target.value.DisplayIndex,
    PurchaseLimit: target.value.PurchaseLimit,
    UserPurchaseLimit: `${target.value.UserPurchaseLimit}`,
    SaleStartAt: target.value.SaleStartAt,
    SaleEndAt: target.value.SaleEndAt,
    ServiceStartAt: target.value?.ServiceStartAt,
    Descriptions: target.value?.Descriptions,
    DisplayNames: target.value?.DisplayNames,
    DisplayColors: target.value?.DisplayColors,
    GoodBanner: target.value?.GoodBanner?.length === 0 ? undefined as unknown as string : target.value?.GoodBanner,
    ProductPage: target.value?.ProductPage,
    EnableProductPage: target.value?.EnableProductPage,
    EnablePurchase: target.value?.EnablePurchase,
    EnableSetCommission: target.value?.EnableSetCommission,
    CancelMode: target.value?.CancelMode,
    CancellableBeforeStart: target.value?.CancellableBeforeStart,
    ElectricityFeeRatio: target.value?.ElectricityFeeRatio,
    TechnicalFeeRatio: target.value?.TechnicalFeeRatio,
    Posters: target.value?.Posters
    // DailyRewardAmount: target.value?.DailyRewardAmount?.length > 0 ? target.value?.DailyRewardAmount : undefined as unknown as string
  }
})

const updateAppGood = (done: () => void) => {
  appGood.updateAppGood({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_AUTHORIZE_GOOD',
        Message: 'MSG_AUTHORIZE_GOOD_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_AUTHORIZE_GOOD',
        Message: 'MSG_AUTHORIZE_GOOD_SUCCESS',
        Popup: true,
        Type: notify.NotifyType.Success
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

const createAppGood = (done: () => void) => {
  done()
}

onMounted(() => {
  if (coins.value?.length === 0) {
    getCoins(0, 500)
  }
})

const appGoodsColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appgood.Good) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: appgood.Good) => row.EntID
  },
  {
    name: 'GOODID',
    label: t('MSG_GOODID'),
    sortable: true,
    field: (row: appgood.Good) => row.GoodID
  },
  {
    name: 'GOODNAME',
    label: t('MSG_GOODNAME'),
    sortable: true,
    field: (row: appgood.Good) => row.GoodName
  },
  {
    name: 'GOODTYPE',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: appgood.Good) => row.GoodType
  },
  {
    name: 'ONLINE',
    label: t('MSG_ONLINE'),
    sortable: true,
    field: (row: appgood.Good) => row.Online
  },
  {
    name: 'VISIBLE',
    label: t('MSG_VISIBLE'),
    sortable: true,
    field: (row: appgood.Good) => row.Visible
  },
  {
    name: 'PurchaseLimit',
    label: t('MSG_PURCHASE_LIMIT'),
    sortable: true,
    field: (row: appgood.Good) => row.PurchaseLimit
  },
  {
    name: 'UserPurchaseLimit',
    label: t('MSG_USER_PURCHASE_LIMIT'),
    sortable: true,
    field: (row: appgood.Good) => row.UserPurchaseLimit
  },
  {
    name: 'GOODPRICE',
    label: t('MSG_GOOD_PRICE'),
    sortable: true,
    field: (row: appgood.Good) => row.Price
  },
  {
    name: 'GOODUNIT',
    label: t('MSG_GOOD_UNIT'),
    sortable: true,
    field: (row: appgood.Good) => t(row.Unit)
  },
  {
    name: 'GOODTOTAL',
    label: t('MSG_GOOD_TOTAL'),
    sortable: true,
    field: (row: appgood.Good) => row.GoodTotal
  },
  {
    name: 'GOODSOLD',
    label: t('MSG_GOOD_SOLD'),
    sortable: true,
    field: (row: appgood.Good) => row.AppGoodSold
  },
  {
    name: 'GOODLOCKED',
    label: t('MSG_GOOD_LOCKED'),
    sortable: true,
    field: (row: appgood.Good) => row.AppGoodLocked
  },
  {
    name: 'GOODINSERVICE',
    label: t('MSG_GOOD_INSERVICE'),
    sortable: true,
    field: (row: appgood.Good) => row.AppGoodInService
  },
  {
    name: 'WaitStart',
    label: t('MSG_GOOD_WAITSTART'),
    sortable: true,
    field: (row: appgood.Good) => row.AppGoodWaitStart
  },
  {
    name: 'COINTYPEID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: appgood.Good) => row.CoinTypeID
  },
  {
    name: 'COINNAME',
    label: t('MSG_COINNAME'),
    sortable: true,
    field: (row: appgood.Good) => row.CoinName
  },
  {
    name: 'BENEFITTYPE',
    label: t('MSG_BENEFITTYPE'),
    sortable: true,
    field: (row: appgood.Good) => row.BenefitType
  },
  {
    name: 'STARTAT',
    label: t('MSG_STARTAT'),
    sortable: true,
    field: (row: appgood.Good) => utils.formatTime(row.StartAt)
  },
  {
    name: 'SaleStartAt',
    label: t('MSG_SALE_START_AT'),
    sortable: true,
    field: (row: appgood.Good) => utils.formatTime(row?.SaleStartAt)
  },
  {
    name: 'SaleEndAt',
    label: t('MSG_SALE_END_AT'),
    sortable: true,
    field: (row: appgood.Good) => utils.formatTime(row?.SaleEndAt)
  },
  {
    name: 'DailyRewardAmount',
    label: t('MSG_DAILY_REWARD_AMOUNT'),
    sortable: true,
    field: (row: appgood.Good) => row.DailyRewardAmount
  },
  {
    name: 'ServiceStartAt',
    label: t('MSG_SERVICE_START_AT'),
    sortable: true,
    field: (row: appgood.Good) => utils.formatTime(row?.ServiceStartAt)
  }
])

const coinColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.AppID
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.CoinTypeID
  },
  {
    name: 'Name',
    label: t('MSG_APP_COIN_NAME'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.Name
  },
  {
    name: 'DisplayNames',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.DisplayNames?.join(',')
  },
  {
    name: 'Logo',
    label: t('MSG_LOGO'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.Logo
  },
  {
    name: 'Unit',
    label: t('MSG_UNIT'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.Unit
  },
  {
    name: 'Presale',
    label: t('MSG_PRESALE'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.Presale
  },
  {
    name: 'ReservedAmount',
    label: t('MSG_RESERVED_AMOUNT'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.ReservedAmount
  },
  {
    name: 'ForPay',
    label: t('MSG_FOR_PAY'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.ForPay
  },
  {
    name: 'ProductPage',
    label: t('MSG_PRODUCT_PAGE'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.ProductPage
  },
  {
    name: 'ENV',
    label: t('MSG_ENV'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.ENV
  },
  {
    name: 'MarketValue',
    label: t('MSG_MARKET_VALUE'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.MarketValue
  },
  {
    name: 'SettleValue',
    label: t('MSG_SETTLE_VALUE'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.SettleValue
  },
  {
    name: 'SettlePercent',
    label: t('MSG_SETTLE_PERCENT'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.SettlePercent
  },
  {
    name: 'SettleTips',
    label: t('MSG_SETTLE_TIPS'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.SettleTips?.join(',')
  },
  {
    name: 'DailyRewardAmount',
    label: t('MSG_DAILY_REWARD_AMOUNT'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.DailyRewardAmount
  },
  {
    name: 'Display',
    label: t('MSG_DISPLAY'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.Display
  },
  {
    name: 'DisplayIndex',
    label: t('MSG_DISPLAY_INDEX'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.DisplayIndex
  }
])
</script>
