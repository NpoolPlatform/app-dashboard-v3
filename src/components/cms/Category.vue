<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_CATEGORIES")'
    :rows='displayCategories'
    row-key='ID'
    :rows-per-page-options='[100]'
    @row-click='(evt, row, index) => onRowClick(row as category.Category)'
    selection='single'
    v-model:selected='selectedCategories'
    :columns='columns'
  >
    <template #top-right>
      <div class='row indent flat'>
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
          :label='$t("MSG_DELETE")'
          :disable='selectedCategories?.length === 0'
          @click='onDelete(selectedCategories?.[0])'
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
        <q-input v-model='target.Index' :label='$t("MSG_CATEGORY_INDEX")' />
        <q-input v-model='target.Name' :label='$t("MSG_CATEGORY_NAME")' />
        <CategoryPicker v-model:id='target.ParentID' :updating='updating' label='MSG_CATEGORY_PARENTID' />
        <q-input v-model='target.Slug' :label='$t("MSG_CATEGORY_SLUG")' />
      </q-card-section>
      <q-card-section>
        <div><q-toggle dense v-model='target.Enabled' :label='$t("MSG_CATEGORY_ENABLED")' /><span class='tip'>Enabled: {{ target.Enabled }}</span></div>
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
  <q-card-section class='bg-primary text-white'>
    {{ $t('MSG_ADVERTISEMENT_POSITION') }}
  </q-card-section>
</template>

<script setup lang='ts'>
import { category, notify } from 'src/npoolstore'
import { getCategories } from 'src/api/category'
import { computed, onMounted, ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const CategoryPicker = defineAsyncComponent(() => import('src/components/cms/CategoryPicker.vue'))

const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const _category = category.useCategoryStore()
const categories = computed(() => _category.categories())

const name = ref('')

const displayCategories = computed(() => {
  return categories.value.filter((el) => el.Name?.toLowerCase()?.includes?.(name.value?.toLowerCase()) || el.EntID?.toLowerCase()?.includes?.(name.value?.toLowerCase()))
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: category.Category) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: category.Category) => row.EntID
  },
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: category.Category) => row.AppID
  },
  {
    name: 'ParentID',
    label: t('MSG_CATEGORY_PARENTID'),
    sortable: true,
    field: (row: category.Category) => row.ParentID
  },
  {
    name: 'Index',
    label: t('MSG_CATEGORY_INDEX'),
    sortable: true,
    field: (row: category.Category) => row.Index
  },
  {
    name: 'Name',
    label: t('MSG_CATEGORY_NAME'),
    sortable: true,
    field: (row: category.Category) => row.Name
  },
  {
    name: 'Slug',
    label: t('MSG_CATEGORY_SLUG'),
    sortable: true,
    field: (row: category.Category) => row.Slug
  },
  {
    name: 'FullSlug',
    label: t('MSG_CATEGORY_FULLSLUG'),
    sortable: true,
    field: (row: category.Category) => row.FullSlug
  },
  {
    name: 'Enabled',
    label: t('MSG_CATEGORY_ENABLED'),
    sortable: true,
    field: (row: category.Category) => row.Enabled
  }
])

const showing = ref(false)
const updating = ref(false)
const target = ref({} as category.Category)

const selectedCategories = ref([] as Array<category.Category>)
const onDelete = (row: category.Category) => {
  _category.deleteCategory({
    ID: row.ID,
    EntID: row.EntID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_CATEGORY',
        Message: 'MSG_DELETE_CATEGORY_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_DELETE_CATEGORY',
        Message: 'MSG_DELETE_CATEGORY_SUCCESS',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, () => {
    // TODO
  })
}

const onCreate = () => {
  showing.value = true
  updating.value = false
}

const onRowClick = (row: category.Category) => {
  target.value = { ...row }
  showing.value = true
  updating.value = true
}

const onCancel = () => {
  onMenuHide()
}

const onMenuHide = () => {
  showing.value = false
  target.value = {} as category.Category
}

const onSubmit = (done: () => void) => {
  updating.value ? updateCategory(done) : createCategory(done)
}

const updateTarget = computed(() => {
  return {
    ID: target.value?.ID,
    EntID: target.value?.EntID,
    AppID: target.value?.AppID,
    ParentID: target.value?.ParentID,
    Name: target.value?.Name,
    Slug: target.value?.Slug,
    Enabled: target.value?.Enabled,
    Index: target.value?.Index
  }
})

const createCategory = (done: () => void) => {
  _category.createCategory({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_CREATE_CATEGORY',
        Message: 'MSG_CREATE_CATEGORY_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_CREATE_CATEGORY',
        Message: 'MSG_CREATE_CATEGORY_SUCCESS',
        Popup: true,
        Type: notify.NotifyType.Success
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

const updateCategory = (done: () => void) => {
  _category.updateCategory({
    ...updateTarget.value,
    Message: {
      Error: {
        Title: 'MSG_UPDATE_CATEGORY',
        Message: 'MSG_UPDATE_CATEGORY_FAIL',
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

onMounted(() => {
  if (categories.value?.length === 0) {
    getCategories(0, 500)
  }
})

</script>
