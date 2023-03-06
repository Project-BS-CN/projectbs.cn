<template>

<div class="navbar">
    <t-head-menu theme="light" v-model="menuValue">
      <template #logo>
        <img height="36" src="../assets/img/logo.png" alt="logo" />
      </template>
      <t-menu-item value="item1" style="height: 38px; font-weight: bold; font-size: 16px;" @click="router.push('/')"> 首页 </t-menu-item>
      <t-menu-item value="item2" style="height: 38px; font-weight: bold; font-size: 16px;"> 捐赠 </t-menu-item>
      <template #operations>
        <t-button style="height: 38px; width: 38px;" variant="text" shape="square" @click="jump('https://account.projectbs.cn/')">
          <template #icon><t-icon name="user" /></template>
        </t-button>
      </template>
    </t-head-menu>
</div>

<br><br><br>

<div style="text-align: center; font-weight: bold; font-size: 30px;">捐赠我们</div>
<br>

<div style="text-align: center;" v-if="nowShow == 1">
    Project BS 是一个非盈利企划。<br>
    随着附属项目的逐渐增多，我们的资金需求也越来越大。<br>
    <br>
    若您有意愿帮助我们继续健康地运营 Project BS，<br>
    您可以通过以下的步骤来进行捐赠。<br>
    <br>
    在此向所有对 Project BS 提供过帮助的用户致谢。
</div>

<div v-if="nowShow == 2">
    <div class="tag">请输入您的昵称</div>
    <t-input size="large" class="input" placeholder="昵称" v-model="userName" />
    <br>
    <div class="tag">请输入您的QQ号或其他联系方式</div>
    <t-input size="large" class="input" placeholder="QQ号/其他联系方式" v-model="qq" />
    <br>
    <div class="tag">留个言吧</div>
    <t-input size="large" class="input" placeholder="留言" v-model="quote" />
    <br>
    <div class="tag">请输入您想捐赠的金额 (单位: 元)</div>
    <t-input-number size="large" style="display: block; margin: auto;" @change="handleFeeChange(fee)" placeholder="金额" v-model="fee" />
</div>

<div v-if="nowShow == 3">
    <div style="text-align: center; font-size: 30px; font-weight: bold; color: #DC8458;">¥{{ fee }}.00</div>
    <br>
    <div class="tag">请选择支付方式</div>
    <div id="checkbox">
        <t-radio :checked="way == 'wxpay'" style="display: inline-flex;" @click="way = 'wxpay'">微信支付</t-radio>
        &nbsp;
        <t-radio :checked="way == 'alipay'" style="display: inline-flex;" @click="way = 'alipay'">支付宝</t-radio>
    </div>
</div>

<div v-if="nowShow == 4">
    <div style="text-align: center; font-size: 30px; font-weight: bold; color: #DC8458;">¥{{ fee }}.00</div>
    <br>
    <div class="tag">请打开{{ way == 'wxpay' ? '微信' : '支付宝' }}扫一扫<br>请勿刷新此页面</div>
    <br>
    <img :src="`https://pay.projectbs.cn/api/qrcode?text=${qrcode}`" style="height: 200px; width: 200px; display: block; margin: auto;" />
</div>

<div v-if="nowShow == 5">
    <icon name="check-circle-filled" style="color: green; width: 30px; height: 30px; display: block; margin: auto;" />
    <div class="tag"><span v-if="userName != '' && userName != undefined">{{ userName }}，</span><span>非常感谢您的捐赠！</span></div>
</div>

<br>

<t-button style="font-weight: bold; height: 40px; display: block; margin: auto;" @click="handleNextStep()" :disabled="buttonDisabled" v-show="buttonShow" :loading="buttonLoading" >{{buttonText}}</t-button>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '../router'
import axios from 'axios'
import { MessagePlugin, Icon } from 'tdesign-vue-next'
import '../assets/css/home.css'
import { now } from 'lodash'
document.title = '捐赠 - Project BS 防灾企划'

let menuValue = ref('item2')
let nowShow = ref(1)
let buttonText = ref('下一步')
let buttonDisabled = ref(false)
let buttonLoading = ref(false)
let buttonShow = ref(true)

let userName = ref('' as any)
let qq = ref('' as any)
let quote = ref('' as any)
let fee = ref(1 as any)
let way = ref('wxpay')

let qrcode = ref('')
let tradeNo = ref('')

let handleNextStep = () => {
    if(nowShow.value == 2) {
        if(userName.value == '' || userName.value == undefined || qq.value == '' || qq.value == undefined || quote.value == '' || quote.value == undefined){
            console.log(userName.value, qq.value, quote.value);
            MessagePlugin.error('某个或多个输入框未填写。')
            return
        }
    }
    if(nowShow.value == 3){
        buttonDisabled.value = true
        buttonLoading.value = true
        buttonText.value = '等待支付'
        axios.post(`https://pay.projectbs.cn/api/${way.value}`, {name: '捐赠Project BS', fee: fee.value}, {headers:{'Content-Type': 'application/json'}}).then(data => {
            let json = data.data
            if(json.response.status != 'success') {
                MessagePlugin.warning('出现错误。')
                buttonLoading.value = false
                buttonText.value = '出现错误'
                return
            }
            qrcode.value = json.data.payLink
            tradeNo.value = json.data.tradeNo
        })
        let notiInterval = setInterval(() => {
            axios.post(`https://pay.projectbs.cn/api/${way.value}/notify`, {tradeNo: tradeNo.value}, {headers:{'Content-Type': 'application/json'}}).then(data => {
                let json = data.data
                if(json.code == 200) {
                    buttonDisabled.value = false
                    buttonLoading.value = false
                    buttonText.value = '完成'
                    nowShow.value += 1
                    clearInterval(notiInterval)
                    
                    axios.post('https://projectbs.cn/donate/quote/upload.php', `data=${qq.value}ooo${quote.value}&qq=${userName.value}_${new Date().getTime()}`)
                }
            })
        }, 3000)
    }

    if(nowShow.value == 5){
        router.push('/')
        return
    }
    nowShow.value += 1
}

let handleFeeChange = (_:any) => {
    // fee.value = fee.value.replace(/./g, '')
    if(fee.value == '' || fee.value == undefined) fee.value = 1
    if(fee.value < 1) fee.value = 1
    if(fee.value > 2000) fee.value = 2000
    fee.value = fee.value.toFixed(0)
}

function jump(url: string){
    window.location.href = url
}
</script>

<style>
.tag {
    text-align: center;
}

.input {
    width: 50%;
    display: block;
    margin: auto;
}

#checkbox {
    display: flex;
    justify-content: center;
}

.t-radio__label {
    position: relative;
    top: -2px;
}

.t-message {
    z-index: 999999999 !important;
}

.t-message__list {
    z-index: 999999999 !important;
}
</style>