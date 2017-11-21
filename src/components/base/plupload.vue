<template>
  <div id="plupload">
      <i id="upImgBtn" class="el-icon-plus" @click='pul'>缩略图</i>
  </div>
</template>

<script>
require('qiniu-js/dist/qiniu.js')

export default {
  data () {
      return {
            qiniuToken:'',
            fileSize: '',
            fileLoaded: '',
            fileSpeed: '',
            filePercent: '',
            uploader: null
      }
  },
  mounted () {
      document.getElementById('upImgBtn').click()
  },
  methods: {
      pul(){
           let _this = this
          this.axios.post('BeautyScience/qiniu/token',{
              res_name:'123465'
          })
          .then(function(response){
              _this.qiniuToken = response.data.uptoken
                window.localStorage.setItem('qiniuToken', _this.qiniuToken)
              console.log(_this.qiniuToken)
          })
        let Qiniu = global.Qiniu
        let plupload = window.plupload
        
        this.uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4',      // 上传模式，依次退化
            browse_button: 'upImgBtn',         // 上传选择的点选按钮，必需
            uptoken: window.localStorage.getItem('qiniuToken'), // uptoken是上传凭证，由其他程序生成
            get_new_uptoken: true,             // 设置上传文件的时候是否每次都重新获取新的uptoken
            unique_names: false,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
            save_key: false,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
            bucket_name: 'test',
            domain: 'http://ozfsx7hp4.bkt.clouddn.com/test', // bucket domain eg:http://qiniu-plupload.qiniudn.com/
            container: 'plupload',             // 上传区域DOM ID，默认是browser_button的父元素
            max_file_size: '500mb',             // 最大文件体积限制
            // flash_swf_url: '/plupload/Moxie.swf',  // 引入flash，相对路径
            dragdrop: true,                     // 开启可拖曳上传
            drop_element: 'plupload',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            chunk_size: '4mb',                  // 分块上传时，每块的体积
            max_retries: 3,                     // 上传失败最大重试次数
            auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
            // x_vars : {
            //    查看自定义变量
            //    'time' : function(up,file) {
            //        var time = (new Date()).getTime();
            // do something with 'time'
            //        return time;
            //    },
            //    'size' : function(up,file) {
            //        var size = file.size;
            // do something with 'size'
            //        return size;
            //    }
            // },
            init: {
                'FilesAdded': function (up, files) {
                    plupload.each(files, function (file) {
                        // 文件添加进队列后，处理相关的事情
                        console.log('FilesAdded', file)
                        
                        // _this.fileSize = _this.toDecimal(file.size)
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
                    _this.filePercent = parseInt(file.percent)
                    _this.fileLoaded = plupload.formatSize(file.loaded).toUpperCase()
                    _this.fileSpeed = plupload.formatSize(file.speed).toUpperCase()
                    console.log('_this.filePercent =')
                    console.log(_this.filePercent)
                },
                'FileUploaded': function (up, file, info) {
                    console.log('FileUploaded')
                    // 每个文件上传成功后，处理相关的事情
                    // 其中info是文件上传成功后，服务端返回的json，形式如：
                    // {
                    //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                    //    "key": "gogopher.jpg"
                    //  }
                    // 查看简单反馈
                    var domain = up.getOption('domain');
                    var res =  JSON.parse(info.response);
                    // console.log(info.response)
                    var sourceLink = domain +"/"+ res.key; //获取上传成功后的文件的Url
                    console.log(sourceLink)
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
                    var key = "123465";
                    // do something with key here
                    return key
                }
            }
        })
      },
  }
}
</script>

<style scoped>

</style>
