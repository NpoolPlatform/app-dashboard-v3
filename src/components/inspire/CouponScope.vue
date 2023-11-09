<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COUPON_SCOPES")'
    :rows='displayScopes'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='columns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='name'
          :label='$t("MSG_NAME")'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { couponscope, sdk, utils } from 'src/npoolstore'

import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const scope = couponscope.useScopeStore()
const scopes = computed(() => scope.scopes())

const name = ref('')
const displayScopes = computed(() => scopes.value?.filter((el) => el.CouponID.toLowerCase().includes(name.value?.toLowerCase()) ||
  el.GoodID.toLowerCase().includes(name.value?.toLowerCase())
))

onMounted(() => {
  if (!scopes.value?.length) {
    sdk.getScopes(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: couponscope.Scope) => row.ID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: couponscope.Scope) => row.GoodID
  },
  {
    name: 'GoodTitle',
    label: t('MSG_GOOD_TITLE'),
    sortable: true,
    field: (row: couponscope.Scope) => row.GoodTitle
  },
  {
    name: 'Type',
    label: t('MSG_TYPE'),
    sortable: true,
    field: (row: couponscope.Scope) => row.CouponType
  },
  {
    name: 'Scope',
    label: t('MSG_COUPON_SCOPE'),
    sortable: true,
    field: (row: couponscope.Scope) => row.CouponScope
  },
  {
    name: 'CouponID',
    label: t('MSG_COUPON_ID'),
    sortable: true,
    field: (row: couponscope.Scope) => row.CouponID
  },
  {
    name: 'CouponName',
    label: t('MSG_COUPON_NAME'),
    sortable: true,
    field: (row: couponscope.Scope) => row.CouponName
  },
  {
    name: 'CouponScope',
    label: t('MSG_SCOPE'),
    sortable: true,
    field: (row: couponscope.Scope) => row.CouponScope
  },
  {
    name: 'CouponDenomination',
    label: t('MSG_COUPON_DENOMINATION'),
    sortable: true,
    field: (row: couponscope.Scope) => row.CouponDenomination
  },
  {
    name: 'CouponCirculation',
    label: t('MSG_COUPON_CIRCULATION'),
    sortable: true,
    field: (row: couponscope.Scope) => row.CouponCirculation
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: couponscope.Scope) => utils.formatTime(row.CreatedAt)
  }
])

</script>
