<template>
	<div>				
		<table class="table-box td-pd" cellpadding="0" cellspacing="0">
			<thead>
				<tr>
					<th>姓名</th>
					<th style="min-width:100px;">手机号</th>
					<th style="min-width:100px;">邮箱</th>
					<th>时间</th>
					<th width="500">简介</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(item,index) in tableData" :key="index">
					<td class="black-text">{{item.user.full_name}}</td>
					<td>{{item.phone}}</td>
					<td>{{item.email}}</td>
					<td>{{item.time}}</br>{{item.hms}}</td>
					<td>{{item.text}}</td>	
				</tr>					
			</tbody>
		</table>
		<div class="text-center m-t-md m-b-md">
			<el-pagination
				@current-change="handleCurrentChange"
				:current-page="pageData.PageID"
				:page-size="pageData.Perpage"
				layout="total, prev, pager, next, jumper"
				:total="pageData.Results">
			</el-pagination>
		</div>	
	</div>
</template>
<script>
    export default {
      data() {
        return {
			pageData:{
				PageID:1,
				Perpage:10,
				Results:1
			},
        	tableData:[]  
        }
      },
      methods: {
      	    getMessages(){
				let that = this,
				userId = window.localStorage.getItem('userid');

				this.axios.get('/BeautyScience/feedbacks',{
					params:{
						page:that.pageData.PageID,
						per:that.pageData.Perpage,
						with_user_name:true
					}
				})
				.then(function(response){
					let dataArr = response.data.records
					that.pageData.Results = response.data.all;
					for(let i = 0;i<dataArr.length;i++){
						let date =new Date(dataArr[i].created_at*1000);
						let Y = date.getFullYear() + '-';
						let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
						let D = date.getDate() + ' ';
						let h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours())  + ':';
						let m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':';
						let s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds());
						dataArr[i].time = Y+M+D;
						dataArr[i].hms = h+m+s;
					}
					that.tableData = response.data.records
				})
			},
			handleCurrentChange(){
				let that = this;
				this.pageData.PageID = val;
				this.getList(that.urlType,val);
			}
	  	},
	  mounted(){
	  	this.getMessages()
	  }
    }
 </script>
<style scoped>
	.messge-crumbs{padding: 0 12%; height: 40px; padding-top: 30px; margin: 0 auto; }
	.messge-crumbs h3{font-weight: 100;}
	.td-pd td{padding-top: 20px; padding-bottom: 20px;}

</style>