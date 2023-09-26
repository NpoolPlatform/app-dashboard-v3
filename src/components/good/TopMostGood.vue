<template>
  <q-table
    dense
    flat
    :title='$t("MSG_TOPMOST_GOODS")'
    :rows='topMostGoods'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as topmostgood.TopMostGood)'
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
        <span>{{ $t('MSG_TOPMOST_GOOD') }}</span>
      </q-card-section>
      <q-card-section>
        <AppGoodSelector :label='$t("MSG_APP_GOODS")' v-model:id='target.AppGoodID' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Price' :label='$t("MSG_PRICE")' />
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
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { topmostgood, sdk } from 'src/npoolstore'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))

const topMostGoods = computed(() => sdk.topMostGoods.value)
const target = ref({} as topmostgood.TopMostGood)

const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  updating.value = false
  showing.value = true
}

const onRowClick = (row: topmostgood.TopMostGood) => {
  updating.value = true
  showing.value = true
  target.value = { ...row }
}

const onMenuHide = () => {
  target.value = {} as topmostgood.TopMostGood
  showing.value = false
}

const onCancel = () => {
  showing.value = false
}

const onSubmit = (done: () => void) => {
  let error = true
  if (updating.value) {
    sdk.updateTopMostGood(target.value, (err: boolean) => {
      error = err
    })
  } else {
    sdk.createTopMostGood(target.value, (err: boolean) => {
      error = err
    })
  }
  done()
  if (error) return
  onMenuHide()
}

onMounted(() => {
  if (!topMostGoods.value?.length) {
    sdk.getTopMostGoods(0, 0)
  }
})
</script>
