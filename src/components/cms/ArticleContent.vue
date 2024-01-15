<template>
  <div class='row'>
    <div class='col' v-show='!updating'>
      <AppLanguagePicker v-model:id='target.TargetLangID' label='MSG_SELECT_LANGUAGE' />
    </div>
    <div class='col' v-show='updating'>
      <q-input outlined :disable='updating' v-model='target.ISO' :label='$t("MSG_SELECT_LANGUAGE")' />
    </div>
    <div class='col'>
      <CategoryPicker :disable='updating' v-model:id='target.CategoryID' :updating='updating' :label='$t("MSG_CATEGORY")' />
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
  </dev>
  <div class='row'>
    <div class='col'>
      <TinymceEditor v-model='target.Content' />
    </div>
    <div class='col'>
      <CodeMirror v-model='target.Content' />
    </div>
  </div>
</template>

<script setup lang='ts'>
import { article, notify, cmsbase } from 'src/npoolstore'
import { getArticles } from 'src/api/article'
import { computed, onMounted, defineAsyncComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const _article = article.useArticleStore()
const articles = computed(() => _article.articles())
const _articleContent = article.useArticleStore()

const TinymceEditor = defineAsyncComponent(() => import('src/components/editor/TinymceEditor.vue'))
const CodeMirror = defineAsyncComponent(() => import('src/components/editor/CodeMirror.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const CategoryPicker = defineAsyncComponent(() => import('src/components/cms/CategoryPicker.vue'))
const AppLanguagePicker = defineAsyncComponent(() => import('src/components/internationalization/AppLanguagePicker.vue'))

const articleContent = ref('')
const codeMirrorContent = ref('')

const showing = ref(false)
const updating = ref(false)
const isHistory = ref(false)
const articleID = ref('')
const currentArticle = computed(() => {
  return articles.value.filter((el) => el.EntID?.toLowerCase()?.includes?.(articleID.value?.toLowerCase()))
})

const target = ref({} as article.Article)

onMounted(() => {
  if (articles.value?.length === 0) {
    getArticles(0, 500)
  }
  if (router.currentRoute.value.query.id != null) {
    updating.value = true
    articleID.value = router.currentRoute.value.query.id
    target.value = { ...currentArticle.value[0] }
    getArticleContent()
  }
})

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
      console.log(info)
      codeMirrorContent.value = info
      target.value.Content = info
      articleContent.value = info
      if (!target.value.Latest) {
        isHistory.value = true
      }
    }
  })
}

watch(codeMirrorContent, (newValue) => {
  // 同步更新 codeMirrorContent
  articleContent.value = newValue
  target.value.Content = newValue
})

watch(articleContent, (newValue) => {
  // 同步更新 codeMirrorContent
  codeMirrorContent.value = newValue
  target.value.Content = newValue
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
