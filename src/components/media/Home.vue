<template>
  <div class="home">
    <div class="resource-type padding-aside">
      <ul>
        <li v-for="(item,index) in mediaType" :key="index" @click="routerTo(item.name)">
          <h3 class="typeName">{{item.name}}</h3>
          <div><i></i>{{item.aliso}}</div>
          <img :src="item.imgUrl" alt="">
        </li>
        <li></li>
      </ul>
    </div>
    
    <div class="list">
      <AllList></AllList>
    </div>
  </div>
</template>

<script>
import AllList from '@/components/base/AllList'

export default {
  data () {
    return {
      mediaType:[
        {name:'显微缩放',
        // linkTo:{path:'/media/Zoom in'},
        aliso:'Zoom in',
        imgUrl:'/static/images/zoomin_img.png'},
        {name:'热成像',
        // linkTo:{path:'/media/heatmap',params:{type:'Heat Map',name:'热成像'}},
        aliso:'Heat Map',
        imgUrl:'/static/images/heatmap_img.png'},
        {name:'VR全景',
        aliso:'Virtual Reality',imgUrl:'/static/images/vr_img.png'},
        {name:'延时摄像',
        aliso:'Time Lapse',imgUrl:'/static/images/timelapse_img.png'},
        {name:'视频',
        aliso:'Polyv Video',imgUrl:'/static/images/video_img.png'},
        {name:'360旋转',
        aliso:'360 Rotation',imgUrl:'/static/images/rotation_img.png'},
        {name:'图片热区',
        aliso:'photo hot zone',imgUrl:'/static/images/photohotzone_img.png'},
        {name:'图片集',
        aliso:'photos',imgUrl:'/static/images/photos_img.png'},
        {name:'多角度',
        aliso:'Multi Angle',imgUrl:'/static/images/multiangle_img.png'},
        {name:'课件',
        aliso:'PPT',imgUrl:'/static/images/PPT_img.png'}
      ],
      searchContent:'',
      searchData:[]
    }
  },
  methods:{
    //routeTo
    routerTo(name){
      switch (name) {
        case '显微缩放':
          this.$router.push('/media/Zoom_in')
          break;
        case '热成像':
          this.$router.push('/media/Heat_map')
          break;
        case 'VR全景':
          this.$router.push('/media/Virtual_reality')
          break;
        case '延时摄像':
          this.$router.push('/media/Time_lapse')
          break;
        case '视频':
          this.$router.push('/media/Polyv_video')
          break;
        case '360旋转':
          this.$router.push('/media/360Rotation')
          break;
        case '图片热区':
          this.$router.push('/media/photo_hot_zone')
          break;
        case '图片集':
            this.$router.push('/media/photos')
            break;
        case '多角度':
            this.$router.push('/media/Multi_angle')
            break;
        case '课件':
            this.$router.push('/media_/PPT')
            break;
        default:
          break;
      }
      
    }
  },
  mounted () {

  },
  components: {
    AllList
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
  cursor: pointer;
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
  bottom:10px;
  right:10px;
}
</style>
