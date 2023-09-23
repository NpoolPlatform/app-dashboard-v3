import { notify, order } from 'src/npoolstore'

const _order = order.useOrderStore()

export const getAppOrders = (offset: number, limit: number) => {
  _order.getAppOrders({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_ORDERS',
        Message: 'MSG_GET_ORDERS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<order.Order>) => {
    if (error || !rows?.length) {
      return
    }
    getAppOrders(offset + limit, limit)
  })
}
