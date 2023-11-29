<template>
  <q-table
    dense
    flat
    :title='$t("MSG_NOTIF_USERS")'
    :rows='displayNotifUsers'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedNotifUsers'
    :columns='columns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          :disable='selectedNotifUsers?.length === 0'
          @click='onDelete(selectedNotifUsers?.[0])'
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
        <span>{{ $t('MSG_NOTIF_USER') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select
          :options='basetypes.EventTypes'
          v-model='target.EventType'
          :label='$t("MSG_USED_FOR")'
        />
        <AppUserSelector v-model:id='target.UserID' label='MSG_USER' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card-section class='bg-primary text-white'>
    {{ $t('MSG_ADVERTISEMENT_POSITION') }}
  </q-card-section>
</template>

<script setup lang='ts'>
import { utils, notifuser, notify, basetypes } from 'src/npoolstore'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AppUserSelector = defineAsyncComponent(() => import('src/components/user/AppUserSelector.vue'))

const notifUser = notifuser.useNotifUserStore()
const notifUsers = computed(() => notifUser.users(undefined, undefined))

const username = ref('')
const displayNotifUsers = computed(() => notifUsers.value?.filter((el) => el.EmailAddress.toLocaleLowerCase()?.includes(username.value?.toLowerCase()) ||
    el.PhoneNO.toLocaleLowerCase()?.includes(username.value?.toLowerCase()) ||
    el.UserID.toLocaleLowerCase()?.includes(username.value?.toLowerCase())
))

const target = ref({} as notifuser.User)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onMenuHide = () => {
  target.value = {} as notifuser.User
  showing.value = false
}

const onCancel = () => {
  onMenuHide()
}

onMounted(() => {
  if (notifUsers.value?.length === 0) {
    getAppNotifUsers(0, 100)
  }
})

const getAppNotifUsers = (offset: number, limit: number) => {
  notifUser.getAppNotifUsers({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_ANNOUNCEMENTS'),
        Message: t('MSG_GET_ANNOUNCEMENTS_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<notifuser.User>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppNotifUsers(offset + limit, limit)
  })
}

const onSubmit = (done: () => void) => {
  createNotifUser(done)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onRowClick = (row: notifuser.User) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const createNotifUser = (done: () => void) => {
  notifUser.createNotifUser({
    TargetUserID: target.value.UserID,
    EventType: target.value.EventType,
    Message: {
      Error: {
        Title: 'MSG_CREATE_NOTIF_USERS',
        Message: 'MSG_CREATE_NOTIF_USERS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_NOTIF_USERS',
        Message: 'MSG_CREATE_NOTIF_USERS_SUCCESS',
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

const selectedNotifUsers = ref([] as Array<notifuser.User>)
const onDelete = (row: notifuser.User) => {
  notifUser.deleteNotifUser({
    ID: row.ID,
    EntID: row.EntID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_ANNOUNCEMENT',
        Message: 'MSG_DELETE_ANNOUNCEMENT_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_ANNOUNCEMENT',
        Message: 'MSG_DELETE_ANNOUNCEMENT_SUCCESS',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, () => {
    // TODO
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: notifuser.User) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: notifuser.User) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: notifuser.User) => row.AppID
  },
  {
    name: 'EventType',
    label: t('MSG_EVENT_TYPE'),
    sortable: true,
    field: (row: notifuser.User) => row.EventType
  },
  {
    name: 'NotifType',
    label: t('MSG_ANNOUNCEMENT_TYPE'),
    sortable: true,
    field: (row: notifuser.User) => row.NotifType
  },
  {
    name: 'UserID',
    label: t('USER_ID'),
    sortable: true,
    field: (row: notifuser.User) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('EMAIL_ADDRESS'),
    sortable: true,
    field: (row: notifuser.User) => row.EmailAddress
  },
  {
    name: 'Username',
    label: t('USERNAME'),
    sortable: true,
    field: (row: notifuser.User) => row.Username
  },
  {
    name: 'PhoneNO',
    label: t('PHONE_NO'),
    sortable: true,
    field: (row: notifuser.User) => row.PhoneNO
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: notifuser.User) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: notifuser.User) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
