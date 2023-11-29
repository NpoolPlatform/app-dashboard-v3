<template>
  <q-table
    dense
    flat
    :title='$t("MSG_WITHDRAW_REVIEWS")'
    :rows='displayReviews'
    row-key='ID'
    :loading='reviewLoading'
    :columns='columns'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as withdrawreview.WithdrawReview)'
  >
    <template #top-right>
      <q-input
        dense
        class='small'
        v-model='username'
        :label='$t("MSG_USERNAME")'
      />
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_EXPORT")'
        :disable='reviews.length === 0'
        @click='onExport'
      />
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
        <span>{{ $t('MSG_REVIEW_WITHDRAW_ADDRESSES') }}</span>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_EMAIL_ADDRESS') }}: {{ target?.EmailAddress }}</q-item-label>
        <q-item-label>{{ $t('MSG_PHONE_NO') }}: {{ target?.PhoneNO }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-item-label>{{ $t('MSG_COIN_TYPE_ID') }}: {{ target?.CoinTypeID }}</q-item-label>
        <q-item-label>{{ $t('MSG_COIN_NAME') }}: {{ target?.CoinName }}</q-item-label>
        <q-item-label>{{ $t('MSG_AMOUNT') }}: {{ target?.Amount }}</q-item-label>
        <q-item-label>{{ $t('MSG_MESSAGE') }}: {{ target?.Trigger }}</q-item-label>
        <q-item-label>{{ $t('MSG_STATE') }}: {{ target?.State }}</q-item-label>
      </q-card-section>
      <q-card-section>
        <q-input v-model='target.Message' :label='$t("MSG_COMMENT")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton :loading='true' :label='$t("MSG_APPROVE")' @click='onApprove' :disabled='target.State === reviewbase.ReviewState.Rejected' />
        <LoadingButton :loading='true' :label='$t("MSG_REJECT")' @click='onReject' :disabled='target.State === reviewbase.ReviewState.Rejected' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { withdrawreview, utils, notify, _locale, user, reviewbase } from 'src/npoolstore'
import saveAs from 'file-saver'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const review = withdrawreview.useWithdrawReviewStore()
const reviews = computed(() => review.reviews(undefined))

const username = ref('')
const displayReviews = computed(() => {
  return reviews.value.filter((el) => {
    const _username = username.value.toLowerCase()
    return el.EmailAddress.toLowerCase().includes(_username) || el.PhoneNO.toLowerCase().includes(_username)
  })
})

const reviewLoading = ref(false)

const locale = _locale.useLocaleStore()
const logined = user.useLocalUserStore()

const showing = ref(false)
const target = ref({} as withdrawreview.WithdrawReview)

const onMenuHide = () => {
  showing.value = false
  target.value = {} as withdrawreview.WithdrawReview
}

const onRowClick = (row: withdrawreview.WithdrawReview) => {
  target.value = { ...row }
  showing.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onApprove = (done: () => void) => {
  target.value.State = reviewbase.ReviewState.Approved
  updateReview(done)
}

const onReject = (done: () => void) => {
  if (target.value.Message.trim().length <= 0) {
    done()
    return
  }
  target.value.State = reviewbase.ReviewState.Rejected
  updateReview(done)
}

const updateReview = (done: () => void) => {
  review.updateWithdrawReview({
    ReviewID: target.value.ReviewID,
    LangID: locale.AppLang?.LangID,
    UserID: logined.User?.EntID,
    Message: target.value.Message,
    State: target.value.State,
    NotifyMessage: {
      Error: {
        Title: t('MSG_UPDATE_WITHDRAW_REVIEW'),
        Message: t('MSG_UPDATE_WITHDRAW_REVIEW_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
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

const onExport = () => {
  let result = 'WithdrawID,WithdrawState,ReviewID,UserID,KycState,EmailAddress,PhoneNO,Reviewer,ObjectType,Domain,Message,State,Trigger,Amount,FeeAmount,CoinTypeID,CoinName,CoinLogo,CoinUnit,Address,PlatformTransactionID,ChainTransactionID,CreatedAt,UpdatedAt'
  result += '\n'
  reviews.value.forEach((val) => {
    const { CreatedAt, UpdatedAt, ...values } = val
    const _createdAt = utils.formatTime(Number(CreatedAt))
    const _updatedAt = utils.formatTime(Number(UpdatedAt))
    result += Object.values(values).join(',') + `,${_createdAt}` + `,${_updatedAt}\n`
  })
  const blob = new Blob([result], { type: 'text/plain;charset=utf-8' })
  const filename = 'withdraw-reviews-' + utils.formatTime(new Date().getTime() / 1000) + '.csv'
  saveAs(blob, filename)
}

onMounted(() => {
  if (reviews.value.length === 0) {
    reviewLoading.value = true
    getWithdrawReviews(0, 100)
  }
})

const getWithdrawReviews = (offset: number, limit: number) => {
  review.getWithdrawReviews({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: t('MSG_GET_WITHDRAW_REVIEWS'),
        Message: t('MSG_GET_WITHDRAW_REVIEWS_FAIL'),
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<withdrawreview.WithdrawReview>) => {
    if (error || !rows?.length) {
      reviewLoading.value = false
      return
    }
    getWithdrawReviews(offset + limit, limit)
  })
}

const columns = computed(() => [
  {
    name: 'CoinTypeID',
    label: t('MSG_COIN_TYPE_ID'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.CoinTypeID
  },
  {
    name: 'CoinName',
    label: t('MSG_COIN_NAME'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.CoinName
  },
  {
    name: 'CoinLogo',
    label: t('MSG_COIN_LOGO'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.CoinLogo
  },
  {
    name: 'Amount',
    label: t('MSG_AMOUNT'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.Amount
  },
  {
    name: 'Address',
    label: t('MSG_ADDRESS'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.Address
  },
  {
    name: 'WithdrawState',
    label: t('MSG_WITHDRAW_STATE'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.WithdrawState
  },
  {
    name: 'State',
    label: t('MSG_STATE'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.State
  },
  {
    name: 'Trigger',
    label: t('MSG_TRIGGER'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.Trigger
  },
  {
    name: 'Message',
    label: t('MSG_MESSAGE'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.Message
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATED_AT'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => utils.formatTime(row.UpdatedAt)
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.UserID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.PhoneNO
  },
  {
    name: 'KycState',
    label: t('MSG_KYC_STATE'),
    sortable: true,
    field: (row: withdrawreview.WithdrawReview) => row.KycState
  }
])
</script>
