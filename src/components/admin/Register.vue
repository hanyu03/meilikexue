<template>
	<div>
		<div class="register">
			<div class="reg-box">
				<h2><img src="../../assets/images/reg_logo.png"></h2>
				<h3>后台管理系统</h3>
				<el-form ref="regform" :rules="rules" :model="regform" label-width="100px" >
				  <el-form-item label="设置密码" prop="password1">
				    <el-input type="password" v-model="regform.password1"></el-input>
				  </el-form-item>		  
				  <el-form-item label="确认密码" prop="password2">
				    <el-input type="password" v-model="regform.password2"></el-input>
				  </el-form-item>
				  <el-form-item>
				  	<el-button type="primary" disabled v-if="disable">提交</el-button>
				    <el-button type="primary" @click="submitForm('regform')" v-else>提交</el-button>
				  </el-form-item>
				</el-form>
			</div>
		</div>
		<div class="head-white"></div>
	</div>
</template>
<script>
export default {
  data () {
    var validatePass2 = (rule, value, callback) => {
        if (value !== this.regform.password1) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
    	regform:{
    		password1:'',            
      	password2:'',
    	}, 
    	disable:false,
      	rules: { 
          password1: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { pattern: /^[A-Z](?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]*$/, message: '密码必需是以大写字母开头,且小写和数字的混合,不得包含特殊字条', trigger: 'blur'},
            { min: 6, max: 16, message: '密码必需是6-16位', trigger: 'blur'},
          ],
          password2: [
            { required: true, message: '请输入确认密码', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ]              
        }
    }
  },
  methods: {    
    submitForm(formName) {
      var that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          	that.disable = true;
          	that.axios({
              method:'post',
              url: '/BeautyScience/admin/register',
              data:{
                admin:{
                  email:that.$route.query.email,
                  uuid:that.$route.query.uuid,
                  password:that.regform.password1           
                }
              }
            }).then(function (res) {            	
              console.log(res)
              if(res.status == 200){
                that.$message.success('密码设置成功');
                //that.disable = false;
                window.localStorage.clear();             
                that.$router.push('/login');
              }else{
                that.$message.error('密码设置失败');
              }                           
            }).catch(function (error) {
              console.log(error);             
            });          
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }    
  },
  mounted(){
    console.log(this.$route)
  }
}
</script>