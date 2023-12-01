<template>
  <q-select
    v-model='target'
    :options='displayGoods'
    options-selected-class='text-deep-orange'
    emit-value
    :label='label'
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
import { appgood } from 'src/npoolstore'
import { computed, defineEmits, defineProps, toRef, ref } from 'vue'

interface Props {
  id: string
  label?: string
}

const props = defineProps<Props>()
const appGoodID = toRef(props, 'id')
const label = toRef(props, 'label')
const target = ref(appGoodID.value)

const appGood = appgood.useAppGoodStore()
const appGoods = computed(() => appGood.goods(undefined).filter((el) => el.Online))

const goods = computed(() => Array.from(appGoods.value, (el) => {
  return {
    value: el.ID,
    label: `${el.GoodName} | ${el.ID}`
  }
}))
const displayGoods = ref(goods.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayGoods.value = goods.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

</script>
