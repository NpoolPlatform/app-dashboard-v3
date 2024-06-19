<template>
  <q-select
    v-model='target'
    :options='displayAppFees'
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
import { sdk } from 'src/npoolstore'
import { computed, defineEmits, defineProps, toRef, ref } from 'vue'

interface Props {
  appGoodId: string
  label?: string
}

const props = defineProps<Props>()
const appGoodID = toRef(props, 'appGoodId')
const label = toRef(props, 'label')
const target = ref(appGoodID.value)

const appFees = sdk.appFees

const _appFees = computed(() => Array.from(appFees.value, (el) => {
  return {
    value: el.EntID,
    label: `${el.GoodName} | ${el.EntID}`
  }
}))
const displayAppFees = ref(_appFees.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayAppFees.value = _appFees.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:appGoodId', appGoodID: string): void}>()
const onUpdate = () => {
  emit('update:appGoodId', target.value)
}

</script>
