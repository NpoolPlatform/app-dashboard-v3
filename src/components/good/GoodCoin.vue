<template>
  <q-table
    dense
    flat
    :rows='displayGoodCoins'
    row-key='ID'
    selection='multiple'
    :title='$t("MSG_GOOD_COINS")'
    :rows-per-page-options='[20]'
    :columns='coinColumns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='goodName'
          :label='$t("MSG_GOOD_NAME")'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { goodcoin, sdk } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const goodName = ref('')
const goodCoins = computed(() => sdk.goodCoins.value)

const displayGoodCoins = computed(() => {
  const name = goodName.value.toLowerCase()
  return goodCoins.value?.filter((el) => {
    return el.GoodID.toLowerCase().includes(name) ||
          el.GoodName.toLowerCase().includes(name)
  })
})

onMounted(() => {
  if (!goodCoins.value.length) {
    sdk.getGoodCoins(0, 0)
  }
})

const coinColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: goodcoin.GoodCoin) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: goodcoin.GoodCoin) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: goodcoin.GoodCoin) => row.GoodID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: goodcoin.GoodCoin) => row.GoodName
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: goodcoin.GoodCoin) => row.GoodType
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: goodcoin.GoodCoin) => row.CoinTypeID
  },
  {
    name: 'Name',
    label: t('MSG_APP_COIN_NAME'),
    sortable: true,
    field: (row: goodcoin.GoodCoin) => row.CoinName
  },
  {
    name: 'MainCoin',
    label: t('MSG_MAIN_COIN'),
    sortable: true,
    field: (row: goodcoin.GoodCoin) => row.Main
  }
])
</script>
