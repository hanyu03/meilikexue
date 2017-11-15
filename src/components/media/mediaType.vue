<template>
    <div class="mediaType">
        <div class="mediaType-header padding-aside">
            <el-row type="flex" align="bottom">
                <el-col :span="12" class="typeAdd">
                    <h3 class="typeName">{{typeName}}</h3>
                    <div><i></i>{{$route.params.type}}</div>
                    <el-button type="primary" icon="el-icon-plus"
                    @click="linkToAdd">点击添加</el-button>
                </el-col>
                <el-col :span="12">
                    <div class="searchBox">
                        <el-input placeholder="输入关键词搜索" v-model="searchContent" class="input-with-select">
                            <el-button type="primary" slot="append">搜索</el-button>
                        </el-input>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="list">
            <List></List>
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
          searchContent:''
      }
  },
  mounted () {
     this.selectType() 
  },
  methods: {
      //判断媒体类别
      selectType(){
          let aliseName = this.$route.params.type;
          switch (aliseName) {
            case 'Zoom in':
                this.typeName = '显微缩放';
                this.addRoute = '/media/Zoom in/add';
                break;
            case 'Heat Map':
                this.typeName = '热成像';
                this.addRoute = '/media/Heat Map/add';
                break;
            case 'Virtual Reality':
                this.typeName = 'VR全景';
                this.addRoute = '/media/Virtual Reality/add';
                break;
            case 'Time Lapse':
                this.typeName = '延时摄像';
                this.addRoute = '/media/Time Lapse/add';
                break;
            case 'Polyv Video':
                this.typeName = '视频';
                this.addRoute = '/media/Polyv Video/add';
                break;
            case '360 Rotation':
                this.typeName = '360旋转';
                this.addRoute = '/media/360 Rotation/add';
                break;
            case 'Partial':
                this.typeName = '整体和局部';
                this.addRoute = '/media/Partial/add';
                break;
            case 'Inner struct':
                this.typeName = '内部分层结构';
                this.addRoute = '/media/Inner struct/add';
                break;
            case 'Multi Angle':
                this.typeName = '多角度';
                this.addRoute = '/media/Multi Angle/add';
                break;
              default:
                  break;
          }
      },
      //跳转至新增页面
      linkToAdd(){
          let addRoute = this.addRoute
          this.$router.push(addRoute);
      }
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
