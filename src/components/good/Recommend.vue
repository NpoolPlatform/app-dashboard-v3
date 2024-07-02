<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOODS")'
    :rows='appPowerRentals'
    :columns='appPowerRentalsColumns'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedAppPowerRental'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_RECOMMENDS")'
    :rows='recommends'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedRecommend'
    @row-click='(evt, row, index) => onRowClick(row as appgoodrecommend.Recommend)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          :disable='selectedAppPowerRental.length === 0'
          @click='onCreate'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          :disable='selectedRecommend.length === 0'
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
        <span>{{ $t('MSG_CREATE_RECOMMEND') }}</span>
      </q-card-section>
      <q-card-section>
        <span> {{ updating? target.GoodName : selectedAppPowerRental[0]?.GoodName }}</span>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.RecommendIndex' :label='$t("MSG_RECOMMEND_INDEX")' />
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
import { useI18n } from 'vue-i18n'
import { sdk, utils, apppowerrental, appgoodrecommend } from 'src/npoolstore'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const appPowerRentals = computed(() => sdk.appPowerRentals.value)
const selectedAppPowerRental = ref([] as Array<apppowerrental.AppPowerRental>)

const recommends = sdk.goodRecommends

const target = ref({} as appgoodrecommend.Recommend)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
  target.value.AppGoodID = selectedAppPowerRental.value[0]?.AppGoodID
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
  updating.value ? updateRecommend(done) : createRecommend(done)
}

const createRecommend = (done: () => void) => {
  sdk.createGoodRecommend({
    ...target.value
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const updateRecommend = (done: () => void) => {
  sdk.updateGoodRecommend({
    ...target.value
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const selectedRecommend = ref([] as Array<appgoodrecommend.Recommend>)
const onDelete = () => {
  sdk.deleteGoodRecommend(selectedRecommend.value?.[0], () => {
    // TODO
  })
}

onMounted(() => {
  if (!recommends.value.length) {
    sdk.getGoodRecommends(0, 0)
  }
})

const appPowerRentalsColumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.EntID
  },
  {
    name: 'GOODID',
    label: t('MSG_GOODID'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.GoodID
  },
  {
    name: 'GOODNAME',
    label: t('MSG_GOODNAME'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.GoodName
  },
  {
    name: 'GOODTYPE',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.GoodType
  },
  {
    name: 'VISIBLE',
    label: t('MSG_VISIBLE'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.Visible
  },
  {
    name: 'BENEFITTYPE',
    label: t('MSG_BENEFITTYPE'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => row.BenefitType
  },
  {
    name: 'ServiceStartAt',
    label: t('MSG_SERVICE_START_AT'),
    sortable: true,
    field: (row: apppowerrental.AppPowerRental) => utils.formatTime(row?.ServiceStartAt)
  }
])
</script>
