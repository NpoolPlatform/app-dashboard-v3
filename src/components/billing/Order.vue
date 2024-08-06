<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ORDERS")'
    :rows='displayOrders'
    row-key='ID'
    :rows-per-page-options='[100]'
    :loading='orderLoading'
    :columns='columns'
  >
    <template #top-right>
      <select class='order-type' name='order-type' v-model='selectedOrderType'>
        <option v-for='value in order.OrderTypes' :key='value'>
          {{ value }}
        </option>
      </select>
      <q-toggle dense v-model='showSimulate' :label='$t("MSG_SHOW_SIMULATE")' size='xs' />
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_EXPORT")'
        @click='onExport'
      />
      <q-input
        dense
        class='small'
        v-model='username'
        :label='$t("MSG_USERNAME")'
      />
      <q-input
        dense
        class='small'
        type='date'
        v-model='start'
        :label='$t("MSG_START")'
      />
      <q-input
        dense
        class='small'
        type='date'
        v-model='end'
        :label='$t("MSG_END")'
      />
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { order, utils, sdk, goodbase, app, notify } from 'src/npoolstore'
import { onMounted, ref, computed, defineProps, toRef } from 'vue'
import { saveAs } from 'file-saver'
import { useI18n } from 'vue-i18n'
import { OrderType } from 'src/npoolstore/order/const'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface Props {
  goodTypes?: Array<goodbase.GoodType>
  orderTypes?: Array<OrderType>
}

const props = defineProps<Props>()
const goodTypes = toRef(props, 'goodTypes')
const orderTypes = toRef(props, 'orderTypes')

const username = ref('')
const start = ref('')
const end = ref('')

const orders = computed(() => sdk.orders.value?.sort((a, b) => a.CreatedAt > b.CreatedAt ? -1 : 1))

const selectedOrderType = ref('ALL')
const showSimulate = ref(false)
const displayOrders = computed(() => orders.value.filter((el) => {
  const name = username.value?.toLowerCase()
  let display = el.EmailAddress?.toLowerCase().includes(name) || el.PhoneNO?.toLowerCase()?.includes(name) || el.GoodID?.toLowerCase()?.includes(name) || el.EntID?.toLowerCase()?.includes(name)
  if (start.value.length) {
    display = display && (el.CreatedAt >= new Date(start.value).getTime() / 1000)
  }
  if (end.value.length) {
    display = display && (el.CreatedAt <= new Date(end.value).getTime() / 1000)
  }
  if (selectedOrderType.value !== 'ALL') {
    display = display && (el.OrderType === selectedOrderType.value)
  }
  if (goodTypes.value !== undefined && goodTypes.value?.length > 0) {
    const index = goodTypes.value.findIndex((gl) => gl === el.GoodType)
    display = display && (index > -1)
  }
  if (orderTypes.value !== undefined && orderTypes.value?.length > 0) {
    const index = orderTypes.value.findIndex((gl) => gl === el.OrderType)
    display = display && (index > -1)
  }
  display = display && (el.Simulate === showSimulate.value)
  return display
}))

const orderLoading = ref(false)

const application = app.useApplicationStore()
onMounted(() => {
  if (!orders.value.length) {
    sdk.getOrders(0, 0)
  }
  if (!application.app(undefined)) {
    getApplication()
  }
})

const getApplication = () => {
  application.getApp({
    Message: {
      Error: {
        Title: 'MSG_GET_APP',
        Message: 'MSG_GET_APP_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onExport = () => {
  let orderStr = ''
  let createdAtCol = 0
  let paidAtCol = 0
  displayOrders.value.forEach((el) => {
    const obj = el as unknown as Record<string, unknown>
    if (!orderStr.length) {
      Object.keys(obj).forEach((k, col) => {
        if (orderStr.length) {
          orderStr += ';'
        }
        if (k === 'CreatedAt') {
          createdAtCol = col
        }
        if (k === 'PaidAt') {
          paidAtCol = col
        }
        orderStr += k
      })
    }
    orderStr += '\n'
    let lineStr = ''
    Object.values(obj).forEach((v, col) => {
      if (lineStr.length) {
        lineStr += ';'
      }
      if (col === createdAtCol || col === paidAtCol) {
        lineStr += utils.formatTime(Number(v))
        return
      }
      lineStr += v
    })
    orderStr += lineStr
  })

  const blob = new Blob([orderStr], { type: 'text/plain;charset=utf-8' })
  const filename = `${application.app()?.Name as string}-Orders-${utils.formatTime(new Date().getTime() / 1000)}.csv`
  saveAs(blob, filename)
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: order.Order) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: order.Order) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: order.Order) => row.AppID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: order.Order) => row.GoodID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: order.Order) => row.GoodName
  },
  {
    name: 'AppGoodID',
    label: t('MSG_APP_GOOD_ID'),
    sortable: true,
    field: (row: order.Order) => row.AppGoodID
  },
  {
    name: 'AppGoodName',
    label: t('MSG_APP_GOOD_NAME'),
    sortable: true,
    field: (row: order.Order) => row.AppGoodName
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: order.Order) => row.GoodType
  },
  {
    name: 'Type',
    label: t('MSG_TYPE'),
    sortable: true,
    field: (row: order.Order) => row.OrderType
  },
  {
    name: 'State',
    label: t('MSG_CONTENT'),
    sortable: true,
    field: (row: order.Order) => row.OrderState
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: order.Order) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: order.Order) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: order.Order) => row.PhoneNO
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: order.Order) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'Start',
    label: t('MSG_START'),
    sortable: true,
    field: (row: order.Order) => utils.formatTime(row.StartAt)
  }
])
</script>
<style scoped>
select {
  border: none;
  outline: none
}
.cancel-order-tip {
  color: #34b6e0
}
</style>
