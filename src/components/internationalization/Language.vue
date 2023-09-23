<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_LANGUAGES")'
    :rows='langs'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as g11nbase.AppLang)'
  />
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_UPDATE_APP_LANGUAGE') }}</span>
      </q-card-section>
      <q-card-section>
        <div><q-input v-model='target.Lang' :label='$t("MSG_LANG")' /></div>
        <div><q-input v-model='target.Logo' :label='$t("MSG_LOGO")' /></div>
        <div><q-input v-model='target.Name' :label='$t("MSG_NAME")' /></div>
        <div><q-input v-model='target.Short' :label='$t("MSG_SHORT")' /></div>
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.Main' :label='$t("MSG_MAIN_LANGUAGE")' /></div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { applang, notify, g11nbase } from 'src/npoolstore'
import { computed, ref, defineAsyncComponent } from 'vue'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const lang = applang.useAppLangStore()
const langs = computed(() => lang.langs(undefined))

const target = ref({} as g11nbase.AppLang)
const showing = ref(false)
const updating = ref(false)

const onRowClick = (row: g11nbase.AppLang) => {
  showing.value = true
  updating.value = true
  target.value = { ...row }
}

const onMenuHide = () => {
  showing.value = false
  target.value = { Main: false } as g11nbase.AppLang
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  lang.updateAppLang({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_APP_LANGUAGE',
        Message: 'MSG_UPDATE_APP_LANGUAGE_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPDATE_APP_LANGUAGE',
        Message: 'MSG_UPDATE_APP_LANGUAGE_SUCCESS',
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

</script>
