<template>
    <div>
        <ResBreadcrumb></ResBreadcrumb>
        <div class="bg_white">
            <ul class="edition-content padding-aside"> 
                <li v-for='(item,index) in listData' :key="index">
                    <!-- <div class="indexBox">
                        <h3>{{item.name}}</h3>
                        <span>{{item.index}}</span>
                    </div> -->
                    <!-- <div>
                        <el-button type="primary" size="small"
                        @click="editGrades(item.id)">编辑</el-button>
                        <el-button type="danger" size="small"
                        @click="deteleGrades(item.id)">删除</el-button>
                        <el-button type="success" size="small"
                        @click="linkTo(item.name,item.id)">详情</el-button>
                    </div> -->
                    <div class="indexBox">
                        <span>{{item.index}}</span>
                    </div>
                    <div class="imgBox" style="width:94px;">
                        <img :src="item.imgUrl" alt="">
                    </div>
                    <div class="btnsArr">
                        <h3>{{item.name}}</h3>
                        <div>
                            <el-button type="primary" size="small"
                            @click="editGrades(item.id)">编辑</el-button>
                            <el-button type="danger" size="small"
                            @click="deteleGrades(item.id)">删除</el-button>
                            <el-button type="success" size="small"
                            @click="linkTo(item.name,item.id)">详情</el-button>
                        </div>
                    </div>
                </li>
                <li class="edition-addBtn"><span @click="addGrades">点击添加 年级</span></li>
            </ul>
            <el-dialog :title="dialogTitle"
                :visible.sync="dialogFormVisible"
                :before-close="cancel"
                center>
                <el-form :model="titleForm" ref="titleForm">
                    <el-form-item prop="name">
                        <el-input v-model="titleForm.name"
                        auto-complete="off"
                        placeholder="请输入年级"></el-input>
                    </el-form-item>
                    <el-form-item prop="index">
                        <el-input v-model="titleForm.index"
                        auto-complete="off"
                        placeholder="请输入序号（用于排序，序号越小越靠前）"></el-input>
                    </el-form-item>
                    <el-form-item prop="thumb">
                        <div id="editionUp" class="upImgBox">
                            <i id="edition-upImg" class="el-icon-plus"
                            v-show="isShow" 
                            @click="upImg">缩略图</i>
                            <div style="width:100%;height:250px;position:relative;" v-show="imgShow" >
                                <img style="max-width: 100%;width: 100%;height: 250px;" :src="imgSrc" alt="">
                                <i class="el-icon-circle-close" 
                                style="position:absolute;top:5px;right:5px;cursor:pointer"
                                @click="changeImg"></i>
                            </div>
                        </div>
                        <el-input class="thumbInput" v-model="titleForm.thumb"
                        auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="danger" @click="cancel">取 消</el-button>
                    <el-button type="primary"
                    :disabled="titleForm.name == '' ? true : false"
                    @click="submit(book_id)">提 交</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
// import Bus from '@/bus.js'
import ResBreadcrumb from '@/components/base/resourceBreadcrumb'

export default {
    data () {
        return {
          dialogTitle:'添加年级',
          book_id:'',
          listData:[],
          dialogFormVisible:false,
          titleForm: {
                name: '',
                index:'',
                thumb:''
            },
          formLabelWidth: '120px',
          isShow:true,
          imgShow:false,
          imgSrc:'',
          uuid:''
        }
    },
    components:{
        ResBreadcrumb
    },
    mounted () {
        this.book_id = this.$route.query.book_id
        this.getGrades(this.book_id);
    },
    methods: {
        cancel(){
            this.$refs['titleForm'].resetFields();
            this.dialogFormVisible = false;
            this.imgShow = false;
            this.isShow =true;
            this.imgSrc = '';
        },
        getGrades(id){
           let that = this;
           this.axios.get('/BeautyScience/grades',{
               params:{
                   book_id:id
               }
           })
            .then(function(response){
                let dataArr = response.data.records
                for(let i=0;i<dataArr.length;i++){
                    that.axios.post('/BeautyScience/qiniu/url',{
                        res_name:dataArr[i].thumb
                    })
                    .then(function(res){
                        dataArr[i].imgUrl=res.data.url
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
            }) 
        },
        addGrades(){
            this.dialogFormVisible = true;
            this.dialogTitle = '添加年级';
        },
        editGrades(id){
           let that = this;
           this.axios.get('/BeautyScience/grades/'+id)
            .then(function(response){
                that.dialogTitle = "编辑年级"
                that.titleForm.name = response.data.name
                that.titleForm.index = response.data.index
                that.titleForm.id = response.data.id
                that.axios.post('/BeautyScience/qiniu/url',{
                    res_name:response.data.thumb
                })
                .then(function(res){
                    that.isShow = false;
                    that.imgShow = true;
                    that.imgSrc=res.data.url;
                })
            })
            this.dialogFormVisible = true
        },
        deteleGrades(id){
           let that = this;
           this.axios.delete('/BeautyScience/grades/'+id)
            .then(function(response){
                that.listData = []
                that.getGrades(that.book_id);
            })
            .catch(function(error){
                if(error.response.status == 422){
                    let msg = error.response.data.msg
                    that.$message({
                        message: msg+' 不可删除',
                        type: 'warning'
                    });
                }
            })
        },
        submit(book_id){
            let that = this;
            if(this.titleForm.id){
                   this.axios.patch('/BeautyScience/grades/'+this.titleForm.id,{
                       grade:{
                            name:this.titleForm.name,
                            index:this.titleForm.index,
                            thumb:this.titleForm.thumb,
                            book_id:book_id,
                        }
                   })
                    .then(function(response){
                        that.titleForm.id = null;
                        that.listData = [];
                        that.cancel();
                        that.getGrades(that.book_id);
                    }) 
            }else{
                this.axios.post('/BeautyScience/grades',{
                    grade:{
                        name:this.titleForm.name,
                        index:this.titleForm.index,
                        thumb:this.titleForm.thumb,
                        book_id:book_id
                    }
                })
                .then(function(response){
                    that.listData = [];
                    that.cancel();
                    that.getGrades(book_id);
                })
            }
            
        },
        linkTo(grade,id){
            let edition = this.$route.params.edition;
            let book_id = this.$route.query.book_id;
            this.$router.push({ name: 'grades',params:{edition:edition,grade:grade},query:{book_id:book_id,grade_id:id}})
        },
        upImg(){
            let _this = this;
            let Qiniu = global.Qiniu
            let plupload = window.plupload
            this.axios.get('BeautyScience/uuid')
            .then(function(response) {
                _this.uuid = response.data.uuid 
            })
            this.uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',      // 上传模式，依次退化
                browse_button: 'edition-upImg',         // 上传选择的点选按钮，必需
                uptoken_url:'BeautyScience/qiniu/get_token',
                // uptoken: _this.uptoken, // uptoken是上传凭证，由其他程序生成
                get_new_uptoken: true,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                unique_names: false,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
                save_key: false,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                bucket_name: 'test',
                domain: 'http://ozfsx7hp4.bkt.clouddn.com/test', // bucket domain eg:http://qiniu-plupload.qiniudn.com/
                container: 'editionUp',             // 上传区域DOM ID，默认是browser_button的父元素
                filters: [{ title : "image files", extensions : "jpg,png,jpeg" }],
                max_file_size: '2048mb',             // 最大文件体积限制
                // flash_swf_url: '/plupload/Moxie.swf',  // 引入flash，相对路径
                dragdrop: true,                     // 开启可拖曳上传
                drop_element: 'editionUp',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '500mb',                  // 分块上传时，每块的体积
                max_retries: 1,                     // 上传失败最大重试次数
                auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function (up, files) {
                        if (up.files.length >= 1) {
                            _this.isShow = false;
                            _this.imgShow = true;
                            // 只保留一张张图片
                            up.files.splice(1, up.files.length - 1);
                        } else {
                            // $('#certificateContainer').show();
                            _this.isShow = true;
                            _this.imgShow = false;
                        }
                        plupload.each(files, function (file) {
                            // 文件添加进队列后，处理相关的事情
                            //文件预览
                            let preloader = new mOxie.Image();
                            preloader.onload = function() {
                                preloader.downsize( 448, 250 );
                                let imgsrc = preloader.type=='image/jpeg' ? preloader.getAsDataURL('image/jpeg',80) : preloader.getAsDataURL(); 
                                _this.imgSrc = imgsrc;
                                preloader.destroy();
                                preloader = null;
                            };
                            preloader.load( file.getSource() );
                        })
                    },
                    'BeforeUpload': function (up, file) {
                        // 每个文件上传前，处理相关的事情
                        console.log('BeforeUpload', file)
                    },
                    'ChunkUploaded': function (up, file, info) {
                        console.log('ChunkUploaded')
                    },
                    'UploadProgress': function (up, file) {
                        // 每个文件上传时，处理相关的事情
                        // console.log('_this.filePause =')
                        // console.log(_this.filePause)
                        console.log('UploadProgress', file)
                        // _this.filePercent = parseInt(file.percent)
                        // _this.fileLoaded = pluploadb.formatSize(file.loaded).toUpperCase()
                        // _this.fileSpeed = pluploadb.formatSize(file.speed).toUpperCase()
                        // console.log('_this.filePercent =')
                        // console.log(_this.filePercent)
                    },
                    'FileUploaded': function (up, file, info) {
                        console.log('FileUploaded',up)
                        // 每个文件上传成功后，处理相关的事情
                        // 其中info是文件上传成功后，服务端返回的json，形式如：
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                        // 查看简单反馈
                        // var domain = up.getOption('domain');
                        var res =  JSON.parse(info.response);
                        var urlKey = res.key; 
                        _this.titleForm.thumb = urlKey
                        console.log(_this.titleForm)
                    },
                    'Error': function (up, err, errTip) {
                        // 上传出错时，处理相关的事情
                        console.log('Error =')
                        console.log(err)
                        console.log('errTip =')
                        console.log(errTip)
                    },
                    'UploadComplete': function () {
                        // 队列文件处理完毕后，处理相关的事情
                        console.log('UploadComplete')
                    },
                    'Key': function (up, file) {
                        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                        // 当save_key和unique_names设为false时，该方法将被调用
                        var key =_this.uuid;
                        // console.log('返回的key',key)
                        // do something with key here
                        return key
                    }
                }
            })
        },
        changeImg(){
            this.imgShow = false;
            this.isShow = true;
            this.imgSrc= '';
            this.titleForm.thumb = ''; 
        }
    }
  
}
</script>

<style scoped>
/* .edition-content{
    padding-top:48px;
    padding-bottom: 48px;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-start;
}
.edition-content li{
    display: inline-flex;
    flex-flow: column;
    justify-content: space-between;
    box-sizing: border-box;
    width: 28%;
    min-width: 276px;
    height: 200px;
    margin-right: 40px;
    margin-bottom: 48px;
    padding: 40px 40px 48px 40px;
    background-color: #f0f0f0; 
}
.edition-content li .indexBox{
    display: inline-flex;
    justify-content: space-between;
}
.edition-content li .indexBox span{
    font-size: 14px;
    color:#47a8de;
    margin:-20px -20px 0 0;
}
.edition-content .edition-addBtn span{
    display: inline-block;
    line-height: 100px;
    text-align: center;
    font-size: 24px;
    color: #999;
    font-weight: 700;
    cursor: pointer;
}
.edition-content li h3{
    font-size: 22px;
    color:#000;
} */


.edition-content{
    padding-top:48px;
    padding-bottom: 48px;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-start;
}
.edition-content li{
    display: flex;
    flex-flow: row;
    /* justify-content: space-between; */
    box-sizing: border-box;
    width: 100%;
    height: 180px;
    border-bottom: 1px solid #e6e6e6;
    padding: 24px 0 24px 48px;
    background-color: #fff; 
}
.edition-content li .indexBox span{
    font-size: 14px;
    color:#47a8de;
}
.edition-content li .imgBox{
    display: inline-flex;
    width: 240px;
    height: 100%;
    margin-right: 48px;
    margin-left:48px;
}
.edition-content li .imgBox>img{
    max-width: 100%;
}
.edition-content li .btnsArr{
    display: inline-flex;
    flex-flow: column;
    justify-content: space-between;
    height: 100%;
}
.edition-content .edition-addBtn span{
    display: inline-block;
    line-height: 100px;
    text-align: center;
    font-size: 24px;
    color: #999;
    font-weight: 700;
    cursor: pointer;
}
.edition-content li h3{
    font-size: 22px;
    color:#000;
}
.thumbInput{
    display: none;
}
.upImgBox{
    position: relative;
    width: 100%;
    height: 250px;
    line-height: 250px;
    text-align: center;
    font-size: 24px;
    background-color: #e6e6e6;
}
#edition-upImg{
    display: inline-block;
    cursor: pointer;
}
</style>
