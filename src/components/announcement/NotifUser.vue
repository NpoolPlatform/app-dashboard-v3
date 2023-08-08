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
          :options='UsedFors'
          v-model='target.EventType'
          :label='$t("MSG_USED_FOR")'
        />
        <AppUsersSelector v-model:id='target.UserID' label='MSG_USER' />
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
import {
  formatTime,
  NotifyType,
  useAdminNotifUserStore,
  UsedFors,
  NotifUser
} from 'npool-cli-v4'
import { AppID } from 'src/const/const'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AppUsersSelector = defineAsyncComponent(() => import('src/components/user/AppUsersSelector.vue'))

const notifUser = useAdminNotifUserStore()
const notifUsers = computed(() => notifUser.NotifUsers.NotifUsers)

const username = ref('')
const displayNotifUsers = computed(() => notifUsers.value?.filter((el) => el.EmailAddress.toLocaleLowerCase()?.includes(username.value?.toLowerCase()) ||
    el.PhoneNO.toLocaleLowerCase()?.includes(username.value?.toLowerCase()) ||
    el.UserID.toLocaleLowerCase()?.includes(username.value?.toLowerCase())
))

const target = ref({} as NotifUser)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onMenuHide = () => {
  target.value = {} as NotifUser
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
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<NotifUser>) => {
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
const onRowClick = (row: NotifUser) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const createNotifUser = (done: () => void) => {
  notifUser.createNotifUser({
    AppID: AppID,
    TargetUserID: target.value.UserID,
    EventType: target.value.EventType,
    Message: {
      Error: {
        Title: 'MSG_CREATE_NOTIF_USERS',
        Message: 'MSG_CREATE_NOTIF_USERS_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_NOTIF_USERS',
        Message: 'MSG_CREATE_NOTIF_USERS_SUCCESS',
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

const selectedNotifUsers = ref([] as Array<NotifUser>)
const onDelete = (row: NotifUser) => {
  notifUser.deleteNotifUser({
    ID: row.ID,
    AppID: AppID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_ANNOUNCEMENT',
        Message: 'MSG_DELETE_ANNOUNCEMENT_FAIL',
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_ANNOUNCEMENT',
        Message: 'MSG_DELETE_ANNOUNCEMENT_SUCCESS',
        Popup: true,
        Type: NotifyType.Success
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
    field: (row: NotifUser) => row.ID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: NotifUser) => row.AppID
  },
  {
    name: 'EventType',
    label: t('MSG_EVENT_TYPE'),
    sortable: true,
    field: (row: NotifUser) => row.EventType
  },
  {
    name: 'NotifType',
    label: t('MSG_ANNOUNCEMENT_TYPE'),
    sortable: true,
    field: (row: NotifUser) => row.NotifType
  },
  {
    name: 'UserID',
    label: t('USER_ID'),
    sortable: true,
    field: (row: NotifUser) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('EMAIL_ADDRESS'),
    sortable: true,
    field: (row: NotifUser) => row.EmailAddress
  },
  {
    name: 'Username',
    label: t('USERNAME'),
    sortable: true,
    field: (row: NotifUser) => row.Username
  },
  {
    name: 'PhoneNO',
    label: t('PHONE_NO'),
    sortable: true,
    field: (row: NotifUser) => row.PhoneNO
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: NotifUser) => formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: NotifUser) => formatTime(row.UpdatedAt)
  }
])
</script>
