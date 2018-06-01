<template>
    <div class="upZip">
        <el-dialog
         id="pluploadZipContent"
        title="上传ZIP文件"
        :visible.sync="upBtnVisible"
        :close-on-click-moda="false"
        :close-on-press-escape="false"
        :show-close="false"
        width="30%">
        <el-progress :text-inside="true" 
        :stroke-width="18" 
        :percentage="zipPercent" 
        status="success"></el-progress>
        <span slot="footer" class="dialog-footer">
            <el-button id="pluploadZip" type="primary">上 传</el-button>
            <el-button type="danger" @click="upDone">完 成</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    props:['resourceData','upBtnVisible'],
    data () {
        return {
            zipPercent:0,
            uuidZip:''
        }
    },
    mounted () {
        let _this = this;
        let QiniuZip = new QiniuJsSDK();
        this.axios.get('BeautyScience/uuid')
        .then(function(response) {
            _this.uuidZip = response.data.uuid+'.zip'
        })
        this.uploaderZip = QiniuZip.uploader({
            key:'qiniuUpzip',
            runtimes: 'html5,flash,html4',      // 上传模式，依次退化
            browse_button: 'pluploadZip',         // 上传选择的点选按钮，必需
            uptoken_url:'BeautyScience/qiniu/get_token',
            // uptoken: _this.uptoken, // uptoken是上传凭证，由其他程序生成
            get_new_uptoken: true,             // 设置上传文件的时候是否每次都重新获取新的uptoken
            unique_names: false,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
            save_key: false,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
            bucket_name: 'test',
            domain: 'http://ozfsx7hp4.bkt.clouddn.com/test?qhash/md5', // bucket domain eg:http://qiniu-plupload.qiniudn.com/
            container: 'pluploadZipContent',             // 上传区域DOM ID，默认是browser_button的父元素
            filters: [{ title : "Zip files", extensions : "zip"}],
            max_file_size: '2048mb',             // 最大文件体积限制
            // flash_swf_url: '/plupload/Moxie.swf',  // 引入flash，相对路径
            dragdrop: true,                     // 开启可拖曳上传
            drop_element: 'pluploadZipContent',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            chunk_size: '500mb',                  // 分块上传时，每块的体积
            max_retries: 1,                     // 上传失败最大重试次数
            auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
            multi_selection: false,
            init: {
                'PostInit':function(up){
                    // up.disableBrowse(true);
                },
                'FilesAdded': function (up, files) {
                    plupload.each(files, function (file) {
                        // 文件添加进队列后，处理相关的事情
                        //文件预览
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
                    _this.zipPercent = file.percent
                },
                'FileUploaded': function (up, file, info) {
                    console.log('FileUploaded',info)
                    // 每个文件上传成功后，处理相关的事情
                    // 查看简单反馈
                    // var domain = up.getOption('domain');
                    var res =  JSON.parse(info.response);
                    var urlKey = res.key;
                    _this.resourceData.zip = urlKey;
                    _this.resourceData.md5 = res.hash;
                    _this.resourceData.file_size = file.origSize;
                    // console.log(_this.titleForm);
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
                    var key = _this.uuidZip;
                    return key
                }
            }
        })
    },
    methods: {
        // upZip(){
        //    this.uploaderZip.start(); 
        // },
        upDone(){
            console.log(this.resourceData)
        }

    }
}
</script>

<style scoped>

</style>
