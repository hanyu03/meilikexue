<template>
  <div class="addZoomin padding-aside">        
        <div class="addHeader">
            <h3 class="addHeader-title">图片热区</h3>
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
            <el-col :span='8'>
                <plupload @listenThumb="changeThumb"></plupload>
                <p class="thumbText">缩略图尺寸要求: 960*540px </p>
            </el-col>
            <el-col :span='16' class="spotImg">                
                <upImg
                    :inputId='spotImg_inputId'
                    :imgId = 'spotImg_imgId'
                    :parentImgFileArr='spotImgFileArr'
                    @listenItemSrc="changeSrc"
                    > 点击上传图片</upImg>
                <p class="thumbText">图片尺寸要求: 1920*1200px </p> 
            </el-col>
        </el-row>
        
        <div class="hotList">
            <div>添加热点</div>
            <ol>
                <li v-for="(item,index) in hotList" :key="index">
                    <span style="float: left;">{{index+1}}.</span>                  
                    <div class="dataBox">
                        <div class="imgBox">
                            <img :src="item.imgUrl" v-if="item.types == 0">
                            <div v-else-if="item.types == 1"><video :src="item.imgUrl" poster class="video-size"></video><i></i></div>
                            <p v-else style="min-width:100px;margin:0;">{{item.text}}</p>
                        </div>                        
                        <div class="textBox">
                            <p>左边距：{{item.left_mg}}%</p>
                            <p>上边距：{{item.bottom_mg}}%</p>
                        </div>
                        <div class="btns">
                            <el-button type="primary" size="small" @click="editItem(index)">编 辑</el-button>
                            <el-button type="danger" size="small" @click="delItem(index)">删 除</el-button>
                        </div>
                    </div>
                </li>
                <li class="addBtn">
                    <i class="el-icon-plus" @click="addItem(0)"> 添加热点图片</i>
                    <i class="el-icon-plus" @click="addItem(1)"> 添加热点视频</i>
                    <i class="el-icon-plus" @click="addItem(2)"> 添加热点文字</i>
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
                <el-form-item prop="thumb" v-if="hotData.types == 0">
                    <upImg ref="innerUpimg"
                    :inputId = 'upImg_inputId'
                    :imgId = 'upImg_imgId'
                    :parentImgFileArr = 'diaImgFileArr'
                    :parentlistItem="listItem"                                      
                    ></upImg>
                    <p class="thumbText">上传图片尺寸要求: 1920*1200px </p>
                </el-form-item>
                <el-form-item prop="thumb" class="diaVideo" v-else-if="hotData.types == 1">                   
                    <upVideo ref="innerUpVideo" :inputId='upVideo_inputId' :videoId = 'upVideo_videoId' :parentVideoFileArr='diaImgFileArr' :parentlistItem="listItem"></upVideo>
                    <p class="thumbText">上传视频尺寸要求: 1920*1080px </p>
                </el-form-item>
                <el-form-item prop="text" class="diaVideo" v-else>                   
                    <el-input v-model="hotData.text" type="textarea" :rows="5"></el-input>
                </el-form-item>
                <el-form-item prop="left_mg" 
                :rules="[
                  { required: true, message: '左边距不能为空'},
                  { pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/, message: '精确到小数点后两位数字'}
                ]">
                    <el-input v-model="hotData.left_mg"
                    auto-complete="off"
                    placeholder="请输入左边距（例如：50表示50%，显示在屏幕中间）"></el-input>
                </el-form-item>
                <el-form-item prop="bottom_mg" 
                :rules="[
                  { required: true, message: '上边距不能为空'},
                  { pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/, message: '精确到小数点后两位数字'}
                ]">
                    <el-input v-model="hotData.bottom_mg"
                    auto-complete="off"
                    placeholder="请输入上边距（例如：50表示50%，显示在屏幕中间）"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="diacancel">取 消</el-button>
                <el-button type="primary" v-if="hotData.types != 2"                
                @click="diaSubmit('hotData')" :disabled="diaDisabled">提 交</el-button>                
                <el-button type="primary" v-else                
                @click="diaSubmit('hotData')">提 交</el-button>                
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
            
            listItem:{},

            spotImgFileArr:[],
            dialogFormVisible:false,
            upBtnVisible:false,            
            hotList:[],
            zipArr:[],            
            zipPercent:0,
            isPercent:false,
            uuidZip:'',
            diaImgFileArr:[],
            isEdit:false,
            isUpDisabled:false,
            isSuccess:true,
            editIndex:0,
            bimg:'',

            //需要传至后台的数据
            addData:{
                name:'',
                tag:'美丽科学',
                thumb:'',
                image:'',
                touch_points:[],
                zip:'',
                md5:'',
                file_size:''
            },
            hotData:{                
                types:null,
                left_mg:'',
                bottom_mg:'',
                imgUrl:'',
                ImgFileName:'',
                text:''
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
          return this.diaImgFileArr == ''? true :false;
      }, 
    },
    mounted () {        
        this.qiniuZip();
    },
    methods: {        
        changeThumb(data){
             this.addData.thumb = data;
        },
        changeSrc(data){            
            this.addData.image = this.spotImgFileArr[0].name;            
        },              
        addItem(types){//添加
            this.dialogFormVisible = true; 
            this.isEdit = false;          
            this.hotData = {
                types:types,
                left_mg:'',
                bottom_mg:'',
                imgUrl:'',
                ImgFileName:'',
                text:''
            };
        },
        editItem(index){//编辑
            this.dialogFormVisible = true;
            this.diaImgFileArr = [6];
            this.bimg = this.hotList[index].ImgFileName;
            this.editIndex = index;
            this.isEdit = true;
            this.hotData = {
                types:this.hotList[index].types,
                left_mg:this.hotList[index].left_mg,
                bottom_mg:this.hotList[index].bottom_mg,
                imgUrl:this.hotList[index].imgUrl,
                ImgFileName:this.hotList[index].ImgFileName
            };
            if(this.hotData.types == 0){
                this.$refs['innerUpimg'].boxVisible = true;                
                this.$refs['innerUpimg'].dialogImageUrl = this.hotList[index].imgUrl;                
            }else if(this.hotData.types == 1){               
                this.$refs['innerUpVideo'].VideoUrl = this.hotList[index].imgUrl;
                this.$refs['innerUpVideo'].boxVisible = true;                               
            }
            //console.log(this.hotData)
        },
        delItem(id){//删除
            this.hotList.splice(id,1);
            this.zipArr.splice(id,1);                     
        },
        zipFiles(){//压缩
            var that = this;            
            if( this.zipArr.length>0 && this.spotImgFileArr.length>0){
                if (this.spotImgFileArr.length>0) this.zipArr.push(this.spotImgFileArr[0]);
                this.hotList.forEach(function (item,index) {
                    if(item.types == 2){
                        that.addData.touch_points.push({
                            x:item.left_mg,
                            y:item.bottom_mg,
                            type:item.types,
                            text:item.text
                        })
                    }else{
                        that.addData.touch_points.push({
                            x:item.left_mg,
                            y:item.bottom_mg,
                            type:item.types,
                            file_name:item.ImgFileName
                        })
                    }                    
                                        
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
                this.$message.error('错误！ 请确保添加热点图片已添加');
            }
            console.log(this.zipArr)
        },
        diacancel(){//弹窗取消
            if(this.hotData.types == 0){
                this.$refs['innerUpimg'].ofileImg = null;
                this.$refs['innerUpimg'].imgFile = {};
                this.$refs['innerUpimg'].dialogImageUrl = '';
                this.$refs['innerUpimg'].boxVisible = false;
            }else if(this.hotData.types == 1){
                this.$refs['innerUpVideo'].ofileVideo = null;
                this.$refs['innerUpVideo'].videoFile = {};
                this.$refs['innerUpVideo'].VideoUrl = '';
                this.$refs['innerUpVideo'].boxVisible = false;                
            } 
            this.dialogFormVisible = false;
            this.diaImgFileArr = [];
            this.resetForm(); 
        },
        diaSubmit(formName) {//弹窗提交
            var that = this;     
            this.$refs[formName].validate((valid) => {
                if (valid) {
                  if(!this.isEdit){//添加  
                    if(this.listItem.thumb){
                        this.hotData.imgUrl = this.listItem.thumb;
                    }
                    if(this.diaImgFileArr[0]){
                        this.hotData.ImgFileName = this.diaImgFileArr[0].name;
                        this.zipArr.push(this.diaImgFileArr[0]); 
                    }            
                    this.hotList.push(this.hotData);
                    // this.zipArr.push(this.diaImgFileArr[0]);                    
                    if(this.hotData.types == 0){
                        this.$refs['innerUpimg'].ofileImg = null;
                        this.$refs['innerUpimg'].imgFile = {};
                        this.$refs['innerUpimg'].dialogImageUrl = '';
                        this.$refs['innerUpimg'].boxVisible = false;
                    }else if(this.hotData.types == 1){
                        this.$refs['innerUpVideo'].ofileVideo = null;
                        this.$refs['innerUpVideo'].videoFile = {};
                        this.$refs['innerUpVideo'].VideoUrl = '';
                        this.$refs['innerUpVideo'].boxVisible = false;                
                    }
                    //console.log('add',this.hotData);                  
                  }else{//编辑
                    if(this.diaImgFileArr != '6'){
                        this.hotData.imgUrl = this.listItem.thumb;
                        this.hotData.ImgFileName = this.diaImgFileArr[0].name;
                    }
                    if(this.diaImgFileArr[0].name != undefined){
                        this.zipArr.forEach(function (item,index) {                            
                            if(item.name === that.bimg){
                                that.zipArr.splice(index,1);                                   
                            }                 
                        });
                        this.zipArr.push(this.diaImgFileArr[0]);                                            
                    }
                    this.hotList[this.editIndex].left_mg = this.hotData.left_mg;
                    this.hotList[this.editIndex].bottom_mg = this.hotData.bottom_mg;
                    this.hotList[this.editIndex].imgUrl = this.hotData.imgUrl;
                    this.hotList[this.editIndex].ImgFileName = this.hotData.ImgFileName;
                    //console.log('edit',this.hotData)
                }               
                this.listItem = {};
                this.diaImgFileArr = [];             
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
              url: '/BeautyScience/partials',
              data:{
                partial:{
                    meta_info:{
                        name:that.addData.name,
                        tag:that.addData.tag,
                        thumb:that.addData.thumb,
                        zip:that.addData.zip,
                        md5:that.addData.md5,
                        file_size:that.addData.file_size
                    },
                    image:that.addData.image,
                    touch_points:that.addData.touch_points
                }
              }
            }).then(function (res) {                
              if(res.status == 201){
                that.$message.success('添加成功');
                that.$router.push('/media/photo_hot_zone');
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
.hotList .imgBox>img,.hotList .imgBox>video{
    max-width: 240px;
    max-height: 150px;
}

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

</style>
