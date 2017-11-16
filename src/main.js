// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import '@/assets/main.css'

Vue.use(ElementUI)


Vue.config.productionTip = false

Vue.prototype.axios = axios;


// 超时登陆

// if(window.localStorage.getItem('accessExp')){
//   alert(1)
// }else{
//   router.replace({
//     path:'/login'
//   })
// }
axios.interceptors.request.use(
  config => {
      if(config.url == "/BeautyScience/admin/login"){
        return config;
      }else if(config.url == "/BeautyScience/admin/refresh"){
        return config;
      }else{
        let now = parseInt(new Date().valueOf()/1000);
        let accessExp = window.localStorage.getItem('accessExp');
        let refreshExp = window.localStorage.getItem('refreshExp');
        if( now < parseInt(accessExp)){
          config.headers.common['Authorization'] = `Bearer ${window.localStorage.getItem('accessToken')}`;
        }else if(now > parseInt(accessExp) && now < parseInt(refreshExp)){
          axios.post('/BeautyScience/admin/refresh', {
            token:{
              refresh_token:window.localStorage.getItem('refreshToken')
            }
          })
          .then(function (response) {
              let data = response.data;
              window.localStorage.setItem('accessToken', data.access_token)
              window.localStorage.setItem('accessExp', data.access_exp)
              config.headers.common['Authorization'] = `Bearer ${window.localStorage.getItem('accessToken')}`;
          })
        }else{
          window.localStorage.removeItem('accessToken');
          window.localStorage.removeItem('accessExp');
          window.localStorage.removeItem('refreshToken');
          window.localStorage.removeItem('refreshExp');
          window.localStorage.removeItem('userEmail');
          window.localStorage.removeItem('userLevel');
          router.replace({
            path:'/login'
          })
        }
        return config;
      }
  },
  err => {
      return Promise.reject(err);
  });

      // axios.post('/BeautyScience/admin/refresh', {
      //   token:{
      //     refresh_token:window.localStorage.getItem('refreshToken')
      //   }
      // })
      // .then(function (response) {
      //   let data = response.data;
      //   localStorage.setItem('accessToken', data.access_token)
      //   localStorage.setItem('accessExp', data.access_exp)
      // })
      // .catch(function (error) {
      //   console.log(error);
      // });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
