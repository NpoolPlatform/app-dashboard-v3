<template>
  <q-table
    dense
    flat
    :title='$t("MSG_DISPLAY_NAMES")'
    :rows='goodDisplayNames'
    :columns='goodDisplayNamesColumns'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedName'
    @row-click='(evt, row, index) => onRowClick(row as appgooddisplayname.DisplayName)'
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
          :disable='selectedName.length === 0'
          @click='onDelete'
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
        <AppGoodSelector v-if='!updating' v-model:app-good-id='target.AppGoodID' :label='$t("MSG_APP_GOOD")' />
        <q-input v-model='target.Name' :label='$t("MSG_NAME")' />
        <q-input v-model.number='target.Index' :label='$t("MSG_INDEX")' type='number' :min='0' />
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { sdk, utils, appgooddisplayname } from 'src/npoolstore'
import { computed, defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))

const goodDisplayNames = computed(() => sdk.goodDisplayNames.value)
const selectedName = ref([] as Array<appgooddisplayname.DisplayName>)

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as appgooddisplayname.DisplayName)

const onCreate = () => {
  updating.value = false
  showing.value = true
  target.value = {} as appgooddisplayname.DisplayName
}

const onRowClick = (row: appgooddisplayname.DisplayName) => {
  showing.value = true
  updating.value = true
  target.value = row
}

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as appgooddisplayname.DisplayName
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  submitting.value = true
  updating.value ? updateDisplayName() : createDisplayName()
}

const createDisplayName = () => {
  sdk.createGoodDisplayName(target.value, (error:boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const updateDisplayName = () => {
  sdk.updateGoodDisplayName(target.value, (error: boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const onDelete = () => {
  sdk.deleteGoodDisplayName(selectedName.value?.[0], () => {
    // TODO
  })
}
const goodDisplayNamesColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appgooddisplayname.DisplayName) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: appgooddisplayname.DisplayName) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: appgooddisplayname.DisplayName) => row.GoodID
  },
  {
    name: 'AppGoodID',
    label: t('MSG_APP_GOOD_ID'),
    sortable: true,
    field: (row: appgooddisplayname.DisplayName) => row.AppGoodID
  },
  {
    name: 'AppGoodName',
    label: t('MSG_APP_GOOD_NAME'),
    sortable: true,
    field: (row: appgooddisplayname.DisplayName) => row.AppGoodName
  },
  {
    name: 'Name',
    label: t('MSG_NAME'),
    sortable: true,
    field: (row: appgooddisplayname.DisplayName) => row.Name
  },
  {
    name: 'Index',
    label: t('MSG_INDEX'),
    sortable: true,
    field: (row: appgooddisplayname.DisplayName) => row.Index
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: appgooddisplayname.DisplayName) => utils.formatTime(row?.CreatedAt)
  }
])
</script>
