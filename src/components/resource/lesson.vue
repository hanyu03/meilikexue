<template>
  <div>
    <ResBreadcrumb></ResBreadcrumb>
    <div class="lessonView bg_white">
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="上课资源" name="lesson_res">
            <div class="resourceList_header padding-aside">
              <div class="btnsBox">
                <el-button type="primary" icon="el-icon-plus"
                @click="linkTo(lesson_id)">点击添加新资源</el-button>
                <el-button type="success" icon="el-icon-plus"
                @click="showList()">点击添加新课件</el-button>
                <el-button v-if="isPublic" type="danger" @click="publicRes">撤回资源</el-button>
                <el-button v-else type="success" @click="publicRes">发布资源</el-button>
              </div>
              <div class="searchBox">
                <el-input placeholder="输入资源名称搜索" v-model="searchContent" @keyup.enter.native="searchRes(1)">
                  <el-button type="primary" slot="append" @click="searchRes(1)">搜索</el-button>
                </el-input>
              </div>
            </div>
            <div class="resourceList_conter">
              <ul class="listHeader padding-aside border-bottom">
                <li class="list_index">序号</li>
                <li class="item_img">缩略图</li>
                <li class="list_title">标题</li>
                <li class="list_type">类型</li>
                <li class="list_time">时间/大小</li>
                <li class="list_info">简介</li>
                <li class="list_handle">操作</li>
              </ul>
              <ul class="listContent">
                <li class="padding-aside border-bottom" v-for="(item,index) in listData" :key="index">
                  <div class="item_index">{{item.index}}</div>
                  <div class="item_img lc_img">
                    <div>
                        <img :src="item.imageUrl" alt="">
                    </div>
                  </div>
                  <div class="list_title lc_title">{{item.name}}</div>
                  <div class="list_type">{{item.meta_info.res_type}}</div>
                  <div class="list_time">
                    <div>
                      {{item.updated_at}}
                    </div>
                    <div>
                      /{{item.file_size}}Mb
                    </div>
                  </div>
                  <div class="list_info">
                    <p>{{item.brief}}</p>
                  </div>
                  <div class="list_handle lc_handle">
                      <el-button type="primary" size="small" @click="editResource(item.id)">编辑</el-button>
                      <el-button type="danger" size="small" @click="deleteResource(item.id)">删除</el-button>
                  </div>
                </li>
              </ul>
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
          </el-tab-pane>
          <el-tab-pane label="上课方案" name="lesson_plan">
            <div class="resourceList_header padding-aside">
              <div>
                <el-button type="primary" icon="el-icon-plus"
                @click="AddPlan(lesson_id)">点击添加新资源</el-button>
              </div>
            </div>
            <div class="resourceList_conter">
              <ul class="teachList">
                <li class="padding-aside border-bottom"
                v-for="(item,index) in teachData" :key="index">
                  <div class="teach_title">
                    <h3>{{item.title}}</h3>
                  </div>
                  <div class="teach_info">
                    <p v-html="item.content"></p>
                  </div>
                  <div class="teach_handle">
                    <el-button type="primary" size="small" @click="editTeach(item.id)">编辑</el-button>
                    <el-button type="danger" size="small" @click="deleteTeach(item.id)">删除</el-button>
                  </div>
                </li>
                <!-- <li style="width:100%;height:300px;border:1px solid red;text-align:center;">
                  <p>没有数据</p>
                </li> -->
              </ul>
            </div>
          </el-tab-pane>
        </el-tabs>
    </div>

    <PptList ref="pptList" v-on:listenResid = "residChange"></PptList>
  </div>
  
</template>
<script>
import ResBreadcrumb from '@/components/base/resourceBreadcrumb'
import PptList from '@/components/resource/pptList'

export default {
  data () {
    return {
      activeName:'lesson_res',
      lesson_id:'',
      searchContent:'',
      listData:[],
      // publicValue:'已发布',
      isPublic:false,
      pageData:{
          PageID:1,
          Perpage:10,
          Results:1
      },
      pageData2:{
          PageID:1,
          Perpage:10,
          Results:1
      },
      teachData:[],
    }
  },
  beforeRouteEnter:((to, from, next) => {
    if(from.name == 'editTeachPlan'){
      next((vm) => {
        vm.activeName = 'lesson_plan'
      })
    }else{
      next((vm) => {
        vm.activeName = 'lesson_res'
      })
    }
  }),
  components:{
      ResBreadcrumb,
      PptList
  },
  mounted () {
    let that = this;
    this.lesson_id = this.$route.query.lesson_id
    this.axios.get('/BeautyScience/lessons/'+that.lesson_id)
    .then(function(response){
      that.isPublic = response.data.public;
      that.getList(that.lesson_id,1);
      that.getTeachPlan(that.lesson_id);
    })
  },
  methods: {
    getList(id,page){
      let that = this;
      this.axios.get('/BeautyScience/resources',{
        params:{
            lesson_id:id,
            page:page,
            per:that.pageData.Perpage,
        }
      })
      .then((response) => {
        that.listData = []
        let dataArr = response.data.records
        that.pageData.Results = response.data.all;
        for(let i=0;i<dataArr.length;i++){
          dataArr[i].updated_at = dataArr[i].updated_at.slice(0,10)
          dataArr[i].file_size = ((dataArr[i].meta_info.file_size/1024)/1024).toFixed(2);
          switch (dataArr[i].meta_info.res_type) {
            case 1:
                dataArr[i].meta_info.res_type = '热成像'
                break;
            case 2:
                dataArr[i].meta_info.res_type = '延时摄像'
                break;
            case 3:
                dataArr[i].meta_info.res_type = '整体和局部'
                break;
            case 4:
                dataArr[i].meta_info.res_type = 'VR全景'
                break;
            case 5:
                dataArr[i].meta_info.res_type = '360旋转'
                break;
            case 6:
                dataArr[i].meta_info.res_type = '内部分层结构'
                break;
            case 7:
                dataArr[i].meta_info.res_type = '视频'
                break;
            case 8:
                dataArr[i].meta_info.res_type = '显微缩放'
                break;
            case 9:
                dataArr[i].meta_info.res_type = '多角度'
                break;
            default:
                break;
          }
          that.axios.post('/BeautyScience/qiniu/url',{
              res_name:dataArr[i].meta_info.thumb
          })
          .then(function(res){
              dataArr[i].imageUrl=res.data.url
              that.listData.push(dataArr[i])
              that.listData.sort(function(a,b){
                  return a.index - b.index
              })
          })
          .catch(function(error){
              that.$message({
                  message: '图片上传出错，请重新上传',
                  type: 'warning'
              });
          })
        }
        // this.listData = dataArr
      })
    },
    handleCurrentChange(val){
        if(this.searchContent == ''){
          this.pageData.PageID = val;
          this.getList(this.lesson_id,val);
        }else{
          this.pageData.PageID = val;
          this.searchRes(val)
        }
        
    },
    searchRes(page){
      let that = this;
      this.axios.post('/BeautyScience/resources/search',{
        keyword:that.searchContent,
        page:page,
        per:that.pageData.Perpage,
      })
      .then(function(response){
        that.listData = []
        let dataArr = response.data.records
        that.pageData.Results = response.data.all;
        for(let i=0;i<dataArr.length;i++){
          dataArr[i].updated_at = dataArr[i].updated_at.slice(0,10)
          dataArr[i].file_size = ((dataArr[i].meta_info.file_size/1024)/1024).toFixed(2);
          switch (dataArr[i].meta_info.res_type) {
            case 1:
                dataArr[i].meta_info.res_type = '热成像'
                break;
            case 2:
                dataArr[i].meta_info.res_type = '延时摄像'
                break;
            case 3:
                dataArr[i].meta_info.res_type = '整体和局部'
                break;
            case 4:
                dataArr[i].meta_info.res_type = 'VR全景'
                break;
            case 5:
                dataArr[i].meta_info.res_type = '360旋转'
                break;
            case 6:
                dataArr[i].meta_info.res_type = '内部分层结构'
                break;
            case 7:
                dataArr[i].meta_info.res_type = '视频'
                break;
            case 8:
                dataArr[i].meta_info.res_type = '显微缩放'
                break;
            case 9:
                dataArr[i].meta_info.res_type = '多角度'
                break;
            default:
                break;
          }
          that.axios.post('/BeautyScience/qiniu/url',{
              res_name:dataArr[i].meta_info.thumb
          })
          .then(function(res){
              dataArr[i].imageUrl=res.data.url
              that.listData.push(dataArr[i])
              that.listData.sort(function(a,b){
                  return a.index - b.index
              })
          })
        }
      })
    },
    linkTo(id){
      this.$router.push({ name: 'editResource',query:{lesson_id:id}})
    },
    showList(){
      this.$refs['pptList'].dialogTableVisible = true;
    },
    residChange(){},
    deleteResource(id){
      let that = this;
      this.axios.delete('/BeautyScience/resources/'+id)
      .then(function(response){
          that.listData = []
          that.getList(that.lesson_id,1);
      })
    },
    editResource(id){
      let that = this;
      this.$router.push({name:'editResource',query:{resId:id,lesson_id:that.lesson_id}})
    },
    publicRes(){
      let id = this.$route.query.lesson_id,that = this,
      isTrue;
      // if(this.listData.length>0){
        switch (that.isPublic) {
          case true:
            isTrue = false
            break;
          case false:
            isTrue = true
            break;
          default:
            break;
        }
        this.axios.patch('/BeautyScience/lessons/'+id,{
          lesson:{
            public:isTrue
          }
        })
        .then(function(res){
          if(!that.isPublic){
            that.isPublic = true;
            that.$message({
              showClose: true,
              message: '恭喜你，资源发布成功',
              type: 'success'
            })
          }else{
            that.isPublic = false;
            that.$message({
              showClose: true,
              message: '请注意，发布资源已被撤回',
              type: 'warning'
            })
          }
        })
      // }else{
      //   this.$message({
      //     showClose: true,
      //     message: '请先选择资源',
      //     type: 'warning'
      //   })
      // }
      
    },
    //教案
    getTeachPlan(id){
      let that = this;
      this.axios.get('/BeautyScience/teaching_plans',{
        params:{
            lesson_id:id,
        }
      })
      .then(function(response){
        that.teachData = response.data
      })
    },
    AddPlan(id){
      this.$router.push({name:'editTeachPlan',query:{lesson_id:id}})
    },
    deleteTeach(id){
      let that = this;
      this.axios.delete('/BeautyScience/teaching_plans/'+id)
      .then(function(response){
          that.teachData = []
          that.getTeachPlan(that.lesson_id);
      })
    },
    editTeach(id){
      let that = this;
      this.$router.push({name:'editTeachPlan',query:{teachId:id,lesson_id:that.lesson_id}})
    }
  }
}
</script>

<style scoped>
.lessonView{
    padding-top:32px;
}
.resourceList_header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 36px;
    padding-bottom: 24px;
}
.btnsBox span{
  color:#999;
  margin-left: 20px;
}
.listHeader{
  height: 48px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  /* justify-content: space-between; */
}
.listHeader li{
  font-size: 14px;
  color: #444;

}
.list_index{
  min-width: 40px;
  margin-right: 20px;
}
.item_index{
  min-width: 40px;
  margin-right: 20px;
  font-size: 12px;
  color: #47a8de;
}
.item_img{
  flex:1.5;
  margin-right: 20px;
}
.item_img img{
  max-width: 240px;
  width: 100%;
  height: 135px;
}
.list_title{
  flex:0.8;
}
.list_type{
  flex:0.8;
}
.list_time{
  flex:0.8;
}
.list_info{
  flex:1;
  margin-right: 30px;
}
.list_handle{
  /* flex:1; */
  width: 126px;
}
.listContent li{
  height: 184px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
}
.listContent .list_title{
  font-size: 14px;
  color: #000;
  font-weight: 700;
}
.teachList li{
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 144px;
}
.teach_title h3{
  width:220px;
  font-size: 20px;
  color:#333;
  font-weight: 700;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.teach_title h3::before{
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #47a8de;
  margin-right: 16px;
  vertical-align: middle;
}
.teach_info p{
  position: relative;
  width: 490px;
  height: 65px;
  font-size: 14px;
  line-height: 24px;
  color:#878787;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp:3;
  overflow: hidden;
}
</style>
