<template>
  <q-table
    dense
    flat
    :title='$t("MSG_DISPLAY_COLORS")'
    :rows='displayColors'
    :columns='goodDisplayColorColumns'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedName'
    @row-click='(evt, row, index) => onRowClick(row as appgooddisplaycolor.DisplayColor)'
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
        <q-input v-model='target.Color' :label='$t("MSG_COLOR")' />
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
import { sdk, utils, appgooddisplaycolor } from 'src/npoolstore'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))

const goodDisplayColors = computed(() => sdk.goodDisplayColors.value)
const color = ref('')
const displayColors = computed(() => {
  const _color = color.value?.toLowerCase()
  return goodDisplayColors.value?.filter((el) => el.Color?.toLowerCase().includes(_color))
})
const selectedName = ref([] as Array<appgooddisplaycolor.DisplayColor>)

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as appgooddisplaycolor.DisplayColor)

const onCreate = () => {
  updating.value = false
  showing.value = true
  target.value = {} as appgooddisplaycolor.DisplayColor
}

const onRowClick = (row: appgooddisplaycolor.DisplayColor) => {
  showing.value = true
  updating.value = true
  target.value = row
}

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as appgooddisplaycolor.DisplayColor
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = () => {
  submitting.value = true
  updating.value ? updateGoodDisplayColor() : createGoodDisplayColor()
}

const createGoodDisplayColor = () => {
  sdk.createGoodDisplayColor(target.value, (error:boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const updateGoodDisplayColor = () => {
  sdk.updateGoodDisplayColor(target.value, (error: boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const onDelete = () => {
  sdk.deleteGoodDisplayColor(selectedName.value?.[0], () => {
    // TODO
  })
}

onMounted(() => {
  if (!goodDisplayColors.value?.length) {
    sdk.getGoodDisplayColors(0, 0)
  }
})

const goodDisplayColorColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appgooddisplaycolor.DisplayColor) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: appgooddisplaycolor.DisplayColor) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: appgooddisplaycolor.DisplayColor) => row.GoodID
  },
  {
    name: 'AppGoodID',
    label: t('MSG_APP_GOOD_ID'),
    sortable: true,
    field: (row: appgooddisplaycolor.DisplayColor) => row.AppGoodID
  },
  {
    name: 'AppGoodName',
    label: t('MSG_APP_GOOD_NAME'),
    sortable: true,
    field: (row: appgooddisplaycolor.DisplayColor) => row.AppGoodName
  },
  {
    name: 'Color',
    label: t('MSG_COLOR'),
    sortable: true,
    field: (row: appgooddisplaycolor.DisplayColor) => row.Color
  },
  {
    name: 'Index',
    label: t('MSG_INDEX'),
    sortable: true,
    field: (row: appgooddisplaycolor.DisplayColor) => row.Index
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: appgooddisplaycolor.DisplayColor) => utils.formatTime(row?.CreatedAt)
  }
])
</script>
