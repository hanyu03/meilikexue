<template>
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
                        <img :src="item.meta_info.imageUrl" alt="">
                    </div>
                </div>
                <div class="list-title lc-title">{{item.meta_info.name}}</div>
                <div class="list-time">{{item.updated_at}} / {{item.meta_info.file_size}}MB</div>
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
            adminName:'',
            level:''
        },
        urlType:'',
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
        editRoute:'',
        listData:[]
      }
  },
  mounted () {
      this.selectType()
      if(this.listData.length > 0){
        this.isLoading = false;
       }
  },
  updated(){
    this.headerMsg.adminName = window.localStorage.getItem('userEmail');
    this.headerMsg.level = parseInt(window.localStorage.getItem('userLevel'));    
  },
  methods: {
      //判断媒体类别
        selectType(){
            let aliseName = this.$route.params.type;
            switch (aliseName) {
            case 'Zoom_in':
                this.urlType = 'zoom_ins'
                this.getList('zoom_ins',1);
                this.editRoute = 'zoominEdit';
                break;
            case 'Heat_map':
                this.urlType = ' heat_maps'
                this.getList('heat_maps',1);
                this.editRoute = 'heatmapEdit';
                break;
            case 'Virtual_reality':
                this.urlType = 'virtual_realities'
                this.getList('virtual_realities',1);
                this.editRoute = 'vrEdit';
                break;
            case 'Time_lapse':
                this.urlType = 'time_lapses'
                this.getList('time_lapses',1);
                this.editRoute = 'timelapseEdit';
                break;
            case 'Polyv_video':
                this.urlType = 'polyv_videos'
                this.getList('polyv_videos',1);
                this.editRoute = 'polyvideoEdit';
                break;
            case '360Rotation':
                this.urlType = 'rotation360s'
                this.getList('rotation360s',1);
                this.editRoute = 'rotationEdit';
                break;
            case 'photo_hot_zone':
                this.urlType = 'partials'
                this.getList('partials',1);
                this.editRoute = 'partialEdit';
                break;
            case 'photos':
                this.urlType = 'inner_structs'
                this.getList('inner_structs',1);
                this.editRoute = 'innerstructEdit';
                break;
            case 'Multi_angle':
                this.urlType = 'multi_angles'
                this.getList('multi_angles',1);
                this.editRoute = 'multiangleEdit';
                break;
            // case 'PPT':
            //     this.urlType = 'coursewares'
            //     this.getList('coursewares',1);
            //     this.editRoute = 'coursewaresEdit';
                break;
                default:
                    break;
            }
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
                        dataArr[i].meta_info.file_size = ((dataArr[i].meta_info.file_size/1024)/1024).toFixed(2)
                        that.axios.post('/BeautyScience/qiniu/url',{
                            res_name:dataArr[i].meta_info.thumb
                        })
                        .then(function(res){
                            dataArr[i].meta_info.imageUrl=res.data.url
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
    }
}
</script>

<style scoped>
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
