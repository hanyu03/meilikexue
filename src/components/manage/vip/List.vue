<template>
	<div>
		<div class="crumbs-box">
			<div class="user-crumbs">
				<h3>会员列表(2013)</h3>
				<div class="searchBox">
	                <el-input placeholder="输入关键词搜索" v-model="searchContent" class="input-with-select">
	                    <el-button type="primary" slot="append">搜索</el-button>
	                </el-input>
	            </div>
			</div>
		</div>
		<div>
			<table class="table-box" cellpadding="0" cellspacing="0">
				<thead>
					<tr>
						<th width="50">用户名</th>
						<th width="80">手机号</th>
						<th>微信</th>
						<th>邮箱</th>
						<th>开通时间</th>
						<th>到期时间</th>
						<th>
							<span @click.stop="DropDown(3)">{{durationVal}}<i class="el-icon-caret-bottom"></i></span>
							<ul class="dropList" v-show="DropShow3">
								<template v-for="item in durationArr">
								<li @click="ClickId(3,item)">{{item}}</li>
								</template>								
							</ul>
						</th>
						<th>姓名</th>
						<th>							
							<span @click.stop="DropDown(1)">{{identityVal}}<i class="el-icon-caret-bottom"></i></span>
							<ul class="dropList" v-show="DropShow1">
								<template v-for="item in identityArr">
								<li @click="ClickId(1,item)">{{item}}</li>
								</template>								
							</ul>
						</th>
						<th>
							<span @click.stop="DropDown(2)">{{versionVal}}<i class="el-icon-caret-bottom"></i></span>
							<ul class="dropList" v-show="DropShow2">
								<template v-for="item in versionArr">
								<li @click="ClickId(2,item)">{{item}}</li>
								</template>								
							</ul>
						</th>						
						<th>学校</th>
						<th width="60">操作</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item,index) in tableData">
						<td class="black-text">{{item.userName}}</td>
						<td>{{item.phone}}</td>
						<td>{{item.weChat}}</td>
						<td>{{item.email}}</td>
						<td>{{item.openDate}}</td>
						<td>{{item.endDate}}</td>
						<td>{{item.duration}}</td>
						<td>{{item.realname}}</td>
						<td>{{item.identity}}</td>
						<td>{{item.version}}</td>						
						<td>{{item.school}}</td>
						<td class="opt">							
							<el-button type="success" size="mini" @click="renewalFun(item.id)">续期</el-button>
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
		<el-dialog title="会员续期" :visible.sync="dialogVisible" :show-close="false" width="40%">
		  <el-form ref="renewal" :model="renewal" label-width="100px" size="mini">
			  <el-form-item label="用户名" class="gray-text">
			    {{renewal.username}}
			  </el-form-item>
			  <el-form-item label="到期时间" class="gray-text">
			    {{renewal.endtime}}
			  </el-form-item>
			  <el-form-item label="会员时长" prop="duration" :rules="[{ required: true, message: '请选择会员时长'}]">
			  	<el-radio-group v-model="renewal.duration" class="renewal">
			      	<el-radio :label="item.value" v-for="(item,index) in Userduration" :key="index">{{item.name}}</el-radio>
		    	</el-radio-group>			  	
			  </el-form-item>			  			  			  
			  <el-form-item>
			  	<el-button type="primary" @click="submitForm('renewal')">提交</el-button>
			    <el-button type="danger" @click="closeDialog">取消</el-button>			    
			  </el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<script>
    export default {
      data() {
        return {
        	identityVal:'全部身份',
        	versionVal:'全部版本',
        	durationVal:'全部时长',
        	DropShow1:false,
        	DropShow2:false,
        	DropShow3:false,
        	dialogVisible:false,
        	renewalId:null,
        	currentPage: 5,
        	searchContent:'',
        	identityArr:['全部身份','老师','学生'],
        	versionArr:['全部版本','人教版','教科版','粤教版'],
        	durationArr:['全部时长','1个月','3个月','6个月','12个月','24个月','36个月'],
        	renewal:{
        		username:'张三',
        		endtime:'2017-11-27 19:00',
        		duration:null    		
        	},
        	Userduration:[
        		{value:1,name:'1个月'},
        		{value:3,name:'3个月'},
        		{value:6,name:'6个月'},
        		{value:12,name:'12个月'},
        		{value:24,name:'24个月'},
        		{value:36,name:'36个月'}
        	],
        	tableData:[
        		{
		            id:1,
		            userName: 'admin',
		            phone: '15988908806',
		            weChat: 'xiaoding',
		            email:'356678990@163.com',
		            openDate:'2017-09-16 09:30',
		            endDate:'2017-09-16 09:30',
		            duration:'1个月',
		            realname:'张三',
		            identity:'老师',
		            version:'人教版	',
		            nature:'普通',
		            school:'成都市同辉学校'
		        },
		        {
		            id:2,
		            userName: 'guest',
		            phone: '15088908806',
		            weChat: 'lisi',
		            email:'356678990@163.com',
		            openDate:'2017-09-16 09:30',
		            endDate:'2017-09-16 09:30',
		            duration:'24个月',
		            realname:'李四',
		            identity:'老师',
		            version:'人教版	',
		            nature:'VIP',
		            school:'成都市同辉学校'
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
				this.DropShow3 = false;		
				this.DropShow1 = ! this.DropShow1;
				break;
			case 2:
				this.DropShow1 = false;
				this.DropShow3 = false;
				this.DropShow2 = ! this.DropShow2;
				break;
			case 3:
				this.DropShow1 = false;
				this.DropShow2 = false;
				this.DropShow3 = ! this.DropShow3;
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
			case 3:
			  this.DropShow3 = false;
      		  this.durationVal = name;
			  break;			
			}
      	},
	    handleSizeChange(val) {
	       console.log(`每页 ${val} 条`);
	    },
	    handleCurrentChange(val) {
	       console.log(`当前页: ${val}`);
	    },
	    renewalFun(id){//续期
	    	this.dialogVisible = true;
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
	    closeDialog(){
	    	this.dialogVisible=false;
	    	this.resetForm();
	    },
	    resetForm() {
	        this.$refs['renewal'].resetFields();
	    }
	  },
	  mounted(){
	  	var that = this;
	  	document.addEventListener('click', (e) => {
	       	if(this.$el.contains(e.target)){
	       		that.DropShow1 = false;
	       		that.DropShow2 = false;
	       		that.DropShow3 = false;
	       	}
	   })
	  }
    }
 </script>
<style scoped>
	
</style>