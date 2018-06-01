<template>
  <el-row class="header" type="flex" align="middle">
    <el-col class="logo" :span="2">
      <img src="../../assets/images/nav_logo.png" alt="">
    </el-col>
    <el-col :span="14" :offset="1">
      <ul class="nav-box">
        <li>
          <router-link :to="{path:'/',name:'home'}" class="noActive link_active">媒体入库</router-link>
        </li>
        <li>
          <router-link to="/resource" class="noActive">资源发布</router-link>
        </li>
        <li v-if="headerMsg.level > 1">
          <router-link to="/manage" class="noActive">用户</router-link>
        </li>
        <li v-if="headerMsg.level > 1">
          <router-link to="/message" class="noActive">消息</router-link>
        </li>
        <li v-if="headerMsg.level > 1">
          <router-link to="/data" class="noActive">数据</router-link>
        </li>
      </ul>
      <!-- <ul class="nav-box">
        <li v-for="(item,index) in navLink" :key="index" v-if="item.isShow">
          <router-link :to="item.linkTo" class="noActive">{{item.linkName}}</router-link>
        </li>
      </ul> -->
    </el-col>
    <el-col :span="8">
      <div class="top-right">        
        <el-dropdown trigger="click" @command="userinfo">
          <span class="el-dropdown-link">
            {{headerMsg.adminName}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="password">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>            
          </el-dropdown-menu>
        </el-dropdown>
      <span class="m-l" v-if="headerMsg.level === 3"><router-link to="/admin"  class="noActive">权限管理</router-link></span>
      </div>
    </el-col>    
  </el-row>
</template>

<script>
export default {
  props: ['headerMsg'],
  data () {    
    return {
      navLink:[
        {linkName:'媒体入库',linkTo:{path:'/',name:'home'}},
        {linkName:'资源发布',linkTo:'/resource'},
        {linkName:'用户',linkTo:'/manage'},
        {linkName:'消息',linkTo:'/message'},
        {linkName:'数据',linkTo:'/data'}
      ]          
    }
  },
  methods: {    
    userinfo(command) {           
      var that = this;
      if(command ==='logout'){//退出登录
        this.$confirm('您确认要退出吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'              
        }).then(() => {
          window.localStorage.clear();
          that.$message({
            type: 'success',
            message: '退出成功'
           });
            that.$router.push('/login');
        }).catch(() => {
          //已取消
        });            
      }
      if(command==='password'){//修改密码
        that.axios({
          method:'post',
          url: '/BeautyScience/mail/modify_password'          
        }).then(function (res) {
          that.$message.success('邮件已发送成功,请注意查收');          
          // if(res.status == 200){
          //   that.$message.success('邮件已发送成功,请注意查收');            
          // }else{
          //   that.$message.error('邮件发送失败');
          // }                           
        }).catch(function (error) {
          console.log(error);             
        });       
      } 
    }   
  },   
  mounted(){

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
