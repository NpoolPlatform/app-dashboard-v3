import { appgood, notify } from 'src/npoolstore'

const appGood = appgood.useAppGoodStore()

export const getAppGoods = (offset: number, limit: number) => {
  appGood.getAppGoods({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_GOODS',
        Message: 'MSG_GET_APP_GOODS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<appgood.Good>) => {
    if (error || !rows?.length) {
      return
    }
    getAppGoods(offset + limit, limit)
  })
}
