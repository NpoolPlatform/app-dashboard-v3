<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_DEFAULT_GOODS")'
    :rows='appDefaultGoods'
    :columns='appDefaultGoodsColumns'
    v-model:selected='selectedGoods'
    row-key='ID'
    selection='single'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as appdefaultgood.Default)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          :disable='selectedGoods?.length === 0'
          @click='onDelete(selectedGoods?.[0])'
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
        <AppGoodSelector
          v-model:app-good-id='target.AppGoodID'
          :label='$t("MSG_APP_GOODS")'
        />
        <CoinPicker
          v-model:coin-type-id='target.CoinTypeID'
          :updating='updating'
          :coin-type-ids='coinTypeIDs'
        />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
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
import { appdefaultgood, utils, sdk } from 'src/npoolstore'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))

const appDefaultGoods = sdk.appDefaultGoods

const target = ref({} as appdefaultgood.Default)
const coinTypeIDs = computed(() => {
  const appPowerRental = sdk.appPowerRental.appPowerRental(target.value.AppGoodID)
  if (appPowerRental) {
    return appPowerRental.GoodCoins.map((el) => el.CoinTypeID)
  }
  // TODO: support fbm crowd funding
  return []
})

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onMenuHide = () => {
  target.value = {} as appdefaultgood.Default
  showing.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onRowClick = (row: appdefaultgood.Default) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const onSubmit = () => {
  updating.value ? updateAppDefaultGood() : createAppDefaultGood()
}

const createAppDefaultGood = () => {
  sdk.createAppDefaultGood(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

const updateAppDefaultGood = () => {
  sdk.updateAppDefaultGood(target.value, (error: boolean) => {
    if (error) return
    onMenuHide()
  })
}

const selectedGoods = ref([] as Array<appdefaultgood.Default>)
const onDelete = (row: appdefaultgood.Default) => {
  sdk.deleteAppDefaultGood(row)
}

onMounted(() => {
  if (appDefaultGoods.value?.length === 0) {
    sdk.getAppDefaultGoods(0, 0)
  }
})

const appDefaultGoodsColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appdefaultgood.Default) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: appdefaultgood.Default) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: appdefaultgood.Default) => row.GoodID
  },
  {
    name: 'AppGoodID',
    label: t('MSG_APP_GOOD_ID'),
    sortable: true,
    field: (row: appdefaultgood.Default) => row.AppGoodID
  },
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: appdefaultgood.Default) => row.CoinTypeID
  },
  {
    name: 'CoinUnit',
    label: t('MSG_COIN_UNIT'),
    sortable: true,
    field: (row: appdefaultgood.Default) => row.CoinUnit
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: appdefaultgood.Default) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: appdefaultgood.Default) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
