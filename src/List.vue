<template>
	<div>
		<div class="crumbs-box">
			<div class="user-crumbs">
				<h3>用户列表({{pageData.Results}})</h3>
				<router-link to="/manage/adduser">			
					<el-button type="primary" icon="el-icon-plus">开通新账号</el-button>
				</router-link>
				<div class="searchBox" style="min-width:70%;">
					<el-row>
						<!-- <el-col :span="10" class="areaSelect">
							<area-select type='text' v-model="location" :data="pcaa"></area-select>
						</el-col> -->
						<el-col :span="8" class="areaSelect">
							<el-input placeholder="输入学校" v-model="school" @focus="clearSearchcontent">
								<el-button type="primary" slot="append" @click="searchList(1)">搜索</el-button>
							</el-input>
						</el-col>
						 <!-- class="input-with-select" -->
						<el-col :span="8" style="position:relative;">
							<el-input placeholder="输入搜索信息" v-model="searchContent" @focus="clearSchool">
								<!-- <el-button type="primary" slot="append" @click="searchList(1)">搜手机</el-button> -->
								<el-button class="btnPhone" slot="append" type="primary" @click="searchList1(1,1)">搜手机</el-button>
							
							</el-input>
							<el-button class="btnName" type="primary" @click="searchList1(2,1)">搜姓名</el-button>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<div>
			<table class="table-box" cellpadding="0" cellspacing="0">
				<thead>
					<tr>
						<th width="80">用户名</th>
						<th width="100">手机号</th>						
						<th>开通时间</th>
						<th>状态</th>
						<th width="60">姓名</th>
						<th>							
							<span @click.stop="DropDown(1)">{{utypeVal.name}}<i class="el-icon-caret-bottom"></i></span>
							<ul class="dropList" v-show="DropShow1">
								<template v-for="item in identityArr">
									<li @click="ClickId(1,item.value,item.name)">{{item.name}}</li>
								</template>							
							</ul>
						</th>
						<th>
							<span @click.stop="DropDown(2)">{{bookVal.name}}<i class="el-icon-caret-bottom"></i></span>
							<ul class="dropList" v-show="DropShow2">
								<li @click="ClickId(2,null,'全部版本')">全部版本</li>
								<template v-for="item in versionArr">
								<li @click="ClickId(2,item.id,item.name)">{{item.name}}</li>
								</template>								
							</ul>
						</th>						
						<th>学校</th>
						<th width="200">操作</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item,index) in tableData">
						<td class="black-text">{{item.name}}</td>
						<td>{{item.phone}}</td>						
						<td>{{fDate(item.created_at)}}</td>
						<td>
							<template v-if="item.status==0">正常</template>
							<template v-else-if="item.status==1">禁用</template>
							<template v-else="item.status==2">禁言</template>
						</td>
						<td>{{item.full_name}}</td>
						<td>{{item.utype?'老师':'学生'}}</td>
						<td>{{item.book_name}}</td>	
						<td>{{item.school_city}}<span v-if="item.school_city">市</span>{{item.school_name}}</td>						
						<td class="opt">
							<router-link :to="'/manage/edituser/'+item.id"><el-button type="primary" size="mini" class="m-r">编辑</el-button></router-link>
							<el-button type="warning" size="mini" @click="Setpower(item.id,1)" v-if="item.status==0">封禁</el-button>
							<el-button type="warning" size="mini" @click="Setpower(item.id,0)" v-else>解封</el-button>
							<el-button type="success" size="mini" @click="openFun(item.id)">开会员</el-button>
						</td>
					</tr>					
				</tbody>
			</table>			
		</div>

		<div class="text-center m-t-md m-b-md"
			v-if="school == ''&& searchContent == ''">
			<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="pageData.PageID"
		      :page-sizes="pageSize"
		      :page-size="pageData.Perpage"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="pageData.Results">
			</el-pagination>
			<div>1</div>
		</div>
		<div class="text-center m-t-md m-b-md"
		v-else-if="school != ''&& searchContent == ''">
			<el-pagination
		      @size-change="handleSizeChange2"
		      @current-change="handleCurrentChange2"
		      :current-page="pageData.PageID"
		      :page-sizes="pageSize"
		      :page-size="pageData.Perpage"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="pageData.Results">
			</el-pagination>
			<div>2</div>
		</div>
		<div class="text-center m-t-md m-b-md"
		v-else-if="(searchContent != '' && school == '')">
			<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="pageData.PageID"
		      :page-sizes="pageSize"
		      :page-size="pageData.Perpage"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="pageData.Results">
			</el-pagination>
			<div>3</div>
		</div>

		<el-dialog title="会员开通" :visible.sync="dialogVisible" :show-close="false" width="40%">
		  <el-form ref="renewal" :model="userInfo" label-width="100px" size="mini">
			  <el-form-item label="用户名" class="gray-text">
			    {{userInfo.username}}
			  </el-form-item>			  
			  <el-form-item label="会员时长" prop="duration" :rules="[{ required: true, message: '请选择会员时长'}]">
			  	<el-radio-group v-model="userInfo.duration" class="renewal">
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
// import 'vue-area-linkage/dist/index.css';
// import {AreaSelect} from 'vue-area-linkage';
import {CustomFun,pageSizes} from '../../../assets/main.js'

// const pcaaDefault = require('area-data/pcaa');
    export default {
			// components:{AreaSelect},
      data() {
        return {  
			// pcaa:pcaaDefault,      	     	
        	pageSize:pageSizes,
        	dialogVisible:false,
        	openId:null,
        	utypeVal:{id:null,name:'全部身份'},
        	bookVal:{id:null,name:'全部版本'},
        	DropShow1:false,
			DropShow2:false,
			// location:[],
			school:'',      	
        	searchContent:'',
        	identityArr:[
        		{value:null,name:'全部身份'},
        		{value:1,name:'老师'},
        		{value:0,name:'学生'}
        	], 
        	versionArr:[],       	
        	userInfo:{
        		username:'张三',        		
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
        	tableData:[],
        	pageData:{					
				PageID:1,
				Perpage:10,
				Results:1											
			},
			btnType:""      
        }
      },
      methods: {
      	fDate:CustomFun.formatDate,      	
      	getList(page){
      		var that = this;
	        that.axios({
	          method:'get',
	          url: '/BeautyScience/users',
	          params:{
	          	page:page,
	          	per:that.pageData.Perpage,
	          	utype:that.utypeVal.id,
	          	book_id:that.bookVal.id
	          }
	        }).then(function (res) {	            	
	        	that.tableData = res.data.records;	        	
	        	that.pageData.Results = res.data.all;
	        	that.tableData.forEach(function (item,index) {
	        		if(item.book_id!=null){
	        			var obj = {};
				        obj = that.versionArr.find((bitem)=>{          
				            return bitem.id === item.book_id;
				        });
				        that.$set(item,"book_name",obj.name);				        
				        //item.book_id = obj.name;				        
	        		}
			    })	      
	        }).catch(function (error) {
	          console.log(error);		          
	        });           
      	},
      	searchList(page){
      		var that = this;
      		if(this.school==''){
      			that.getList(1);
      		}else{
      			that.axios({
		          method:'post',
		          url: '/BeautyScience/users/search',
		          data:{
					school_name:that.school,
					page:page,
	          		per:that.pageData.Perpage
		          }
		        }).then(function (res) {	        		        	
		        	that.tableData = res.data.records;	        	
		        	that.pageData.Results = res.data.all;		      
		        }).catch(function (error) {
		          console.log(error);		          
		        });
      		}	                   
      	},
		searchList1(btnType,page){
			let that =this
			if(this.searchContent!=''){
				if(btnType == 1){
					this.btnType = 1
					that.axios({
						method:'post',
						url: '/BeautyScience/users/search',
						data:{
							phone:that.searchContent,
							page:page,
	          				per:that.pageData.Perpage
						}
					}).then(function (res) {	        		        	
						that.tableData = res.data.records;	        	
						that.pageData.Results = res.data.all;		      
					}).catch(function (error) {
						console.log(error);		          
					});
				}else{
					this.btnType = 2
					that.axios({
						method:'post',
						url: '/BeautyScience/users/search',
						data:{
							full_name:that.searchContent
						}
					}).then(function (res) {	        		        	
						that.tableData = res.data.records;	        	
						that.pageData.Results = res.data.all;		      
					}).catch(function (error) {
						console.log(error);		          
					});
				}
			}else{
				that.getList(1);
			}
		},
      	Setpower(id,status){//解封/封禁
      		var that = this;
	        that.axios({
	          method:'post',
	          url: '/BeautyScience/users/change_status',
	          data:{
	          	ban: { 
	          		user_id: id, 
	          		status: status, 
	          		duration: 86400 
	          	}
	          }         
	        }).then(function (res) {
	        	if(res.status === 200){
	        		that.getList(that.pageData.PageID);
	        	}	        		        	    		        	
	        }).catch(function (error) {
	          console.log(error);		          
	        });
      	}, 
      	bookList(){//版本
      		var that = this;
	        that.axios({
	          method:'get',
	          url: '/BeautyScience/books'	          
	        }).then(function (res) {
	        	if(res.status === 200){
	        		that.versionArr = res.data.records;
	        		that.getList(1);
	        	}else{
	        		console.log(res)
	        	}	        	
	        		        	    		        	
	        }).catch(function (error) {
	          console.log(error);		          
	        });
      	},    	      	 	   
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
						ClickId(type,id,name){//选择值 
							switch(type)
					{
					case 1:
						this.DropShow1 = false;
								this.utypeVal = {id:id,name:name};
						break;
					case 2:
						this.DropShow2 = false;
								this.bookVal = {id:id,name:name};
						break;			
					}
			this.getList(1);			
		},
	    
		clearSchool(){
			this.school=""
		},
		clearSearchcontent(){
			this.searchContent=""
		},

		handleSizeChange(val) {
			this.pageData.Perpage = val;
			let that =this
			if(this.btnType == 1){
				that.axios({
					method:'post',
					url: '/BeautyScience/users/search',
					data:{
						phone:that.searchContent,
						page:1,
						per:that.pageData.Perpage
					}
				}).then(function (res) {	        		        	
					that.tableData = res.data.records;	        	
					that.pageData.Results = res.data.all;		      
				}).catch(function (error) {
					console.log(error);		          
				});
			}else if(this.btnType == 2){
				that.axios({
					method:'post',
					url: '/BeautyScience/users/search',
					data:{
						full_name:that.searchContent,
						page:1,
						per:that.pageData.Perpage
					}
				}).then(function (res) {	        		        	
					that.tableData = res.data.records;	        	
					that.pageData.Results = res.data.all;		      
				}).catch(function (error) {
					console.log(error);		          
				});
			}
	    },
	    handleCurrentChange(val) {
	    	this.pageData.PageID = val;
			let that =this
			if(this.btnType == 1){
				that.axios({
					method:'post',
					url: '/BeautyScience/users/search',
					data:{
						phone:that.searchContent,
						page:val,
						per:that.pageData.Perpage
					}
				}).then(function (res) {	        		        	
					that.tableData = res.data.records;	        	
					that.pageData.Results = res.data.all;		      
				}).catch(function (error) {
					console.log(error);		          
				});
			}else if(this.btnType == 2){
				that.axios({
					method:'post',
					url: '/BeautyScience/users/search',
					data:{
						full_name:that.searchContent,
						page:val,
						per:that.pageData.Perpage
					}
				}).then(function (res) {	        		        	
					that.tableData = res.data.records;	        	
					that.pageData.Results = res.data.all;		      
				}).catch(function (error) {
					console.log(error);		          
				});
			}
	    },
		// search school
	    handleSizeChange2(val) {
			let that = this
			this.pageData.Perpage = val;
			this.axios({
				method:'post',
				url: '/BeautyScience/users/search',
				data:{
				school_name:that.school,
				page:1,
				per:that.pageData.Perpage
				}
			}).then(function (res) {	        		        	
				that.tableData = res.data.records;	        	
				that.pageData.Results = res.data.all;		      
			}).catch(function (error) {
				console.log(error);		          
			});
	    },
	    handleCurrentChange2(val) {
			let that = this
	    	this.pageData.PageID = val;
			that.axios({
				method:'post',
				url: '/BeautyScience/users/search',
				data:{
					school_name:that.school,
					page:val,
					per:that.pageData.Perpage
				}
			}).then(function (res) {	        		        	
				that.tableData = res.data.records;	        	
				that.pageData.Results = res.data.all;		      
			}).catch(function (error) {
				console.log(error);		          
			});
	    },
		// search phone&name
	    handleSizeChange3(val) {
			let that = this
			this.pageData.Perpage = val;
			this.axios({
				method:'post',
				url: '/BeautyScience/users/search',
				data:{
				school_name:that.school,
				page:1,
				per:that.pageData.Perpage
				}
			}).then(function (res) {	        		        	
				that.tableData = res.data.records;	        	
				that.pageData.Results = res.data.all;		      
			}).catch(function (error) {
				console.log(error);		          
			});
	    },
	    handleCurrentChange3(val) {
			let that = this
	    	this.pageData.PageID = val;
			that.axios({
				method:'post',
				url: '/BeautyScience/users/search',
				data:{
					school_name:that.school,
					page:val,
					per:that.pageData.Perpage
				}
			}).then(function (res) {	        		        	
				that.tableData = res.data.records;	        	
				that.pageData.Results = res.data.all;		      
			}).catch(function (error) {
				console.log(error);		          
			});
	    },
	    openFun(id){//开通
	    	this.dialogVisible = true;
	    	//console.log(id)
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
	  	this.bookList();	
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
.areaSelect{
	display: inline-flex;
	justify-content: flex-end;
	padding-right: 10px;
}
.btnPhone{
	
}
.btnName{
	position: absolute;
	top: 0;
	right: -88px;
	height: 36px;
	border-radius: 0;
	background-color: #47a8de;
}

</style>