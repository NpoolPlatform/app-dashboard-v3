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
        <span>{{ $t('MSG_APP_DEFAULT_GOOD') }}</span>
      </q-card-section>
      <q-card-section>
        <AppGoodSelector v-model:id='target.AppGoodID' />
        <!-- <CoinPicker v-model:id='target.CoinTypeID' v-model:updating='updating' /> -->
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
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
import { appdefaultgood, utils, notify } from 'src/npoolstore'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
// const CoinPicker = defineAsyncComponent(() => import('src/components/coin/CoinPicker.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))

const appDefaultGood = appdefaultgood.useAppDefaultGoodStore()
const appDefaultGoods = computed(() => appDefaultGood.defaults(undefined))

const target = ref({} as appdefaultgood.Default)

const showing = ref(false)
const updating = ref(false)

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

const onSubmit = (done: () => void) => {
  updating.value ? updateAppDefaultGood(done) : createAppDefaultGood(done)
}

const createAppDefaultGood = (done: () => void) => {
  appDefaultGood.createAppDefaultGood({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_APP_DEFAULT_GOOD',
        Message: 'MSG_CREATE_APP_DEFAULT_GOOD_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_APP_DEFAULT_GOOD',
        Message: 'MSG_CREATE_APP_DEFAULT_GOOD_SUCCESS',
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

const updateAppDefaultGood = (done: () => void) => {
  appDefaultGood.updateAppDefaultGood({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_APP_DEFAULT_GOOD',
        Message: 'MSG_UPDATE_APP_DEFAULT_GOOD_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_APP_DEFAULT_GOOD',
        Message: 'MSG_UPDATE_APP_DEFAULT_GOOD_SUCCESS',
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

const selectedGoods = ref([] as Array<appdefaultgood.Default>)
const onDelete = (row: appdefaultgood.Default) => {
  appDefaultGood.deleteAppDefaultGood({
    ID: row.ID,
    EntID: row.EntID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_APP_DEFAULT_GOOD',
        Message: 'MSG_DELETE_APP_DEFAULT_GOOD_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_APP_DEFAULT_GOOD',
        Message: 'MSG_DELETE_APP_DEFAULT_GOOD_SUCCESS',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, () => {
    // TODO
  })
}

onMounted(() => {
  if (appDefaultGoods.value?.length === 0) {
    getAppDefaultGoods(0, 500)
  }
})

const getAppDefaultGoods = (offset: number, limit: number) => {
  appDefaultGood.getAppDefaultGoods({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_DEFAULT_GOODS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<appdefaultgood.Default>) => {
    if (error || !rows?.length) {
      return
    }
    getAppDefaultGoods(offset + limit, limit)
  })
}

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
