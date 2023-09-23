import { coupon, notify } from 'src/npoolstore'

const _coupon = coupon.useCouponStore()
export const getCoupons = (offset: number, limit: number, type?: coupon.CouponType) => {
  _coupon.getCoupons({
    Offset: offset,
    Limit: limit,
    CouponType: type,
    Message: {
      Error: {
        Title: 'MSG_GET_COUPONS',
        Message: 'MSG_GET_COUPONS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<coupon.Coupon>) => {
    if (error) {
      return
    }
    if (!rows?.length) {
      return
    }
    getCoupons(offset + limit, limit, type)
  })
}
