<template>
  <q-table
    dense
    flat
    :title='$t("MSG_CHANNELS")'
    :rows='channels'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedNotifChannels'
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
          :disable='selectedNotifChannels?.length === 0'
          @click='onDelete(selectedNotifChannels?.[0])'
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
        <span>{{ $t('MSG_CHANNEL') }}</span>
      </q-card-section>
      <q-card-section>
        <q-select
          :options='notifbase.NotifChannels'
          v-model='target.Channel'
          :label='$t("MSG_CHANNEL_TYPE")'
        />
        <q-select
          :options='basetypes.EventTypes'
          v-model='target.EventType'
          :label='$t("MSG_USED_FOR")'
        />
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
import { utils, notify, notifbase, notifchannel, basetypes } from 'src/npoolstore'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const channel = notifchannel.useNotifChannelStore()
const channels = computed(() => {
  const rows = channel.channels(undefined)
  return rows.sort((a, b) => a.EventType.localeCompare(b.EventType, 'zh-CN'))
})

const target = ref({} as notifchannel.TNotifChannel)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onMenuHide = () => {
  target.value = {} as notifchannel.TNotifChannel
  showing.value = false
}

const onCancel = () => {
  onMenuHide()
}

onMounted(() => {
  if (channels.value?.length === 0) {
    getAppNotifChannels(0, 100)
  }
})

const getAppNotifChannels = (offset: number, limit: number) => {
  channel.getAppNotifChannels({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_CHANNELS'),
        Message: t('MSG_GET_CHANNELS_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<notifchannel.TNotifChannel>) => {
    if (error || rows.length < limit) {
      return
    }
    getAppNotifChannels(offset + limit, limit)
  })
}

const onSubmit = (done: () => void) => {
  createNotifChannel(done)
}

const createNotifChannel = (done: () => void) => {
  channel.createNotifChannel({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_CHANNEL',
        Message: 'MSG_CREATE_CHANNEL_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_CHANNEL',
        Message: 'MSG_CREATE_CHANNEL_SUCCESS',
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

const selectedNotifChannels = ref([] as Array<notifchannel.TNotifChannel>)
const onDelete = (row: notifchannel.TNotifChannel) => {
  channel.deleteNotifChannel({
    ID: row.ID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_CHANNEL',
        Message: 'MSG_DELETE_CHANNEL_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_CHANNEL',
        Message: 'MSG_DELETE_CHANNEL_SUCCESS',
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
    field: (row: notifchannel.TNotifChannel) => row.ID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: notifchannel.TNotifChannel) => row.AppID
  },
  {
    name: 'EventType',
    label: t('MSG_EVENT_TYPE'),
    sortable: true,
    field: (row: notifchannel.TNotifChannel) => row.EventType
  },
  {
    name: 'Channel',
    label: t('MSG_CHANNEL'),
    sortable: true,
    field: (row: notifchannel.TNotifChannel) => row.Channel
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: notifchannel.TNotifChannel) => utils.formatTime(row.CreatedAt)
  }
])
</script>
