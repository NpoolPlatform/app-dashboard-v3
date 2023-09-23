<template>
  <q-table
    dense
    flat
    :title='$t("MSG_WITHDRAW_ADDRESS")'
    :rows='withdrawAddress'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='columns'
  />
  <q-card-section class='bg-primary text-white'>
    {{ $t('MSG_ADVERTISEMENT_POSITION') }}
  </q-card-section>
</template>

<script setup lang='ts'>
import { useraccount, utils, accountbase, useraccountbase } from 'src/npoolstore'
import { getAppUserAccounts } from 'src/api/account'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const account = useraccount.useUserAccountStore()
const withdrawAddress = computed(() => account.accounts(undefined, undefined, undefined, accountbase.AccountUsedFor.UserWithdraw))

onMounted(() => {
  if (withdrawAddress.value.length === 0) {
    getAppUserAccounts(0, 500)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: useraccountbase.Account) => row.ID,
    sortable: true
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: useraccountbase.Account) => row.AppID,
    sortable: true
  },
  {
    name: 'AccountID',
    label: t('MSG_ACCOUNT_ID'),
    field: (row: useraccountbase.Account) => row.AccountID,
    sortable: true
  },
  {
    name: 'Address',
    label: t('MSG_ADDRESS'),
    field: (row: useraccountbase.Account) => row.Address,
    sortable: true
  },
  {
    name: 'UsedFor',
    label: t('MSG_USED_FOR'),
    field: (row: useraccountbase.Account) => row.UsedFor,
    sortable: true
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: useraccountbase.Account) => row.UserID,
    sortable: true
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: useraccountbase.Account) => row.EmailAddress,
    sortable: true
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    field: (row: useraccountbase.Account) => row.PhoneNO,
    sortable: true
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    field: (row: useraccountbase.Account) => row.CoinTypeID,
    sortable: true
  },
  {
    name: 'CoinName',
    label: t('MSG_COINNAME'),
    field: (row: useraccountbase.Account) => row.CoinName,
    sortable: true
  },
  {
    name: 'CoinEnv',
    label: t('MSG_COINENV'),
    field: (row: useraccountbase.Account) => row.CoinEnv,
    sortable: true
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COINUNIT'),
    field: (row: useraccountbase.Account) => row.CoinUnit,
    sortable: true
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    field: (row: useraccountbase.Account) => utils.formatTime(row.CreatedAt),
    sortable: true
  },
  {
    name: 'Label',
    label: t('MSG_LABEL'),
    field: (row: useraccountbase.Account) => row.Labels?.join(','),
    sortable: true
  },
  {
    name: 'Active',
    label: t('MSG_ACTIVE'),
    field: (row: useraccountbase.Account) => row.Active,
    sortable: true
  },
  {
    name: 'Blocked',
    label: t('MSG_BLOCKED'),
    field: (row: useraccountbase.Account) => row.Blocked,
    sortable: true
  }
])
</script>
