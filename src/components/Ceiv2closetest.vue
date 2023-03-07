<template>
    <div class="navbar">
      <t-head-menu v-model="menuValue" theme="light">
        <template #logo>
          <img height="36" src="../assets/img/logo.png" alt="logo" />
        </template>
        <t-menu-item value="item1" style="height: 38px; font-weight: bold; font-size: 16px;" @click="router.push('/')"> 首页 </t-menu-item>
        <t-menu-item value="item2" style="height: 38px; font-weight: bold; font-size: 16px;"> CEIV2内测申请 </t-menu-item>
        <template #operations>
          <t-button style="height: 38px; width: 38px;" variant="text" shape="square" @click="jump('https://account.projectbs.cn/')">
            <template #icon><t-icon name="user" /></template>
          </t-button>
        </template>
      </t-head-menu>
    </div>
    <br><br><br>
    <div class="ceivTitle" style="display: flex; align-items: center; justify-content: center;">
      <img src="../assets/img/CEIV2Logo.png" style="width: 80px;"/>
      <span style="font-weight: bold; font-size: 30px;">CEIV2内测申请</span>
    </div>
    <t-alert theme="info" title="温馨提示" message="若您已提交过内测申请，请勿再重复提交，谢谢合作！" close class="input" style="display: flex; margin-top: 10px; margin-bottom: 15px;">
    </t-alert>
    <div class="tag">请输入您的昵称。</div>
    <t-input clearable size="large" class="input" placeholder="昵称" v-model="userName" />
    <br>
    <div class="tag">请输入您的QQ号或电子邮箱地址。</div>
    <t-input size="large" class="input" placeholder="QQ号/电子邮箱地址" v-model="qq" />
    <br>
    <div class="tag">您从事的行业是？</div>
    <t-select bordered class="input" size="large" v-model="industry">
      <t-option label="不便透露" value="不便透露" />
      <t-option label="地质" value="地质" />
      <t-option label="金融" value="金融" />
      <t-option label="零售" value="零售" />
      <t-option label="媒体和广告" value="媒体和广告" />
      <t-option label="医疗保健" value="医疗保健" />
      <t-option label="旅游和酒店" value="旅游和酒店" />
      <t-option label="教育" value="教育" />
      <t-option label="科技" value="科技" />
      <t-option label="政府和公共事业" value="政府和公共事业" />
      <t-option label="物流" value="物流" />
      <t-option label="制造" value="制造" />
      <t-option label="建筑和房地产" value="建筑和房地产" />
      <t-option label="农业和食品" value="农业和食品" />
      <t-option label="环境保护和可持续发展" value="环境保护和可持续发展" />
      <t-option label="艺术和文化" value="艺术和文化" />
      <t-option label="运动和娱乐" value="运动和娱乐" />
      <t-option label="高校在校学生" value="高校在校学生" />
      <t-option label="高中及以下学校在校学生" value="高中及以下学校在校学生" />
      <t-option label="其他" value="其他" />
    </t-select>
    <br>
    <div class="tag">您了解地震预警的运作原理吗？</div>
    <t-select bordered class="input" size="large" v-model="isKnowEew">
      <t-option label="是" value="true" />
      <t-option label="否" value="false" />
    </t-select>
    <div v-show="eewExplainShow">
      <br>
      <div class="tag">请您简述地震预警的原理。</div>
      <t-textarea placeholder="请简述地震预警的原理" class="input" :autosize="{ minRows: 2, maxRows: 5 }" v-model="eewExplain" />
    </div>
    <br>
    <t-checkbox style="display: flex; justify-content: center;" v-model="isAgree">您自愿接收来自四川地震局、福建地震局的地震预警信息，<br>并知晓其可能出现误报的情况。</t-checkbox>
    <br>
    <t-button style="display: block; margin: auto;" size="large" :disabled="buttonDisabled" @click="handleClick()" :loading="buttonLoading">提交</t-button>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { MessagePlugin } from 'tdesign-vue-next'
import router from '../router'
import '../assets/css/home.css'
import axios from 'axios';
document.title = 'CEIV2内测申请 - Project BS'

const menuValue = ref('item2')

let userName = ref('')
let qq = ref('')
let industry = ref('' as any)
let isKnowEew = ref('' as any)
let eewExplainShow = computed(() => {
  return isKnowEew.value == 'true'
})
let eewExplain = ref('')
let isAgree = ref(false)
let buttonDisabled = computed(() => {
  if (buttonLoading.value) return true
  if (buttonDone.value) return true
  if (isKnowEew.value == 'false') {
    return userName.value == '' || qq.value == '' || industry.value == '' || !isAgree.value
  } else if (isKnowEew.value == 'true') {
    return userName.value == '' || qq.value == '' || industry.value == '' || eewExplain.value == '' || !isAgree.value
  } else {
    return true
  }
})
let buttonLoading = ref(false)
let buttonDone = ref(false)

let handleClick = () => {
  buttonLoading.value = true
  let data = {
    userName: userName.value,
    qq: qq.value,
    industry: industry.value,
    isKnowEew: isKnowEew.value,
    eewExplain: eewExplain.value,
    isAgree: isAgree.value,
    timestamp: Date.now()
  }
  axios.post('https://projectbs.cn/api/requestceiv2closetest.php', data).then(data => {
    let json = data.data
    if(json.success){
      MessagePlugin.success('您的申请已提交。')
      buttonDone.value = true
      buttonLoading.value = false
    }else {
      MessagePlugin.error('服务器出现错误，请稍后重试。')
      buttonLoading.value = false
    }
  })
}

function jump(url: string){
  window.location.href = url
}
</script>

<style>
.tag {
  width: 50%;
  display: block;
  margin: auto;
}

.input {
  width: 50%;
  display: block;
  margin: auto;
}

@media only screen and (max-width : 1199px) {
  .input {
    width: 50%;
  }

  .tag {
    width: 50%;
  }
}

@media only screen and (max-width : 991px) {
  .input {
    width: 90%;
  }

  .tag {
    width: 90%;
  }
}

.t-message {
    z-index: 999999999 !important;
}

.t-message__list {
    z-index: 999999999 !important;
}

.t-is-hidden {
  display: none !important;
}
</style>