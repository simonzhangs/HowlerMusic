<template>
  <div class="login">
    <div class="login-container">
      <div class="section-1">
        <img src="../../public/img/logos/netease-music.png" alt="" />
      </div>
      <div class="title">{{ $t('login.loginText') }}</div>
      <!-- 登录主体信息 -->
      <div class="section-2">
        <!-- 手机号登录 -->
        <div v-show="mode === 'phone'" class="input-box">
            <div class="container" :class="{active: inputFocus === 'phone'}">
                <svg-icon icon-class="mobile" />
                <div class="inputs">
                    <input 
                    id="countryCode"
                    v-model="countryCode"
                    :placeholder="
                    inputFocus === 'phone' ? '' : $t('login.countryCode')
                    "
                    @focus="inputFocus = 'phone'"
                    @blur="inputFocus = ''"
                    @keyup.enter="login"
                    />
                    <input 
                    id="phoneNumber"
                    v-model="phoneNumber"
                    :placeholder="inputFocus === 'phone' ? '' : $t('login.phone')"
                    @focus="inputFocus = 'phone'"
                    @blur="inputFocus = ''"
                    @keyup.enter="login"
                    />
                </div>
            </div>
        </div>
        <!-- 邮箱登录 -->
        <div v-show="mode === 'email'" class="input-box">
            <div class="container" :class="{active: inputFocus === 'email'}">
                <svg-icon icon-class="mail" />
                <div class="inputs">
                    <input 
                    id="email"
                    v-model="email"
                    :placeholder="inputFocus === 'email' ? '' : $t('login.email')"
                    @focus="inputFocus = 'email'"
                    @blur="inputFocus = ''"
                    @keyup.enter="login"
                    />
                </div>
            </div>
        </div>

        <div v-show="mode !== 'qrCode'" class="input-box"> </div>
        <!-- 二维码登录 -->
        <div v-show="mode === 'qrCode'"> </div>
      </div>
      <!-- 非二维码登录按钮 -->
      <div v-show="mode !== 'qrCode'" class="confirm">
        <button v-show="!processing" @click="login">
          {{ $t('login.login') }}
        </button>
        <button v-show="processing" class="loading" disabled>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div class="other-login">
        <a v-show="mode !== 'email'" @click="changeMode('email')">
          {{ $t('login.loginWithEmail') }}
        </a>
        <span v-show="mode === 'qrCode'">|</span>
        <a v-show="mode !== 'phone'" @click="changeMode('phone')">
          {{ $t('login.loginWithPhone') }}
        </a>
        <span v-show="mode !== 'qrCode'">|</span>
        <a v-show="mode !== 'qrCode'" @click="changeMode('qrCode')">二维码登录</a>
      </div>
      <!-- 声明信息 -->
      <div class="notice"
      v-show="mode !== 'qrCode'"
      v-html="isElectron ? $t('login.noticeElectron') : $t('login.notice')"
      >
      </div>
    </div>
  </div>
</template>

<script>

</script>

<style lang="scss" scoped></style>
