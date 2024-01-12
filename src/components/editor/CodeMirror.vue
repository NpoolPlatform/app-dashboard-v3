<template>
  <codemirror
    v-model='internalValue'
    :placeholder='placeholder'
    :autofocus='true'
    :indent-with-tab='true'
    :tab-size='2'
    :extensions='extensions'
    :style='{ height: height }'
  />
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'

export default defineComponent({
  name: 'CodeEditor',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  components: {
    Codemirror
  },
  setup (props, { emit }) {
    const internalValue = ref(props.modelValue)
    const extensions = [json(), oneDark]

    watch(internalValue, (newValue) => {
      emit('update:modelValue', newValue)
    })

    watch(() => props.modelValue, (newValue) => {
      internalValue.value = newValue
    })

    return {
      internalValue,
      extensions
    }
  }
})
</script>
