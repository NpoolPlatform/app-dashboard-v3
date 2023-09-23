<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ROLES")'
    :rows='roles'
    row-key='ID'
    :loading='roleLoading'
    :rows-per-page-options='[100]'
  />
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { role, notify } from 'src/npoolstore'
import { computed, onMounted, ref } from 'vue'

const _role = role.useRoleStore()
const roles = computed(() => _role.roles(undefined))
const roleLoading = ref(false)

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

onMounted(() => {
  if (!roles.value?.length) {
    roleLoading.value = true
    getRoles(0, 100)
  }
})

</script>
