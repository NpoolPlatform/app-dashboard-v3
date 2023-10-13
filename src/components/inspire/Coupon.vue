<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COUPONS")'
    :rows='coupons'
    row-key='ID'
    :loading='loading'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as coupon.Coupon)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
      </div>
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
        <!-- <AppGoodSelector v-model:id='target.AppGoodID' :label='$t("MSG_GOOD")' /> -->
        <!-- <AppUserSelector v-model:id='target.UserID' /> -->
        <q-input v-model='target.Name' :label='$t("MSG_NAME")' />
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
        <q-select :options='coupon.CouponTypes' v-model='target.CouponType' :label='$t("MSG_COUPON_TYPE")' />
        <q-select :options='coupon.CouponConstraints' v-model='target.CouponConstraint' :label='$t("MSG_COUPON_CONSTRAINT")' />
        <q-input v-model='target.Denomination' :label='$t("MSG_DENOMINATION")' />
        <q-input v-model='target.Circulation' :label='$t("MSG_CIRCULATION")' />
        <q-input v-model.number='target.DurationDays' :label='$t("MSG_DURATION_DAYS")' />
        <q-input v-model='target.Threshold' :label='$t("MSG_THRESHOLD")' />
        <q-select :options='coupon.CouponScopes' v-model='target.CouponScope' :label='$t("MSG_COUPON_SCOPE")' />
      </q-card-section>
      <q-card-section>
        <DateTimePicker v-model:date='target.StartAt' label='MSG_START_AT' />
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.Random' :label='$t("MSG_RANDOM")' /></div>
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
import { useI18n } from 'vue-i18n'
import { coupon, notify, sdk } from 'src/npoolstore'
const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _coupon = coupon.useCouponStore()
const coupons = computed(() => _coupon.coupons())
const loading = ref(false)

const target = ref({} as coupon.Coupon)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  target.value = {} as coupon.Coupon
  showing.value = true
  updating.value = false
}
const onRowClick = (row: coupon.Coupon) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as coupon.Coupon
}
const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  if (updating.value) {
    sdk.updateCoupon(target.value, (error: boolean) => {
      done()
      if (error) {
        return
      }
      onMenuHide()
    })
    return
  }
  sdk.createCoupon(target.value, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const getCoupons = (offset: number, limit: number) => {
  loading.value = true
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
