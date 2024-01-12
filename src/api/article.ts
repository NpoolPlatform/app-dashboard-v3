import { article, notify } from 'src/npoolstore'

const _article = article.useArticleStore()
export const getArticles = (offset : number, limit: number) => {
  _article.getArticles({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_ARTICLES',
        Message: 'MSG_GET_ARTICLES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<article.Article>) => {
    if (error || !rows?.length) {
      return
    }
    getArticles(offset + limit, limit)
  })
}
