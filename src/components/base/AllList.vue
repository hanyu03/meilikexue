<template>
    <div>
        <div class="homeSearch padding-aside">
            <span>全部媒体列表</span>
            <div class="searchBox">
                <el-input class="input-with-select" placeholder="输入资源名称搜索"
                v-model="searchContent"
                @keyup.enter.native="searchRes(1)">
                    <el-button type="primary" slot="append" @click="searchRes(1)">搜索</el-button>
                </el-input>
            </div>
        </div>
        <div class="list">
            <ul class="listHeader border-bottom padding-aside">
                <li class="list-img">缩略图</li>
                <li class="list-title">标题</li>
                <li class="list-time">时间/大小</li>
                <li class="list-handle">操作</li>
            </ul>
            <ul class="listContent">
                <li class="text_li" v-show="isLoading" v-loading="loading" element-loading-background="rgba(255, 255, 255, 1)">
                    <p>暂时没有数据</p>
                </li>
                <li class="border-bottom padding-aside"
                v-for="(item,index) in listData" :key="index">
                    <div class="list-img lc-img">
                        <div>
                            <img :src="item.imageUrl" alt="">
                        </div>
                    </div>
                    <div class="list-title lc-title">{{item.name}}</div>
                    <div class="list-time">{{item.updated_at}} / {{item.file_size}}MB</div>
                    <div class="list-handle lc-handle">
                        <el-button type="primary" v-if="headerMsg.level == 0" @click="patchItem(item.res_type,item.meta_id)">查 看</el-button>
                        <el-button type="primary" v-else @click="patchItem(item.res_type,item.meta_id)">编 辑</el-button>
                        <el-button type="danger" v-if="headerMsg.level !== 0" @click="deleteMessage(item.id)">删 除</el-button>
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
    </div>
    
</template>

<script>
export default {  
  data () {
      return {
        isLoading:true,
        loading:false,
        pageData:{
            PageID:1,
            Perpage:10,
            Results:1
        },
        headerMsg:{
            level:''
        },
        searchContent:'',
        greenClass:'green',
        blueClass:'blue',
        listData:[]
      }
  },
  mounted () {
    this.getList(1)
    if(this.listData.length > 0){
        this.isLoading = false;
    }
  },
  updated(){
    this.headerMsg.level = parseInt(window.localStorage.getItem('userLevel'));    
  },
  methods: {
      //搜索列表
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
      //获取列表
        getList(page){
            this.isLoading = true;
            this.loading = true;
            let that = this;
            this.axios.get('/BeautyScience/meta_infos',{
                params:{
                    page:page,
                    per:that.pageData.Perpage,
                }
            })
            .then(function(response){
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
                        that.isLoading = false;
                        that.loading = false;
                    })
                    .catch(function(error){
                        that.$message({
                            message: '图片上传出错，请重新上传',
                            type: 'warning'
                        });
                    })
                }
                that.loading = false;
            })
        },
        handleCurrentChange(val){
            if(this.searchContent == ''){
                this.pageData.PageID = val;
                this.getList(val);
            }else{
                this.pageData.PageID = val;
                this.searchRes(val);
            }
            
        },
      //删除提示
        deleteMessage (id) {
            let that = this;
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                that.axios.delete('/BeautyScience/meta_infos/'+id)
                .then(function(response){
                    that.getList(that.pageData.PageID)
                    that.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
      //编辑
        patchItem(resType,metaId){
            let editName;
            switch (resType) {
                case 1:
                    editName = 'heatmapEdit'
                    break;
                case 2:
                    editName = 'timelapseEdit'
                    break;
                case 3:
                    editName = 'partialEdit'
                    break;
                case 4:
                    editName = 'vrEdit'
                    break;
                case 5:
                    editName = 'rotationEdit'
                    break;
                case 6:
                    editName = 'innerstructEdit'
                    break;
                case 7:
                    editName = 'polyvideoEdit'
                    break;
                case 8:
                    editName = 'zoominEdit'
                    break;
                case 9:
                    editName = 'multiangleEdit'
                    break;
                default:
                    break;
            }
            this.$router.push({ name: editName, params: { id : metaId}})
        }
    }
}
</script>

<style scoped>
.homeSearch{
  overflow: hidden;
  text-align: left;
  font-size: 20px;
  color:#444;
  padding-top:32px;
  padding-bottom: 32px;
  background-color: #f0f0f0;
}
.homeSearch span{
  line-height: 36px;
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
    flex: 2.5;
}
/* .list-select{
    flex: 1.5;
} */
.list-time{
    flex: 5.5;
}
.list-handle{
    /* flex: 0.7; */
    width: 138px;
}
.listContent li{
    display: flex;
    padding-top:24px;
    padding-bottom:24px;
    text-align: left;
    font-size: 14px;
    color:#999;
}
.listContent .text_li>p{
    width: 100%;
    min-height: 200px;
    line-height: 200px;
    text-align: center;
    font-size: 18px;
    color: #333;
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
