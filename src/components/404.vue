<template>
    <div class="navbar">
    <t-head-menu v-model="menuValue" theme="light">
      <template #logo>
        <img height="36" src="../assets/img/logo.png" alt="logo" />
      </template>
      <t-menu-item value="item1" style="height: 38px; font-weight: bold; font-size: 16px;" @click="router.push('/')"> 首页 </t-menu-item>
      <t-menu-item value="item2" style="height: 38px; font-weight: bold; font-size: 16px;"> 404 </t-menu-item>
      <template #operations>
        <t-button style="height: 38px; width: 38px;" variant="text" shape="square" @click="jump('https://account.projectbs.cn/')">
          <template #icon><t-icon name="user" /></template>
        </t-button>
      </template>
    </t-head-menu>
  </div>
  <div style="min-height: 95vh; display: flex; align-items: center; justify-content: center; font-size: 50px; font-weight: bold;">404 Not Found</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import router from '../router'
import '../assets/css/home.css'
document.title = '404 - Project BS'

const menuValue = ref('item2')

function jump(url: string){
  window.location.href = url
}
</script>

<style>

</style>