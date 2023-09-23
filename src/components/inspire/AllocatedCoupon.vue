<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COUPONS")'
    :rows='coupons'
    row-key='ID'
    :loading='loading'
    :rows-per-page-options='[10]'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { allocatedCoupon, notify } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _coupon = allocatedCoupon.useAllocatedCouponStore()
const username = ref('')
const coupons = computed(() => _coupon.coupons(undefined).filter((el) => {
  return el.EmailAddress?.includes(username.value) ||
         el.PhoneNO?.includes(username.value) ||
         el.Username?.includes(username.value)
}))
const loading = ref(true)

const getCoupons = (offset: number, limit: number) => {
  _coupon.getCoupons({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_COUPONS'),
        Message: t('MSG_GET_COUPONS_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<allocatedCoupon.Coupon>) => {
    if (error) {
      loading.value = false
      return
    }
    if (!rows?.length) {
      loading.value = false
      return
    }
    getCoupons(offset + limit, limit)
  })
}

const prepare = () => {
  if (_coupon.coupons().length > 0) {
    loading.value = false
    return
  }
  loading.value = true
  getCoupons(0, 100)
}

onMounted(() => {
  prepare()
})

</script>
