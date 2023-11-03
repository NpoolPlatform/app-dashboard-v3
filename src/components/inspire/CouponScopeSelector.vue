<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayScopes'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_SCOPES'
    map-options
    @update:model-value='onUpdate'
    use-input
    @filter='onFilter'
  />
</template>
<script setup lang='ts'>
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { couponscope, sdk } from 'src/npoolstore'
interface Props {
    id: string
    updating?: boolean
}

const props = defineProps<Props>()
const _id = toRef(props, 'id')
const updating = toRef(props, 'updating')

const scope = couponscope.useScopeStore()
const scopes = computed(() => scope.scopes())
const _displayScopes = computed(() => scopes.value.map((el) => {
  return {
    value: el.ID,
    label: `${el.ID} | ${el.CouponName} | ${el.CouponName} | ${el.CouponScope} | ${el.CouponType}`
  }
}))
const displayScopes = ref(_displayScopes.value)
const target = ref(_id.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayScopes.value = _displayScopes.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  if (!scopes.value?.length) {
    sdk.getScopes(0, 0)
  }
})
</script>
