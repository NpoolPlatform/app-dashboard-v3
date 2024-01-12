<template>
  <q-select
    v-model='target'
    :options='displayLangs'
    options-selected-class='text-deep-orange'
    emit-value
    :label='myLabel'
    map-options
    @update:model-value='onUpdate'
    use-input
    clearable
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
import { getCategories } from 'src/api/category'
import { category } from 'src/npoolstore'
import { computed, defineEmits, defineProps, toRef, ref, onMounted } from 'vue'

interface Props {
  id: string
  updating?: boolean
  label?: string,
}

const props = defineProps<Props>()
const id = toRef(props, 'id')
const label = toRef(props, 'label')

const myLabel = computed(() => {
  return !label.value ? 'MSG_LANGUAGES' : label.value
})

const target = ref(id.value)

const _category = category.useCategoryStore()
const _categories = computed(() => _category.categories())
const categories = computed(() => Array.from(_categories.value).map((el) => {
  return {
    value: el.EntID,
    label: `${el.Name} | ${el.FullSlug}`
  }
}))
const displayLangs = ref(categories.value)

const onFilter = (val: string, doneFn: (callbackFn: () => void) => void) => {
  doneFn(() => {
    displayLangs.value = categories.value.filter((el) => {
      return el?.label?.toLowerCase().includes(val.toLowerCase())
    })
  })
}

const emit = defineEmits<{(e: 'update:id', id: string): void}>()
const onUpdate = () => {
  emit('update:id', target.value)
}

onMounted(() => {
  if (_categories.value.length === 0) {
    getCategories(0, 100)
  }
})
</script>
