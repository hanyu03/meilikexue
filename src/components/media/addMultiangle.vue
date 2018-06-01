<template>
  <div class="addZoomin padding-aside">        
        <div class="addHeader">
            <h3 class="addHeader-title">多角度</h3>
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
        <el-row class="addVideo-content m-t" :gutter="30">            
            <el-col :span='10'>
                <plupload @listenThumb="changeThumb"></plupload>
                <p class="thumbText">缩略图尺寸要求: 960*540px </p>
            </el-col>
            <el-col :span='16'></el-col>
        </el-row>
        
        <div class="hotList">
            <div>图片和视频上传</div>
            <ol>
                <li v-for="(item,index) in AllList" :key="index">
                    <span style="float: left;">{{index+1}}.</span>                  
                    <div class="dataBox">
                        <div class="imgBox">
                            <img :src="item.imgUrl" v-if="item.types==0">
                            <div v-else><video :src="item.imgUrl" poster class="video-size"></video><i></i></div>
                        </div>
                        <div class="simgBox">
                            <img :src="item.simgUrl">                            
                        </div>                        
                        <div class="textBox">
                            <p>{{item.titles}}</p>
                        </div>
                        <div class="btns">
                            <el-button type="primary" size="small" @click="editItem(index)">编 辑</el-button>
                            <el-button type="danger" size="small" @click="delItem(item,index)">删 除</el-button>
                        </div>
                    </div>
                </li>
                <li class="addBtn">
                    <i class="el-icon-plus" @click="addItem(0)"> 添加多角度图片</i>
                    <i class="el-icon-plus" @click="addItem(1)"> 添加多角度视频</i>                  
                </li>
            </ol>
        </div>
        <div class="btns" style="margin-bottom:32px;">
            <el-button type="primary" :disabled="isDisabledZip" @click="zipFiles">压 缩</el-button>
            <el-button type="danger" @click="$router.back(-1)">取 消</el-button>
        </div>

        <el-dialog
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        :show-close="false"
        center>
            <el-form :model="hotData" ref="hotData">
                <el-form-item prop="titles" 
                :rules="[{ required: true, message: '标题不能为空'}]">
                    <el-input v-model="hotData.titles" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item prop="thumb" v-if="hotData.types == 0">
                    <upImg ref="innerUpimg"
                    :inputId = 'upImg_inputId'
                    :imgId = 'upImg_imgId'
                    :parentImgFileArr = 'diaImgFileArr'
                    :parentlistItem="listItem"                                      
                    >点击上传正图</upImg>
                    <p class="thumbText">上传图片尺寸要求: 1920*1200px </p>
                </el-form-item>
                <el-form-item prop="thumb" class="diaVideo" v-else>                   
                    <upVideo ref="innerUpVideo" :inputId='upVideo_inputId' :videoId = 'upVideo_videoId' :parentVideoFileArr='diaImgFileArr' :parentlistItem="listItem"></upVideo>
                    <p class="thumbText">上传视频尺寸要求: 1920*1080px </p>
                </el-form-item>
                <el-form-item prop="thumb_small">
                    <div class="small-img">
                        <upImg ref="smallUpimg"
                        :inputId = 'thumb_inputId'
                        :imgId = 'thumb_imgId'
                        :parentImgFileArr = 'diaImgSmallArr'
                        :parentlistItem="listItem2"                                      
                        ></upImg>
                        <p class="thumbText">缩略图尺寸要求: 512*320px </p>
                    </div>                    
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="diacancel">取 消</el-button>
                <el-button type="primary"                
                @click="diaSubmit('hotData')" :disabled="diaDisabled">提 交</el-button>                
            </div>
        </el-dialog>

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
import upVideo from '@/components/base/upVideo'

export default {
    components: {
        Plupload,upImg,upVideo
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
            // upImg组件id
            spotImg_inputId:'spotImg_inputId',
            spotImg_imgId:'spotImg_imgId',

            upImg_inputId:'FileInput',
            upImg_imgId:'FileImg',

            upVideo_inputId:'inputId',
            upVideo_videoId:'videoId',

            thumb_inputId:'thumbInputId',
            thumb_imgId:'thumbVideoId',
            
            listItem:{}, 
            listItem2:{},          
            dialogFormVisible:false,
            upBtnVisible:false,            
            AllList:[],
            imgList:[],
            videoList:[],
            zipArr:[],            
            zipPercent:0,
            isPercent:false,
            isUpDisabled:false,
            isSuccess:true,
            vid:0,
            uuidZip:'',
            diaImgFileArr:[],
            diaImgSmallArr:[],
            isEdit:false,
            editIndex:0,
            bimg:'',
            simg:'',
            //需要传至后台的数据
            addData:{
                name:'',
                tag:'美丽科学',
                thumb:'',                
                angles:[],
                zip:'',
                md5:'',
                file_size:''
            },
            hotData:{                
                types:null,
                file_name:'',
                thumb_name:'',                
                imgUrl:'',
                simgUrl:'',
                titles:''
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
          return data.name == ''? true :(data.tag == ''? true : (data.thumb == ''? true :(data.image == ''?true:false)))
      },
      diaDisabled(){          
          return this.diaImgFileArr == ''? true :(this.diaImgSmallArr == ''? true :false);
      }      
    },
    mounted () {        
        this.qiniuZip();
    },
    methods: {        
        changeThumb(data){
             this.addData.thumb = data;
        },                     
        addItem(types){//添加
            this.dialogFormVisible = true;            
            this.isEdit = false;                   
            this.hotData = {
                types:types,                
                file_name:'',
                thumb_name:'',                
                imgUrl:'',
                simgUrl:'',
                titles:''
            };
        },
        editItem(index){//编辑               
            this.dialogFormVisible = true;
            this.diaImgFileArr = [6];
            this.diaImgSmallArr = [6];            
            this.bimg = this.AllList[index].file_name;
            this.simg = this.AllList[index].thumb_name;
            this.editIndex = index;
            this.isEdit = true;
            var that = this;
            console.log(index);
            this.hotData = {
                types:that.AllList[index].types,
                file_name:that.AllList[index].file_name,
                thumb_name:that.AllList[index].thumb_name,                    
                imgUrl:that.AllList[index].imgUrl,
                simgUrl:that.AllList[index].simgUrl,
                titles:that.AllList[index].titles
            };          
            if(parseInt(this.hotData.types) == 0){
                this.$refs['innerUpimg'].boxVisible = true;                
                this.$refs['innerUpimg'].dialogImageUrl = this.AllList[index].imgUrl;
                this.$refs['smallUpimg'].dialogImageUrl = this.AllList[index].simgUrl;               
            }else{           
                this.$refs['innerUpVideo'].VideoUrl = this.AllList[index].imgUrl;
                this.$refs['smallUpimg'].dialogImageUrl = this.AllList[index].simgUrl;
                this.$refs['innerUpVideo'].boxVisible = true;
            }
            this.$refs['smallUpimg'].boxVisible = true;
        },
        delItem(Aitem,id){//删除
            this.delZipArr(Aitem.file_name);
            this.delZipArr(Aitem.thumb_name);
            this.AllList.splice(id,1);
        },
        delZipArr(name){
            var that = this;
            this.zipArr.forEach(function (item,index) {                
                if (item.name == name){
                    that.zipArr.splice(index,1);                                 
                }       
            });
        },
        zipFiles(){//压缩
            var that = this;            
            if( this.zipArr.length>0 ){                
                this.AllList.forEach(function (item,index) {                    
                    that.addData.angles.push({
                        type:item.types,
                        file_name:item.file_name,
                        thumb_name:item.thumb_name,                        
                        text:item.titles
                    })                    
                });                
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
                });
            }else{
                this.$message.error('错误！ 请确保图片或视频已添加');
            } 
            console.log(this.zipArr)           
        },
        diacancel(){//弹窗取消
            if(this.hotData.types == 0){
                this.$refs['innerUpimg'].ofileImg = null;
                this.$refs['innerUpimg'].imgFile = {};
                this.$refs['innerUpimg'].dialogImageUrl = '';
                this.$refs['innerUpimg'].boxVisible = false;
            }else{
                this.$refs['innerUpVideo'].ofileVideo = null;
                this.$refs['innerUpVideo'].videoFile = {};
                this.$refs['innerUpVideo'].VideoUrl = '';
                this.$refs['innerUpVideo'].boxVisible = false;                
            }
            this.$refs['smallUpimg'].ofileImg = null;
            this.$refs['smallUpimg'].imgFile = {};
            this.$refs['smallUpimg'].dialogImageUrl = '';
            this.$refs['smallUpimg'].boxVisible = false;

            this.dialogFormVisible = false;
            this.diaImgFileArr = [];
            this.resetForm(); 
        },
        diaSubmit(formName) {//弹窗提交
            var that = this;          
            this.$refs[formName].validate((valid) => {
              if (valid) {                               
                  if(!this.isEdit){//添加                                                     
                    this.hotData.imgUrl = this.listItem.thumb;
                    this.hotData.simgUrl = this.listItem2.thumb;
                    this.hotData.file_name = this.diaImgFileArr[0].name;
                    this.hotData.thumb_name = this.diaImgSmallArr[0].name;
                    this.AllList.push(this.hotData);
                    this.zipArr.push(this.diaImgFileArr[0]);
                    this.zipArr.push(this.diaImgSmallArr[0]);

                    if(this.hotData.types == 0){
                        this.$refs['innerUpimg'].ofileImg = null;
                        this.$refs['innerUpimg'].imgFile = {};
                        this.$refs['innerUpimg'].dialogImageUrl = '';
                        this.$refs['innerUpimg'].boxVisible = false;
                    }else{
                        this.$refs['innerUpVideo'].ofileVideo = null;
                        this.$refs['innerUpVideo'].videoFile = {};
                        this.$refs['innerUpVideo'].VideoUrl = '';
                        this.$refs['innerUpVideo'].boxVisible = false;                
                    }
                    this.$refs['smallUpimg'].ofileImg = null;
                    this.$refs['smallUpimg'].imgFile = {};
                    this.$refs['smallUpimg'].dialogImageUrl = '';
                    this.$refs['smallUpimg'].boxVisible = false;                                     
                  }else{//编辑 
                    if(this.diaImgFileArr != '6'){
                        this.hotData.imgUrl = this.listItem.thumb;
                        this.hotData.file_name = this.diaImgFileArr[0].name;
                    }
                    if(this.diaImgSmallArr != '6'){
                        this.hotData.simgUrl = this.listItem2.thumb;
                        this.hotData.thumb_name = this.diaImgSmallArr[0].name;
                    }
                    if(this.diaImgFileArr[0].name != undefined){
                        this.zipArr.forEach(function (item,index) {                            
                            if(item.name === that.bimg){
                                that.zipArr.splice(index,1);                                   
                            }                 
                        });
                        this.zipArr.push(this.diaImgFileArr[0]);                                            
                    }
                    if(this.diaImgSmallArr[0].name != undefined){
                        this.zipArr.forEach(function (item,index) {
                            if (item.name == that.simg){
                                that.zipArr.splice(index,1);                                 
                            }                 
                        });                        
                        this.zipArr.push(this.diaImgSmallArr[0]);                        
                    }
                    this.AllList[this.editIndex].file_name = this.hotData.file_name;
                    this.AllList[this.editIndex].thumb_name = this.hotData.thumb_name;
                    this.AllList[this.editIndex].imgUrl = this.hotData.imgUrl;
                    this.AllList[this.editIndex].simgUrl = this.hotData.simgUrl;
                    this.AllList[this.editIndex].titles = this.hotData.titles;
                  }               
                this.listItem = {};
                this.listItem2 = {};
                this.diaImgFileArr = []; 
                this.diaImgSmallArr = [];            
                this.dialogFormVisible = false;                            
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
        stopUp(){//取消上传
            this.uploaderZip.stop();
            this.upBtnVisible = false;
            this.zipPercent = 0;
        },
        qiniuZip() {//打包上传到七牛
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
        onSubmit(){//完成            
            var that = this;
            that.axios({
              method:'post',
              url: '/BeautyScience/multi_angles',
              data:{                
                multi_angle:{
                    meta_info:{
                        name:that.addData.name,
                        tag:that.addData.tag,
                        thumb:that.addData.thumb,
                        zip:that.addData.zip,
                        md5:that.addData.md5,
                        file_size:that.addData.file_size
                    },                    
                    angles:that.addData.angles
                }
              }
            }).then(function (res) {                           
              if(res.status == 201){
                that.$message.success('添加成功');
                that.$router.push('/media/Multi_angle');
              }else{
                that.$message.error('添加失败');
              }                           
            }).catch(function (error) {
              console.log(error);             
            });            
        },
        resetForm() {//重置表单
          this.$refs['hotData'].resetFields();
        }
    }    
}
</script>

<style scoped>
.hotList{
    width: 100%;
    box-sizing: border-box;
    padding:24px 48px;
    border:1px solid #e6e6e6;
    margin-bottom: 48px;
}
.hotList>div{
    font-size: 20px;
    color:#333;
    font-weight: 700;
    line-height: 32px;
    margin-bottom: 24px;
}
.hotList ol{
    font-size: 20px;
    color: #47a8de;
    font-weight: 700;
}
.hotList ol li{
    margin-bottom: 24px;
}
.hotList ol li:last-child{
    margin-bottom: 0;
}
.hotList li>.dataBox{
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    height: 150px;
    padding-left: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid #e6e6e6; 
}
.hotList li>.dataBox>div{
    margin-right: 32px;
}
.hotList .imgBox{
    min-width: 240px;
    flex: 1;
}
.hotList .imgBox>div{display: inline-block; position: relative;}
.hotList .imgBox>div i{display: inline-block; width: 56px; height: 56px; position: absolute; bottom: 8px; right: 8px; background: url('../../assets/images/video_icon.png') center center;}
.hotList .textBox{
    width: 240px;
    color: #333
}
.hotList .textBox p{
    margin: 0;
    padding-bottom: 15px;
}
.hotList .btns{
    flex: 1;
    display: inline-flex;
    align-items: flex-end;
    flex-flow: row nowrap;
    margin-right: 0 !important;
}
.hotList .imgBox>img{
    max-width: 240px;
    max-height: 150px;
}

.hotList .simgBox{width: 140px}
.hotList .simgBox>img{ max-width: 140px; max-height: 80px;}
.hotList .addBtn{
    padding:8px 0 32px 15px;
}
.hotList .addBtn i{
    font-size: 17px;
    color: #999;
    font-weight: 700;
    cursor: pointer;
    margin-right: 30px;
}
.dislog_upImg{
    width: 100%;
    height:280px;
    background-color: #f0f0f0;
    text-align: center;
    line-height: 280px;
}

.small-img{position: relative;}
.small-img p{position: absolute; top: 25%; left: 150px}
</style>
