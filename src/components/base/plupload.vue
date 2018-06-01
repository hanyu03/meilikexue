<template>
    <div id="pluploadContent3" class="upImg">
        <i id="pluploadUp3" class="el-icon-plus" @click="getUid"
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
</template>

<script>

export default {
    // props:['thumb'],
    data () {
    return {
        uuidImg:'',
        isShow:true,
        imgShow:false,
        pluploadImgSrc:'',
        dialogVisible:false
    }
  },
  mounted () {
      this.qiniuImg();
  },
  methods: {
        listenThumb(key){
            this.$emit('listenThumb',key)
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
                browse_button: 'pluploadUp3',         // 上传选择的点选按钮，必需
                uptoken_url:'/BeautyScience/qiniu/get_token',
                // uptoken: _this.uptoken, // uptoken是上传凭证，由其他程序生成
                get_new_uptoken: true,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                unique_names: false,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
                save_key: false,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                bucket_name: 'test',
                domain: 'http://ozfsx7hp4.bkt.clouddn.com/test', // bucket domain eg:http://qiniu-plupload.qiniudn.com/
                container: 'pluploadContent3',             // 上传区域DOM ID，默认是browser_button的父元素
                filters: [{ title : "image files", extensions : "jpg,png" }],
                max_file_size: '2048mb',             // 最大文件体积限制
                // flash_swf_url: '/plupload/Moxie.swf',  // 引入flash，相对路径
                dragdrop: true,                     // 开启可拖曳上传
                drop_element: 'pluploadContent3',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
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
                            // 只保留一张图片
                            // up.files.splice(0, up.files.length - 2);
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
                        // _this.thumb = urlKey;
                        _this.listenThumb(urlKey)
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
        }
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
    /* margin-top: 32px; */
}
.upImg i{
    font-size: 20px;
    color:#999;
    font-weight: 700;
    cursor: pointer;
    line-height: 270px;
}
.upContent-icon>i{
    color: #fff;
}
</style>
