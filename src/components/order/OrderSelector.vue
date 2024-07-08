<template>
  <q-select
    v-model='target'
    :options='displayOrders'
    options-selected-class='text-deep-orange'
    emit-value
    :label='$t("MSG_SELECT_ORDER")'
    map-options
    @filter='onFilter'
    @update:model-value='onUpdate'
  >
    <template #option='scope'>
      <q-item v-bind='scope.itemProps'>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script setup lang='ts'>
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { order, goodbase, sdk } from 'src/npoolstore'

interface Props {
  orderId: string
  orderTypes?: order.OrderType[]
  goodTypes?: Array<goodbase.GoodType>
}

const props = defineProps<Props>()
const orderId = toRef(props, 'orderId')
const orderTypes = toRef(props, 'orderTypes')
const goodTypes = toRef(props, 'goodTypes')

const target = ref(orderId.value)

const orders = computed(() => sdk.orders.value.filter((el) => {
  let display = true
  if (orderTypes.value !== undefined && orderTypes.value?.length > 0) {
    const index = orderTypes.value.findIndex((gl) => gl === el.OrderType)
    display = display && (index > -1)
  }
  if (goodTypes.value !== undefined && goodTypes.value?.length > 0) {
    const index = goodTypes.value.findIndex((gl) => gl === el.GoodType)
    display = display && (index > -1)
  }
  return display
}))

const _orders = computed(() => Array.from(orders.value).map((el) => {
  return {
    value: el.EntID,
    label: `${el.EntID} | ${el.OrderType} | ${el.AppGoodID} | ${el.AppGoodName} | ${el.GoodType}`
  }
}))
const displayOrders = ref(_orders.value)

const emit = defineEmits<{(e: 'update:orderId', orderId: string): void}>()
const onUpdate = () => {
  emit('update:orderId', target.value)
}

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayOrders.value = _orders.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

onMounted(() => {
  if (!orders.value.length) {
    sdk.getOrders(0, 0)
  }
})
</script>
