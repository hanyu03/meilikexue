<template>
    <div class="mediaType">
        <div class="mediaType-header padding-aside">
            <el-row type="flex" align="bottom">
                <el-col :span="12" class="typeAdd">
                    <h3 class="typeName">{{typeName}}</h3>
                    <div><i></i>{{$route.params.type}}</div>
                    <el-button type="primary" icon="el-icon-plus"
                    v-if="headerMsg.level !== 0"
                    @click="linkToAdd">点击添加</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="list">
            <List ref="listData"></List>
        </div>
    </div>
</template>

<script>
import List from '@/components/base/List'

export default {
  data () {
      return {
          typeName:'',
          addRoute:'',
          listData:'listData',
          headerMsg:{
              level:''
          }
      }
  },
  beforeRouteEnter:(to, from, next) => {
    next(vm => {
        vm.selectType();
    });
  },
  mounted () {
    //  this.selectType() 
  },
  updated(){
    this.headerMsg.level = parseInt(window.localStorage.getItem('userLevel'));    
  },
  methods: {
      //判断媒体类别
      selectType(){
          let aliseName = this.$route.params.type;
          console.log(aliseName)
          switch (aliseName) {
            case 'Zoom_in':
                this.typeName = '显微缩放';
                this.addRoute = '/media/Zoom_in/add';
                break;
            case 'Heat_map':
                this.typeName = '热成像';
                this.addRoute = '/media/Heat_map/add';
                break;
            case 'Virtual_reality':
                this.typeName = 'VR全景';
                this.addRoute = '/media/Virtual_reality/add';
                break;
            case 'Time_lapse':
                this.typeName = '延时摄像';
                this.addRoute = '/media/Time_lapse/add';
                break;
            case 'Polyv_video':
                this.typeName = '视频';
                this.addRoute = '/media/Polyv_video/add';
                break;
            case '360Rotation':
                this.typeName = '360旋转';
                this.addRoute = '/media/360Rotation/add';
                break;
            case 'photo_hot_zone':
                this.typeName = '图片热区';
                this.addRoute = '/media/photo_hot_zone/add';
                break;
            case 'photos':
                this.typeName = '图片集';
                this.addRoute = '/media/photos/add';
                break;
            case 'Multi_angle':
                this.typeName = '多角度';
                this.addRoute = '/media/Multi_angle/add';
                break;
            // case 'PPT':
            //     this.typeName = '课件';
            //     this.addRoute = '/media/PPT/add';
            //     break;
            default:
                break;
          }
      },
      //跳转至新增页面
      linkToAdd(){
          let addRoute = this.addRoute
          this.$router.push(addRoute);
      },
      getList(type){
          this.axios.get('/BeautyScience/'+type)
          .then(function(response){
              console.log(response)
          })
      },
  },
  components: {
      List
  }
}
</script>

<style scoped>
.mediaType-header{
    padding-top: 56px;
    padding-bottom:65px;
    background-color: #f0f0f0;
}
.mediaType-header .typeAdd{
    text-align: left;
}
.mediaType-header .typeAdd .typeName{
    font-size: 24px;
    color: #000;
}
.typeAdd div{
  font-size: 14px;
  color:#999;
  line-height: 22px;
  margin-bottom: 20px;
}
.typeAdd div i{
  display: inline-block;
  width: 16px;
  height: 1px;
  background-color: #999;
  margin:0 8px 2px 0;
}
</style>
