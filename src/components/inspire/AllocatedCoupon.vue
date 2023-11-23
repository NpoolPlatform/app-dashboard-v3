<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ALLOCATED_COUPONS")'
    :rows='coupons'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
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
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_CREATE")'
        @click='onCreate'
      />
    </template>
  </q-table>

  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_COUPON') }}</span>
      </q-card-section>
      <q-card-section>
        <AppUserSelector v-model:id='target.UserID' />
        <CouponSelector v-model:id='target.CouponID' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { allocatedcoupon, sdk, utils } from 'src/npoolstore'
const CouponSelector = defineAsyncComponent(() => import('src/components/inspire/CouponSelector.vue'))
const AppUserSelector = defineAsyncComponent(() => import('src/components/user/AppUserSelector.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _coupon = allocatedcoupon.useAllocatedCouponStore()
const username = ref('')
const coupons = computed(() => _coupon.coupons(undefined).filter((el) => {
  return el.EmailAddress?.includes(username.value) ||
         el.PhoneNO?.includes(username.value) ||
         el.Username?.includes(username.value)
}))

const target = ref({} as allocatedcoupon.Coupon)
const showing = ref(false)

const onCreate = () => {
  target.value = {} as allocatedcoupon.Coupon
  showing.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as allocatedcoupon.Coupon
}
const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  sdk.createAllocatedCoupon(target.value, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

onMounted(() => {
  if (!coupons.value?.length) {
    sdk.getAllocatedCoupons(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => row.AppID
  },
  {
    name: 'CouponID',
    label: t('MSG_COUPON_ID'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => row.CouponID
  },
  {
    name: 'Name',
    label: t('MSG_NAME'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => row.CouponName
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => row.Message
  },
  {
    name: 'Type',
    label: t('MSG_TYPE'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => row.CouponType
  },
  {
    name: 'Scope',
    label: t('MSG_COUPON_SCOPE'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => row.CouponScope
  },
  {
    name: 'Denomination',
    label: t('MSG_DENOMINATION'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => row.Denomination
  },
  {
    name: 'Circulation',
    label: t('MSG_CIRCULATION'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => row.Circulation
  },
  {
    name: 'DurationDays',
    label: t('MSG_DURATION_DAYS'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => row.DurationDays
  },
  {
    name: 'CouponConstraint',
    label: t('MSG_CONSTRAINT'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => row.CouponConstraint
  },
  {
    name: 'Random',
    label: t('MSG_RANDOM'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => row.Random
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => row.PhoneNO
  },
  {
    name: 'Expired',
    label: t('MSG_EXPIRED'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => row.Expired
  },
  {
    name: 'StartAt',
    label: t('MSG_START_AT'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => utils.formatTime(row.StartAt)
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: allocatedcoupon.Coupon) => utils.formatTime(row.CreatedAt)
  }
])
</script>
