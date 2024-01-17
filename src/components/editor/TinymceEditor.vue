<template>
  <div>
    <editor
      :init='editorInit'
      @input='handleEditorInput'
      v-model='internalValue'
    />
  </div>
</template>

<script lang="ts">
import { media, notify } from 'src/npoolstore'
import { defineComponent, ref, watch } from 'vue'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/tinymce.min.js'
import 'tinymce/plugins/accordion/plugin.min.js'
import 'tinymce/plugins/advlist/plugin.min.js'
import 'tinymce/plugins/anchor/plugin.min.js'
import 'tinymce/plugins/autolink/plugin.min.js'
import 'tinymce/plugins/autoresize/plugin.min.js'
import 'tinymce/plugins/autosave/plugin.min.js'
import 'tinymce/plugins/charmap/plugin.min.js'
import 'tinymce/plugins/code/plugin.min.js'
import 'tinymce/plugins/codesample/plugin.min.js'
import 'tinymce/plugins/directionality/plugin.min.js'
import 'tinymce/plugins/emoticons/plugin.min.js'
import 'tinymce/plugins/emoticons/js/emojis.js'
import 'tinymce/plugins/fullscreen/plugin.min.js'
import 'tinymce/plugins/help/plugin.min.js'
import 'tinymce/plugins/image/plugin.min.js'
import 'tinymce/plugins/importcss/plugin.min.js'
import 'tinymce/plugins/insertdatetime/plugin.min.js'
import 'tinymce/plugins/link/plugin.min.js'
import 'tinymce/plugins/lists/plugin.min.js'
import 'tinymce/plugins/media/plugin.min.js'
import 'tinymce/plugins/nonbreaking/plugin.min.js'
import 'tinymce/plugins/pagebreak/plugin.min.js'
import 'tinymce/plugins/preview/plugin.min.js'
import 'tinymce/plugins/quickbars/plugin.min.js'
import 'tinymce/plugins/save/plugin.min.js'
import 'tinymce/plugins/searchreplace/plugin.min.js'
import 'tinymce/plugins/table/plugin.min.js'
import 'tinymce/plugins/template/plugin.min.js'
import 'tinymce/plugins/visualblocks/plugin.min.js'
import 'tinymce/plugins/visualchars/plugin.min.js'
import 'tinymce/plugins/wordcount/plugin.min.js'
import 'tinymce/plugins/help/js/i18n/keynav/en.js'

import 'tinymce/themes/silver/theme.js'
import 'tinymce/models/dom/model.js'
import 'tinymce/icons/default/icons.js'

import { Cookies } from 'quasar'

const target = ref({} as media.Media)
const apiURL = ref('')
const _media = media.useMediaStore()

const uploadMedia = (resolve: (value: string) => void, reject: (value: string) => void) => {
  _media.uploadMedia({
    ...target.value,
    Message: {
      Error: {
        Title: 'MSG_UPLOAD_MEDIA',
        Message: 'MSG_UPLOAD_MEDIA_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      },
      Info: {
        Title: 'MSG_UPLOAD_MEDIA',
        Message: 'MSG_UPLOAD_MEDIA_SUCCESS',
        Popup: true,
        Type: notify.NotifyType.Success
      }
    }
  }, (error: boolean, row: media.Media) => {
    if (!error) {
      if (row != null) {
        target.value = row
        const imgURL = apiURL.value + media.API.GET_MEDIA + '/' + target.value.AppID + '/' + target.value.MediaURL
        resolve(imgURL)
      }
    } else {
      reject('upload error')
    }
  })
}

const initApiURL = () => {
  const devURL = 'https://api.development.npool.top/api'
  apiURL.value = process.env.DEV ? devURL : Cookies.get('X-Base-URL')
}

interface CustomBlob extends Blob {
  name: string
}

const exampleImageUploadHandler = (blobInfo: { blob: () => CustomBlob }) => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const base64Image = e.target?.result as string
    const base64String = base64Image.split(',')[1]
    target.value.MediaData = base64String
    uploadMedia(resolve, reject)
  }
  const blob = blobInfo.blob()
  const fileName = blob.name
  target.value.Name = fileName
  reader.readAsDataURL(blobInfo.blob())
})

export default defineComponent({
  components: {
    Editor
  },
  emits: ['update:modelValue'],
  props: {
    id: {
      type: String,
      default: ''
    },
    modelValue: {
      type: String,
      default: ''
    },
    plugins: {
      type: [String, Array],
      default: 'preview searchreplace autolink directionality visualblocks visualchars ' +
               'fullscreen image link media code codesample table charmap pagebreak nonbreaking ' +
               'anchor insertdatetime advlist lists wordcount help emoticons autosave autoresize'
    },
    toolbar: {
      type: [String, Array],
      default: 'code undo redo restoredraft | fullscreen | cut copy | ' +
               'forecolor backcolor bold italic underline strikethrough link anchor | ' +
               'alignleft aligncenter alignright alignjustify outdent indent | ' +
               'styleselect formatselect fontselect fontsizeselect | bullist numlist | ' +
               'blockquote subscript superscript removeformat | ' +
               'table image media charmap emoticons hr pagebreak insertdatetime print preview | ' +
               'bdmap indent2em lineheight axupimgs'
    }
  },
  setup (props, { emit }) {
    const editorInit = {
      height: 500,
      min_height: 500,
      menubar: 'edit view insert format tools table',
      plugins: props.plugins,
      toolbar: props.toolbar,
      skin_url: '/tinymce/skins/ui/oxide',
      content_css: '/tinymce/skins/content/default/content.css',
      promotion: false,
      branding: false,
      protect: [/<a.*?@click=.*?>/g],
      images_upload_handler: exampleImageUploadHandler
    }

    const internalValue = ref(props.modelValue)

    watch(internalValue, (newValue) => {
      emit('update:modelValue', newValue)
    })

    watch(() => props.modelValue, (newValue) => {
      internalValue.value = newValue
    })

    const handleEditorInput = (content: string) => {
      internalValue.value = content
    }

    return {
      editorInit,
      internalValue,
      handleEditorInput
    }
  },
  mounted () {
    initApiURL()
  }
})
</script>
