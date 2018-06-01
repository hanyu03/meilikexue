<template>
	<div class="addUser">
		<h3>新账号开通(<em>*</em>必填)</h3>
		<div class="add-user">
			<el-form ref="userform" :rules="rules" :model="userform" label-width="100px" class="addform" size="small">
			  <el-form-item label="用户名" prop="username">
			    <el-input v-model="userform.username"></el-input>
			  </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userform.phone"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="full_name">
          <el-input v-model="userform.full_name"></el-input>
        </el-form-item>
			  <el-form-item label="初始密码" prop="password1">
			    <el-input type="password" v-model="userform.password1" auto-complete="off"></el-input>
			  </el-form-item>		  
			  <el-form-item label="确认密码" prop="password2">
			    <el-input type="password" v-model="userform.password2" auto-complete="off"></el-input>
			  </el-form-item>			  
			  <el-form-item label="身份" prop="utype" :rules="[{ required: true, message: '请选择身份'}]">
          <el-radio-group v-model="userform.utype">
            <el-radio :label="1">老师</el-radio>
            <el-radio :label="0">学生</el-radio>
          </el-radio-group>			  			    
			  </el-form-item>
			  <el-form-item label="版本" prop="book_id" :rules="[{ required: true, message: '请选择版本'}]">
          <el-radio-group v-model="userform.book_id">
              <el-radio :label="item.id" v-for="(item,index) in versionArr" :key="index">{{item.name}}</el-radio>
          </el-radio-group>			  			    
			  </el-form-item>
			  <el-form-item label="学校" prop="school">
			    <el-input v-model="userform.school"></el-input>
			  </el-form-item>
			  
			  <!-- <el-form-item label="昵称" prop="nick">
			    <el-input v-model="userform.nick"></el-input>
			  </el-form-item>
			  <el-form-item label="邮箱" prop="email">
			    <el-input v-model="userform.email"></el-input>
			  </el-form-item> -->
			  <el-form-item>
			    <el-button type="primary" @click="submitForm('userform')">提交</el-button>
			    <router-link to="/manage/user/list"><el-button type="danger" class="m-l">取消</el-button></router-link>
			  </el-form-item>
			</el-form>			
		</div>
	</div>
</template>
<script>
  export default {
    data() {
	  var validatePass2 = (rule, value, callback) => {
        if (value !== this.userform.password1) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        userform: {
          username: '',
          password1: '',
          password2: '',
          full_name: '',
          utype: 0,
          book_id: 1,
          school: '',
          phone: '',
          nick:'',
          email:''
        }, 
        versionArr:[],       
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '用户名必需是以英文字母开头，只能包含英文字母、数字、下划线', trigger: 'blur'}           
          ],
          password1: [
            { required: true, message: '请输入初始密码', trigger: 'blur' },
            { min: 6, max: 16, message: '密码必需是6-16位', trigger: 'blur'}
          ],
          password2: [
            { required: true, message: '请输入确认密码', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
          ],          
          address:[
            { min: 4, message: '请正确输入学校名称', trigger: 'blur'}
          ],         
          phone:[
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { pattern: /^1[345678]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur,change'}
          ]                             
        }
      }      
    },
    methods: {      
      submitForm(formName) {
        var that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.axios({
              method:'post',
              url: '/BeautyScience/users/create',
              data:{
                user:{
                  name:that.userform.username,
                  password:that.userform.password1,
                  phone:that.userform.phone,
                  utype:that.userform.utype,
                  status:0,
                  //nick:that.userform.nick,                   
                  address:that.userform.school,
                  //email:that.userform.email,                   
                  full_name:that.userform.full_name, 
                  book_id:that.userform.book_id
                }
              }
            }).then(function (res) {
              if(res.status == 201){
                that.$message.success('添加成功');
                that.$router.push('/manage/user/list');
              }else{
                that.$message.error('添加失败');
              }                           
            }).catch(function (error) {
              console.log(error);             
            });
          } else {
            //console.log('error submit!!');
            return false;
          }
        });
      },
      bookList(){//版本
          var that = this;
          that.axios({
            method:'get',
            url: '/BeautyScience/books'           
          }).then(function (res) {                     
            that.versionArr = res.data.records;                       
          }).catch(function (error) {
            console.log(error);             
          });
        },    
    },
    mounted(){
      this.bookList();
    }
  }
</script>
<style scoped>

</style>