<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_ARTICLES")'
    :rows='displayArticles'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as article.Article)'
    selection='single'
    v-model:selected='selectedArticles'
    :columns='columns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='title'
          :label='$t("MSG_ARTICLE_TITLE")'
        />
        <q-toggle dense v-model='showHistory' :label='$t("MSG_SHOW_HISTORY")' size='xs' />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_CREATE")'
          @click='onCreate'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_EDIT_CONTENT")'
          :disable='selectedArticles?.length === 0'
          @click='onUpdate(selectedArticles?.[0])'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          :disable='selectedArticles?.length === 0'
          @click='onDelete(selectedArticles?.[0])'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_ACLS")'
    :rows='articleACLs'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedACLs'
    :columns='aclcolumns'
    :loading='articleACLLoading'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          :disable='selectedACLs?.length === 0'
          @click='onACLDelete(selectedACLs?.[0])'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_ROLES")'
    :rows='displayRoles'
    row-key='ID'
    :loading='roleLoading'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedRole'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='rolename'
          :label='$t("MSG_ROLENAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_ADD")'
          @click='onAddACL'
          :disable='selectedRole.length === 0 || selectedArticles.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <q-input :disable='updating' v-model='target.ISO' :label='$t("MSG_SELECT_LANGUAGE")' />
        <CategoryPicker v-model:id='target.CategoryID' :disable='updating' :updating='updating' :label='$t("MSG_CATEGORY")' />
        <q-select
          :options='cmsbase.ArticleStatuss'
          v-model='target.Status'
          :disable='!target.Latest'
          :label='$t("MSG_ARTICLE_STATUS")'
        />
        <q-input v-model='target.Title' :disable='!target.Latest' :label='$t("MSG_ARTICLE_TITLE")' />
        <q-input v-model='target.Subtitle' :disable='!target.Latest' :label='$t("MSG_ARTICLE_SUBTITLE")' />
        <q-input v-model='target.Digest' type='textarea' :disable='!target.Latest' :label='$t("MSG_ARTICLE_DIGEST")' />
        <q-toggle
          :label='`ACLEnabled: ${target.ACLEnabled}`'
          v-model='target.ACLEnabled'
          :disable='!target.Latest'
        />
        <q-input v-model='currentArticleURL' type='textarea' :disable='!target.Latest' :label='$t("MSG_ARTICLE_URL")' />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' :disable='!target.Latest' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card-section class='bg-primary text-white'>
    {{ $t('MSG_ADVERTISEMENT_POSITION') }}
  </q-card-section>
</template>

<script setup lang='ts'>
import { article, acl, notify, cmsbase, role } from 'src/npoolstore'
import { getArticles } from 'src/api/article'
import { computed, onMounted, ref, defineAsyncComponent, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Cookies } from 'quasar'
const router = useRouter()
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))
const CategoryPicker = defineAsyncComponent(() => import('src/components/cms/CategoryPicker.vue'))

const _role = role.useRoleStore()
const roles = computed(() => _role.roles(undefined))
const rolename = ref('')
const displayRoles = computed(() => {
  return roles.value.filter((el) => el.Role?.toLowerCase()?.includes?.(rolename.value?.toLowerCase()) || el.EntID?.toLowerCase()?.includes?.(rolename.value?.toLowerCase()))
})

const roleLoading = ref(false)
const selectedRole = ref([] as Array<role.Role>)

const _article = article.useArticleStore()
const articles = computed(() => _article.articles())

const _acl = acl.useACLStore()

const showHistory = ref(false)

const apiURL = ref('')
const currentArticleURL = ref('')

const initApiURL = () => {
  const devURL = 'https://api.development.npool.top/api'
  apiURL.value = process.env.DEV ? devURL : Cookies.get('X-Base-URL')
}

const selectedACLs = ref([] as Array<acl.ArticleACL>)
const articleACLLoading = ref(false)
const getACLs = (offset: number, limit: number) => {
  _acl.getArticleACLs({
    Offset: offset,
    Limit: limit,
    ArticleKey: selectedArticles.value[0]?.ArticleKey,
    Message: {
      Error: {
        Title: 'MSG_GET_ARTICLE_ACLS',
        Message: 'MSG_GET_ARTICLE_ACLS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<acl.ACL>) => {
    if (error || !rows?.length) {
      articleACLLoading.value = false
      return
    }
    getACLs(offset + limit, limit)
  })
}

const title = ref('')

const displayArticles = computed(() => {
  if (showHistory.value) {
    return articles.value.filter((el) => el.Title?.toLowerCase()?.includes?.(title.value?.toLowerCase()) || el.EntID?.toLowerCase()?.includes?.(title.value?.toLowerCase()))
  }
  return articles.value.filter((el) => el.Latest && (el.Title?.toLowerCase()?.includes?.(title.value?.toLowerCase()) || el.EntID?.toLowerCase()?.includes?.(title.value?.toLowerCase())))
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: article.Article) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: article.Article) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: article.Article) => row.AppID
  },
  {
    name: 'CategoryID',
    label: t('MSG_CategoryID'),
    sortable: true,
    field: (row: article.Article) => row.CategoryID
  },
  {
    name: 'ISO',
    label: t('MSG_ISO'),
    sortable: true,
    field: (row: article.Article) => row.ISO
  },
  {
    name: 'Title',
    label: t('MSG_ARTICLE_TITLE'),
    sortable: true,
    field: (row: article.Article) => row.Title
  },
  {
    name: 'Subtitle',
    label: t('MSG_ARTICLE_SUBTITLE'),
    sortable: true,
    field: (row: article.Article) => row.Subtitle
  },
  {
    name: 'Status',
    label: t('MSG_ARTICLE_STATUS'),
    sortable: true,
    field: (row: article.Article) => row.Status
  },
  {
    name: 'ACLEnabled',
    label: t('MSG_ARTICLE_ACLENABLED'),
    sortable: true,
    field: (row: article.Article) => row.ACLEnabled
  },
  {
    name: 'ArticleKey',
    label: t('MSG_ARTICLE_KEY'),
    sortable: true,
    field: (row: article.Article) => row.ArticleKey
  },
  {
    name: 'Version',
    label: t('MSG_ARTICLE_VERSION'),
    sortable: true,
    field: (row: article.Article) => row.Version
  },
  {
    name: 'Latest',
    label: t('MSG_ARTICLE_LATEST'),
    sortable: true,
    field: (row: article.Article) => row.Latest
  },
  {
    name: 'ContentURL',
    label: t('MSG_ARTICLE_URL'),
    sortable: true,
    field: (row: article.Article) => row.ContentURL
  }
])

const aclcolumns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: acl.ACL) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: acl.ACL) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: acl.ACL) => row.AppID
  },
  {
    name: 'RoleID',
    label: t('MSG_ROLEID'),
    sortable: true,
    field: (row: acl.ACL) => row.RoleID
  },
  {
    name: 'Role',
    label: t('MSG_ROLE'),
    sortable: true,
    field: (row: acl.ACL) => row.Role
  },
  {
    name: 'ArticleKey',
    label: t('MSG_ARTICLEKEY'),
    sortable: true,
    field: (row: acl.ACL) => row.ArticleKey
  }
])

const showing = ref(false)
const updating = ref(false)
const target = ref({} as article.Article)

const selectedArticles = ref([] as Array<article.Article>)
const onDelete = (row: article.Article) => {
  _article.deleteArticle({
    ID: row.ID,
    EntID: row.EntID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_ARTICLE',
        Message: 'MSG_DELETE_ARTICLE_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_ARTICLE',
        Message: 'MSG_DELETE_ARTICLE_SUCCESS',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, () => {
    // TODO
  })
}

const onCreate = () => {
  void router.push({ path: 'article/content' })
}

const onUpdate = (row: article.Article) => {
  void router.push({ path: 'article/content', query: { id: row.EntID } })
}

const onRowClick = (row: article.Article) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
  currentArticleURL.value = apiURL.value + article.API.GET_CONTENT + target.value.ContentURL
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as article.Article
}

const onSubmit = (done: () => void) => {
  updateArticle(done)
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
    ACLEnabled: target.value?.ACLEnabled
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
      return
    }
    onMenuHide()
  })
}

const onACLDelete = (row: acl.ACL) => {
  _acl.deleteACL({
    ID: row.ID,
    EntID: row.EntID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_ACL',
        Message: 'MSG_DELETE_ACL_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_ACL',
        Message: 'MSG_DELETE_ACL_SUCCESS',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, () => {
    // TODO
  })
}

const getRoles = (offset: number, limit: number) => {
  _role.getRoles({
    Offset: offset,
    Limit: limit,
    Message: {
      Error: {
        Title: 'MSG_GET_USERS',
        Message: 'MSG_GET_USERS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<role.Role>) => {
    if (error || !rows?.length) {
      roleLoading.value = false
      return
    }
    getRoles(offset + limit, limit)
  })
}

const onAddACL = () => {
  if (selectedRole.value.length === 0 || selectedArticles.value.length === 0) {
    return
  }
  _acl.createACL({
    ArticleKey: selectedArticles.value[0].ArticleKey,
    RoleID: selectedRole.value[0].EntID,
    Message: {
      Error: {
        Title: 'MSG_ADD_ACL',
        Message: 'MSG_ADD_ACL_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

onMounted(() => {
  initApiURL()
  if (!roles.value?.length) {
    roleLoading.value = true
    getRoles(0, 100)
  }
  if (articles.value?.length === 0) {
    getArticles(0, 500)
  }
})

const currentArticleACLs = computed(() => selectedArticles.value.length > 0 ? _acl.articleACLs(undefined, selectedArticles.value[0].ArticleKey) : [])

const articleACLs = computed(() => currentArticleACLs.value)

watch(selectedArticles, () => {
  if (selectedArticles.value.length > 0 && currentArticleACLs.value.length === 0) {
    articleACLLoading.value = true
    getACLs(0, 500)
  }
})

</script>
