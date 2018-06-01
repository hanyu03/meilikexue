<template>
    <div class="mediaType">
        <div class="mediaType-header padding-aside">
            <el-row type="flex" align="bottom">
                <el-col :span="12" class="typeAdd">
                    <h3 class="typeName">{{typeName}}</h3>
                    <div><i></i>PPT</div>
                    <el-button type="primary" icon="el-icon-plus"
                    v-if="headerMsg.level !== 0"
                    @click="linkToAdd">点击添加</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="list">
            <!-- <List ref="listData"></List> -->
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
                        <div class="list-title lc-title">{{item.title}}</div>
                        <div class="list-time">{{item.updated_at}} / {{item.file_size}}MB</div>
                        <div class="list-handle lc-handle">
                            <el-button type="primary" v-if="headerMsg.level == 0" @click="patchItem(item.id)">查 看</el-button>
                            <el-button type="primary" v-else @click="patchItem(item.id)">编 辑</el-button>
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
    </div>
</template>

<script>
import List from '@/components/base/List'

export default {
  data () {
      return {
            typeName:'课件',
            addRoute:'/media/PPT/add',
            // listData:'listData',
            headerMsg:{
                level:''
            },

            isLoading:true,
            loading:false,
            pageData:{
                PageID:1,
                Perpage:10,
                Results:1
            },
            headerMsg:{
                adminName:'',
                level:''
            },
            urlType:'coursewares',
            select:{
                all:'',
                options:[
                {value: '选项1',
                label: '全部状态'
                }, {
                value: '选项2',
                label: '已发布'
                }, {
                value: '选项3',
                label: '待发布'
                }, {
                value: '选项4',
                label: '未发布'
                }]
            },
            greenClass:'green',
            blueClass:'blue',
            editRoute:'coursewaresEdit',
            listData:[]
      }
  },
  mounted () {
    this.getList('coursewares',1)
    if(this.listData.length > 0){
        this.isLoading = false;
    }
  },
  updated(){
    this.headerMsg.level = parseInt(window.localStorage.getItem('userLevel'));

    this.headerMsg.adminName = window.localStorage.getItem('userEmail');
    this.headerMsg.level = parseInt(window.localStorage.getItem('userLevel'));   
  },
  methods: {
      //跳转至新增页面
      linkToAdd(){
          let addRoute = this.addRoute
          this.$router.push(addRoute);
      },


      //获取列表
        getList(type,page){
            this.isLoading = true;
            this.loading = true;
            let that = this;
            this.axios.get('/BeautyScience/'+type,{
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
            let that = this;
            this.pageData.PageID = val;
            this.getList(that.urlType,val);
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
                that.axios.delete('/BeautyScience/'+that.urlType+'/'+id)
                .then(function(response){
                    that.getList(that.urlType,that.pageData.PageID)
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
        patchItem(typeId){
            let editName = this.editRoute
            this.$router.push({ name: editName, params: { id : typeId}})
        }
  },
//   components: {
//       List
//   }
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
    /* flex: 1.6; */
    width: 126px;
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
