<template>
  <q-table
    dense
    flat
    :rows='displayCoins'
    row-key='ID'
    :title='$t("MSG_APP_COINS")'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appcoin.AppCoin)'
    :columns='columns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='name'
          :label='$t("MSG_COINNAME")'
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
        <q-input v-model='target.Name' :label='$t("MSG_COIN_NAME")' />
        <q-input v-model='displayNames' :label='$t("MSG_DISPLAY_NAMES")' />
        <q-input v-model='target.Logo' :label='$t("MSG_COIN_LOGO")' />
        <q-input v-model='target.ProductPage' :label='$t("MSG_PRODUCT_PAGE")' />
        <!-- <q-input v-model='target.Specs' :label='$t("MSG_COIN_SPECS")' /> -->
        <!-- <q-input type='number' v-model='target.ReservedAmount' :label='$t("MSG_COIN_RESERVED_AMOUNT")' /> -->
        <q-input type='number' v-model='target.WithdrawAutoReviewAmount' :label='$t("MSG_WITHDRAW_AUTO_REVIEW_AMOUNT")' />
        <q-input type='number' v-model='target.MarketValue' :label='$t("MSG_COIN_MARKET_VALUE")' />
        <q-input type='number' v-model.number='target.SettlePercent' :label='$t("MSG_COIN_SETTLE_PERCENT")' />
        <q-input v-model='target.DisplayIndex' :label='$t("MSG_DISPLAY_INDEX")' />
        <q-input v-model='settleTips' :label='$t("MSG_SETTLE_TIPS")' />
        <!-- <q-select dense :options='CoinEnvironments' v-model='target.ENV' :label='$t("MSG_COIN_ENVIRONMENT")' /> -->
        <q-input
          v-model='target.MaxAmountPerWithdraw'
          :label='$t("MSG_MAX_AMOUNT_PER_WITHDRAW")'
          type='number'
          :min='0'
        />
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.ForPay' :label='$t("MSG_FOR_PAY")' /><span class='tip'>CoinForPay: {{ target.CoinForPay }}</span></div>
        <div><q-toggle dense v-model='target.Disabled' :label='$t("MSG_DISABLE")' /><span class='tip'>CoinDisabled: {{ target.CoinDisabled }}</span></div>
        <div><q-toggle dense v-model='target.Display' :label='$t("MSG_DISPLAY")' /></div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card-section class='bg-primary text-white'>
    {{ $t('MSG_ADVERTISEMENT_POSITION') }}
  </q-card-section>
</template>

<script setup lang='ts'>
import { appcoin, notify } from 'src/npoolstore'
import { getCoins } from 'src/api/coin'
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const coin = appcoin.useAppCoinStore()
const coins = computed(() => coin.coins())

const name = ref('')
const displayCoins = computed(() => {
  return coins.value.filter((el) => el.Name?.toLowerCase()?.includes?.(name.value?.toLowerCase()) || el.CoinTypeID?.toLowerCase()?.includes?.(name.value?.toLowerCase()))
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appcoin.AppCoin) => row.ID
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

const showing = ref(false)
const updating = ref(false)
const target = ref({} as appcoin.AppCoin)
const displayNames = ref('')
const settleTips = ref('')

const onRowClick = (row: appcoin.AppCoin) => {
  target.value = { ...row }
  displayNames.value = target.value.DisplayNames.join(',')
  settleTips.value = target.value.SettleTips.join(',')
  showing.value = true
  updating.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as appcoin.AppCoin
}

const onSubmit = (done: () => void) => {
  updateAppCoin(done)
}

const updateTarget = computed(() => {
  return {
    ID: target.value?.ID,
    AppID: target.value?.AppID,
    CoinTypeID: target.value?.CoinTypeID,
    Name: target.value?.Name,
    DisplayNames: displayNames.value.length > 0 ? displayNames.value.split(',') : [],
    Logo: target.value?.Logo?.length > 0 ? target.value?.Logo : undefined as unknown as string,
    ForPay: target.value?.ForPay,
    WithdrawAutoReviewAmount: target.value?.WithdrawAutoReviewAmount,
    MarketValue: target.value?.MarketValue,
    SettlePercent: target.value?.SettlePercent === 0 ? undefined as unknown as number : target.value?.SettlePercent,
    SettleTips: settleTips.value.length > 0 ? settleTips.value.split(',') : [],
    ProductPage: target.value?.ProductPage?.length > 0 ? target.value?.ProductPage : undefined as unknown as string,
    DailyRewardAmount: target.value?.DailyRewardAmount?.length > 0 ? target.value?.DailyRewardAmount : undefined as unknown as string,
    Disabled: target.value?.Disabled,
    Display: target.value?.Display,
    MaxAmountPerWithdraw: target.value.MaxAmountPerWithdraw,
    DisplayIndex: target.value?.DisplayIndex
  }
})

const updateAppCoin = (done: () => void) => {
  coin.updateAppCoin({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_APP_COIN',
        Message: 'MSG_UPDATE_COIN_FAIL',
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

watch([() => target.value?.Disabled, () => target.value?.ForPay], () => {
  if (target.value?.CoinDisabled) {
    target.value.Disabled = true
  }
  if (!target.value?.CoinForPay) {
    target.value.ForPay = false
  }
})

onMounted(() => {
  if (coins.value?.length === 0) {
    getCoins(0, 500)
  }
})
</script>
