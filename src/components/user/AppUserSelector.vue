<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayUsers'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_USERS'
    map-options
    @update:model-value='onUpdate'
    use-input
    @filter='onFilter'
  >
    <template #option='scope'>
      <q-item v-bind='scope.itemProps'>
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>
<script setup lang='ts'>
import { user, sdk } from 'src/npoolstore'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'

interface Props {
  id: string
  updating?: boolean
}

const props = defineProps<Props>()
const id = toRef(props, 'id')
const updating = toRef(props, 'updating')
const target = ref(id.value)

const _user = user.useUserStore()
const users = computed(() => Array.from(_user.appUsers(undefined)).map((el) => {
  return {
    value: el.EntID,
    label: `${el.EmailAddress} | ${el.PhoneNO}`
  }
}))

const displayUsers = ref(users.value)
const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayUsers.value = users.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  if (!users.value?.length) {
    sdk.getUsers(0, 0)
  }
})
</script>
