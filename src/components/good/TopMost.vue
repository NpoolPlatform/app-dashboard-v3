<template>
  <q-table
    dense
    flat
    :title='$t("MSG_TOPMOST")'
    :rows='topMosts'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as topmost.TopMost)'
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
        <q-input v-model='target.Title' :label='$t("MSG_TITLE")' />
        <q-input v-model='target.Message' :label='$t("MSG_MESSAGE")' />
        <q-input v-model='target.ThresholdCredits' :label='$t("MSG_THRESHOLD_PAYMENT_CREDITS")' />
        <q-input v-model='target.ThresholdPaymentAmount' :label='$t("MSG_THRESHOLD_PAYMENT_AMOUNT")' />
        <q-input v-model.number='target.RegisterElapsedSeconds' :label='$t("MSG_REGISTER_ELAPSED_SECONDS")' />
        <q-input v-model.number='target.ThresholdPurchases' :label='$t("MSG_THRESHOLD_PURCHASES")' />
      </q-card-section>
      <q-card-section>
        <q-select
          label='MSG_POSTERS'
          filled
          v-model='target.Posters'
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          input-debounce='0'
          new-value-mode='add'
        />
      </q-card-section>
      <q-card-section>
        <div> <DateTimePicker v-model:date='target.StartAt' label='MSG_START_AT' /></div>
        <div> <DateTimePicker v-model:date='target.EndAt' label='MSG_END_AT' /></div>
      </q-card-section>
      <q-card-section>
        <div>
          <q-toggle dense v-model='target.KycMust' :label='$t("MSG_KYC_MUST")' />
        </div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <TopMostGood />
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { topmost, sdk } from 'src/npoolstore'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))
const TopMostGood = defineAsyncComponent(() => import('src/components/good/TopMostGood.vue'))

const topMosts = computed(() => sdk.topMosts.value)
const target = ref({} as topmost.TopMost)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: topmost.TopMost) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onMenuHide = () => {
  target.value = {} as topmost.TopMost
  showing.value = false
}

const onCancel = () => {
  showing.value = false
}

const onSubmit = (done: () => void) => {
  let error = true
  if (updating.value) {
    sdk.updateTopMost(target.value, (err: boolean) => {
      error = err
    })
  } else {
    sdk.createTopMost(target.value, (err: boolean) => {
      error = err
    })
  }
  done()
  if (error) return
  onMenuHide()
}

onMounted(() => {
  if (!topMosts.value?.length) {
    sdk.getTopMosts(0, 0)
  }
})
</script>
