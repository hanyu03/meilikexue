<template>
  <div class="home">
    <div class="resource-type padding-aside">
      <ul>
        <li v-for="(item,index) in mediaType" :key="index">
          <h3 class="typeName" @click="routerTo(item.name)">{{item.name}}</h3>
          <div><i></i>{{item.aliso}}</div>
          <img :src="item.imgUrl" alt="">
        </li>
      </ul>
      <div class="homeSearch">
        <span>全部媒体列表</span>
        <div class="searchBox">
          <el-input placeholder="输入关键词搜索" v-model="searchContent" class="input-with-select">
            <el-button type="primary" slot="append">搜索</el-button>
          </el-input>
        </div>
      </div>
    </div>
    
    <div class="list">
      <List></List>
    </div>
  </div>
</template>

<script>
import jsZip from 'jszip'
import fs from 'file-saver'  //用于保存文件到本地
import List from '@/components/base/List'

export default {
  data () {
    return {
      mediaType:[
        {name:'显微缩放',
        // linkTo:{path:'/media/Zoom in'},
        aliso:'Zoom in',
        imgUrl:'/static/images/zoom_in.png'},
        {name:'热成像',
        // linkTo:{path:'/media/heatmap',params:{type:'Heat Map',name:'热成像'}},
        aliso:'Heat Map',
        imgUrl:'/static/images/heatmap.png'},
        {name:'VR全景',
        aliso:'Virtual Reality',imgUrl:'/static/images/vr.png'},
        {name:'延时摄像',
        aliso:'Time Lapse',imgUrl:'/static/images/time_lapse.png'},
        {name:'视频',
        aliso:'Polyv Video',imgUrl:'/static/images/video.png'},
        {name:'360旋转',
        aliso:'360 Rotation',imgUrl:'/static/images/360rotation.png'},
        {name:'整体和局部',
        aliso:'Partial',imgUrl:'/static/images/partical.png'},
        {name:'内部分层结构',
        aliso:'Inner struct',imgUrl:'/static/images/innerstruct.png'},
        {name:'多角度',
        aliso:'Multi Angle',imgUrl:'/static/images/multiangle.png'},
        {}
      ],
      searchContent:''
    }
  },
  methods:{
    //routeTo
    routerTo(name){
      switch (name) {
        case '显微缩放':
          this.$router.push('/media/Zoom in')
          break;
        case '热成像':
          this.$router.push('/media/Heat Map')
          break;
        case 'VR全景':
          this.$router.push('/media/Virtual Reality')
          break;
        case '延时摄像':
          this.$router.push('/media/Time Lapse')
          break;
        case '视频':
          this.$router.push('/media/Polyv Video')
          break;
        case '360旋转':
          this.$router.push('/media/360 Rotation')
          break;
        case '整体和局部':
          this.$router.push('/media/Partial')
          break;
        case '内部分层结构':
            this.$router.push('/media/Inner struct')
            break;
        case '多角度':
            this.$router.push('/media/Multi Angle')
            break;
        default:
          break;
      }
      
    },
    // fileZip(inputId,id){
    //   var zip = new jsZip();
    //   let ofile = document.getElementById(inputId).files[0];
    //   let ovideo = document.getElementById(id)
    //   let reader  = new FileReader();
    //   reader.addEventListener("load", function () {
    //     ovideo.src = reader.result;
    //     ovideo.setAttribute("width", "800px");
    //     ovideo.setAttribute("height", "600px");
    //   }, false);

    //   if (ofile) {
    //     reader.readAsDataURL(ofile);
    //   }
    //   // zip.generateAsync({type:"blob",comment:"ssss"})   // 生成一个zipObj
    //   // .then(function(content) {
    //   //     // see FileSaver.js
    //   //     // fs.saveAs(content, "test.zip");  //使用fileSave 保存至本地
    //   //     console.log('22',zip)
    //   // });
    // },
    // zipClick(){
    //   var zip = new jsZip();
    //   let ofile = document.getElementById("fileImg").files[0];
    //   let ofileVideo = document.getElementById("fileVideo").files[0];
    //   console.log(ofile)
    //   zip.file(ofile.name,ofile)
    //   zip.file(ofileVideo.name,ofileVideo)
    //   zip.generateAsync({type:"blob",comment:"ssss"})   // 生成一个zipObj
    //   .then(function(content) {
    //       // see FileSaver.js
    //       // fs.saveAs(content, "test.zip");  //使用fileSave 保存至本地
    //       console.log('22',zip)
    //   });
    // }
  },
  mounted () {

  },
  components: {
    List
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home{
  width: 100%;
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
.resource-type li .typeName{
  font-size: 20px;
  color:#000;
  font-weight: 700;
  cursor: pointer;
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
.homeSearch{
  overflow: hidden;
  text-align: left;
  font-size: 20px;
  color:#444;
  padding:32px 0;
}
.homeSearch span{
  line-height: 36px;
}
</style>
