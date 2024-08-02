<template>
  <q-select
    v-model='target'
    :options='displayAppPowerRentals'
    options-selected-class='text-deep-orange'
    emit-value
    :label='label? label : "MSG_APP_GOOD"'
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
import { sdk, goodbase } from 'src/npoolstore'
import { computed, defineEmits, defineProps, toRef, ref } from 'vue'

interface Props {
  appGoodId: string
  label?: string
  goodTypes?: Array<goodbase.GoodType>
}

const props = defineProps<Props>()
const appGoodID = toRef(props, 'appGoodId')
const label = toRef(props, 'label')
const goodTypes = toRef(props, 'goodTypes')
const target = ref(appGoodID.value)

const appPowerRentals = computed(() => sdk.appPowerRental.appPowerRentals.value)

const goods = computed(() => Array.from(appPowerRentals.value.filter((el) => !goodTypes.value || goodTypes.value.includes(el.GoodType)), (el) => {
  return {
    value: el.AppGoodID,
    label: `${el.AppGoodName} | ${el.AppGoodID} | ${el.GoodType}`
  }
}))
const displayAppPowerRentals = ref(goods.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayAppPowerRentals.value = goods.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:appGoodId', appGoodID: string): void}>()
const onUpdate = () => {
  emit('update:appGoodId', target.value)
}

</script>
