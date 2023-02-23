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
    <div style="text-align: center;">内测申请通道目前尚未开启，请稍后重试</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import router from '../router'
import '../assets/css/home.css'
document.title = 'CEIV2内测申请 - Project BS'

const menuValue = ref('item2')

function jump(url: string){
  window.location.href = url
}
</script>

<style>

</style>