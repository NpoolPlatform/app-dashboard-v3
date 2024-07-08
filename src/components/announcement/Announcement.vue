<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ANNOUNCEMENTS")'
    :rows='announcements'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as announcement.Announcement)'
    selection='single'
    v-model:selected='selectedAnnouncements'
    :columns='columns'
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
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          :disable='selectedAnnouncements?.length === 0'
          @click='onDelete(selectedAnnouncements?.[0])'
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
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-input v-model='target.Content' :label='$t("MSG_CONTENT")' />
        <AppLanguagePicker v-model:id='target.LangID' :updating='updating' label='MSG_LANGUAGE' />
        <q-select
          :options='notifbase.NotifTypes'
          v-model='target.AnnouncementType'
          :label='$t("MSG_ANNOUNCEMENT_TYPE")'
        />
        <q-select
          :options='notifbase.NotifChannels'
          v-model='target.Channel'
          :label='$t("MSG_CHANNEL")'
          :disable='updating'
        />
      </q-card-section>
      <q-card-section>
        <DateTimePicker v-model:date='target.StartAt' label='MSG_START_AT' />
      </q-card-section>
      <q-card-section>
        <DateTimePicker v-model:date='target.EndAt' label='MSG_END_AT' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <AnnouncementUser />
  <State />
</template>

<script setup lang='ts'>
import { utils, notify, announcement, notifbase } from 'src/npoolstore'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))
const AppLanguagePicker = defineAsyncComponent(() => import('src/components/internationalization/AppLanguagePicker.vue'))
const AnnouncementUser = defineAsyncComponent(() => import('src/components/announcement/AnnouncementUser.vue'))
const State = defineAsyncComponent(() => import('src/components/announcement/State.vue'))

const _announcement = announcement.useAnnouncementStore()
const announcements = computed(() => _announcement.announcements(undefined))

const target = ref({} as announcement.Announcement)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onMenuHide = () => {
  target.value = {} as announcement.Announcement
  showing.value = false
}

const onCancel = () => {
  onMenuHide()
}

onMounted(() => {
  if (announcements.value?.length === 0) {
    getAppAnnouncements(0, 100)
  }
})

const getAppAnnouncements = (offset: number, limit: number) => {
  _announcement.getAppAnnouncements({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_ANNOUNCEMENTS',
        Message: 'MSG_GET_ANNOUNCEMENTS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<announcement.Announcement>) => {
    if (error || !rows.length) {
      return
    }
    getAppAnnouncements(offset + limit, limit)
  })
}

const onSubmit = (done: () => void) => {
  updating.value ? updateAnnouncement(done) : createAnnouncement(done)
}

const onRowClick = (row: announcement.Announcement) => {
  target.value = { ...row }
  updating.value = true
  showing.value = true
}

const updateAnnouncement = (done: () => void) => {
  _announcement.updateAnnouncement({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_ANNOUNCEMENT',
        Message: 'MSG_UPDATE_ANNOUNCEMENT_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_ANNOUNCEMENT',
        Message: 'MSG_UPDATE_ANNOUNCEMENT_SUCCESS',
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

const createAnnouncement = (done: () => void) => {
  _announcement.createAnnouncement({
    ...target.value,
    TargetLangID: target.value?.LangID,
    Message: {
      Error: {
        Title: 'MSG_CREATE_ANNOUNCEMENT',
        Message: 'MSG_CREATE_ANNOUNCEMENT_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_ANNOUNCEMENT',
        Message: 'MSG_CREATE_ANNOUNCEMENT_SUCCESS',
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

const selectedAnnouncements = ref([] as Array<announcement.Announcement>)
const onDelete = (row: announcement.Announcement) => {
  _announcement.deleteAnnouncement({
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
    field: (row: announcement.Announcement) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: announcement.Announcement) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: announcement.Announcement) => row.AppID
  },
  {
    name: 'LangID',
    label: t('MSG_LANG_ID'),
    sortable: true,
    field: (row: announcement.Announcement) => row.LangID
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    sortable: true,
    field: (row: announcement.Announcement) => row.Title
  },
  {
    name: 'Type',
    label: t('MSG_TYPE'),
    sortable: true,
    field: (row: announcement.Announcement) => row.AnnouncementType
  },
  {
    name: 'Content',
    label: t('MSG_CONTENT'),
    sortable: true,
    field: (row: announcement.Announcement) => row.Content
  },
  {
    name: 'Channel',
    label: t('MSG_CHANNEL'),
    sortable: true,
    field: (row: announcement.Announcement) => row.Channel
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: announcement.Announcement) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'StartAt',
    label: t('MSG_START_AT'),
    sortable: true,
    field: (row: announcement.Announcement) => utils.formatTime(row.StartAt)
  },
  {
    name: 'END_AT',
    label: t('MSG_END_AT'),
    sortable: true,
    field: (row: announcement.Announcement) => utils.formatTime(row.EndAt)
  }
])
</script>
