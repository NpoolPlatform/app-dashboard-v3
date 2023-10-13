<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_COMMENTS")'
    :rows='comments'
    row-key='ID'
    :columns='(columns as any)'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedComments'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          :disable='selectedComments?.length == 0'
          @click='onDelete'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { goodcomment, sdk, utils } from 'src/npoolstore'
import { Comment } from 'src/npoolstore/good/good/comment'

const comments = computed(() => sdk.comments.value)
const selectedComments = ref([] as Array<Comment>)

const onDelete = () => {
  if (selectedComments.value?.length > 0) {
    sdk.deleteAppGoodComment(selectedComments.value?.[0], () => {
      // TODO
    })
  }
}
onMounted(() => {
  if (!comments.value?.length) {
    sdk.getComments(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: 'MSG_ID',
    sortable: true,
    field: (row: goodcomment.Comment) => row.ID
  },
  {
    name: 'AppID',
    label: 'MSG_APP_ID',
    sortable: true,
    field: (row: goodcomment.Comment) => row.AppID
  },
  {
    name: 'UserID',
    label: 'MSG_USER_ID',
    sortable: true,
    field: (row: goodcomment.Comment) => row.UserID
  },
  {
    name: 'Username',
    label: 'MSG_USER_NAME',
    sortable: true,
    field: (row: goodcomment.Comment) => row.Username
  },
  {
    name: 'EmailAddress',
    label: 'MSG_EMAIL_ADDRESS',
    sortable: true,
    field: (row: goodcomment.Comment) => row.EmailAddress
  },
  {
    name: 'GoodID',
    label: 'MSG_GOOD_ID',
    sortable: true,
    field: (row: goodcomment.Comment) => row.GoodID
  },
  {
    name: 'GoodID',
    label: 'MSG_APP_GOOD_ID',
    sortable: true,
    field: (row: goodcomment.Comment) => row.AppGoodID
  },
  {
    name: 'GoodName',
    label: 'MSG_GOOD_NAME',
    sortable: true,
    field: (row: goodcomment.Comment) => row.GoodName
  },
  {
    name: 'OrderID',
    label: 'MSG_ORDER_ID',
    sortable: true,
    field: (row: goodcomment.Comment) => row.OrderID
  },
  {
    name: 'Content',
    label: 'MSG_CONTENT',
    sortable: true,
    field: (row: goodcomment.Comment) => row.Content
  },
  {
    name: 'ReplyToID',
    label: 'MSG_REPLY_TO_ID',
    sortable: true,
    field: (row: goodcomment.Comment) => row.ReplyToID
  },
  {
    name: 'CreatedAt',
    label: 'MSG_CREATED_AT',
    sortable: true,
    field: (row: goodcomment.Comment) => utils.formatTime(row.CreatedAt, undefined)
  }
])
</script>
