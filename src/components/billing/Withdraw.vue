<template>
  <q-table
    dense
    flat
    :title='$t("MSG_WITHDRAW_RECORDS")'
    :rows='withdraws'
    :columns='withdrawColumns'
    row-key='ID'
    :rows-per-page-options='[100]'
  />
  <q-card-section class='bg-primary text-white'>
    {{ $t('MSG_ADVERTISEMENT_POSITION') }}
  </q-card-section>
</template>

<script setup lang='ts'>
import { ledgerwithdraw, notify, utils } from 'src/npoolstore'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const withdraw = ledgerwithdraw.useWithdrawStore()
const withdraws = computed(() => withdraw.withdraws(undefined))

onMounted(() => {
  if (withdraws.value.length === 0) {
    getAppWithdraws(0, 100)
  }
})

const getAppWithdraws = (offset: number, limit: number) => {
  withdraw.getAppWithdraws({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_WITHDRAWS',
        Message: 'MSG_GET_WITHDRAWS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<ledgerwithdraw.Withdraw>) => {
    if (error || !rows.length) {
      return
    }
    getAppWithdraws(offset + limit, limit)
  })
}

const withdrawColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.EntID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.UserID
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COINTYPE_ID'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.CoinTypeID
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.CoinName
  },
  {
    name: 'CoinLogo',
    label: t('MSG_COIN_LOGO'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.CoinLogo
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.CoinUnit
  },
  {
    name: 'Address',
    label: t('MSG_ADDRESS'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.Address
  },
  {
    name: 'Amount',
    label: t('MSG_AMOUNT'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.Amount
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.Message
  },
  {
    name: 'State',
    label: t('MSG_STATE'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.State
  },
  {
    name: 'Label',
    label: t('MSG_LABEL'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => row.AddressLabels?.join(',')
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: ledgerwithdraw.Withdraw) => utils.formatTime(row.CreatedAt)
  }
])

</script>
