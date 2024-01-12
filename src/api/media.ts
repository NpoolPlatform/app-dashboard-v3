import { media, notify } from 'src/npoolstore'

const coin = media.useMediaStore()
export const getMedias = (offset : number, limit: number) => {
  coin.getMedias({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_MEDIAS',
        Message: 'MSG_GET_MEDIAS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<media.Media>) => {
    if (error || !rows?.length) {
      return
    }
    getMedias(offset + limit, limit)
  })
}
