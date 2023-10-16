<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COUPON_SCOPE")'
    :rows='scopes'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    :columns='columns'
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
import { couponscope, sdk, utils } from 'src/npoolstore'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const scope = couponscope.useScopeStore()
const username = ref('')
const scopes = computed(() => scope.scopes(undefined).filter((el) => {
  return el.AppGoodID?.includes(username.value) ||
           el.CouponID?.includes(username.value)
}))

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
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: couponscope.Scope) => row.AppID
  },
  {
    name: 'AppGoodID',
    label: t('MSG_APP_GOOD_ID'),
    sortable: true,
    field: (row: couponscope.Scope) => row.AppGoodID
  },
  {
    name: 'GoodName',
    label: t('MSG_MESSAGE'),
    sortable: true,
    field: (row: couponscope.Scope) => row.GoodName
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
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: couponscope.Scope) => utils.formatTime(row.CreatedAt)
  }
])

</script>
