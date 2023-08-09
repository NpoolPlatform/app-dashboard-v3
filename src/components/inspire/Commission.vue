<template>
  <q-table
    dense
    flat
    :title='$t("MSG_COMMISSION_SETTINGS")'
    :rows='displayCommissions'
    row-key='ID'
    :rows-per-page-options='[50]'
    @row-click='(evt, row, index) => onRowClick(row as commission.Commission)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CLONE")'
          @click='onClone'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_RECONCILE")'
          @click='onReconcile'
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
        <span>{{ updating ? $t('MSG_UPDATE_COMMISSION_SETTING') : $t('MSG_CREATE_COMMISSION_SETTING') }}</span>
      </q-card-section>
      <q-card-section v-if='!updating'>
        <AppGoodSelector v-model:id='target.GoodID' :label='$t("MSG_GOOD")' />
        <AppUserSelector v-model:id='target.UserID' />
        <q-select :options='commission.SettleTypes' v-model='target.SettleType' :label='$t("MSG_COMMISSION_SETTLE_TYPE")' />
        <q-select :options='commission.SettleAmountTypes' v-model='target.SettleAmountType' :label='$t("MSG_COMMISSION_SETTLE_AMOUNT_TYPE")' />
        <q-select :options='commission.SettleIntervals' v-model='target.SettleInterval' :label='$t("MSG_COMMISSION_SETTLE_INTERVAL")' />
        <q-select :options='commission.SettleModes' v-model='target.SettleMode' :label='$t("MSG_COMMISSION_SETTLE_MODE")' />
      </q-card-section>
      <q-card-section v-if='!updating'>
        <q-input type='number' v-model.number='target.AmountOrPercent' :label='$t("MSG_AMOUNT_OR_PERCENT")' suffix='$ | %' />
      </q-card-section>
      <q-card-section>
        <DateTimePicker v-model:date='target.StartAt' label='MSG_START_AT' />
        <q-input v-model.number='target.Threshold' :label='$t("MSG_THRESHOLD")' suffix='$' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model='showing1'
    @hide='onMenuHide1'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_CLONE_COMMISSION_SETTING') }}</span>
      </q-card-section>
      <q-card-section>
        <AppGoodSelector v-model:id='cloneCommission.FromGoodID' :label='$t("MSG_FROM_GOOD")' />
        <AppGoodSelector v-model:id='cloneCommission.ToGoodID' :label='$t("MSG_TO_GOOD")' />
        <q-input type='number' v-model='cloneCommission.ScalePercent' :label='$t("MSG_SCALE")' suffix='%' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_CLONE")' @click='onSubmit1' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel1' />
      </q-item>
    </q-card>
  </q-dialog>

  <!-- reconcile -->
  <q-dialog
    v-model='showing2'
    @hide='onMenuHide2'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_RECONCILE') }}</span>
      </q-card-section>
      <q-card-section>
        <AppUserSelector v-model:id='reconcileRequest.TargetUserID' />
        <AppGoodSelector v-model:id='reconcileRequest.GoodID' :label='$t("MSG_GOOD")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_RECONCILE")' @click='onSubmit2' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel2' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { NotifyType, useAdminReconcileStore } from 'npool-cli-v4'
import { ReconcileRequest } from 'npool-cli-v4/dist/store/admin/inspire/reconcile/types'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { commission } from 'src/teststore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const DateTimePicker = defineAsyncComponent(() => import('src/components/date/DateTimePicker.vue'))
const AppGoodSelector = defineAsyncComponent(() => import('src/components/good/AppGoodSelector.vue'))
const AppUserSelector = defineAsyncComponent(() => import('src/components/user/AppUserSelector.vue'))

const _commission = commission.useCommissionStore()
const commissions = computed(() => _commission.Commissions)

const username = ref('')
const displayCommissions = computed(() => commissions.value.filter((el) => {
  const name = username.value.toLowerCase()
  return el.EmailAddress.toLowerCase().includes(name) || el.PhoneNO.toLowerCase().includes(name)
}))

const target = ref({} as commission.Commission)
const showing = ref(false)
const updating = ref(false)

const onCreate = () => {
  target.value = {} as commission.Commission
  showing.value = true
  updating.value = false
}
const onRowClick = (row: commission.Commission) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as commission.Commission
}
const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  updating.value ? updateCommission(done) : createUserCommission(done)
}

const updateCommission = (done: () => void) => {
  _commission.updateCommission({
    ID: target.value.ID,
    StartAt: target.value.StartAt,
    Threshold: target.value.Threshold,
    Message: {
      Error: {
        Title: t('MSG_UPDATE_COMMISSION'),
        Message: t('MSG_UPDATE_COMMISSION_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_UPDATE_COMMISSION'),
        Message: t('MSG_UPDATE_COMMISSION_FAIL'),
        Popup: true,
        Type: NotifyType.Success
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
const createUserCommission = (done: () => void) => {
  _commission.createUserCommission({
    TargetUserID: target.value.UserID,
    StartAt: target.value.StartAt,
    GoodID: target.value.GoodID,
    AmountOrPercent: `${target.value.AmountOrPercent}`,
    SettleType: target.value.SettleType,
    SettleAmountType: target.value.SettleAmountType,
    SettleMode: target.value.SettleMode,
    Threshold: target.value.Threshold,
    Message: {
      Error: {
        Title: t('MSG_CREATE_COMMISSION'),
        Message: t('MSG_CREATE_COMMISSION_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_CREATE_COMMISSION'),
        Message: t('MSG_CREATE_COMMISSION_FAIL'),
        Popup: true,
        Type: NotifyType.Success
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
interface CloneCommission {
  FromGoodID: string;
  ToGoodID: string;
  Value: string;
  ScalePercent: string;
}

const cloneCommission = ref({} as CloneCommission)
const showing1 = ref(false)

const onMenuHide1 = () => {
  showing1.value = false
  cloneCommission.value = {} as CloneCommission
}

const onClone = () => {
  showing1.value = true
  cloneCommission.value = {} as CloneCommission
}

const onCancel1 = () => {
  onMenuHide1()
}

const onSubmit1 = (done: () => void) => {
  _commission.cloneCommissions({
    ...cloneCommission.value,
    Message: {
      Error: {
        Title: t('MSG_CLONE_COMMISSION'),
        Message: t('MSG_CLONE_COMMISSION_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_CLONE_COMMISSION'),
        Message: t('MSG_CLONE_COMMISSION_FAIL'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide1()
  })
}

const reconcileRequest = ref({} as ReconcileRequest)
const showing2 = ref(false)

const onMenuHide2 = () => {
  showing2.value = false
  reconcileRequest.value = {} as ReconcileRequest
}

const onCancel2 = () => {
  onMenuHide2()
}
const onReconcile = () => {
  showing2.value = true
  reconcileRequest.value = {} as ReconcileRequest
}

const reconcile = useAdminReconcileStore()
const onSubmit2 = (done: () => void) => {
  reconcile.reconcile({
    ...reconcileRequest.value,
    Message: {
      Error: {
        Title: t('MSG_RECONCILE'),
        Message: t('MSG_RECONCILE_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      },
      Info: {
        Title: t('MSG_RECONCILE'),
        Message: t('MSG_RECONCILE_FAIL'),
        Popup: true,
        Type: NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide2()
  })
}

onMounted(() => {
  if (_commission.Commissions.length === 0) {
    getAppCommissions(0, 100)
  }
})

const getAppCommissions = (offset: number, limit: number) => {
  _commission.getAppCommissions({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_COMMISSIONS_FAIL'),
        Popup: true,
        Type: NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<commission.Commission>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    getAppCommissions(offset + limit, limit)
  })
}
</script>
