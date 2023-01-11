<template>
  <q-table
    dense
    flat
    :title='$t("MSG_REGISTRATION")'
    :rows='displayRegistrations'
    row-key='ID'
    :rows-per-page-options='[10]'
    @row-click='(evt, row, index) => onRowClick(row as Registration)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='invitee'
          :label='$t("MSG_INVITEE")'
        />
        <q-input
          dense
          flat
          class='small'
          v-model='inviter'
          :label='$t("MSG_INVITER")'
        />
      </div>
    </template>
  </q-table>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_UPDATE_COMMISSION_SETTING') }}</span>
      </q-card-section>
      <q-card-section>
        <!-- <AppUserSelector v-model:id='target.UserID' /> -->
      </q-card-section>
      <q-card-section>
        <AppUserSelector v-model:id='target.InviterID' :label='$t("MSG_INVITER")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotifyType, useAdminRegistrationStore, Registration } from 'npool-cli-v4'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppUserSelector from '../user/AppUserSelector.vue'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const registration = useAdminRegistrationStore()
const registrations = computed(() => registration.Registrations.Registrations)

const invitee = ref('')
const inviter = ref('')
const displayRegistrations = computed(() => registrations.value.filter((el) => {
  const _invitee = invitee.value.toLowerCase()
  const _inviter = inviter.value.toLowerCase()
  let display = true
  if (_invitee.length > 0 && _invitee.length > 0) {
    display = (el.InviteeEmailAddress.toLowerCase().includes(_invitee) || el.InviteePhoneNO.toLowerCase().includes(_invitee)) &&
      (el.InviterEmailAddress.toLowerCase().includes(_inviter) || el.InviterPhoneNO.toLowerCase().includes(_inviter))
    return display
  }

  if (_invitee.length > 0) {
    display = el.InviteeEmailAddress.toLowerCase().includes(_invitee) || el.InviteePhoneNO.toLowerCase().includes(_invitee)
    return display
  }
  if (_inviter.length > 0) {
    display = el.InviterEmailAddress.toLowerCase().includes(_inviter) || el.InviterPhoneNO.toLowerCase().includes(_inviter)
    return display
  }

  return display
}))

const target = ref({} as Registration)
const showing = ref(false)
const updating = ref(false)

const onRowClick = (row: Registration) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as Registration
}

const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  registration.updateRegistration({
    ID: target.value.ID,
    InviterID: target.value.InviterID,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_REGISTRATION'),
        Message: t('MSG_UPDATE_REGISTRATION_FAIL'),
        Popup: true,
        Type: NotifyType.Error
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

onMounted(() => {
  if (registrations.value.length === 0) {
    getRegistrations(0, 500)
  }
})

const getRegistrations = (offset: number, limit: number) => {
  registration.getRegistrations({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_REGISTRATIONS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<Registration>) => {
    if (error || rows.length < limit) {
      return
    }
    getRegistrations(offset + limit, limit)
  })
}
</script>