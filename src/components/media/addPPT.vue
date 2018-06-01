<template>
    <div id="ppt" class="padding-aside" style="background:#fff;">
        <div class="addHeader">
            <h3 class="addHeader-title">课件</h3>
            <el-row :gutter="20" type="flex" align='middle' style="margin-right:0;">
                <el-col :span='15' style="display:inline-flex;padding:0;margin-left:10px;">
                    <i class="icon-blue"></i>
                    <el-input v-model="addData.title" placeholder="请输入标题"></el-input>
                </el-col>
                <el-col :span='9' :offset='1' style="padding:0;">
                    <el-select v-model="addData.tag" placeholder="请选择标签">
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
        <el-row :gutter="30" class="m-t">
           <el-col :span="8">
               <Plupload @listenThumb="changeThumb"></Plupload>
               <p class="thumbText">缩略图尺寸要求: 960*540px </p>
           </el-col>
           <el-col :span="16">
               <div class="fileTitle">
                    <P v-if="ofilePPTname != ''">{{ofilePPTname}}</P>
                    <P v-else>PPT</P>
               </div>
               <div class="addPicBtn" id="pluploadPPTContent">
                    <img src="../../../static/images/PPT.png" alt="">
                    <span v-if="ofilePPTname != ''" @click="deleteFile" style="color:red;margin-left:10px;">删除</span>
                    <span v-else id="pluploadPPT" style="color:#47a8de;margin-left:10px;">选择文件</span>
                    <!-- <span v-else id="pluploadPPT" @click="focusInput" style="color:#47a8de;margin-left:10px;">选择文件</span> -->
                    <!-- <input id="changeppt" class="upInput" type="file" @change="fileZip"> -->
                </div>
           </el-col> 
        </el-row>
        <div class="btns" style="margin-bottom:32px;">
            <!-- <el-button type="primary" :disabled="isDisabledZip" @click="zipFiles">压 缩</el-button> -->
            <el-button type="primary" :disabled="isDisabledZip" @click="submit">上 传</el-button>
            <el-button type="danger"  @click="$router.back(-1)">取 消</el-button>
        </div> 


        <el-dialog
            title="上传ZIP文件"
            :visible.sync="upBtnVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :show-close="false"
            width="30%">
            <div class="percentBox">
                <div>
                    <el-progress :text-inside="true" 
                    :stroke-width="18" 
                    :percentage="zipPercent" 
                    status="success"></el-progress>
                </div>
                <span v-if="isPercent" @click="stopUp">取消上传</span>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import jsZip from 'jszip'
import fs from 'file-saver'
import Plupload from '@/components/base/plupload'

export default {
    components: {
        Plupload
    },
    data () {
        return {
            options: [
                {
                    value: '美丽科学',
                    label: '美丽科学'
                }, 
                {
                    value: 'twig',
                    label: 'twig'
                }
            ],
            ofilePPTname:"",
            zipArr:[],
            upBtnVisible:false,
            zipPercent:0,
            isPercent:false,
            isUpDisabled:false,
            isSuccess:true,
            addData:{
                title:'',
                thumb:'',
                url:'',
                tag:'美丽科学',
                file_size:''                
            }
        }
    },
    watch: {
      zipPercent:function(newData){
            if(newData > 0 && newData < 100){
                this.isPercent = true
            }else if(newData == 100){
                this.isPercent = false
                this.isUpDisabled = true
                this.isSuccess = false
            }else{
                this.isPercent = false
            }
      }  
    },
    computed: {
      isDisabledZip(){
          var data = this.addData
          return data.title == ''? true :(data.tag == ''? true : (data.thumb == ''? true :(data.url == ''? true :false)))
      }       
    },
    mounted () {
        this.qiniuZip();
    },
    methods: {
        changeThumb(data){//缩略图
            this.addData.thumb = data;
        },
        focusInput(){
          this.ofilePPT = document.getElementById('changeppt');
          this.ofilePPT.click();
        },
        deleteFile(){
            document.getElementById('changeppt').value = ""
            this.ofilePPT = {}
            this.$message.success("删除成功，请重新选取文件！")
        },

        qiniuZip() {//上传到七牛
            let _this = this;
            let QiniuZip = new QiniuJsSDK();
            this.axios.get('BeautyScience/uuid')
            .then(function(response) {
                _this.uuidZip = response.data.uuid+'.ppt'
            })
            this.uploaderZip = QiniuZip.uploader({
                key:'qiniuUpzip',
                runtimes: 'html5,flash,html4',      // 上传模式，依次退化
                browse_button: 'pluploadPPT',         // 上传选择的点选按钮，必需
                uptoken_url:'BeautyScience/qiniu/get_public_token',
                // uptoken: _this.uptoken, // uptoken是上传凭证，由其他程序生成
                get_new_uptoken: true,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                unique_names: false,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
                save_key: false,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                bucket_name: 'test',
                domain: 'http://ozfsx7hp4.bkt.clouddn.com/test?qhash/md5', // bucket domain eg:http://qiniu-plupload.qiniudn.com/
                container: 'pluploadPPTContent',             // 上传区域DOM ID，默认是browser_button的父元素
                // filters: [{ title : "Zip files", extensions : "zip"}],
                max_file_size: '2048mb',             // 最大文件体积限制
                // flash_swf_url: '/plupload/Moxie.swf',  // 引入flash，相对路径
                dragdrop: true,                     // 开启可拖曳上传
                drop_element: 'pluploadPPTContent',          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '500mb',                  // 分块上传时，每块的体积
                max_retries: 1,                     // 上传失败最大重试次数
                auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                multi_selection: false,
                init: {
                    'BeforeUpload': function (up, file) {
                        // 每个文件上传前，处理相关的事情
                        _this.upBtnVisible = true
                    },
                    'UploadProgress': function (up, file) {
                        // 每个文件上传时，处理相关的事情
                        console.log('UploadProgress', file)
                        _this.zipPercent = file.percent
                    },
                    'FileUploaded': function (up, file, info) {
                        console.log('FileUploaded',info)
                        console.log('FileUploaded',file)
                        // 每个文件上传成功后，处理相关的事情
                        // 查看简单反馈
                        // var domain = up.getOption('domain');
                        _this.upBtnVisible = false
                        var res =  JSON.parse(info.response);
                        var urlKey = res.key;
                        _this.axios.post('BeautyScience/qiniu/public_url',{
                            res_name:urlKey
                        }).then((res)=>{
                            _this.addData.url = res.data.url
                        })
                        // _this.addData.zip = urlKey;
                        _this.addData.file_size = file.origSize;
                        _this.ofilePPTname = file.name;
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
        stopUp(){//取消上传
            this.uploaderZip.stop();
            this.upBtnVisible = false;
            this.zipPercent = 0;
        }, 

        submit(){//完成            
            var that = this;
            that.axios({
              method:'post',
              url: '/BeautyScience/coursewares',
              data:{                
                courseware:{
                    title : that.addData.title,
                    thumb : that.addData.thumb,
                    url : that.addData.url,
                    tag : that.addData.tag,
                    zip:that.addData.zip,
                    file_size:that.addData.file_size
                }
              }
            }).then(function (res) {                
              if(res.status == 201){
                that.$message.success('添加成功');
                that.$router.push('/media_/PPT');
              }else{
                that.$message.error('添加失败');
              }                           
            }).catch(function (error) {
              console.log(error);             
            });            
        },
    }
}
</script>

<style>
#ppt .fileTitle>p{
    font-size: 18px;
    color:#000;
    margin:0;
    margin-bottom:10px;
}
#ppt .addPicBtn>span{
    cursor: pointer;
}
</style>
