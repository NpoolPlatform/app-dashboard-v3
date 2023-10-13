<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ALLOCATED_COUPONS")'
    :rows='coupons'
    row-key='ID'
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
import { allocatedCoupon, sdk } from 'src/npoolstore'
const CouponSelector = defineAsyncComponent(() => import('src/components/inspire/CouponSelector.vue'))
const AppUserSelector = defineAsyncComponent(() => import('src/components/user/AppUserSelector.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const _coupon = allocatedCoupon.useAllocatedCouponStore()
const username = ref('')
const coupons = computed(() => _coupon.coupons(undefined).filter((el) => {
  return el.EmailAddress?.includes(username.value) ||
         el.PhoneNO?.includes(username.value) ||
         el.Username?.includes(username.value)
}))

const target = ref({} as allocatedCoupon.Coupon)
const showing = ref(false)

const onCreate = () => {
  target.value = {} as allocatedCoupon.Coupon
  showing.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as allocatedCoupon.Coupon
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

</script>
