<template>
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='displayUsers'
    row-key='ID'
    selection='multiple'
    v-model:selected='selectedUser'
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
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE_INVITATION_CODE")'
          :disable='selectedUser.length === 0'
          @click='onCreateInvitationCodeClick'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_SET_KOL")'
          :disable='selectedUser.length === 0'
          @click='onSetKolClick'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_INVITATION_CODES")'
    :rows='displayCodes'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='invitationCodeColumns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='_code'
          :label='$t("MSG_SEARCH")'
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
import { utils, invitationcode, user, notify } from 'src/npoolstore'
import { getUsers } from 'src/api/user'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const code = invitationcode.useInvitationCodeStore()
const codes = computed(() => code.invitationCodes(undefined))

const _code = ref('')
const displayCodes = computed(() => codes.value.filter((el) => {
  return el.EmailAddress?.includes(_code.value) || el.InvitationCode?.includes(_code.value) || el.PhoneNO?.includes(_code.value)
}))

const _user = user.useUserStore()
const users = computed(() => _user.appUsers(undefined))

const username = ref('')
const start = ref('')
const end = ref('')

const displayUsers = computed(() => users.value.filter((user) => {
  let display = user.EmailAddress?.toLowerCase().includes(username.value.toLowerCase()) ||
        user.PhoneNO?.toLowerCase().includes(username.value.toLowerCase())
  if (start.value.length) {
    display = display && (user.CreatedAt >= new Date(start.value).getTime() / 1000)
  }
  if (end.value.length) {
    display = display && (user.CreatedAt <= new Date(end.value).getTime() / 1000)
  }
  return display
}))

const selectedUser = ref([] as Array<user.User>)

const onCreateInvitationCodeClick = () => {
  addInvitationCode()
}

const counter = ref(0)
const addInvitationCode = (idx = 0) => {
  code.createInvitationCode({
    TargetUserID: selectedUser.value[idx].EntID,
    Message: {
      Error: {
        Title: t('MSG_CREATE_INVITATION_CODE'),
        Message: t('MSG_CREATE_INVITATION_CODE_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_INVITATION_CODE'),
        Message: t('MSG_CREATE_INVITATION_CODE_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, () => {
    counter.value++
    if (counter.value >= selectedUser.value.length) {
      counter.value = 0
      return
    }
    addInvitationCode(counter.value)
  })
}

const onSetKolClick = () => {
  selectedUser.value?.forEach((el) => {
    _user.updateAppUser({
      ID: el.ID,
      TargetUserID: el.EntID,
      Kol: true,
      Message: {
        Error: {
          Title: t('MSG_CREATE_INVITATION_CODE'),
          Message: t('MSG_CREATE_INVITATION_CODE_FAIL'),
          Popup: true,
          Type: notify.NotifyType.Error
        },
        Info: {
          Title: t('MSG_CREATE_INVITATION_CODE'),
          Message: t('MSG_CREATE_INVITATION_CODE_FAIL'),
          Popup: true,
          Type: notify.NotifyType.Success
        }
      }
    }, () => {
      // TODO
    })
  })
}

onMounted(() => {
  if (codes.value?.length === 0) {
    getInvitationCodes(0, 500)
  }
  if (!users.value?.length) {
    getUsers(0, 500)
  }
})

const getInvitationCodes = (offset: number, limit: number) => {
  code.getInvitationCodes({
    Offset: offset,
    Limit: limit,
    Message: {}
  }, (error: boolean, rows: Array<invitationcode.InvitationCode>) => {
    if (error || !rows.length) {
      return
    }
    getInvitationCodes(offset + limit, limit)
  })
}
const columns = computed(() => [
  {
    name: 'UserUintID',
    label: t('MSG_USER_UINT_ID'),
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

const invitationCodeColumns = computed(() => [
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: invitationcode.InvitationCode) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: invitationcode.InvitationCode) => row.UserID
  },
  {
    name: 'Username',
    label: t('MSG_USERNAME'),
    sortable: true,
    field: (row: invitationcode.InvitationCode) => row.Username
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: invitationcode.InvitationCode) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: invitationcode.InvitationCode) => row.PhoneNO
  },
  {
    name: 'InvitationCode',
    label: t('MSG_INVITATION_CODE'),
    sortable: true,
    field: (row: invitationcode.InvitationCode) => row.InvitationCode
  },
  {
    name: 'Disabled',
    label: t('MSG_DISABLED'),
    sortable: true,
    field: (row: invitationcode.InvitationCode) => row.Disabled
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: invitationcode.InvitationCode) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: invitationcode.InvitationCode) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
