<template>
  <div class="home">
    <div class="resource-type padding-aside">
      <ul>
        <li v-for="(item,index) in resourceType" :key="index">
          <h3>{{item.name}}</h3>
          <div><i></i>{{item.aliso}}</div>
          <img :src="item.imgUrl" alt="">
        </li>
      </ul>
      <div>
        
      </div>
    </div>
    
    <el-row class="resource-list">

    </el-row>
  </div>
</template>

<script>
import jsZip from 'jszip'
import fs from 'file-saver'  //用于保存文件到本地

export default {
  name: 'HelloWorld',
  data () {
    return {
      resourceType:[
        {name:'显微缩放',aliso:'Zoom in',imgUrl:'/static/images/zoom_in.png'},
        {name:'热成像',aliso:'Heat Map',imgUrl:'/static/images/heatmap.png'},
        {name:'VR全景',aliso:'Virtual Reality',imgUrl:'/static/images/vr.png'},
        {name:'延时摄像',aliso:'Time Lapse',imgUrl:'/static/images/time_lapse.png'},
        {name:'视频',aliso:'Polyv Video',imgUrl:'/static/images/video.png'},
        {name:'360旋转',aliso:'360 Rotation',imgUrl:'/static/images/360rotation.png'},
        {name:'整体和局部',aliso:'Partial',imgUrl:'/static/images/partical.png'},
        {name:'内部分层结构',aliso:'Inner struct',imgUrl:'/static/images/innerstruct.png'},
        {name:'多角度',aliso:'Multi Angle',imgUrl:'/static/images/multiangle.png'},
        {}
      ]
    }
  },
  created () {
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
.home{
  width: 100%;
  height:500px;
  background-color: red
}
.resource-type{
  background-color: #f0f0f0;
}
.resource-type ul{
  display: flex;
  height: 368px;
  padding: 64px 0 32px 0;
  justify-content: space-between;
  flex-wrap: wrap;
  overflow: hidden;
}
.resource-type li{
  position: relative;
  box-sizing: border-box;
  width: 18%;
  height: 45.6%;
  padding:32px 0 0 32px;
  margin-bottom: 32px;
  background-color: #fff;
  text-align: left;
}
.resource-type li:last-of-type{
  visibility: hidden;
}
.resource-type li h3{
  margin: 0;
  font-size: 20px;
  color:#000;
  font-weight: 700;
  
}
.resource-type li div{
  font-size: 12px;
  color:#999;
  line-height: 22px;
}
.resource-type li div i{
  display: inline-block;
  width: 16px;
  height: 1px;
  background-color: #999;
  margin:0 8px 2px 0;
}
.resource-type li img{
  position: absolute;
  bottom:0;
  right:0;
}
</style>
