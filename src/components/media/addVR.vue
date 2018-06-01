<template>
    <div class="addVR padding-aside">        
        <div class="addHeader">
            <h3 class="addHeader-title">VR全景</h3>
            <el-row :gutter="20" type="flex" align='middle' style="margin-right:0;">
                <el-col :span='15' style="display:inline-flex;padding:0;margin-left:10px;">
                    <i class="icon-blue"></i>
                    <el-input v-model="addData.name" placeholder="请输入标题"></el-input>
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
           <el-col :span="9">
               <Plupload @listenThumb="changeThumb"></Plupload>
               <p class="thumbText">缩略图尺寸要求: 960*540px</p>
           </el-col>
           <el-col :span="15"></el-col> 
        </el-row>
        <div>
            <el-row :gutter="30" v-for="(item,index) in panoramaArr" :key="index">
               <el-col :span="16">               
                   <upImg
                    :inputId='item.Img_inputId'
                    :imgId = 'item.Img_imgId'
                    :parentImgFileArr='item.ImgFileArr'> 上传全景图</upImg>
                   <p class="thumbText">注意：必须上传全景图片！全景图尺寸要求：5376*2688px</p>
               </el-col>
               <el-col :span="8">
                    <el-input v-model="item.imgTitle" placeholder="请输入左侧全景图标题"></el-input>
                    <el-button type="danger" size="small" class="del-btn" @click="delPimg(index)" v-if="panoramaArr.length>1">删 除</el-button>
               </el-col> 
            </el-row>
            <p class="addPan"><i class="el-icon-plus" @click="addNode"> 添加全景图</i></p>
        </div>
        <div class="btns">
            <el-button type="primary" :disabled="isDisabledZip" @click="zipFiles">压缩</el-button>
            <el-button type="danger" @click="$router.back(-1)">取消</el-button>
        </div>
        <el-dialog
            id="pluploadZipContent"
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
            <span slot="footer" class="dialog-footer">
                <el-button id="pluploadZip" type="primary" :disabled="isUpDisabled">上 传</el-button>
                <el-button type="danger" :disabled="isSuccess" @click="onSubmit">完 成</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import jsZip from 'jszip'
import fs from 'file-saver'
import Plupload from '@/components/base/plupload'
import upImg from '@/components/base/upImg'

export default {
    components: {
        Plupload,upImg
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
            upBtnVisible:false, 
            zipPercent:0,
            isPercent:false,
            isUpDisabled:false,
            isSuccess:true,
            uuidZip:'',         
            panoramaArr:[
                {
                    Img_inputId:'FileInput',
                    Img_imgId:'FileImg',
                    ImgFileArr:[],
                    imgTitle:''
                }
            ],
            zipArr:[],            
            addData:{
                name:'',
                thumb:'',                
                tag:'美丽科学',
                images:[],
                zip:'',
                md5:'',
                file_size:''                
            },            
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
      isDisabled(){
          var data = this.addData
          return data.name == ''? true :(data.tag == ''? true : (data.thumb == ''? true :(data.zip == ''?true:false)))
      },
      isDisabledZip(){
          var data = this.addData
          return data.name == ''? true :(data.tag == ''? true : (data.thumb == ''? true :false))
      }      
    },
    mounted () {
        this.qiniuZip();        
    },
    methods: {
        changeThumb(data){//缩略图
          this.addData.thumb = data;
        },
        addNode(){
            this.panoramaArr.push({
                Img_inputId:'FileInput'+this.panoramaArr.length,
                Img_imgId:'FileImg'+this.panoramaArr.length,
                ImgFileArr:[],
                imgTitle:''
            })
        },
        delPimg(id){//删除一行图片
            this.panoramaArr.splice(id,1);                      
        },
        qiniuZip() {//上传到七牛
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
                uptoken_url:'BeautyScience/qiniu/get_public_token',
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
                        _this.addData.zip = urlKey;
                        _this.addData.md5 = res.hash;
                        _this.addData.file_size = file.origSize;
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
        zipFiles(){//压缩             
            var that = this;
            var valid = true;
            this.panoramaArr.forEach(function (item,index) {
                if(item.ImgFileArr.length <1 || item.imgTitle == ''){
                    that.$message.error('请确保全景图片和标题都已填写！');
                    valid = false;
                }
            });
            if(valid){
                if( this.panoramaArr.length>0){
                    this.panoramaArr.forEach(function (item,index) {
                        that.zipArr.push(item.ImgFileArr[0]);
                        //console.log(that.zipArr)
                        that.addData.images.push({
                            name:item.imgTitle,
                            image:item.ImgFileArr[0].name,
                        })                    
                    })                    
                    this.upBtnVisible = true;
                    var zip = new jsZip();
                    for(let i=0;i<this.zipArr.length;i++){
                        zip.file(this.zipArr[i].name,this.zipArr[i])
                    }
                    zip.generateAsync({
                        type:"blob",
                        compression: "DEFLATE",
                        compressionOptions: {
                            level: 9
                        },
                        comment:"这是注释"
                    })   // 生成一个zipObj
                    .then(function(content) {
                        //使用fileSave 保存至本地
                        fs.saveAs(content, "test.zip");
                        console.log('检查文件个数',zip)
                    });                               
                }else{
                    this.$message.error('错误！请确保全景图已选取');
                }
            }            
        },
        stopUp(){//取消上传
            this.uploaderZip.stop();
            this.upBtnVisible = false;
            this.zipPercent = 0;
        },
        onSubmit(){//完成            
            var that = this;
            that.axios({
              method:'post',
              url: '/BeautyScience/virtual_realities',
              data:{                
                virtual_reality:{
                    meta_info:{
                        name:that.addData.name,
                        tag:that.addData.tag,
                        thumb:that.addData.thumb,
                        zip:that.addData.zip,
                        md5:that.addData.md5,
                        file_size:that.addData.file_size
                    },
                    images:that.addData.images                   
                }
              }
            }).then(function (res) {                
              if(res.status == 201){
                that.$message.success('添加成功');
                that.$router.push('/media/Virtual_reality');
              }else{
                that.$message.error('添加失败');
              }                           
            }).catch(function (error) {
              console.log(error);             
            });            
        }
    }    
}
</script>

<style scoped>
.addPan{height: 40px; line-height: 40px}
.addPan i{font-size: 14px; color: #b9b9b9; font-weight: 700; cursor: pointer;}
.del-btn{position: absolute; bottom: 45px; right: 0;}
</style>
