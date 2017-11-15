<template>
  <div class="login">
      <div class="loginBox">
          <div class="login-logo">
              <div class="imgBox">
                  <img src="../../assets/images/login_logo.png" alt="">
              </div>
              
              <p>优质小学科学互动资源 — 后台管理系统登陆</p>
          </div>
          <div class="login-form">
              <el-form :model="loginData" :rules="rules"
              ref="loginData" label-width="80px">
                  <el-form-item prop='email'>
                      <el-input v-model="loginData.email"
                      placeholder="请输入邮箱地址"></el-input>
                  </el-form-item>
                  <el-form-item prop='passWord'>
                      <el-input type="password" v-model="loginData.passWord"
                      placeholder="请输入密码"></el-input>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" @click="loginSubmit">登陆</el-button>
                  </el-form-item>
              </el-form>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  data () {
      return {
          loginData:{
              email:'',
              passWord:''
          },
          rules:{
            email: [
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
            ],
            passWord: [
                { required: true, message: '请输入密码', trigger: 'blur'},
                { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
            ]
          }
      }
  },
  methods: {
      loginSubmit(){
          let that = this;
          this.axios.post('/BeautyScience/admin/login',{
            admin:{
                email:this.loginData.email,
                password:this.loginData.passWord
            }
          })
          .then(function(response){
              let data = response.data;
              localStorage.setItem('accessToken', data.access_token)
              localStorage.setItem('accessExp', data.access_exp)
              localStorage.setItem('refreshToken', data.refresh_token)
              localStorage.setItem('refreshExp', data.refresh_exp)
              localStorage.setItem('userEmail', data.admin.email)
              localStorage.setItem('userLevel', data.admin.level)
              console.log(data)
              that.$router.push('/')
          })
          .catch(function (error) {
              if(error.response.status == 401){
                  that.$message.error('用户或密码错误');
              }else{
                  console.log(error)
              }
          });
      }
  }
}
</script>

<style scoped>
.login{
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100% !important;
    height: 100% !important;
    background: url('../../assets/images/login_bg.png') no-repeat center;
}
.loginBox{
    width: 25%;
    z-index: 666;
}
.loginBox .imgBox{
    width: 100%;
    text-align: center;
    vertical-align: middle;
}
.loginBox .imgBox>img{
    max-width: 100%;
}
.loginBox p{
    font-size: 16px;
    color:#fff;
    text-align: center;
    padding:24px 0 72px 0;
}
</style>
