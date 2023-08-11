<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='displayUsers'
    row-key='ID'
    :loading='loading'
    :rows-per-page-options='[10]'
    selection='multiple'
    v-model:selected='selectedUsers'
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
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_AIRDROP")'
          @click='onDo'
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
        <span>{{ $t('MSG_CREATE_EVENT_COUPON') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select
          :options='coupons'
          v-model='selectedCoupon'
          :label='$t("MSG_COUPON")'
        />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { formatTime, NotifyType, useAdminUserStore, User } from 'npool-cli-v4'
import { computed, onMounted, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { allocatedCoupon, coupon } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const columns = computed(() => [
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    field: (row: User) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    field: (row: User) => row.ID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    field: (row: User) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    field: (row: User) => row.PhoneNO
  },
  {
    name: 'Roles',
    label: t('MSG_ROLES'),
    field: (row: User) => row.Roles?.join(',')
  },
  {
    name: 'IDNUMBER',
    label: t('MSG_IDNUMBER'),
    field: (row: User) => row.IDNumber
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    field: (row: User) => formatTime(row.CreatedAt)
  }
])

const _allocatedCoupon = allocatedCoupon.useAllocatedCouponStore()
const _coupon = coupon.useCouponStore()
const coupons = computed(() => _coupon.Coupons.filter((el) => el.CouponType !== coupon.CouponType.SpecialOffer).map((el) => {
  return {
    label: el.Name + ' | ' + el.Denomination + ' | ' + el.CouponType,
    value: el
  }
}))

const user = useAdminUserStore()
const users = computed(() => user.Users.Users)
const username = ref('')
const displayUsers = computed(() => users.value.filter((el) => {
  return el.EmailAddress?.includes(username.value) || el.PhoneNO?.includes(username.value)
}))
const selectedUsers = ref([] as Array<User>)

const loading = ref(false)
const couponID = ref(undefined as unknown as string)
const selectedCoupon = ref(undefined as unknown as coupon.Coupon)

watch(selectedCoupon, () => {
  couponID.value = selectedCoupon.value?.ID
})

const getUsers = (offset: number, limit: number) => {
  user.getUsers({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_USERS',
        Message: 'MSG_GET_USERS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (resp: Array<User>, error: boolean) => {
    if (error || resp.length < limit) {
      loading.value = false
      return
    }
    getUsers(offset + limit, limit)
  })
}
const prepare = () => {
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
    // TODO
  })

  if (user.Users.Users.length === 0) {
    loading.value = true
    getUsers(0, 500)
  }
}

onMounted(() => {
  prepare()
})

const showing = ref(false)
const onDo = () => {
  showing.value = true
}

const onMenuHide = () => {
  showing.value = false
}

const onSubmit = () => {
  showing.value = false
  selectedUsers.value.forEach((user) => {
    _allocatedCoupon.createCoupon({
      TargetUserID: user.ID,
      CouponID: couponID.value,
      Message: {
        Error: {
          Title: t('MSG_CREATE_USER_COUPONS'),
          Message: t('MSG_CREATE_USER_COUPONS_FAIL'),
          Popup: true,
          Type: NotifyType.Error
        }
      }
    }, () => {
      // TODO
    })
  })
}

const onCancel = () => {
  showing.value = false
}

</script>
