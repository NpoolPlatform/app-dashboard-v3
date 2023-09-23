<template>
  <div>
    <q-input
      v-model='account'
      :label='$t("MSG_ACCOUNT")'
    >
      <template #prepend>
        <q-icon name='account_circle' />
      </template>
    </q-input>
    <q-input
      v-model='password'
      type='password'
      :label='$t("MSG_PASSWORD")'
    >
      <template #prepend>
        <q-icon name='lock' />
      </template>
    </q-input>
    <div class='row top'>
      <q-btn
        no-caps
        :label='$t("MSG_SIGNIN")'
        @click='onLoginClick'
        class='btn start round'
      />
      <q-btn
        no-caps
        :label='$t("MSG_CONTACT_ADMIN")'
        class='btn alt round'
      />
    </div>
    <q-dialog v-model='showVerifyDialog' persistent>
      <q-card style='min-width: 350px'>
        <q-card-section>
          <div class='text-h6'>
            <p
              class='tip'
              v-html='$t("MSG_VERIFICATION_CODE_SENT_TO", { ACCOUNT: account })'
            />
          </div>
        </q-card-section>

        <q-card-section class='q-pt-none'>
          <q-input
            dense v-model='verifyCode' autofocus
            @keyup.enter='onVerifyClick'
          />
        </q-card-section>
        <q-card-actions align='right' class='text-primary'>
          <TimeoutSendBtn
            :initial-clicked='true'
            @click='onSendCodeClick'
            class='margin-top-0'
            :target-error='false'
          />
          <button @click='onVerifyClick' style='margin-left: 10px;' :disabled='!validVerifyCode'>
            {{ $t("MSG_VERIFY") }}
          </button>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang='ts'>
import { defineAsyncComponent, ref } from 'vue'
import { user, notify, app, basetypes, utils, appcoin, notifverify, coderepo, appuserbase, constant } from 'src/npoolstore'
import { useRouter } from 'vue-router'
import { useReCaptcha } from 'vue-recaptcha-v3'
import { computed } from '@vue/reactivity'
import { getCoins } from 'src/api/coin'

const TimeoutSendBtn = defineAsyncComponent(() => import('src/components/button/TimeoutSendBtn.vue'))

const account = ref('')
const password = ref('')

const _user = user.useUserStore()
const _coderepo = coderepo.useCodeRepoStore()
const _notifverify = notifverify.useVerifyStore()
const recaptcha = useReCaptcha()

const router = useRouter()
const _app = app.useApplicationStore()

const validVerifyCode = computed(() => utils.validateVerificationCode(verifyCode.value))
const signin = (token: string) => {
  _user.login({
    Account: account.value,
    PasswordHash: utils.encryptPassword(password.value),
    AccountType: appuserbase.SignMethodType.Email,
    ManMachineSpec: token,
    EnvironmentSpec: 'NOT-USED',
    Message: {
      Error: {
        Title: 'MSG_SINGIN',
        Message: 'MSG_SIGNIN_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean) => {
    if (error) {
      return
    }
    verify()
  })
}
const verify = () => {
  _app.getApp({
    Message: {
      Error: {
        Title: 'MSG_GET_APP_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, () => {
    _verify()
  })
}
const _verify = () => {
  if (!_app.app(undefined)?.SigninVerifyEnable) {
    void router.push({ path: '/' })
    return
  }
  showVerifyDialog.value = true
  onSendCodeClick()
}
const getRecaptcha = () => {
  _coderepo.getGoogleToken({
    Recaptcha: recaptcha,
    Req: constant.GoogleTokenType.Login,
    Message: {
      Error: {
        Title: 'MSG_GET_GOOGLE_TOKEN',
        Message: 'MSG_GET_GOOGLE_TOKEN_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (token: string) => {
    signin(token)
  })
}

const onLoginClick = () => {
  getRecaptcha()
}

const showVerifyDialog = ref(false)
const verifyCode = ref('')

const onSendCodeClick = () => {
  _notifverify.sendVerificationCode(
    account.value,
    appuserbase.SignMethodType.Email as unknown as appuserbase.SigninVerifyType,
    basetypes.EventType.Signin,
    account.value
  )
}

const logined = user.useLocalUserStore()

const coin = appcoin.useAppCoinStore()
const onVerifyClick = () => {
  _user.loginVerify({
    Account: account.value,
    AccountType: appuserbase.SignMethodType.Email,
    UserID: logined.User?.ID,
    Token: logined.User?.LoginToken,
    VerificationCode: verifyCode.value,
    Message: {
      Error: {
        Title: 'MSG_LOGIN_VERIFY',
        Message: 'MSG_LOGIN_VERIFY_FAIL',
        Popup: true,
        Type: notify.NotifyType.Error
      }
    }
  }, (error: boolean) => {
    if (error) {
      console.log('error: ')
      return
    }
    showVerifyDialog.value = false
    void router.push({ path: '/' })
    if (!coin.coins(undefined).length) { getCoins(0, 500) }
  })
}
</script>

<style lang='sass' scoped>
</style>
