<template>
  <q-table
    dense
    flat
    :title='$t("MSG_SMS_TEMPLATES")'
    :rows='smsTemplates'
    row-key='ID'
    :loading='smsLoading'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as smsnotiftemplate.Template)'
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
        <span>{{ $t('MSG_CREATE_SMS_TEMPLATE') }}</span>
      </q-card-section>
      <q-card-section>
        <LanguagePicker v-model:language='target.LangID' :updating='updating' />
      </q-card-section>
      <q-card-section>
        <q-select :options='basetypes.EventTypes' v-model='target.UsedFor' :disable='updating' :label='$t("MSG_USED_FOR")' />
        <q-input v-model='target.Subject' :label='$t("MSG_SUBJECT")' />
        <q-input v-model='target.Message' :label='$t("MSG_BODY")' type='textarea' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton :loading='true' :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card-section class='bg-primary text-white'>
    {{ $t('MSG_ADVERTISEMENT_POSITION') }}
  </q-card-section>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { basetypes, notify, smsnotiftemplate } from 'src/npoolstore'

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const LanguagePicker = defineAsyncComponent(() => import('src/components/lang/LanguagePicker.vue'))

const sms = smsnotiftemplate.useSMSTemplateStore()
const smsTemplates = computed(() => sms.templates())
const smsLoading = ref(false)

const showing = ref(false)
const updating = ref(false)

const target = ref({} as smsnotiftemplate.Template)

const onMenuHide = () => {
  target.value = {} as unknown as smsnotiftemplate.Template
}

const onRowClick = (template: smsnotiftemplate.Template) => {
  target.value = { ...template }
  showing.value = true
  updating.value = true
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  showing.value = false
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  updating.value ? updateSMSTemplate(done) : createSMSTemplate(done)
}
onMounted(() => {
  if (smsTemplates?.value?.length === 0) {
    getSMSTemplates(0, 500)
  }
})

const getSMSTemplates = (offset: number, limit: number) => {
  sms.getSMSTemplates({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_EMAIL_TEMPLATES',
        Message: 'MSG_GET_EMAIL_TEMPLATES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<smsnotiftemplate.Template>) => {
    if (error || !rows?.length) {
      smsLoading.value = false
      return
    }
    getSMSTemplates(offset + limit, limit)
  })
}

const createSMSTemplate = (done: () => void) => {
  sms.createSMSTemplate({
    TargetLangID: target.value.LangID,
    UsedFor: target.value.UsedFor,
    Subject: target.value.Subject,
    Message: target.value.Message,
    NotifyMessage: {
      Error: {
        Title: 'MSG_CREATE_SMS_TEMPLATE',
        Message: 'MSG_CREATE_SMS_TEMPLATE_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean) => {
    done()
    if (!error) {
      onCancel()
    }
  })
}
const updateSMSTemplate = (done: () => void) => {
  sms.updateSMSTemplate({
    TargetLangID: target.value.LangID,
    ID: target.value.ID,
    Subject: target.value.Subject,
    Message: target.value.Message,
    NotifyMessage: {
      Error: {
        Title: 'MSG_UPDATE_SMS_TEMPLATE',
        Message: 'MSG_UPDATE_SMS_TEMPLATE_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean) => {
    done()
    if (!error) {
      onCancel()
    }
  })
}
</script>
