<template>
  <div id="app">
    <el-container>
      <el-header>
        <HeaderNav :headerMsg="headerMsg"></HeaderNav>
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
  data () {    
    return { 
      localUrl:'',
      isShow:false,
      headerMsg:{
        'adminName':'',
        'level':null
      }               
    }
  },
  components: {
    HeaderNav
  },
  methods: {
             
  },
  updated(){
    this.headerMsg.adminName = window.localStorage.getItem('userEmail');
    this.headerMsg.level = parseInt(window.localStorage.getItem('userLevel'));    
  },
  mounted(){
    this.headerMsg.adminName = window.localStorage.getItem('userEmail');
    this.headerMsg.level = parseInt(window.localStorage.getItem('userLevel'));    
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
