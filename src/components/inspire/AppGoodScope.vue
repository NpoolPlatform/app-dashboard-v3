<template>
  <q-table
    dense
    flat
    :title='$t("MSG_APP_GOOD_SCOPE")'
    :rows='displayScopes'
    row-key='ID'
    :rows-per-page-options='[100]'
    selection='single'
    :columns='columns'
    v-model:selected='selectedScopes'
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
      </div>
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_DELETE")'
        :disable='selectedScopes?.length === 0'
        @click='onDelete'
      />
      <q-btn
        dense
        flat
        class='btn flat'
        :label='$t("MSG_CREATE")'
        @click='onCreate'
      />
    </template>
  </q-table>

  <q-dialog
    v-model='showing'
    @hide='onMenuHide'
    position='right'
  >
    <q-card class='popup-menu'>
      <q-card-section>
        <span>{{ $t('MSG_SCOPE') }}</span>
      </q-card-section>
      <q-card-section>
        <CouponScopeSelector v-model:id='target.ScopeID' />
        <AppGoodFromOutSelector v-model:id='target.AppGoodID' :label='"MSG_APP_GOOD"' :appgoods='displayGoods' />
        <q-select
          :options='[
            coupon.CouponScope.Whitelist,
            coupon.CouponScope.Blacklist
          ]'
          v-model='target.CouponScope'
          :label='$t("MSG_COUPON_SCOPE")'
        />
      </q-card-section>
      <q-item class='row'>
        <LoadingButton loading :label='$t("MSG_SUBMIT")' @click='onSubmit' />
        <q-btn class='btn round' :label='$t("MSG_CANCEL")' @click='onCancel' />
      </q-item>
    </q-card>
  </q-dialog>
</template>

<script setup lang='ts'>
import { computed, defineAsyncComponent, onMounted, ref, watch } from 'vue'
import { appgoodscope, coupon, sdk, utils, appgood, couponscope } from 'src/npoolstore'
import { useI18n } from 'vue-i18n'
import { CouponScope } from 'src/npoolstore/inspire/coupon'
import { getAppGoods } from 'src/api/good'

// eslint-disable-next-line @typescript-eslint/unbound-method
const { t } = useI18n({ useScope: 'global' })

const AppGoodFromOutSelector = defineAsyncComponent(() => import('src/components/good/AppGoodFromOutSelector.vue'))
const CouponScopeSelector = defineAsyncComponent(() => import('src/components/inspire/CouponScopeSelector.vue'))
const LoadingButton = defineAsyncComponent(() => import('src/components/button/LoadingButton.vue'))

const scope = appgoodscope.useAppGoodScopeStore()
const username = ref('')
const scopes = computed(() => scope.scopes(undefined))
const displayScopes = computed(() => scope.scopes(undefined).filter((el) => {
  return el.GoodID?.includes(username.value) ||
          el.AppGoodID?.includes(username.value) ||
           el.CouponID?.includes(username.value)
}))

const target = ref({} as appgoodscope.AppGoodScope)
const showing = ref(false)

const onCreate = () => {
  target.value = {} as appgoodscope.AppGoodScope
  showing.value = true
}
const onMenuHide = () => {
  showing.value = false
  target.value = {} as appgoodscope.AppGoodScope
}
const onCancel = () => {
  onMenuHide()
}

const onSubmit = (done: () => void) => {
  sdk.createAppGoodScope(target.value, (error: boolean) => {
    done()
    if (error) {
      return
    }
    onMenuHide()
  })
}

const selectedScopes = ref([] as Array<appgoodscope.AppGoodScope>)
const onDelete = () => {
  sdk.deleteAppGoodScope(selectedScopes.value?.[0], () => {
    // TODO
  })
}

const appGood = appgood.useAppGoodStore()
const appGoods = computed(() => appGood.goods(undefined))

const goodID = ref('')
const displayGoods = computed(() => appGoods.value?.filter((el) => el.GoodID === goodID.value))

const _couponscope = couponscope.useScopeStore()
const couponscopes = computed(() => _couponscope.scopes())

watch(() => target.value.ScopeID, () => {
  goodID.value = _couponscope.scope(target.value.ScopeID)?.GoodID as string
  target.value.CouponScope = _couponscope.scope(target.value?.ScopeID)?.CouponScope as CouponScope
})

onMounted(() => {
  if (!scopes.value?.length) {
    sdk.getAppGoodScopes(0, 0)
  }
  if (!couponscopes.value?.length) {
    sdk.getScopes(0, 0)
  }
  if (appGoods.value.length === 0) {
    getAppGoods(0, 100)
  }
})

const columns = computed(() => [
  {
    name: 'ID',
    label: t('MSG_ID'),
    sortable: true,
    field: (row: appgoodscope.AppGoodScope) => row.ID
  },
  {
    name: 'GoodID',
    label: t('MSG_GOOD_ID'),
    sortable: true,
    field: (row: appgoodscope.AppGoodScope) => row.GoodID
  },
  {
    name: 'GoodName',
    label: t('MSG_GOOD_NAME'),
    sortable: true,
    field: (row: appgoodscope.AppGoodScope) => row.GoodName
  },
  {
    name: 'Type',
    label: t('MSG_TYPE'),
    sortable: true,
    field: (row: appgoodscope.AppGoodScope) => row.CouponType
  },
  {
    name: 'AppGoodScope',
    label: t('MSG_COUPON_SCOPE'),
    sortable: true,
    field: (row: appgoodscope.AppGoodScope) => row.CouponScope
  },
  {
    name: 'CouponID',
    label: t('MSG_COUPON_ID'),
    sortable: true,
    field: (row: appgoodscope.AppGoodScope) => row.CouponID
  },
  {
    name: 'CouponName',
    label: t('MSG_COUPON_NAME'),
    sortable: true,
    field: (row: appgoodscope.AppGoodScope) => row.CouponName
  },
  {
    name: 'CouponScope',
    label: t('MSG_SCOPE'),
    sortable: true,
    field: (row: appgoodscope.AppGoodScope) => row.CouponScope
  },
  {
    name: 'CouponDenomination',
    label: t('MSG_COUPON_DENOMINATION'),
    sortable: true,
    field: (row: appgoodscope.AppGoodScope) => row.CouponDenomination
  },
  {
    name: 'CreatedAt',
    label: t('MSG_CREATED_AT'),
    sortable: true,
    field: (row: appgoodscope.AppGoodScope) => utils.formatTime(row.CreatedAt)
  }
])

</script>
