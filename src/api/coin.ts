import { appcoin, appcoindescription, notify } from 'src/npoolstore'

const coin = appcoin.useAppCoinStore()
export const getCoins = (offset : number, limit: number) => {
  coin.getAppCoins({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COINS',
        Message: 'MSG_GET_COINS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<appcoin.AppCoin>) => {
    if (error || !rows?.length) {
      return
    }
    getCoins(offset + limit, limit)
  })
}

const description = appcoindescription.useCoinDescriptionStore()
export const getCoinDescriptions = (offset : number, limit: number) => {
  description.getCoinDescriptions({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COIN_DESCRIPTIONS',
        Message: 'MSG_GET_COIN_DESCRIPTIONS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<appcoindescription.CoinDescription>) => {
    if (error || !rows?.length) {
      return
    }
    getCoinDescriptions(offset + limit, limit)
  })
}
