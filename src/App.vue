<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>

<script>
import {defineComponent, provide} from 'vue'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import * as echarts from 'echarts'
export default defineComponent ({
  name: 'App',
  setup() {
    provide('ec',echarts)
    return {
      locale
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100vh;
}
</style>
