<template>
	<div>
		<div class="crumbs-box">
			<div class="user-crumbs">			
				<h3>单版本会员</h3>
				<el-button type="primary" icon="el-icon-plus" @click="addGrade">点击添加会员类别</el-button>
			</div>
		</div>
		<div>			
			<table class="table-box" cellpadding="0" cellspacing="0">
				<thead>
					<tr>
						<th>类别名称</th>
						<th>会员时长</th>
						<th>现价</th>
						<th>原价</th>
						<th width="300">折扣</th>						
						<th width="130">操作</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item,index) in tableData">
						<td class="black-text">{{item.typeName}}</td>
						<td>{{item.duration}}</td>
						<td>{{item.price}}</td>
						<td>{{item.costPrice}}</td>
						<td>{{item.discount}}%</td>						
						<td class="opt">
							<el-button type="primary" size="mini" @click="addGrade(item.id)">编辑</el-button>
							<el-button type="danger" size="mini">删除</el-button>							
						</td>
					</tr>					
				</tbody>
			</table>			
		</div>
		<div class="text-center m-t-md">
			<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="currentPage"
		      :page-sizes="[10, 20, 30, 40]"
		      :page-size="100"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="400">
		    </el-pagination>
		</div>
		<el-dialog :visible.sync="dialogVisible" :show-close="false" width="40%">
		  <el-form ref="memberCate" :rules="rules" :model="memberCate" label-width="80px">
			  <el-form-item label="名称" prop="title">
			    <el-input v-model="memberCate.title" placeholder="请输入会员类别名称"></el-input>
			  </el-form-item>
			  <el-form-item label="时长" prop="duration">
			    <el-input v-model="memberCate.duration" placeholder="请输入时长"></el-input>
			  </el-form-item>
			  <el-form-item label="现价" prop="price">
			    <el-input v-model="memberCate.price" placeholder="请输入现价"></el-input>
			  </el-form-item>
			  <el-form-item label="原价" prop="costPrice">
			    <el-input v-model="memberCate.costPrice" placeholder="请输入原价"></el-input>
			  </el-form-item>
			  <el-form-item label="折扣" prop="discount">
			    <el-input v-model="memberCate.discount" placeholder="请输入折扣百分比"></el-input>
			  </el-form-item>			  			  
			  <el-form-item>
			    <el-button type="danger" @click="closeDialog">取消</el-button>
			    <el-button type="primary" @click="submitForm('memberCate')">提交</el-button>
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
        	memberCate:{
        		title:'',
				duration:'',
				price:'',
				costPrice:'',
				discount:''
        	},
        	rules: {
	          title: [
	            { required: true, message: '请输入会员类别名称', trigger: 'blur' }	            
	          ],
	          duration: [
	            { required: true, message: '请输入时长', trigger: 'blur' }
	          ],
	          price: [
	            { required: true, message: '请输入现价', trigger: 'blur' }
	          ],
	          costPrice: [
	            { required: true, message: '请输入原价', trigger: 'blur' }
	          ]	                   
	        },
        	identityVal:'全部身份',
        	versionVal:'全部版本',
        	DropShow1:false,
        	DropShow2:false,
        	currentPage: 5,
        	searchContent:'',
        	identityArr:['全部身份','老师','学生'],
        	versionArr:['全部版本','人教版','教科版','粤教版'],
        	tableData:[
        		{
		            id:1,
		            typeName: '一个月VIP会员',
		            duration: '1个月',
		            price: '88.0',
		            costPrice:'108.0',
		            discount:'50'		            
		        },
		        {
		            id:2,
		            typeName: '一个月VIP会员',
		            duration: '1个月',
		            price: '88.0',
		            costPrice:'108.0',
		            discount:'50'		            
		        },
        	]          
        }
      },
      methods: {
      	DropDown(num){//下拉  		
      		switch(num)
			{
			case 1:
				this.DropShow2 = false;			
				this.DropShow1 = ! this.DropShow1;
				break;
			case 2:
				this.DropShow1 = false;
				this.DropShow2 = ! this.DropShow2;
				break;			
			}
      	},      	
      	ClickId(type,name){//选择值 
      		switch(type)
			{
			case 1:
			  this.DropShow1 = false;
      		  this.identityVal = name;
			  break;
			case 2:
			  this.DropShow2 = false;
      		  this.versionVal = name;
			  break;			
			}
      	},
	    handleSizeChange(val) {
	       console.log(`每页 ${val} 条`);
	    },
	    handleCurrentChange(val) {
	       console.log(`当前页: ${val}`);
	    },
	    addGrade(id){
	    	this.dialogVisible = true;
	    	if(id>0){	    		
	    		this.memberCate.title = "1234567"
	    	}else{
	    		this.memberCate={
	        		title:'',
					duration:'',
					price:'',
					costPrice:'',
					discount:''
	        	}
	    	}
	    },
	    closeDialog(){
	    	this.dialogVisible=false;
	    	this.resetForm();
	    },
	    submitForm(formName) {
	        this.$refs[formName].validate((valid) => {
	          if (valid) {
	            alert('submit!');
	          } else {
	            console.log('error submit!!');
	            return false;
	          }
	        });
	    },
	    resetForm() {
	        this.$refs['memberCate'].resetFields();
	    }	    
	  },
	  mounted(){
	  	var that = this;
	  	document.addEventListener('click', (e) => {
	       	if(this.$el.contains(e.target)){
	       		that.DropShow1 = false;
	       		that.DropShow2 = false;
	       	}
	   })
	  }
    }
 </script>
<style scoped>
	

</style>