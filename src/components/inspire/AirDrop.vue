<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='displayUsers'
    row-key='ID'
    :loading='loading'
    :rows-per-page-options='[100]'
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
        <CouponSelector v-model:id='target.ID' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card-section class='bg-primary text-white'>
    {{ $t('MSG_ADVERTISEMENT_POSITION') }}
  </q-card-section>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { allocatedcoupon, coupon, user, utils, notify } from 'src/npoolstore'
const CouponSelector = defineAsyncComponent(() => import('src/components/inspire/CouponSelector.vue'))

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _allocatedcoupon = allocatedcoupon.useAllocatedCouponStore()

const _user = user.useUserStore()
const users = computed(() => _user.appUsers(undefined))
const username = ref('')
const displayUsers = computed(() => users.value.filter((el) => {
  return el.EmailAddress?.includes(username.value) || el.PhoneNO?.includes(username.value)
}))
const selectedUsers = ref([] as Array<user.User>)

const loading = ref(false)
const target = ref({} as coupon.Coupon)

const getUsers = (offset: number, limit: number) => {
  _user.getUsers({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_USERS',
        Message: 'MSG_GET_USERS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<user.User>) => {
    if (error || !rows?.length) {
      loading.value = false
      return
    }
    getUsers(offset + limit, limit)
  })
}

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
    _allocatedcoupon.createCoupon({
      TargetUserID: user.EntID,
      CouponID: target.value?.ID,
      Message: {
        Error: {
          Title: t('MSG_CREATE_USER_COUPONS'),
          Message: t('MSG_CREATE_USER_COUPONS_FAIL'),
          Popup: true,
          Type: notify.NotifyType.Error
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

onMounted(() => {
  getUsers(0, 100)
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: user.User) => row.ID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: user.User) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: user.User) => row.EntID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: user.User) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: user.User) => row.PhoneNO
  },
  {
    name: 'Roles',
    label: t('MSG_ROLES'),
    sortable: true,
    field: (row: user.User) => row.Roles?.join(',')
  },
  {
    name: 'IDNUMBER',
    label: t('MSG_IDNUMBER'),
    sortable: true,
    field: (row: user.User) => row.IDNumber
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: user.User) => utils.formatTime(row.CreatedAt)
  }
])
</script>
