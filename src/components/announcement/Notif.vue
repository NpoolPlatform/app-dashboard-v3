<template>
  <q-table
    dense
    flat
    :title='$t("MSG_NOTIFS")'
    :rows='displayNotifs'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='(columns as any)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
      </div>
    </template>
  </q-table>
  <q-card-section class='bg-primary text-white'>
    {{ $t('MSG_ADVERTISEMENT_POSITION') }}
  </q-card-section>
</template>

<script setup lang='ts'>
import { utils, notif, notify } from 'src/npoolstore'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _notif = notif.useNotifStore()
const notifs = computed(() => _notif.notifs(undefined, undefined))

const username = ref('')
const displayNotifs = computed(() => notifs.value?.filter((el) =>
  el.EmailAddress.toLocaleLowerCase()?.includes(username.value?.toLowerCase()) ||
  el.PhoneNO.toLocaleLowerCase()?.includes(username.value?.toLowerCase())
))

onMounted(() => {
  if (notifs.value?.length === 0) {
    getAppNotifs(0, 500)
  }
})

const getAppNotifs = (offset: number, limit: number) => {
  _notif.getAppNotifs({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_NOTIFS'),
        Message: t('MSG_GET_NOTIFS_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<notif.Notif>) => {
    if (error || !rows.length) {
      return
    }
    getAppNotifs(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: notif.Notif) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: notif.Notif) => row.EntID
  },
  {
    name: 'Title',
    label: t('MSG_TITLE'),
    sortable: true,
    field: (row: notif.Notif) => row.Title
  },
  {
    name: 'Content',
    align: 'left',
    label: t('MSG_CONTENT'),
    sortable: true,
    field: (row: notif.Notif) => row.Content
  },
  {
    name: 'Channel',
    label: t('MSG_CHANNEL'),
    sortable: true,
    field: (row: notif.Notif) => row.Channel
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: notif.Notif) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: notif.Notif) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: notif.Notif) => row.PhoneNO
  },
  {
    name: 'EventType',
    label: t('MSG_EVENT_TYPE'),
    sortable: true,
    field: (row: notif.Notif) => row.EventType
  },
  {
    name: 'Notified',
    label: t('MSG_NOTIFIED'),
    sortable: true,
    field: (row: notif.Notif) => row.Notified
  },
  {
    name: 'LangID',
    label: t('MSG_LANG_ID'),
    sortable: true,
    field: (row: notif.Notif) => row.LangID
  },
  {
    name: 'Lang',
    label: t('MSG_LANG'),
    sortable: true,
    field: (row: notif.Notif) => row.Lang
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: notif.Notif) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: notif.Notif) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
