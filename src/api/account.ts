import { useraccount, notify, useraccountbase } from 'src/npoolstore'

const account = useraccount.useUserAccountStore()

export const getAppUserAccounts = (offset: number, limit: number) => {
  account.getAppUserAccounts({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_WITHDRAW_ADDRESS_REVIEWS',
        Message: 'MSG_GET_WITHDRAW_ADDRESS_REVIEWS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<useraccountbase.Account>) => {
    if (error || !rows?.length) {
      return
    }
    getAppUserAccounts(offset + limit, limit)
  })
}
