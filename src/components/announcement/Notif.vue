<template>
  <div>{{ pagination }}</div>
  <q-table
    dense
    flat
    :title='$t("MSG_NOTIFS")'
    :rows='displayNotifs'
    row-key='ID'
    :rows-per-page-options='[0]'
    :columns='(columns as any)'
    v-model:pagination='pagination'
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
    <template #pagination>
      <div class='row q-mt-md'>
        <q-space />
        <q-pagination
          v-model='pagination.page'
          color='grey-8'
          :max='totalPages'
          :max-pages='10'
        />
      </div>
    </template>
  </q-table>
  <q-card-section class='bg-primary text-white'>
    {{ $t('MSG_ADVERTISEMENT_POSITION') }}
  </q-card-section>
</template>

<script setup lang='ts'>
import { utils, notif, sdk } from 'src/npoolstore'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const notifs = sdk.notifications
const totalRows = sdk.totalNotifications
const rowsPerPage = ref(20)
const totalPages = computed(() => Math.ceil(totalRows.value / rowsPerPage.value))
const pagination = ref({
  page: 1,
  rowsPerPage: rowsPerPage.value
} as Record<string, unknown>)
const selectedPage = computed(() => pagination.value.page as number)

const username = ref('')
const displayNotifs = computed(() => notifs.value?.filter((el) =>
  el.EmailAddress.toLocaleLowerCase()?.includes(username.value?.toLowerCase()) ||
  el.PhoneNO.toLocaleLowerCase()?.includes(username.value?.toLowerCase())
))

watch(selectedPage, () => {
  sdk.getNotifs(selectedPage.value - 1, 10)
  pagination.value.page = selectedPage.value
})

onMounted(() => {
  sdk.setNotificationPageLimit(rowsPerPage.value)
  if (!notifs.value.length) {
    sdk.getNotifs(undefined, 10)
  }
})

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
