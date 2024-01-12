<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_MEDIAS")'
    :rows='displayCategories'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as media.Media)'
    selection='single'
    v-model:selected='selectedCategories'
    :columns='columns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          :disable='selectedCategories?.length === 0'
          @click='onDelete(selectedCategories?.[0])'
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
        <q-input v-model='target.Name' :label='$t("MSG_MEDIA_NAME")' />
        <q-input v-model='currentImgURL' type='textarea' :label='$t("MSG_MEDIA_URL")' />
        <q-img
          :src='currentImgURL'
          :ratio='1'
        />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card-section class='bg-primary text-white'>
    {{ $t('MSG_ADVERTISEMENT_POSITION') }}
  </q-card-section>
</template>

<script setup lang='ts'>
import { media, notify } from 'src/npoolstore'
import { getMedias } from 'src/api/media'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Cookies } from 'quasar'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const _media = media.useMediaStore()
const medias = computed(() => _media.medias())

const name = ref('')
const currentImgURL = ref('')

const displayCategories = computed(() => {
  return medias.value.filter((el) => el.Name?.toLowerCase()?.includes?.(name.value?.toLowerCase()) || el.EntID?.toLowerCase()?.includes?.(name.value?.toLowerCase()))
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: media.Media) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: media.Media) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: media.Media) => row.AppID
  },
  {
    name: 'Name',
    label: t('MSG_MEDIA_NAME'),
    sortable: true,
    field: (row: media.Media) => row.Name
  },
  {
    name: 'MediaURL',
    label: t('MSG_url'),
    sortable: true,
    field: (row: media.Media) => row.MediaURL
  }
])

const showing = ref(false)
const updating = ref(false)
const target = ref({} as media.Media)
const apiURL = ref('')

const initApiURL = () => {
  const devURL = 'https://api.development.npool.top/api'
  apiURL.value = process.env.DEV ? devURL : Cookies.get('X-Base-URL')
}

const selectedCategories = ref([] as Array<media.Media>)
const onDelete = (row: media.Media) => {
  _media.deleteMedia({
    ID: row.ID,
    EntID: row.EntID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_CATEGORY',
        Message: 'MSG_DELETE_CATEGORY_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_CATEGORY',
        Message: 'MSG_DELETE_CATEGORY_SUCCESS',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, () => {
    // TODO
  })
}

const onRowClick = (row: media.Media) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
  currentImgURL.value = apiURL.value + media.API.GET_MEDIA + '/' + target.value.AppID + '/' + target.value.MediaURL
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as media.Media
}

onMounted(() => {
  initApiURL()
  if (medias.value?.length === 0) {
    getMedias(0, 500)
  }
})

</script>
