<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_COUNTRIES")'
    :rows='displayCountries'
    row-key='ID'
    :rows-per-page-options='[100]'
  >
    <template #top-right>
      <q-input
        dense
        class='small'
        v-model='countryName'
        :label='$t("MSG_COUNTRY")'
      />
    </template>
  </q-table>
</template>

<script setup lang='ts'>
import { getCountries } from 'src/api/g11n'
import { appcountry } from 'src/npoolstore'
import { computed, onMounted, ref } from 'vue'

const country = appcountry.useAppCountryStore()
const countries = computed(() => country.countries())

const countryName = ref('')
const displayCountries = computed(() => countries.value.filter((el) => el.Country?.toLowerCase().includes(countryName.value?.toLowerCase())))

onMounted(() => {
  if (countries.value.length === 0) {
    getCountries(0, 100)
  }
})

</script>
