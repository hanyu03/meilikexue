<template>
	<div>
		<div class="user-tabs">
			<ul>
				<li><router-link to="/manage/user/list" active-class="active">用户管理<i></i></router-link></li>
				<li><router-link to="/manage/vip/list" active-class="active">会员管理<i></i></router-link></li>
				<li><router-link to="/manage/grade/list" active-class="active">会员等级管理<i></i></router-link></li>		
			</ul>
		</div>		
		<router-view></router-view>
	</div>
</template>
<script>
export default { 
  data () {    
    return {    
                    
    }
  },
  methods: {
  },
  mounted(){    
    
  }
}
</script>
<style scoped>
.user-tabs { width: 100%; min-width: 1200px; height: 96px; background-color: #ffffff; box-shadow:2px 2px 5px rgba(0,0,0,0.36); position: relative; }
.user-tabs ul{ padding: 0 12%; margin: 0 auto; overflow: hidden;}
.user-tabs ul li{float: left; width: 33%; height: 66px; text-align:center; font-size: 20px; color: #999999; border-right:1px solid #e6e6e6; padding-top: 30px;}
.user-tabs ul li a{color: #999999; display: block;}
.user-tabs ul li:last-child{border-right: none}
.user-tabs ul li i{height: 4px; width: 36px; background-color: #e6e6e6; display: block; margin: 15px auto 0 auto;}
.user-tabs ul li a.active{color: #47a8de;}
.user-tabs ul li a.active i{background-color: #47a8de;}
</style>