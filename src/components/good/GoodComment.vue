<template>
  <q-table
    dense
    flat
    :title='$t("MSG_GOOD_COMMENTS")'
    :rows='comments'
    row-key='ID'
    :columns='columns'
    :rows-per-page-options='[100]'
  />
</template>

<script setup lang='ts'>
import { computed, onMounted } from 'vue'
import { goodcomment, sdk, utils } from 'src/npoolstore'

const comments = computed(() => sdk.comments.value)

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
