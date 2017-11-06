<template>
  <div id="app">
    <el-container>
      <el-header>
        <HeaderNav></HeaderNav>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import HeaderNav from '@/components/header/HeaderNav'

export default {
  name: 'app',
  components: {
    HeaderNav
  }
}
</script>

<style scoped>
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  /* text-align: center; */
}
</style>
