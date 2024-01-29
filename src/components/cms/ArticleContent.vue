<template>
  <div class='row'>
    <div class='col' v-show='!updating'>
      <AppLanguagePicker v-model:id='target.TargetLangID' label='MSG_SELECT_LANGUAGE' />
    </div>
    <div class='col' v-show='updating'>
      <q-input outlined :disable='updating' v-model='target.ISO' :label='$t("MSG_SELECT_LANGUAGE")' />
    </div>
    <div class='col' v-show='!updating'>
      <CategoryPicker v-model:id='target.CategoryID' :updating='updating' :label='$t("MSG_CATEGORY")' />
    </div>
    <div class='col' v-show='updating'>
      <q-input outlined :disable='updating' v-model='target.CategoryName' :label='$t("MSG_CATEGORY")' />
    </div>
    <div class='col' v-show='updating'>
      <q-select
        :options='cmsbase.ArticleStatuss'
        v-model='target.Status'
        :disable='isHistory'
        :label='$t("MSG_ARTICLE_STATUS")'
      />
    </div>
  </div>
  <div class='row'>
    <div class='col'>
      <q-input outlined v-model='target.Title' :disable='isHistory' :label='$t("MSG_ARTICLE_TITLE")' />
    </div>
    <div class='col'>
      <q-input outlined v-model='target.Subtitle' :disable='isHistory' :label='$t("MSG_ARTICLE_SUBTITLE")' />
    </div>
    <div class='col'>
      <q-input
        outlined
        v-model='target.Digest'
        type='textarea'
        :disable='isHistory'
        :label='$t("MSG_ARTICLE_DIGEST")'
      />
    </div>
  </div>
  <dev class='row'>
    <LoadingButton loading :label='$t("MSG_SUBMIT")' :disable='isHistory' @click='onSubmit' />
    <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
    <q-btn class='btn round' @click='openPreview' :label='$t("MSG_PREVIEW")' />
  </dev>
  <div class='row'>
    <div class='col'>
      <TinymceEditor v-model='articleContent' />
    </div>
    <div class='col'>
      <q-btn :label='$t("MSG_ARTICLE_CONTENT")' />
      <CodeMirror v-model='codeMirrorContent' />
      <br>
      <q-btn :label='$t("MSG_ARTICLE_CSS_CONTENT")' />
      <CodeMirror v-model='cssContent' />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { article, notify, cmsbase } from 'src/npoolstore'
import { computed, onMounted, defineAsyncComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const TinymceEditor = defineAsyncComponent(() => import('src/components/editor/TinymceEditor.vue'))
const CodeMirror = defineAsyncComponent(() => import('src/components/editor/CodeMirror.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const CategoryPicker = defineAsyncComponent(() => import('src/components/cms/CategoryPicker.vue'))
const AppLanguagePicker = defineAsyncComponent(() => import('src/components/internationalization/AppLanguagePicker.vue'))

const router = useRouter()

const _article = article.useArticleStore()
const _articleContent = article.useArticleStore()

const articleContent = ref('')
const codeMirrorContent = ref('')
const cssContent = ref('')

const showing = ref(false)
const updating = ref(false)
const isHistory = ref(false)
const articleID = ref('')

const target = ref({} as article.Article)

const openPreview = () => {
  const htmlContent = target.value.Content
  const blob = new Blob([htmlContent], { type: 'text/html; charset=utf-8' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
  URL.revokeObjectURL(url)
}

onMounted(() => {
  if (router.currentRoute.value.query.id != null) {
    updating.value = true
    articleID.value = router.currentRoute.value.query.id
    getArticle(articleID.value)
  }
})

const getArticle = (id: string) => {
  _article.getArticle({
    EntID: id,
    Message: {
      Error: {
        Title: 'MSG_GET_ARTICLE',
        Message: 'MSG_GET_ARTICLE_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_GET_ARTICLE',
        Message: 'MSG_GET_ARTICLE_SUCCESS',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean, row: article.Article) => {
    if (error) {
      console.log(error)
    } else {
      target.value = row
      getArticleContent()
    }
  })
}

const onSubmit = (done: () => void) => {
  updating.value ? updateArticle(done) : createArticle(done)
}

const onCancel = () => {
  onMenuHide()
  void router.push({ path: '/cms/article' })
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as article.Article
}

const createArticle = (done: () => void) => {
  _article.createArticle({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_ARTICLE',
        Message: 'MSG_CREATE_ARTICLE_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_ARTICLE',
        Message: 'MSG_CREATE_ARTICLE_SUCCESS',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      console.log(error)
    } else {
      onMenuHide()
      void router.push({ path: '/cms/article' })
    }
  })
}

const updateTarget = computed(() => {
  return {
    ID: target.value?.ID,
    EntID: target.value?.EntID,
    AppID: target.value?.AppID,
    CategoryID: target.value?.CategoryID,
    Title: target.value?.Title,
    Subtitle: target.value?.Subtitle,
    Digest: target.value?.Digest,
    Status: target.value?.Status,
    Content: target.value?.Content,
    UpdateContent: true
  }
})

const updateArticle = (done: () => void) => {
  _article.updateArticle({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_ARTICLE',
        Message: 'MSG_UPDATE_ARTICLE_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean) => {
    done()
    if (error) {
      console.log(error)
    } else {
      onMenuHide()
      void router.push({ path: '/cms/article' })
    }
  })
}

const initContent = () => {
  const htmlCode = target.value.Content

  const bodyMatch = /<body>(.*?)<\/body>/s.exec(htmlCode)
  const styleMatch = /<style>(.*?)<\/style>/s.exec(htmlCode)

  const body = bodyMatch ? bodyMatch[1] : ''
  const style = styleMatch ? styleMatch[1] : ''
  codeMirrorContent.value = body
  articleContent.value = body
  cssContent.value = style
  if (body === '') {
    codeMirrorContent.value = htmlCode
    articleContent.value = htmlCode
  }
}

const getArticleContent = () => {
  _articleContent.getArticleContent({
    ID: target.value?.ID,
    EntID: target.value?.EntID,
    Message: {
      Error: {
        Title: 'MSG_GET_ARTICLE_CONTENT',
        Message: 'MSG_GET_ARTICLE_CONTENT_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, info: string) => {
    if (error) {
      return ''
    } else {
      target.value.Content = info
      initContent()
      if (!target.value.Latest) {
        isHistory.value = true
      }
    }
  })
}

const setArticleContent = () => {
  target.value.Content = '<head><style>' + cssContent.value + '</style></head>' + '<body>' + codeMirrorContent.value + '</body>'
}

watch(codeMirrorContent, (newValue) => {
  articleContent.value = newValue
  setArticleContent()
})

watch(articleContent, (newValue) => {
  codeMirrorContent.value = newValue
  setArticleContent()
})

watch(cssContent, () => {
  setArticleContent()
})

</script>

<style lang='sass' scoped>
.row
  display: flex
  height: 100%

.col
  flex: 1
  margin: 10px
</style>
