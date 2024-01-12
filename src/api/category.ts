import { category, notify } from 'src/npoolstore'

const coin = category.useCategoryStore()
export const getCategories = (offset : number, limit: number) => {
  coin.getCategories({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_CATEGORIES',
        Message: 'MSG_GET_CATEGORIES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<category.Category>) => {
    if (error || !rows?.length) {
      return
    }
    getCategories(offset + limit, limit)
  })
}
