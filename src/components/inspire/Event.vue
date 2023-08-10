<template>
  <q-table
    dense
    flat
    :title='$t("MSG_EVENT_INSPIRE")'
    :rows='displayEvents'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[50]'
    @row-click='(evt, row, index) => onRowClick(row as eventinspire.Event)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <!-- <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        /> -->
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
        <span>{{ $t('MSG_EVENT_INSPIRE') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select
          :disable='updating'
          :options='[
            eventinspire.UsedFor.AffiliatePurchase,
            eventinspire.UsedFor.Purchase,
            eventinspire.UsedFor.Signup,
            eventinspire.UsedFor.AffiliateSignup,
          ]'
          v-model='target.EventType'
          :label='$t("MSG_EVENT_YPE")'
        />
      </q-card-section>
      <q-card-section
        v-if='target.EventType === eventinspire.UsedFor.AffiliatePurchase ||
          target.EventType === eventinspire.UsedFor.Purchase ||
          eventinspire.UsedFor.Signup ||
          eventinspire.UsedFor.AffiliateSignup'
      >
        <AppGoodSelector v-model:id='target.GoodID' v-if='!updating' :label='$t("MSG_GOOD")' />
        <CouponSelector v-model:ids='couponIDs' />
      </q-card-section>
      <q-card-section>
        <q-input type='number' v-model='target.Credits' :label='$t("MSG_CREDIT")' />
        <q-input type='number' v-model='target.CreditsPerUSD' :label='$t("MSG_CREDIT_PERUSD")' />
      </q-card-section>
      <q-card-section>
        <q-input type='number' v-model.number='target.MaxConsecutive' :label='$t("MSG_MAX_CONSECUTIVE")' />
        <q-input type='number' v-model.number='target.InviterLayers' :label='$t("MSG_INVITER_LAYERS")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { formatTime, NotifyType } from 'npool-cli-v4'
import { getCoupons } from 'src/api/inspire'
import { coupon, eventinspire } from 'src/npoolstore'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))
const CouponSelector = defineAsyncComponent(() => import('src/components/inspire/CouponSelector.vue'))

const _coupon = coupon.useCouponStore()
const event = eventinspire.useEventStore()
const events = computed(() => event.Events)
const couponIDs = ref([] as Array<string>)

// const username = ref('')
const displayEvents = computed(() => events.value.filter((el) => {
  return el
}))

const target = ref({} as eventinspire.Event)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  target.value = { MaxConsecutive: 1, InviterLayers: 1 } as eventinspire.Event
  couponIDs.value = []
  showing.value = true
  updating.value = false
}
const onRowClick = (row: eventinspire.Event) => {
  target.value = { ...row }
  couponIDs.value = target.value.Coupons.map((el) => el.ID)
  showing.value = true
  updating.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as eventinspire.Event
}
const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  updating.value ? updateEvent(done) : createEvent(done)
}

const updateEvent = (done: () => void) => {
  event.updateEvent({
    ...target.value,
    CouponIDs: couponIDs.value,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_EVENT'),
        Message: t('MSG_UPDATE_EVENT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_EVENT'),
        Message: t('MSG_UPDATE_EVENT_SUCCESS'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const createEvent = (done: () => void) => {
  event.createEvent({
    ...target.value,
    CouponIDs: couponIDs.value,
    Message: {
      Error: {
        Title: t('MSG_CREATE_EVENT'),
        Message: t('MSG_CREATE_EVENT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_EVENT'),
        Message: t('MSG_CREATE_EVENT_FAIL'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

onMounted(() => {
  if (event.Events.length === 0) {
    getEvents(0, 500)
  }
  if (_coupon.Coupons.length === 0) {
    getCoupons(0, 500)
  }
})

const getEvents = (offset: number, limit: number) => {
  event.getEvents({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_EVENT_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<eventinspire.Event>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    getEvents(offset + limit, limit)
  })
}

const eventCoupons = computed(() => (rows: coupon.Coupon[]) => {
  let str = ''
  rows.forEach((el) => {
    str += `${el.ID} | ${el.CouponType} | ${el.Name} | ${el.Denomination}  ;  `
  })
  return str
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    field: (row: eventinspire.Event) => row.ID
  },
  {
    name: 'AppName',
    label: t('MSG_APP_NAME'),
    field: (row: eventinspire.Event) => row.AppName
  },
  {
    name: 'EventType',
    label: t('MSG_EVENT_TYPE'),
    field: (row: eventinspire.Event) => row.EventType
  },
  {
    name: 'Coupons',
    label: t('MSG_COUPONS'),
    field: (row: eventinspire.Event) => eventCoupons.value(row.Coupons)
  },
  {
    name: 'Credits',
    label: t('MSG_CREDITS'),
    field: (row: eventinspire.Event) => row.Credits
  },
  {
    name: 'CreditsPerUSD',
    label: t('MSG_CREDITS_PERUSD'),
    field: (row: eventinspire.Event) => row.CreditsPerUSD
  },
  {
    name: 'MaxConsecutive',
    label: t('MSG_MAX_CONSECUTIVE'),
    field: (row: eventinspire.Event) => row.MaxConsecutive
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    field: (row: eventinspire.Event) => row.GoodID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOOD_NAME'),
    field: (row: eventinspire.Event) => row.GoodName
  },
  {
    name: 'InviterLayers',
    label: t('MSG_INVITER_LAYERS'),
    field: (row: eventinspire.Event) => row.InviterLayers
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: eventinspire.Event) => formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: eventinspire.Event) => formatTime(row.UpdatedAt)
  }
])
</script>
