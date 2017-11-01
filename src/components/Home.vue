<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <!-- <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul> -->
    <button @click="handle">CLICK ZIP</button>
  </div>
</template>

<script>
import jsZip from 'jszip'
import fs from 'file-saver'  //用于保存文件到本地

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods:{
    handle(){
      alert(123)
      var zip = new jsZip();  //创建zipObject对象
      console.log('11',zip)

      zip.file('name01.txt','创建一个文件',{base64:true}); //创建文件
      zip.file('name02.txt','创建一个文件');
      var regex = zip.file(/name01/);  //已文件名为规则来匹配文件，返回一个数组，数组项为zipObj
      console.log(regex)

      zip.folder('css').file('style.css','height:23px;')
      // zip.file('css/style.css','height:36px;') 

      zip.forEach(function(rePath,file) {  //以生成的zipObj文件
        console.log(rePath,file)
      })

      zip.generateAsync({type:"blob",comment:"jszip生成的zip对象"})   // 生成一个zipObj
      .then(function(content) {
          // see FileSaver.js
          // fs.saveAs(content, "test.zip");  //使用fileSave 保存至本地
          console.log('22',zip)
      });
      // zip.generateAsync({type:"blob"}, function updateCallback(metadata) {
      //     console.log("progression: " + metadata.percent.toFixed(2) + " %");
      //     if(metadata.currentFile) {
      //         console.log("current file = " + metadata.currentFile);
      //     }
      // });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
