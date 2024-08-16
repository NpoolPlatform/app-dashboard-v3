<template>
  <q-table
    dense
    flat
    :title='$t("MSG_FEES")'
    :rows='displayFees'
    row-key='ID'
    :rows-per-page-options='[100]'
    :columns='columns'
    @row-click='(ev, row, index) => onRowClick(row as fee.Fee)'
  >
    <template #top-right>
      <div class='row indent flat'>
        <q-input
          dense
          flat
          class='small'
          v-model='goodName'
          :label='$t("MSG_GOOD_NAME")'
        />
      </div>
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { utils, sdk, fee } from 'src/npoolstore'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const fees = sdk.fees

const goodName = ref('')
const displayFees = computed(() => {
  const name = goodName.value.toLowerCase()
  return fees.value?.filter((el) => {
    return el.EntID.toLowerCase().includes(name) ||
          el.Name.toLowerCase().includes(name) ||
          el.GoodID.toLowerCase().includes(name)
  })
})

onMounted(() => {
  if (!fees.value.length) {
    sdk.getFees(0, 0)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: fee.Fee) => row.ID
  },
  {
    name: 'EntID',
    label: t('MSG_ENT_ID'),
    sortable: true,
    field: (row: fee.Fee) => row.EntID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: fee.Fee) => row.GoodID
  },
  {
    name: 'Name',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: fee.Fee) => row.Name
  },
  {
    name: 'GoodType',
    label: t('MSG_GOOD_TYPE'),
    sortable: true,
    field: (row: fee.Fee) => row.GoodType
  },
  {
    name: 'DurationDisplayType',
    label: t('MSG_DURATION_DISPLAY_TYPE'),
    sortable: true,
    field: (row: fee.Fee) => row.DurationDisplayType
  },
  {
    name: 'UnitValue',
    label: t('MSG_UNIT_VALUE'),
    sortable: true,
    field: (row: fee.Fee) => row.UnitValue
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATEDAT'),
    sortable: true,
    field: (row: fee.Fee) => utils.formatTime(row.CreatedAt)
  },
  {
    name: 'UpdatedAt',
    label: t('MSG_UPDATEDAT'),
    sortable: true,
    field: (row: fee.Fee) => utils.formatTime(row.UpdatedAt)
  }
])

</script>

<style lang='sass' scoped>
</style>
