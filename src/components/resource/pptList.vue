<template>
    <div>
        <el-dialog
            width = "80%"
            top = "50px"
            :visible.sync="dialogTableVisible">
            <!-- <div class="listSearch padding-aside">
                <span>媒体列表</span>
                <div class="searchBox">
                <el-input placeholder="输入资源名称搜索" v-model="searchContent"
                class="input-with-select"
                @keyup.enter.native="searchRes(1)">
                    <el-button type="primary" slot="append" @click="searchRes(1)">搜索</el-button>
                </el-input>
                </div>
            </div> -->
            <div class="list" v-loading="loading">
                <ul class="listHeader border-bottom padding-aside">
                    <li class="list-img">缩略图</li>
                    <li class="list-title">标题</li>
                    <li class="list-time">时间/大小</li>
                    <li class="list-handle">操作</li>
                </ul>
                <ul class="listContent">
                    <li class="border-bottom padding-aside"
                    v-for="(item,index) in listData" :key="index">
                        <div class="list-img lc-img">
                            <div>
                                <img :src="item.imageUrl" alt="">
                            </div>
                        </div>
                        <div class="list-title lc-title">{{item.title}}</div>
                        <div class="list-time">{{item.updated_at}} / {{item.file_size}}MB</div>
                        <div class="list-handle lc-handle">
                            <el-button type="success" @click="changed(item)">选 择</el-button>
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
        </el-dialog>
    </div>   
</template>

<script>
export default {
  data () {
      return {
        loading:true,
        searchContent:'',
        pageData:{
            PageID:1,
            Perpage:10,
            Results:1
        },
        listData:[],
        dialogTableVisible:false
      }
  },
  mounted () {
    this.getList(1)
  },
  methods: {
      //获取列表
        getList(page){
            let that = this;
            this.axios.get('/BeautyScience/coursewares',{
                params:{
                    page:page,
                    per:that.pageData.Perpage,
                }
            })
            .then(function(response){
                that.loading = false;
                that.listData = []
                let dataArr = response.data.records
                that.pageData.Results = response.data.all;
                for(let i=0;i<dataArr.length;i++){
                    let sortTime = new Date(dataArr[i].updated_at);
                    dataArr[i].upTime = Date.parse(sortTime);
                    dataArr[i].updated_at = dataArr[i].updated_at.slice(0,10)
                    dataArr[i].file_size = ((dataArr[i].file_size/1024)/1024).toFixed(2)
                    that.axios.post('/BeautyScience/qiniu/url',{
                        res_name:dataArr[i].thumb
                    })
                    .then(function(res){
                        dataArr[i].imageUrl=res.data.url
                        that.listData.push(dataArr[i])
                        that.listData.sort(function(a,b){
                            return b.upTime - a.upTime
                        })
                    })
                    .catch(function(error){
                        that.$message({
                            message: '图片上传出错，请重新上传',
                            type: 'warning'
                        });
                    })
                }
            })
        },
        handleCurrentChange(val){
            let that = this;
            that.loading = true;
            this.pageData.PageID = val;
            this.getList(val);
        },
        searchRes(page){
            let that = this;
            this.axios.post('/BeautyScience/meta_infos/search',{
                keyword:this.searchContent,
                page:page,
                per:that.pageData.Perpage,
            })
            .then(function(response){
                that.listData=[]
                let dataArr = response.data.records
                that.pageData.Results = response.data.all;
                for(let i=0;i<dataArr.length;i++){
                    let sortTime = new Date(dataArr[i].updated_at);
                    dataArr[i].upTime = Date.parse(sortTime);
                    dataArr[i].updated_at = dataArr[i].updated_at.slice(0,10)
                    dataArr[i].file_size = ((dataArr[i].file_size/1024)/1024).toFixed(2)
                    that.axios.post('/BeautyScience/qiniu/url',{
                        res_name:dataArr[i].thumb
                    })
                    .then(function(res){
                        dataArr[i].imageUrl=res.data.url
                        that.listData.push(dataArr[i])
                        that.listData.sort(function(a,b){
                            return b.upTime - a.upTime
                        })
                    })
                    .catch(function(error){
                        that.$message({
                            message: '图片上传出错，请重新上传',
                            type: 'warning'
                        });
                    })
                }
            })
        },
        listenResid(id){
            this.$emit('listenResid',id)
        },
      //选择资源
        changed(item){
            // this.dialogTableVisible = false;
            // this.listenResid(resId);
            var that = this;
            that.axios({
              method:'patch',
              url: '/BeautyScience/coursewares/'+item.id,
              data:{                
                courseware:{
                    title : item.title,
                    thumb : item.thumb,
                    url : item.url,
                    tag : item.tag,
                    file_size:item.file_size,
                    lesson_ids:[that.$route.query.lesson_id]
                }
              }
            }).then(function (res) {   
                console.log(res)          
            //   if(res.status == 201){
            //     that.$message.success('添加成功');
            //     that.dialogTableVisible = false;
            //     // that.$router.push('/media_/PPT');
            //   }else{
            //     that.$message.error('添加失败');
            //   }                           
            }).catch(function (error) {
              console.log(error);             
            });
        }
    }
}
</script>

<style scoped>
.listSearch{
  overflow: hidden;
  text-align: left;
  font-size: 20px;
  color:#444;
  padding-top:32px;
  padding-bottom: 32px;
  background-color: #f0f0f0;
}
.listSearch span{
  line-height: 36px;
}
.list{
    min-height: 600px;
}
.listHeader{
    display: flex;
    align-items: center;
    height:48px;
    font-size: 14px;
    color:#444;
}
.listHeader li{
    text-align: left;   
}
.list-img{
    flex: 2.5;
}
.list-title{
    flex: 1.5;
}
/* .list-select{
    flex: 1.5;
} */
.list-time{
    flex: 5.5;
}
.list-handle{
    flex: 1.6;
}
.listContent li{
    display: flex;
    padding-top:24px;
    padding-bottom:24px;
    text-align: left;
    font-size: 14px;
    color:#999;
}
.listContent li .lc-title{
    font-weight: 700;
    color:#000;
}
.listContent li .lc-img>div{
    width: 160px;
    height: 90px;
    display: inline-flex;
}
.listContent li .lc-img img{
    flex: 1;
    max-width: 100% !important;
    max-height: 100% !important;
}
.listContent li .lc-handle{
    display: inline-flex;
    justify-content: flex-start;
}
</style>
