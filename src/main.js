// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import '@/assets/main.css'
import vueEditor from 'vue-quill-editor'
// import 'jquery'
require('qiniu-js/dist/qiniu.js')

Vue.use(ElementUI)
Vue.use(vueEditor)


Vue.config.productionTip = false

Vue.prototype.axios = axios;


// 超时登陆

// if(window.localStorage.getItem('refreshExp')!=null){
//   refreshToken();
// }else{
//   router.replace({
//     path:'/login'
//   })
// }

axios.interceptors.request.use(function (config) {  //配置发送请求的信息  
  if(config.url == "/BeautyScience/admin/login"){
    return config;
  }else if(config.url == "/BeautyScience/admin/refresh"){    
    return config;
  }else if(config.url == "/BeautyScience/admin/register"){
    return config;
  }
  var timer = null;
  var now = parseInt(new Date().valueOf()/1000); 
  var accessExp = parseInt(window.localStorage.getItem('accessExp'));
  var refreshExp = window.localStorage.getItem('refreshExp');
  var ctimes = (accessExp - now)*1000;

  
  if(ctimes<3000){
    refreshToken();
    var currentUrl = router.history.current.path;
    setTimeout(
      router.replace({
      path:currentUrl
    }),2000);
  } 
  // console.log(ctimes);  
  //clearInterval(timer);
  if(timer != null){clearInterval(timer);}
  timer = setInterval(refreshToken, ctimes);


  setInterval(refreshToken, 300000);//5分钟执行一次300000
  
  if (now < parseInt(refreshExp)) {//没过期      
      config.headers.common['Authorization'] = `Bearer ${window.localStorage.getItem('accessToken')}`;      
  }else{
        window.localStorage.clear();
        router.replace({
          path:'/login'
        })
  }  
  return config;
}, function (error) {
  // console.log(error)
  return Promise.reject(error);
});



axios.interceptors.response.use(function (response) { //配置请求回来的信息  
  return response;
}, function (error) {
  var err = error.response;
  var currentUrl = router.history.current.path;
  if(err.status == 401){
    setTimeout(
      router.replace({
      path:currentUrl
    }),2000);//延时2秒        
  }  
  return Promise.reject(error);
});

function refreshToken(){//过期刷新token
  var that = this;
  var now = parseInt(new Date().valueOf()/1000);
  var accessExp = window.localStorage.getItem('accessExp');
  var refreshExp = window.localStorage.getItem('refreshExp');  
  if(now > parseInt(accessExp) && now < parseInt(refreshExp)){    
    axios.post('/BeautyScience/admin/refresh', {
      token:{
        refresh_token:window.localStorage.getItem('refreshToken')
      }
    }).then(function (response) {
        //console.log('refreshToken',response);        
        var data = response.data;        
        window.localStorage.setItem('accessToken', data.access_token);
        window.localStorage.setItem('accessExp', data.access_exp);
    });
    return;
  }
}



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})