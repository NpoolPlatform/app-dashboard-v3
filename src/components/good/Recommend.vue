<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_RECOMMENDS")'
    :rows='recommends'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='columns'
    @row-click='(evt, row, index) => onRowClick(row as appgoodrecommend.Recommend)'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span> {{ target.GoodName }}</span>
      </q-card-section>
      <q-card-section>
        <AppUserSelector
          v-model:user-id='target.RecommenderID'
          :label='$t("MSG_RECOMMENDER_ID")'
        />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.HideReason' :label='$t("MSG_HIDE_REASON")' />
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.Hide' :label='$t("MSG_HIDE")' /></div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { sdk, appgoodrecommend, utils } from 'src/npoolstore'
import { useI18n } from 'vue-i18n'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AppUserSelector = defineAsyncComponent(() => import('src/components/user/AppUserSelector.vue'))

const recommends = sdk.goodRecommends
const target = ref({} as appgoodrecommend.Recommend)

const showing = ref(false)
const updating = ref(false)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: appgoodrecommend.Recommend) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  target.value = {} as appgoodrecommend.Recommend
  showing.value = false
}

const onSubmit = (done: () => void) => {
  updateUserRecommend(done)
}

const updateUserRecommend = (done: () => void) => {
  sdk.updateUserGoodRecommend({
    ...target.value
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

onMounted(() => {
  if (!recommends.value.length) {
    sdk.getGoodRecommends(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appgoodrecommend.Recommend) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: appgoodrecommend.Recommend) => row.EntID
  },
  {
    name: 'AppGoodID',
    label: t('MSG_APP_GOOD_ID'),
    sortable: true,
    field: (row: appgoodrecommend.Recommend) => row.AppGoodID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: appgoodrecommend.Recommend) => row.GoodName
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    sortable: true,
    field: (row: appgoodrecommend.Recommend) => row.Message
  },
  {
    name: 'RecommendIndex',
    label: t('MSG_INDEX'),
    sortable: true,
    field: (row: appgoodrecommend.Recommend) => row.RecommendIndex
  },
  {
    name: 'RecommenderID',
    label: t('MSG_RECOMMENDER_ID'),
    sortable: true,
    field: (row: appgoodrecommend.Recommend) => row.RecommenderID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: appgoodrecommend.Recommend) => row.EmailAddress
  },
  {
    name: 'Hide',
    label: t('MSG_HIDE'),
    sortable: true,
    field: (row: appgoodrecommend.Recommend) => row.Hide
  },
  {
    name: 'HideReason',
    label: t('MSG_HIDE_REASON'),
    sortable: true,
    field: (row: appgoodrecommend.Recommend) => row.HideReason
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: appgoodrecommend.Recommend) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: appgoodrecommend.Recommend) => utils.formatTime(row.UpdatedAt)
  }
])
</script>
