<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COUPON_COINS")'
    :rows='displayCouponCoins'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='columns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='name'
          :label='$t("MSG_NAME")'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { couponcoin, sdk, utils } from 'src/npoolstore'

import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _couponcoin = couponcoin.useCouponCoinStore()
const coins = computed(() => _couponcoin.couponcoins())

const name = ref('')
const displayCouponCoins = computed(() => coins.value?.filter((el) => el.CoinTypeID.toLowerCase().includes(name.value?.toLowerCase()) ||
    el.CoinName.toLowerCase().includes(name.value?.toLowerCase())
))

onMounted(() => {
  if (!coins.value?.length) {
    sdk.getAppCouponCoins(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: couponcoin.CouponCoin) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: couponcoin.CouponCoin) => row.EntID
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_GOOD_TITLE'),
    sortable: true,
    field: (row: couponcoin.CouponCoin) => row.CoinTypeID
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: couponcoin.CouponCoin) => row.CoinName
  },
  {
    name: 'CoinENV',
    label: t('MSG_COIN_ENV'),
    sortable: true,
    field: (row: couponcoin.CouponCoin) => row.CoinENV
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: couponcoin.CouponCoin) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: couponcoin.CouponCoin) => utils.formatTime(row.UpdatedAt)
  }
])

</script>
