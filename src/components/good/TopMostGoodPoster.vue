<template>
  <q-table
    dense
    flat
    :title='$t("MSG_TOPMOST_GOOD_POSTER")'
    :rows='topMostGoodPosters'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as topmostgoodposter.Poster)'
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
        <span>{{ $t('MSG_TOPMOST') }}</span>
      </q-card-section>
      <q-card-section>
        <TopMostSelector v-model:id='target.TopMostID' v-if='!updating' :label='$t("MSG_TOP_MOST")' />
        <q-input v-model='target.Poster' :label='$t("MSG_POSTER")' />
        <q-input v-model.number='target.Index' :label='$t("MSG_INDEX")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>
<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { topmostgoodposter, sdk, utils } from 'src/npoolstore'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const TopMostSelector = defineAsyncComponent(() => import('src/components/good/TopMostSelector.vue'))

const topMostGoodPosters = computed(() => sdk.topMostGoodPosters.value)
const target = ref({} as topmostgoodposter.Poster)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: topmostgoodposter.Poster) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onMenuHide = () => {
  target.value = {} as topmostgoodposter.Poster
  showing.value = false
}

const onCancel = () => {
  showing.value = false
}

const onSubmit = (done: () => void) => {
  if (updating.value) {
    sdk.updateTopMostGoodPoster(target.value, (error: boolean) => {
      done()
      if (error) return
      onMenuHide()
    })
  } else {
    sdk.createTopMostGoodPoster(target.value, (error: boolean) => {
      done()
      if (error) return
      onMenuHide()
    })
  }
}

onMounted(() => {
  if (!topMostGoodPosters.value?.length) {
    sdk.getTopMostGoodPosters(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: 'MSG_ID',
    sortable: true,
    field: (row: topmostgoodposter.Poster) => row.ID
  },
  {
    name: 'EntID',
    label: 'MSG_ENT_ID',
    sortable: true,
    field: (row: topmostgoodposter.Poster) => row.EntID
  },
  {
    name: 'AppID',
    label: 'MSG_APP_ID',
    sortable: true,
    field: (row: topmostgoodposter.Poster) => row.AppID
  },
  {
    name: 'AppGoodName',
    label: 'MSG_APP_GOOD_NAME',
    sortable: true,
    field: (row: topmostgoodposter.Poster) => row.AppGoodName
  },
  {
    name: 'TopMostType',
    label: 'MSG_TOP_MOST_TYPE',
    sortable: true,
    field: (row: topmostgoodposter.Poster) => row.TopMostType
  },
  {
    name: 'Poster',
    label: 'MSG_POSTER',
    sortable: true,
    field: (row: topmostgoodposter.Poster) => row.Poster
  },
  {
    name: 'Index',
    label: 'MSG_INDEX',
    sortable: true,
    field: (row: topmostgoodposter.Poster) => row.Index
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    sortable: true,
    field: (row: topmostgoodposter.Poster) => utils.formatTime(row.CreatedAt, undefined)
  }
])
</script>
