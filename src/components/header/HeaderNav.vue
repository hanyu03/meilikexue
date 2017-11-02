<template>
  <el-row class="header" type="flex" align="middle">
    <el-col class="logo" :span="2">
      <img src="../../assets/images/nav_logo.png" alt="">
    </el-col>
    <el-col :span="20" :offset="1">
      <ul class="nav-box">
        <li v-for="(item,index) in navLink" :key="index">
          <router-link :to="item.linkTo" class="noActive">{{item.linkName}}</router-link>
        </li>
      </ul>
    </el-col>
    <el-col :span="2" style="background-color:yellow;">
      <div>ok</div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      navLink:[
        {linkName:'媒体入库',linkTo:{path:'/',name:'home',params:{user:'han'}}},
        {linkName:'资源发布',linkTo:'/resource'},
        {linkName:'用户',linkTo:'/user'},
        {linkName:'消息',linkTo:'/message'},
        {linkName:'数据',linkTo:'/data'}
      ]
    }
  },
  methods: {
    
  }
}
</script>

<style scoped>
.header {
  width:100%;
  height:100%;
  padding:0 48px;
}
.logo>img{
  vertical-align: middle;
}
.nav-box{
  display: flex;
  align-items: center;
}
.nav-box li{
  margin-right: 24px;
}
.noActive{
  font-size: 14px;
  color:#c0ecff;
}
.router-link-exact-active{
  color:#fff;
  font-weight: 700;
}
</style>
