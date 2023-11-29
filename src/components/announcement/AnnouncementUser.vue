<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ANNOUNCEMENT_USERS")'
    :rows='displayAnnouncementUsers'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedAnnouncementUsers'
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
          :disable='selectedAnnouncementUsers?.length === 0'
          @click='onDelete(selectedAnnouncementUsers?.[0])'
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
        <span>{{ $t('MSG_ANNOUNCEMENT_USER') }}</span>
      </q-card-section>
      <q-card-section>
        <AnnouncementPicker v-model:id='target.AnnouncementID' label='MSG_ANNOUNCEMENT' />
        <AppUserSelector v-if='targetAnnouncement?.AnnouncementType === notifbase.NotifType.Multicast' v-model:id='target.UserID' label='MSG_USER' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { utils, notify, announcement, announcementuser, notifbase } from 'src/npoolstore'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AnnouncementPicker = defineAsyncComponent(() => import('src/components/announcement/AnnouncementPicker.vue'))
const AppUserSelector = defineAsyncComponent(() => import('src/components/user/AppUserSelector.vue'))

const announcementUser = announcementuser.useAnnouncementUserStore()
const announcementUsers = computed(() => announcementUser.users())

const username = ref('')
const displayAnnouncementUsers = computed(() => announcementUsers.value?.filter((el) =>
  el.EmailAddress.toLocaleLowerCase()?.includes(username.value?.toLowerCase()) ||
  el.PhoneNO.toLocaleLowerCase()?.includes(username.value?.toLowerCase()) ||
  el.UserID.toLocaleLowerCase()?.includes(username.value?.toLowerCase())
))

const _announcement = announcement.useAnnouncementStore()
const targetAnnouncement = computed(() => _announcement.getAnnouncementByEntID(undefined, target.value?.AnnouncementID))

const target = ref({} as announcementuser.User)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onMenuHide = () => {
  target.value = {} as announcementuser.User
  showing.value = false
}

const onCancel = () => {
  onMenuHide()
}

onMounted(() => {
  if (announcementUsers.value?.length === 0) {
    getAppAnnouncementUsers(0, 100)
  }
})

const getAppAnnouncementUsers = (offset: number, limit: number) => {
  announcementUser.getAnnouncementUsers({
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
  }, (error: boolean, rows: Array<announcementuser.User>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppAnnouncementUsers(offset + limit, limit)
  })
}

const onSubmit = (done: () => void) => {
  createAnnouncementUser(done)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onRowClick = (row: announcementuser.User) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const createAnnouncementUser = (done: () => void) => {
  announcementUser.createAnnouncementUser({
    TargetUserID: target.value.UserID,
    AnnouncementID: target.value.AnnouncementID,
    Message: {
      Error: {
        Title: 'MSG_CREATE_ANNOUNCEMENT_USERS',
        Message: 'MSG_CREATE_ANNOUNCEMENT_USERS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_ANNOUNCEMENT_USERS',
        Message: 'MSG_CREATE_ANNOUNCEMENT_USERS_SUCCESS',
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

const selectedAnnouncementUsers = ref([] as Array<announcementuser.User>)
const onDelete = (row: announcementuser.User) => {
  announcementUser.deleteAnnouncementUser({
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
    field: (row: announcementuser.User) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: announcementuser.User) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: announcementuser.User) => row.AppID
  },
  {
    name: 'AnnouncementID',
    label: t('MSG_ANNOUNCEMENT_ID'),
    sortable: true,
    field: (row: announcementuser.User) => row.AnnouncementID
  },
  {
    name: 'AnnouncementType',
    label: t('MSG_ANNOUNCEMENT_TYPE'),
    sortable: true,
    field: (row: announcementuser.User) => row.AnnouncementType
  },
  {
    name: 'UserID',
    label: t('USER_ID'),
    sortable: true,
    field: (row: announcementuser.User) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('EMAIL_ADDRESS'),
    sortable: true,
    field: (row: announcementuser.User) => row.EmailAddress
  },
  {
    name: 'Username',
    label: t('USERNAME'),
    sortable: true,
    field: (row: announcementuser.User) => row.Username
  },
  {
    name: 'PhoneNO',
    label: t('PHONE_NO'),
    sortable: true,
    field: (row: announcementuser.User) => row.PhoneNO
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    sortable: true,
    field: (row: announcementuser.User) => row.Title
  },
  {
    name: 'Content',
    label: t('MSG_CONTENT'),
    sortable: true,
    field: (row: announcementuser.User) => row.Content
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: announcementuser.User) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: announcementuser.User) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
