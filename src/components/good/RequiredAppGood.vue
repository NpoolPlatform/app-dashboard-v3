<template>
  <q-table
    dense
    flat
    :title='$t("MSG_REQUIRED_APP_GOODS")'
    :rows='requireds'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedRequireds'
    @row-click='(evt, row, index) => onRowClick(row as requiredappgood.Required)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreateClick'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          @click='onDelete'
          :disable='selectedRequireds?.length === 0'
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
      <q-card-section v-if='!updating'>
        <div>{{ $t('MSG_SELECT_MAIN_APP_GOOD') }}</div>
        <AppGoodSelector v-model:app-good-id='target.MainAppGoodID' />
      </q-card-section>
      <q-card-section v-if='!updating'>
        <div>{{ $t('MSG_SELECT_REQUIRED_APP_GOOD') }}</div>
        <AppGoodSelector v-model:app-good-id='target.RequiredAppGoodID' />
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.Must' :label='$t("MSG_MUST")' /></div>
      </q-card-section>
      <q-item class='row'>
        <q-btn class='btn round' :loading='submitting' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn alt round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { onMounted, ref, defineAsyncComponent } from 'vue'
import { sdk, requiredappgood } from 'src/npoolstore'

const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))

const requireds = sdk.requiredAppGoods
const selectedRequireds = ref([] as Array<requiredappgood.Required>)

const showing = ref(false)
const updating = ref(false)
const submitting = ref(false)
const target = ref({} as requiredappgood.Required)

const onCreateClick = () => {
  showing.value = true
  updating.value = false
}

const onSubmit = () => {
  updating.value ? updateRequiredGood() : createRequiredGood()
}

const onCancel = () => {
  onMenuHide()
}

const createRequiredGood = () => {
  submitting.value = true
  sdk.createRequiredAppGood(target.value, (error:boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const updateRequiredGood = () => {
  submitting.value = true
  sdk.updateRequiredAppGood(target.value, (error:boolean) => {
    submitting.value = false
    if (error) return
    onMenuHide()
  })
}

const onRowClick = (required: requiredappgood.Required) => {
  showing.value = true
  updating.value = true
  target.value = required
}

const onMenuHide = () => {
  showing.value = false
  submitting.value = false
  target.value = {} as requiredappgood.Required
}

const onDelete = () => {
  sdk.deleteRequiredAppGood(selectedRequireds.value?.[0], () => {
    // NOTHING TODO
  })
}

onMounted(() => {
  if (!requireds.value.length) {
    sdk.getRequiredAppGoods(0, 0)
  }
})
</script>

<style lang='sass' scoped>
</style>
