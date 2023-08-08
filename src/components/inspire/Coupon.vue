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
import { useCouponStore } from 'src/teststore/inspire/coupon'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const coupon = useCouponStore()
const coupons = computed(() => coupon.Coupons)
const loading = ref(true)

const prepare = () => {
  loading.value = true
  coupon.getCoupons({
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
