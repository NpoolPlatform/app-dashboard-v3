<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COUPONS")'
    :rows='coupons'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='columns'
  />
  <CouponScope />
  <CouponControl />
  <AppGoodScope />
  <AllocatedCoupon />
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { coupon, sdk, utils } from 'src/npoolstore'
const AllocatedCoupon = defineAsyncComponent(() => import('src/components/inspire/AllocatedCoupon.vue'))
const CouponScope = defineAsyncComponent(() => import('src/components/inspire/CouponScope.vue'))
const CouponControl = defineAsyncComponent(() => import('src/components/inspire/CashControl.vue'))
const AppGoodScope = defineAsyncComponent(() => import('src/components/inspire/AppGoodScope.vue'))

import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _coupon = coupon.useCouponStore()
const coupons = computed(() => _coupon.coupons())

onMounted(() => {
  if (!coupons.value?.length) {
    sdk.getCoupons(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: coupon.Coupon) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: coupon.Coupon) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: coupon.Coupon) => row.AppID
  },
  {
    name: 'Name',
    label: t('MSG_NAME'),
    sortable: true,
    field: (row: coupon.Coupon) => row.Name
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    sortable: true,
    field: (row: coupon.Coupon) => row.Message
  },
  {
    name: 'Type',
    label: t('MSG_TYPE'),
    sortable: true,
    field: (row: coupon.Coupon) => row.CouponType
  },
  {
    name: 'Scope',
    label: t('MSG_COUPON_SCOPE'),
    sortable: true,
    field: (row: coupon.Coupon) => row.CouponScope
  },
  {
    name: 'Denomination',
    label: t('MSG_DENOMINATION'),
    sortable: true,
    field: (row: coupon.Coupon) => row.Denomination
  },
  {
    name: 'Circulation',
    label: t('MSG_CIRCULATION'),
    sortable: true,
    field: (row: coupon.Coupon) => row.Circulation
  },
  {
    name: 'Allocated',
    label: t('MSG_ALLOCATED'),
    sortable: true,
    field: (row: coupon.Coupon) => row.Allocated
  },
  {
    name: 'DurationDays',
    label: t('MSG_DURATION_DAYS'),
    sortable: true,
    field: (row: coupon.Coupon) => row.DurationDays
  },
  {
    name: 'CouponConstraint',
    label: t('MSG_CONSTRAINT'),
    sortable: true,
    field: (row: coupon.Coupon) => row.CouponConstraint
  },
  {
    name: 'Random',
    label: t('MSG_RANDOM'),
    sortable: true,
    field: (row: coupon.Coupon) => row.Random
  },
  {
    name: 'StartAt',
    label: t('MSG_START_AT'),
    sortable: true,
    field: (row: coupon.Coupon) => utils.formatTime(row.StartAt)
  },
  {
    name: 'EndAt',
    label: t('MSG_END_AT'),
    sortable: true,
    field: (row: coupon.Coupon) => utils.formatTime(row.EndAt)
  },
  {
    name: 'CashableProbability',
    label: t('MSG_CASHABLE_PROBABILITY'),
    sortable: true,
    field: (row: coupon.Coupon) => row.CashableProbability
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: coupon.Coupon) => utils.formatTime(row.CreatedAt)
  }
])

</script>
