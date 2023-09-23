<template>
  <q-table
    dense
    flat
    :title='$t("MSG_TRANSFER_ACCOUNTS")'
    :rows='displayAccounts'
    row-key='ID'
    :loading='accountsLoading'
    :rows-per-page-options='[100]'
    :columns='columns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_EMAIL_ADDRESS")'
        />
      </div>
    </template>
  </q-table>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { AppID } from 'src/const/const'
import { transferaccount, user, notify } from 'src/npoolstore'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

interface TFAccount extends transferaccount.TransferAccount {
  PhoneNO: string;
  EmailAddress: string;
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: TFAccount) => row.ID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: TFAccount) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: TFAccount) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: TFAccount) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: TFAccount) => row.PhoneNO
  },
  {
    name: 'TargetUserID',
    label: t('MSG_TARGET_USER_ID'),
    sortable: true,
    field: (row: TFAccount) => row.TargetUserID
  },
  {
    name: 'TargetEmailAddress',
    label: t('MSG_TARGET_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: TFAccount) => row.TargetEmailAddress
  },
  {
    name: 'TargetPhoneNO',
    label: t('MSG_TARGET_PHONE_NO'),
    sortable: true,
    field: (row: TFAccount) => row.TargetPhoneNO
  },
  {
    name: 'TargetUsername',
    label: t('MSG_TARGET_USERNAME'),
    sortable: true,
    field: (row: TFAccount) => row.TargetUsername
  },
  {
    name: 'TargetFirstName',
    label: t('MSG_TARGET_FIRST_NAME'),
    sortable: true,
    field: (row: TFAccount) => row.TargetFirstName
  },
  {
    name: 'TargetFirstName',
    label: t('MSG_TARGET_LAST_NAME'),
    sortable: true,
    field: (row: TFAccount) => row.TargetLastName
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: TFAccount) => row.CreatedAt
  }
])

const _user = user.useUserStore()
const users = computed(() => _user.appUsers(undefined))

const transferAccount = transferaccount.useTransferAccountStore()
const transferAccounts = computed(() => transferAccount.transferAccounts(undefined, undefined))

const displayAccounts = computed(() => {
  const data = [] as Array<TFAccount>
  transferAccount.transferAccounts(undefined, undefined).forEach((el) => {
    const targetUser = _user.appUser(el.AppID, el.UserID) as user.User
    data.push({ ...el, ...{ PhoneNO: targetUser?.PhoneNO, EmailAddress: targetUser?.EmailAddress } })
  })
  return data.filter((el) => el.EmailAddress?.includes(username.value) || el.PhoneNO?.includes(username.value))
})
const accountsLoading = ref(false)
const username = ref('')

onMounted(() => {
  if (!transferAccounts.value?.length) {
    accountsLoading.value = true
    getAppTransfers(0, 500)
  }
  if (!users.value?.length) {
    getUsers(0, 500)
  }
})

const getAppTransfers = (offset: number, limit: number) => {
  transferAccount.getAppTransfers({
    TargetAppID: AppID,
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
  }, (error: boolean, rows?: Array<transferaccount.TransferAccount>) => {
    if (error || !rows?.length) {
      accountsLoading.value = false
      return
    }
    getAppTransfers(offset + limit, limit)
  })
}
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
      return
    }
    getUsers(offset + limit, limit)
  })
}
</script>
