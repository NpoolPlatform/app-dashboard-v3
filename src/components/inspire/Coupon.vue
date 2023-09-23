<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COUPONS")'
    :rows='coupons'
    row-key='ID'
    :loading='loading'
    :rows-per-page-options='[10]'
  />
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { coupon, notify } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _coupon = coupon.useCouponStore()
const coupons = computed(() => _coupon.coupons())
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
  }, (error: boolean, rows?: Array<coupon.Coupon>) => {
    if (error || !rows?.length) {
      loading.value = false
      return
    }
    getCoupons(offset + limit, limit)
  })
}

onMounted(() => {
  if (!coupons.value?.length) {
    getCoupons(0, 100)
  }
})

</script>
