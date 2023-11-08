<template>
  <q-select
    :disable='!updating ? false : true'
    v-model='target'
    :options='displayAnnouncements'
    options-selected-class='text-deep-orange'
    emit-value
    label='MSG_ANNOUNCEMENTS'
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
import { announcement } from 'src/npoolstore'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'

interface Props {
  id: string
  updating?: boolean
}

const props = defineProps<Props>()
const id = toRef(props, 'id')
const updating = toRef(props, 'updating')
const target = ref(id.value)

const _announcement = announcement.useAnnouncementStore()
const announcements = computed(() => Array.from(_announcement.announcements(undefined)).map((el) => {
  return {
    value: el.EntID,
    label: `${el.ID} | ${el.EntID} |  ${el.Title} | ${el.AnnouncementType}`
  }
}))

const displayAnnouncements = ref(announcements.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayAnnouncements.value = announcements.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  if (announcements.value.length === 0) {
    getAppAnnouncements(0, 500)
  }
})

const getAppAnnouncements = (offset: number, limit: number) => {
  _announcement.getAppAnnouncements({
    Offset: offset,
    Limit: limit,
    Message: {
    }
  }, (error: boolean, rows: Array<announcement.Announcement>) => {
    if (error || !rows.length) {
      return
    }
    getAppAnnouncements(offset + limit, limit)
  })
}
</script>
