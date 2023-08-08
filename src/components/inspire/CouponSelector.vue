<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayCoupons'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_COUPONS'
    map-options
    @update:model-value='onUpdate'
    use-input
    @filter='onFilter'
    multiple
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
import { useCouponStore, CouponTypes, CouponType } from 'src/teststore/inspire/coupon'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'
import { getCoupons } from 'src/api/inspire'

interface Props {
  ids: string[]
  updating?: boolean
}

const props = defineProps<Props>()
const ids = toRef(props, 'ids')
const updating = toRef(props, 'updating')
const target = ref(ids.value)

const coupon = useCouponStore()
const myCoupons = computed(() => coupon.Coupons.filter((el) => el.CouponType !== CouponType.SpecialOffer))

const coupons = computed(() => myCoupons.value.map((el) => {
  return {
    value: el,
    label: `${el.ID} | ${el.Name} | ${el.CouponType} | ${el.Denomination}`
  }
}))

const displayCoupons = ref(coupons.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayCoupons.value = coupons.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:ids', ids: string[]): void}>()
const onUpdate = () => {
  emit('update:ids', target.value)
}

onMounted(() => {
  if (coupons.value.length === 0) {
    CouponTypes.forEach((type) => {
      getCoupons(0, 500, type)
    })
  }
})
</script>
