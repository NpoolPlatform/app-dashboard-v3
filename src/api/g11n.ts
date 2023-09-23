import { applang, appcountry, notify, g11nbase, message } from 'src/npoolstore'

const country = appcountry.useAppCountryStore()
export const getCountries = (offset: number, limit: number) => {
  country.getAppCountries({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_COUNTRIES',
        Message: 'MSG_GET_COUNTRIES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<appcountry.Country>) => {
    if (error || !rows.length) {
      return
    }
    getCountries(offset + limit, limit)
  })
}

const appLang = applang.useAppLangStore()
export const getAppLangs = (offset: number, limit: number) => {
  appLang.getAppLangs({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_LANGUAGES',
        Message: 'MSG_GET_APP_LANGUAGES_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows: Array<g11nbase.AppLang>) => {
    if (error || rows.length === 0) {
      return
    }
    getAppLangs(offset + limit, limit)
  })
}

const _message = message.useMessageStore()
export const getMessages = (offset: number, limit: number) => {
  _message.getMessages({
    Disabled: false,
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_APP_MESSAGES',
        Message: 'MSG_GET_APP_MESSAGES_FAIL',
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<g11nbase.Message>) => {
    if (error || !rows?.length) {
      return
    }
    getMessages(offset + limit, limit)
  })
}
