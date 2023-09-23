<template>
  <q-table
    dense
    flat
    :title='$t("MSG_ROLE_USERS")'
    :rows='roleUsers'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedRoleUser'
    :loading='roleUserLoading'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='roleUsername'
          :label='$t("MSG_USERNAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_DELETE")'
          @click='onDeleteRoleUser'
          :disable='selectedRoleUser.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-table
    dense
    flat
    :title='$t("MSG_ROLES")'
    :rows='roles'
    row-key='ID'
    :loading='roleLoading'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedRole'
  />
  <q-table
    dense
    flat
    :title='$t("MSG_USERS")'
    :rows='displayUsers'
    row-key='ID'
    :loading='userLoading'
    :rows-per-page-options='[100]'
    selection='single'
    v-model:selected='selectedUser'
    :columns='columns'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='username'
          :label='$t("MSG_USERNAME")'
        />
        <q-btn
          dense
          flat
          class='btn flat'
          :label='$t("MSG_ADD")'
          @click='onAddRoleUser'
          :disable='selectedRole.length === 0 || selectedUser.length === 0'
        />
      </div>
    </template>
  </q-table>
  <q-card>
    <q-card-section class='bg-primary text-white'>
      {{ $t('MSG_ADVERTISEMENT_POSITION') }}
    </q-card-section>
  </q-card>
</template>

<script setup lang='ts'>
import { notify, user, utils, role } from 'src/npoolstore'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const _role = role.useRoleStore()
const roles = computed(() => _role.roles(undefined))
const roleLoading = ref(false)
const selectedRole = ref([] as Array<role.Role>)

const _user = user.useUserStore()
const users = computed(() => _user.appUsers(undefined))
const userLoading = ref(false)
const selectedUser = ref([] as Array<user.User>)
const username = ref('')
const displayUsers = computed(() => users.value.filter((user) => user.EmailAddress?.includes(username.value) || user.PhoneNO?.includes(username.value)))

const roleUsername = ref('')
const selectedRoleUser = ref([] as Array<role.AppRoleUser>)
const roleUsers = computed(() => currentRoleUsers.value.filter((el) => el.EmailAddress?.includes(roleUsername.value) || el.PhoneNO?.includes(roleUsername.value)))
const currentRoleUsers = computed(() => selectedRole.value.length > 0 ? _role.roleUsers(undefined, selectedRole.value[0].ID) : [])

const roleUserLoading = ref(false)
const getRoleUsers = (offset: number, limit: number) => {
  _role.getRoleUsers({
    Offset: offset,
    Limit: limit,
    RoleID: selectedRole.value[0]?.ID,
    Message: {
      Error: {
        Title: 'MSG_GET_ROLE_USERS',
        Message: 'MSG_GET_ROLE_USERS_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean, rows?: Array<role.AppRoleUser>) => {
    if (error || !rows?.length) {
      roleUserLoading.value = false
      return
    }
    getRoleUsers(offset + limit, limit)
  })
}

watch(selectedRole, () => {
  if (selectedRole.value.length > 0 && currentRoleUsers.value.length === 0) {
    roleUserLoading.value = true
    getRoleUsers(0, 500)
  }
})

const getUsers = (offset: number, limit: number) => {
  _user.getUsers({
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
  }, (error: boolean, rows?: Array<user.User>) => {
    if (error || !rows?.length) {
      userLoading.value = false
      return
    }
    getUsers(offset + limit, limit)
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

onMounted(() => {
  if (!roles.value?.length) {
    roleLoading.value = true
    getRoles(0, 100)
  }

  if (!users.value?.length) {
    userLoading.value = true
    getUsers(0, 500)
  }
})

const onAddRoleUser = () => {
  if (selectedRole.value.length === 0 || selectedUser.value.length === 0) {
    return
  }
  _role.createRoleUser({
    TargetUserID: selectedUser.value[0].ID,
    RoleID: selectedRole.value[0].ID,
    Message: {
      Error: {
        Title: 'MSG_ADD_ROLE_USER',
        Message: 'MSG_ADD_ROLE_USER_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

const onDeleteRoleUser = () => {
  if (selectedRoleUser.value.length === 0) {
    return
  }

  _role.deleteRoleUser({
    ID: selectedRoleUser.value[0].ID,
    TargetUserID: selectedRoleUser.value[0].UserID,
    Message: {
      Error: {
        Title: 'MSG_DELETE_ROLE_USER',
        Message: 'MSG_DELETE_ROLE_USER_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    // TODO
  })
}

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })
const columns = computed(() => [
  {
    name: 'AppID',
    label: t('MSG_APP_ID'),
    sortable: true,
    field: (row: user.User) => row.AppID
  },
  {
    name: 'UserID',
    label: t('MSG_USER_ID'),
    sortable: true,
    field: (row: user.User) => row.ID
  },
  {
    name: 'EmailAddress',
    label: t('MSG_EMAIL_ADDRESS'),
    sortable: true,
    field: (row: user.User) => row.EmailAddress
  },
  {
    name: 'PhoneNO',
    label: t('MSG_PHONE_NO'),
    sortable: true,
    field: (row: user.User) => row.PhoneNO
  },
  {
    name: 'Roles',
    label: t('MSG_ROLES'),
    sortable: true,
    field: (row: user.User) => row.Roles?.join(',')
  },
  {
    name: 'KYC_STATE',
    label: t('MSG_KYC_STATE'),
    sortable: true,
    field: (row: user.User) => row.State
  },
  {
    name: 'IDNUMBER',
    label: t('MSG_IDNUMBER'),
    sortable: true,
    field: (row: user.User) => row.IDNumber
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: user.User) => utils.formatTime(row.CreatedAt)
  }
])

</script>
