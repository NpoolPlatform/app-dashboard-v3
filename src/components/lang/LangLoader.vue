<script setup lang='ts'>
import { getMessages } from 'src/api/g11n'
import { applang, message, appgood, _locale, g11nbase } from 'src/npoolstore'
import { onMounted, computed } from 'vue'
import { getAppGoods } from 'src/api/good'

const lang = applang.useAppLangStore()
const langs = computed(() => lang.langs())

const _message = message.useMessageStore()
const messages = computed(() => _message.messages(undefined, undefined, undefined))

const appGood = appgood.useAppGoodStore()
const appGoods = computed(() => appGood.goods())

const locale = _locale.useLocaleStore()

onMounted(() => {
  if (langs.value.length === 0) {
    getAppLangs(0, 100)
  }
  if (messages.value.length === 0) {
    getMessages(0, 500)
  }
  if (appGoods.value.length === 0) {
    getAppGoods(0, 500)
  }
})

const getAppLangs = (offset: number, limit: number) => {
  lang.getAppLangs({
    Offset: offset,
    Limit: limit,
    Message: {
    }
  }, (error: boolean, rows: Array<g11nbase.AppLang>) => {
    if (error || rows.length === 0) {
      if (!error) {
        locale.setLangs(langs.value)
      }
      return
    }
    getAppLangs(offset + limit, limit)
  })
}
</script>
