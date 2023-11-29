<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='displayUsers'
    row-key='ID'
    :loading='userLoading'
    :rows-per-page-options='[100]'
    :columns='columns'
    @row-click='(evt, row, index) => onRowClick(row as user.User)'
  >
    <template #top-right>
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
        :label='$t("MSG_EXPORT")'
        @click='onExport'
      />
      <q-input
        dense
        class='small'
        type='date'
        v-model='start'
        :label='$t("MSG_START")'
      />
      <q-input
        dense
        class='small'
        type='date'
        v-model='end'
        :label='$t("MSG_END")'
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
        <q-input v-model='target.EmailAddress' :label='$t("MSG_NEW_EMAIL_ADDRESS")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import saveAs from 'file-saver'
import { notify, user, utils, app } from 'src/npoolstore'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const columns = computed(() => [
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
    name: 'InvitationCode',
    label: t('MSG_INVITATION_CODE'),
    sortable: true,
    field: (row: user.User) => row.InvitationCode
  },
  {
    name: 'KOL',
    label: t('MSG_KOL'),
    sortable: true,
    field: (row: user.User) => row.Kol
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

const _user = user.useUserStore()
const users = computed(() => _user.appUsers(undefined).filter((el) => {
  let display = true
  if (start.value.length) {
    display = display && (el.CreatedAt >= new Date(start.value).getTime() / 1000)
  }
  if (end.value.length) {
    display = display && (el.CreatedAt <= new Date(end.value).getTime() / 1000)
  }
  return display
}))

const username = ref('')

const displayUsers = computed(() => users.value.filter((user) => {
  const display = user.EmailAddress?.toLowerCase().includes(username.value.toLowerCase()) ||
        user.PhoneNO?.toLowerCase().includes(username.value.toLowerCase())
  return display
}))

const target = ref({} as user.User)
const showing = ref(false)
const updating = ref(false)

const onRowClick = (row: user.User) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as user.User
}

const onSubmit = (done: () => void) => {
  _user.updateAppUser({
    ID: target.value?.ID,
    TargetUserID: target.value?.EntID,
    EmailAddress: target.value?.EmailAddress,
    Message: {
      Error: {
        Title: 'MSG_CREATE_INVITATION_CODE',
        Message: 'MSG_CREATE_INVITATION_CODE_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_INVITATION_CODE',
        Message: 'MSG_CREATE_INVITATION_CODE_FAIL',
        Popup: true,
        Type: notify.NotifyType.Success
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

const start = ref('')
const end = ref('')
const onExport = () => {
  if (users.value.length === 0) {
    return
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { CreatedAt, AddressFields, AddressFieldsString, KycStateStr, Roles, InvitationCode, InvitationCodeConfirmed, InvitationCodeID, LoginVerified, ...columns } = { ...users.value[0] }
  let str = ''
  str += Object.keys(columns).join(',') + ',AddressFields,Roles,InvitationCode,InvitationCodeConfirmed,CreatedAt\n'
  users.value.forEach((el) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { CreatedAt, AddressFields, AddressFieldsString, KycStateStr, Roles, InvitationCode, InvitationCodeConfirmed, InvitationCodeID, LoginVerified, ...values } = { ...el }
    const valueArray = Object.values(values)
    valueArray.push(AddressFieldsString.split(',').join(';'), Roles.join(';'), InvitationCode, InvitationCodeConfirmed, utils.formatTime(CreatedAt))
    str += valueArray.join(',') + '\n'
  })
  const blob = new Blob([str], { type: 'text/plain;charset=utf-8' })
  const filename = _app.app(undefined)?.Name as string + '-Users-' + utils.formatTime(new Date().getTime() / 1000) + '.csv'
  saveAs(blob, filename)
}

const userLoading = ref(false)
onMounted(() => {
  if (!_user.appUsers(undefined).length) {
    userLoading.value = true
    getUsers(0, 500)
  }
  if (!_app.app(undefined)) {
    getApplication()
  }
})
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
      userLoading.value = false
      return
    }
    getUsers(offset + limit, limit)
  })
}

const _app = app.useApplicationStore()
const getApplication = () => {
  _app.getApp({
    Message: {
      Error: {
        Title: 'MSG_GET_APP',
        Message: 'MSG_GET_APP_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}
</script>
