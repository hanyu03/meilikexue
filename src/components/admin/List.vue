<template>
	<div class="background-gray admin-box" :style="{ height: adminH + 'px' }">
		<div class="admin-crumbs clearfix">
			<h3>管理员权限管理列表</h3>
			<el-button type="primary" icon="el-icon-plus" class="m-t hj-fr" @click="addAdmin">添加管理员</el-button>
		</div>			
		<div class="admin-table">
			<table class="table-box2" cellpadding="0" cellspacing="0">				
				<tbody>
					<tr v-for="(item,index) in tableData">
						<td width="200">{{item.email}}</td>
						<td>
							<template v-if="item.level===0">只读</template>
							<template v-else-if="item.level===1">编辑</template>
							<template v-else-if="item.level===2">管理员</template>
							<template v-else="item.level===3">超管</template>
						</td>						
						<td class="opt" width="160">
							<el-button type="primary" size="mini" @click="editRole(item.id,item.email,item.level)">权限变更</el-button>
							<el-button type="danger" size="mini" @click="delAdmin(item.id)" disabled v-if="item.level===3">删除</el-button>
							<el-button type="danger" size="mini" @click="delAdmin(item.id)" v-else>删除</el-button>
						</td>	
					</tr>					
				</tbody>
			</table>
		</div>
		<!-- <div class="text-center m-t-md m-b-md">
			<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="pageData.PageID"
		      :page-sizes="pageSize"
		      :page-size="pageData.Perpage"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="pageData.Results">
		    </el-pagination>
		</div> -->
		<el-dialog :visible.sync="dialogVisible" :show-close="false" width="30%">
		  <el-form ref="adminData" :model="adminData" size="small" class="adminForm">
		  	<el-form-item prop="roleid" :rules="[{ required: true, message: '请选择权限'}]">
			  <el-select v-model="adminData.roleid" placeholder="请选择权限">
			      <el-option :label="item.name" :value="item.id" v-for="(item,index) in roleArr" :key="index" :disabled="item.disabled"></el-option>
			    </el-select>
			  </el-form-item>
			  <el-form-item prop="email" :rules="[{ required: true, message: '请输入邮箱地址'}]">			    
			    <el-input v-model="adminData.email" placeholder="请输入邮箱,如abc@qq.com"></el-input>
			  </el-form-item>			  			  			  			  			  
			  <el-form-item>
			  	<el-button type="danger" @click="closeDialog(1)">取消</el-button>
			  	<el-button type="primary" @click="submitForm('add','adminData')">提交</el-button>
			  </el-form-item>
			</el-form>
		</el-dialog>
		<el-dialog :visible.sync="dialogVisible2" :show-close="false" width="30%">
		  <el-form ref="adminRole" :model="adminRole" size="small" class="adminForm">
		  	<el-form-item>			  
			  <el-form-item>			    
			    <i class="blue-dot"></i> {{adminRole.roleEmail}}
			  </el-form-item>
			  <el-select v-model="adminRole.roleId" placeholder="请选择权限" :rules="[{ required: true, message: '请选择权限'}]">
			      <el-option :label="item.name" :value="item.id" v-for="(item,index) in roleArr" :key="index" :disabled="item.disabled"></el-option>
			    </el-select>
			  </el-form-item>			  			  			  			  			  
			  <el-form-item>
			  	<el-button type="danger" @click="closeDialog(2)">取消</el-button>
			  	<el-button type="primary" @click="submitForm('eidt','adminRole')">提交</el-button>
			  </el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<script>
    export default {
      data() {
        return {
        	dialogVisible:false,
        	dialogVisible2:false,
        	page:1,
        	roleArr:[
        		{id:0,name:'只读'},
        		{id:1,name:'编辑'},
        		{id:2,name:'管理员'},
        		{id:3,name:'超管',disabled: true}
        	],
        	tableData:[],
        	adminH:300,
        	adminData:{
        		roleid:null,        		
        		email:''        		    		
        	},        	
        	adminRole:{        		
	    		adminId:null,
	        	roleId:null,
	        	roleEmail:''
        	}
        }
      },
      methods: {
	  	   resize () {
	          var that=this;
	          var bodyHeight=window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	          that.adminH = bodyHeight;	          
	        },
	        getList(){
	      		var that = this;
		        that.axios({
		          method:'get',
		          url: '/BeautyScience/admins'		          
		        }).then(function (res) {
		        	//console.log(res);	        	
		        	that.tableData = res.data.records;
		        }).catch(function (error) {
		        	if(error.response.status == 403){
		        		that.$message.error(error.response.data.error);		        		
		        	}		          	          
		        });           
	      	},
	        delAdmin(id){//删除
	        	var that = this;
	        	this.$confirm('您确认要删除吗？', '提示', {
		          confirmButtonText: '确认',
		          cancelButtonText: '取消',
		          type: 'warning'              
		        }).then(() => {
		          that.axios({
		              method:'post',
		              url: '/BeautyScience/admins/'+id+'/delete'		              
		            }).then(function (res) {
		              //console.log(res)
		              if(res.status == 204){
		                that.$message.success('删除成功');
		                that.getList();	                
		              }else{
		                that.$message.error('删除失败');
		              }                           
		            }).catch(function (error) {
		              console.log(error);             
		            });
		        }).catch(() => {
		          //已取消
		        });
	        },
	        addAdmin(){
	        	this.dialogVisible = true;
	        },
	        editRole(id,email,level){	        	
	        	this.dialogVisible2 = true;
	        	this.adminRole.adminId = id;
	        	this.adminRole.roleEmail = email;
	        	this.adminRole.roleId = level;
	        },
	        closeDialog(id){
	        	if(id == 1){
	        		this.dialogVisible = false;
	        		this.resetForm();
	        	}else{
	        		this.dialogVisible2 = false;
	        	}        	
	        },
	        submitForm(types,formName) {
	        	var that = this;
		        this.$refs[formName].validate((valid) => {
		          if (valid) {
		          	if(types === 'add'){//添加管理员
		          		that.axios({
				          method:'post',
				          url: '/BeautyScience/mail/register_admin',
				          data:{
				          	admin:{
			                  email:that.adminData.email,
			                  level:that.adminData.roleid			                            
			                }
				          }                 
				        }).then(function (res) {				        	                
				          if(res.status === 200){
				            that.$message.success('添加成功'+res.data.msg);
				            that.dialogVisible = false;
				          }else{
				          	that.$message.error('添加失败');
				          }    
				        }).catch(function (error) {
				          console.log(error);             
				        });
		          	}else{
		          		//console.log(that.adminRole.roleId);
		          		that.axios({
				          method:'post',
				          url: '/BeautyScience/admins/'+that.adminRole.adminId+'/update',
				          data:{
				          	admin:{
			                  email:that.adminRole.roleEmail,
			                  level:that.adminRole.roleId			                            
			                }
				          }                 
				        }).then(function (res) {				        	            
				          if(res.status === 200){
				            that.$message.success('变更成功');
				            that.dialogVisible2 = false;
				          }else{
				          	that.$message.error('变更失败');
				          }    
				        }).catch(function (error) {
				          console.log(error);             
				        });
		          	}
		            //alert('submit!');
		          } else {
		            console.log('error submit!!');
		            return false;
		          }
		        });
		    },
		    resetForm() {
	          this.$refs['adminData'].resetFields();
	      	}
	  },
	  mounted(){
	  	var that = this;
	  	this.resize();
	  	this.getList();
	  	window.onresize=function () {
		  that.resize();
		};
	  }
    }
 </script>
<style scoped>	
	.admin-box{ width: 100%; min-width: 1200px; overflow: hidden;}
	.admin-crumbs{margin: 50px 12% 20px 12%;  background-color: #FFF; padding: 0 50px; height: 90px}
	.admin-crumbs h3{ line-height: 90px; display: inline-block; font-size: 20px}
	.admin-table{margin: 0px 12% 50px 12%;  background-color: #FFF;}
	.adminForm{padding: 0 30px;}	
</style>