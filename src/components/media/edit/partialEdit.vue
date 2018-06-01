<template>
    <div class="zoominEdit padding-aside">
        <div class="addHeader">
            <h3 class="addHeader-title">图片热区</h3>
            <el-row :gutter="20" type="flex" align='middle' style="margin-right:0;">
                <el-col :span='15' style="display:inline-flex;padding:0;margin-left:10px;">
                    <i class="icon-blue"></i>
                    <el-input v-model="resourceData.name" placeholder="请输入标题"></el-input>
                </el-col>
                <el-col :span='9' :offset='1' style="padding:0;">
                    <el-select v-model="resourceData.tag" placeholder="请选择标签">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>
        </div>
        <div class="editContent">
            <div class="thumbBox">
                <div style="width:480px;height:270px;margin-top:32px;position: relative;">
                    <div id="pluploadContent" class="upImg">
                        <i id="pluploadUp" class="el-icon-plus" @click="getUid"
                        v-show="isShow"> 添加缩略图</i>
                        <div class="upContent" style="width:100%;height:270px;" v-show="imgShow" >
                            <img style="max-width: 100%;width: 100%;height: 270px;" :src="pluploadImgSrc" alt="">
                            <!-- <i class="el-icon-circle-close" 
                            style="position:absolute;top:5px;right:5px;cursor:pointer"></i> -->
                            <div class="upContent-icon">
                                <i class="el-icon-delete margin-right-20" @click="imgDelete"></i>
                                <i class="el-icon-view" @click="imgDialog"></i>
                            </div>
                        </div>
                        <el-dialog
                            title="图片展示"
                            :center="true"
                            :visible.sync="dialogVisible"
                            width="70%">
                            <img width="100%" :src="pluploadImgSrc" alt="">
                        </el-dialog>
                    </div>
                </div>
                <p class="thumbText">缩略图尺寸要求: 960*540px </p>
            </div>
            <div class="downZip">
                <p>资源包</p>
                <div>
                    <img src="../../../assets/images/zipbag.png" alt="">
                    <a :href="zipUrl" download="test.zip">下 载</a>
                </div>
            </div>
        </div>
        <div v-if="headerMsg.level !== 0" slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submit">上 传</el-button>
            <el-button type="danger" @click="Cancel">取 消</el-button>
        </div>
        <div v-else slot="footer" class="dialog-footer">
            <el-button type="danger" @click="Cancel">返 回</el-button>
        </div>
    </div>
</template>

<script>

export default {
    data () {
        return {
            pluploadEdit:'pluploadEdit',
            editId:'',
            options: [{
                value: '美丽科学',
                label: '美丽科学'
                }, {
                value: 'twig',
                label: 'twig'
            }],
            headerMsg:{
                level:''
            },
            resourceData:{
                name:'',
                tag:'',
                thumb:'',
                zip:'',
            },
            zipUrl:'',
            uuidImg:'',
            isShow:false,
            imgShow:true,
            pluploadImgSrc:'',
            dialogVisible:false
        }
    },
    mounted () {
        this.headerMsg.level = parseInt(window.localStorage.getItem('userLevel'));
        let that = this;
        this.editId = this.$route.params.id
        this.getData(that.editId)
        this.qiniuImg();
    },
    updated(){
        this.headerMsg.level = parseInt(window.localStorage.getItem('userLevel'));    
    },
    methods: {
        getData(id){
            let _this = this;
            this.axios.get('/BeautyScience/partials/'+id)
            .then(function(respones){
                let data = respones.data.meta_info;
                _this.resourceData.name = data.name
                _this.resourceData.tag = data.tag
                _this.resourceData.thumb = data.thumb
                _this.uuidImg = data.thumb
                _this.resourceData.zip = data.zip
                _this.axios.all([_this.axios.post('BeautyScience/qiniu/url',{
                    res_name:data.thumb
                }),_this.axios.post('BeautyScience/qiniu/public_url',{
                    res_name:data.zip
                })])
                .then(_this.axios.spread(function(acct, perms){
                    _this.pluploadImgSrc = acct.data.url
                    _this.zipUrl = perms.data.url
                }))
            })
        },
        imgDelete(){
            let that = this;
            this.axios.post('BeautyScience/qiniu/delete',{
               res_name: that.uuidImg
            })
            .then(function(response){
                that.$message({
                    message: '图片已删除，请重新上传',
                    type: 'success'
                })
                that.imgShow = false;
                that.isShow = true;
                that.pluploadImgSrc = '';
            })
        },
        imgDialog(){
            this.dialogVisible=true
        },
        Cancel(){
            this.$router.push('/media/Partial')
        },
        submit(){
            let that = this;
            this.axios.patch('/BeautyScience/partials/'+this.editId,{
                partial:{
                    meta_info:this.resourceData
                }
            })
            .then(function(respones){
                that.$router.push('/media/Partial')
            })
        },
        getUid(){
            let _this = this;
            this.axios.get('BeautyScience/uuid')
            .then(function(response) {
                _this.uuidImg = response.data.uuid
            })
        },
        qiniuImg() {
            let _this = this;
            let QiniuImg = new QiniuJsSDK();
            
            this.uploader = QiniuImg.uploader({
                key:'qiniuUpimg',
                runtimes: 'html5,flash,html4',      // 上传模式，依次退化
                browse_button: 'pluploadUp',         // 上传选择的点选按钮，必需
                uptoken_url:'BeautyScience/qiniu/get_token',
                // uptoken: '5689', // uptoken是上传凭证，由其他程序生成
                get_new_uptoken: true,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                unique_names: false,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
                save_key: false,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                bucket_name: 'test',
                domain: 'http://ozfsx7hp4.bkt.clouddn.com/test', // bucket domain eg:http://qiniu-plupload.qiniudn.com/
                container: 'pluploadContent',             // 上传区域DOM ID，默认是browser_button的父元素
                filters: [{ title : "image files", extensions : "jpg,png" }],
                max_file_size: '2048mb',             // 最大文件体积限制
                // flash_swf_url: '/plupload/Moxie.swf',  // 引入flash，相对路径
                dragdrop: true,                     // 开启可拖曳上传
                drop_element: 'pluploadContent',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '500mb',                  // 分块上传时，每块的体积
                max_retries: 1,                     // 上传失败最大重试次数
                auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                multi_selection: false,
                init: {
                    'PostInit':function(up){
                        // up.disableBrowse(true)
                    },
                    'FilesAdded': function (up, files) {
                        if (up.files.length >= 1) {
                            _this.isShow = false;
                            _this.imgShow = true;
                            // 只保留一张张图片
                            // up.files.splice(1, up.files.length - 1);
                        } else {
                            _this.isShow = true;
                            _this.imgShow = false;
                        }
                        plupload.each(files, function (file) {
                            // 文件添加进队列后，处理相关的事情
                            //文件预览
                            let preloader = new mOxie.Image();
                            preloader.onload = function() {
                                preloader.downsize( 960, 540 );
                                let imgsrc = preloader.type=='image/jpeg' ? preloader.getAsDataURL('image/jpeg',80) : preloader.getAsDataURL(); 
                                _this.pluploadImgSrc = imgsrc;
                                preloader.destroy();
                                preloader = null;
                            };
                            preloader.load( file.getSource() );
                            // _this.pluploadImgFile = file.getNative();
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
                        console.log('UploadProgress', file)
                    },
                    'FileUploaded': function (up, file, info) {
                        console.log('FileUploaded',up)
                        // 每个文件上传成功后，处理相关的事情
                        // 查看简单反馈
                        // var domain = up.getOption('domain');
                        var res =  JSON.parse(info.response);
                        var urlKey = res.key; 
                        _this.resourceData.thumb = urlKey;
                        // _this.listenThumb(urlKey)
                        // console.log(_this.$parent.resourceData);
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
                        var key = _this.uuidImg;
                        return key
                    }
                }
            })
            
        },
    }
}
</script>

<style scoped>
.upImg{
    /* width: 480px; */
    width: 100%;
    height: 270px;
    background-color: #f0f0f0;
    text-align: center;
}
.upImg i{
    font-size: 20px;
    color:#fff;
    font-weight: 700;
    cursor: pointer;
    line-height: 270px;
}
.editContent{
    display: flex;
}
.downZip{
    margin: 32px 0 0 48px;
}
.downZip>p{
    margin: 0;
    font-size: 18px;
    color:#333;
    line-height: 34px;
}
.downZip img{
    vertical-align: bottom;
}
.downZip a{
    font-size: 12px;
    color:#47a8de;
    margin-left: 16px;
}
</style>

