<template>
  <q-table
    dense
    flat
    :title='$t("MSG_EMAIL_TEMPLATES")'
    :rows='emails'
    row-key='ID'
    :loading='emailLoading'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as MyEmailTemplate)'
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
        <span>{{ $t('MSG_CREATE_EMAIL_TEMPLATE') }}</span>
      </q-card-section>
      <q-card-section>
        <LanguagePicker v-model:language='myTarget.LangID' :updating='updating' />
      </q-card-section>
      <q-card-section>
        <q-input v-model='myTarget.DefaultToUsername' :label='$t("MSG_DEFAULT_TO_USERNAME")' />
        <q-select :options='basetypes.EventTypes' :disable='updating' v-model='myTarget.UsedFor' :label='$t("MSG_USED_FOR")' />
        <q-input v-model='myTarget.Sender' :label='$t("MSG_SENDER")' />
        <q-input v-model='myTarget.ReplyTos' :label='$t("MSG_REPLY_TOS_COMMA")' />
        <q-input v-model='myTarget.CCTos' :label='$t("MSG_CC_TOS_COMMA")' />
        <q-input v-model='myTarget.Subject' :label='$t("MSG_SUBJECT")' />
        <q-input v-model='myTarget.Body' :label='$t("MSG_BODY")' type='textarea' />
      </q-card-section>
      <q-item class='row'>
        <!-- <q-btn class='btn round alt' :label='$t("MSG_SUBMIT")' @click='onSubmit' /> -->
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
import { basetypes, notify, emailnotiftemplate, utils } from 'src/npoolstore'
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const LanguagePicker = defineAsyncComponent(() => import('src/components/lang/LanguagePicker.vue'))

interface MyEmailTemplate {
  ID: string
  LangID: string
  DefaultToUsername: string
  UsedFor: basetypes.EventType
  Sender: string
  ReplyTos: string
  CCTos: string
  Subject: string
  Body: string
}

const email = emailnotiftemplate.useEmailTemplateStore()
const emailTemplates = computed(() => email.templates())
const emails = computed(() => Array.from(emailTemplates.value).map((el) => {
  return {
    ID: el.ID,
    LangID: el.LangID,
    DefaultToUsername: el.DefaultToUsername,
    UsedFor: el.UsedFor,
    Sender: el.Sender,
    ReplyTos: el.ReplyTos.join(','),
    CCTos: el.CCTos.join(','),
    Subject: el.Subject,
    Body: el.Body
  } as MyEmailTemplate
}))
const emailLoading = ref(false)

const showing = ref(false)
const updating = ref(false)

const myTarget = ref({} as MyEmailTemplate)

const onMenuHide = () => {
  showing.value = false
  myTarget.value = {} as MyEmailTemplate
}

const onRowClick = (template: MyEmailTemplate) => {
  myTarget.value = { ...template }
  showing.value = true
  updating.value = true
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  updating.value ? updateEmailTemplate(done) : createEmailTemplate(done)
}

onMounted(() => {
  if (emailTemplates?.value?.length === 0) {
    getEmailTemplates(0, 500)
  }
})

const getEmailTemplates = (offset: number, limit: number) => {
  email.getEmailTemplates({
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
  }, (error: boolean, rows?: Array<emailnotiftemplate.Template>) => {
    if (error || !rows?.length) {
      emailLoading.value = false
      return
    }
    getEmailTemplates(offset + limit, limit)
  })
}

const updateEmailTemplate = (done: () => void) => {
  let flag = false
  if (myTarget.value?.ReplyTos?.length > 0) {
    myTarget.value?.ReplyTos?.split(',')?.forEach((el) => {
      const emails = el.match(/[\d\w]+\b@[a-zA-ZA-z0-9]+\.[a-z]+/g)
      emails?.forEach((al) => {
        if (!utils.validateEmailAddress(al)) {
          console.log('invalid email address', al)
          flag = true
        }
      })
    })
  }
  if (myTarget.value?.CCTos?.length > 0) {
    myTarget.value?.CCTos?.split(',')?.forEach((el) => {
      const emails = el.match(/[\d\w]+\b@[a-zA-ZA-z0-9]+\.[a-z]+/g)
      emails?.forEach((al) => {
        if (!utils.validateEmailAddress(al)) {
          console.log('invalid email address', al)
          flag = true
        }
      })
    })
  }
  if (flag) {
    done()
    return
  }
  email.updateEmailTemplate({
    TargetLangID: myTarget.value.LangID,
    ID: myTarget.value.ID,
    Sender: myTarget.value.Sender,
    ReplyTos: myTarget.value?.ReplyTos?.length === 0 ? [] : myTarget.value?.ReplyTos?.split(','),
    CCTos: myTarget.value?.CCTos?.length === 0 ? [] : myTarget.value?.CCTos?.split(','),
    Subject: myTarget.value?.Subject,
    Body: myTarget.value?.Body,
    DefaultToUsername: myTarget.value?.DefaultToUsername,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_EMAIL_TEMPLATE',
        Message: 'MSG_UPDATE_EMAIL_TEMPLATE_FAIL',
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

const createEmailTemplate = (done: () => void) => {
  let flag = false
  if (myTarget.value?.ReplyTos?.length > 0) {
    myTarget.value?.ReplyTos?.split(',')?.forEach((el) => {
      const emails = el.match(/[\d\w]+\b@[a-zA-ZA-z0-9]+\.[a-z]+/g)
      emails?.forEach((al) => {
        if (!utils.validateEmailAddress(al)) {
          console.log('invalid email address', al)
          flag = true
        }
      })
    })
  }
  if (myTarget.value?.CCTos?.length > 0) {
    myTarget.value?.CCTos?.split(',')?.forEach((el) => {
      const emails = el.match(/[\d\w]+\b@[a-zA-ZA-z0-9]+\.[a-z]+/g)
      emails?.forEach((al) => {
        if (!utils.validateEmailAddress(al)) {
          console.log('invalid email address', al)
          flag = true
        }
      })
    })
  }
  if (flag) {
    done()
    return
  }
  email.createEmailTemplate({
    TargetLangID: myTarget.value.LangID,
    UsedFor: myTarget.value.UsedFor,
    Sender: myTarget.value.Sender,
    ReplyTos: myTarget.value?.ReplyTos?.length === 0 ? [] : myTarget.value?.ReplyTos?.split(','),
    CCTos: myTarget.value?.CCTos?.length === 0 ? [] : myTarget.value?.CCTos?.split(','),
    Subject: myTarget.value?.Subject,
    Body: myTarget.value?.Body,
    DefaultToUsername: myTarget.value?.DefaultToUsername,
    Message: {
      Error: {
        Title: 'MSG_CREATE_EMAIL_TEMPLATE',
        Message: 'MSG_CREATE_EMAIL_TEMPLATE_FAIL',
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
