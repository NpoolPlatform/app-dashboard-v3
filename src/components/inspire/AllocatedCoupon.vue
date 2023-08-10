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
import { NotifyType } from 'npool-cli-v4'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { allocatedCoupon } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _coupon = allocatedCoupon.useAllocatedCouponStore()
const coupons = computed(() => _coupon.AllocatedCoupons)
const loading = ref(true)

const prepare = () => {
  if (_coupon.AllocatedCoupons.length > 0) {
    return
  }
  loading.value = true
  _coupon.getCoupons({
    Offset: 0,
    Limit: 100,
    Message: {
      Error: {
        Title: t('MSG_GET_COUPONS'),
        Message: t('MSG_GET_COUPONS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, () => {
    loading.value = false
  })
}

onMounted(() => {
  prepare()
})

</script>
