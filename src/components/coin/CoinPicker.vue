<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayCoins'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_COINS'
    map-options
    @update:model-value='onUpdate'
    use-input
    @filter='onFilter'
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
import { appcoin } from 'src/npoolstore'
import { getCoins } from 'src/api/coin'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'

interface Props {
  coinTypeId: string
  updating?: boolean
  hiddenDisabledCoins?: boolean
  coinTypeIds?: string[]
}

const props = defineProps<Props>()
const coinTypeID = toRef(props, 'coinTypeId')
const updating = toRef(props, 'updating')
const hiddenDisabledCoins = toRef(props, 'hiddenDisabledCoins')
const coinTypeIDs = toRef(props, 'coinTypeIds')
const target = ref(coinTypeID.value)

const coin = appcoin.useAppCoinStore()
const coins = computed(() => {
  let items = coin.coins()
  if (hiddenDisabledCoins.value) {
    items = coin.coins().filter((el) => !el.Disabled && !el.CoinDisabled)
  }
  return Array.from(items.filter((el) => !coinTypeIDs.value || coinTypeIDs.value.includes(el.EntID))).map((el) => {
    return {
      value: el.CoinTypeID,
      label: `${el.Name} | ${el.CoinTypeID} | ${el.Unit}`
    }
  })
})
const displayCoins = ref(coins.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayCoins.value = coins.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:coinTypeId', coinTypeID: string): void}>()
const onUpdate = () => {
  emit('update:coinTypeId', target.value)
}

onMounted(() => {
  if (coin.coins()?.length === 0) {
    getCoins(0, 500)
  }
})
</script>
