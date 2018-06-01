<template>
  <div class="addZoomin padding-aside">
        <!-- <AddHeader v-on:listenName="changeName" v-on:listenTag="changeTag">
            <h3 class="addHeader-title">显微缩放</h3>
        </AddHeader> -->
        <div class="addHeader">
            <h3 class="addHeader-title">显微缩放</h3>
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
        <div style="width:480px;height:270px;margin-top:32px;">
            <Plupload ref="pluploadImg" v-on:listenThumb="changeThumb"></Plupload>
        </div>
        <p class="thumbText">缩略图尺寸要求: 960*540px </p>
        <div class="bigImgList m-t">
            <div class="title">
                <h3>放大图片({{bigImgList.length}})</h3>
                <em>必填</em>
                <span>尺寸要求：3840*2400px</span>
            </div>
            <ul>
                <li v-for="(item,index) in bigImgList" :key="index">
                    <em>{{index+1}}</em>
                    <div>
                        <img :src="item">
                        <div class="opt-icon">
                            <i class="el-icon-delete margin-right-20" @click="imgDelete(index)"></i>
                            <i class="el-icon-view" @click="imgDialog(item)"></i>
                        </div>
                    </div>                    
                </li>                
                <li>
                    <em></em>
                    <div class="addPicBtn">
                        <i class="el-icon-plus" @click="focusInput">添加放大图片</i>
                        <input id="changeImg" class="upInput" type="file" @change="fileZip">
                    </div>                    
                </li>
            </ul>
        </div>
        <div class="nodeList">
            <div>轴节点（{{nodeData.length}}）</div>
            <ol>
                <li v-for="(item,index) in nodeData" :key="index">
                    <span>{{index+1}}.</span>
                    <div class="dataBox">
                        <div class="timeName">
                            <span>节点:</span>
                            <span v-if="item.isEdit == false && item.isAdd == false">{{item.num}}</span>
                            <el-input v-model="item.num" v-else placeholder="节点名称"></el-input>
                        </div>
                        <div class="timeName">
                            <span>节点描述:</span>
                            <span v-if="item.isEdit == false && item.isAdd == false">{{item.text}}</span>
                            <el-input v-model="item.text" v-else placeholder="节点描述（选填）"></el-input>
                        </div>
                        <div class="btns">
                            <el-button type="primary" size="small"
                            @click="editNode(index)" v-if="item.isEdit == false && item.isAdd == false">编 辑</el-button>
                            <el-button type="success" size="small"
                            @click="submitNode(index)" v-if="item.isEdit || item.isAdd" :disabled="item.num == ''?true:false">确 认</el-button>
                            <el-button type="danger" size="small"
                            @click="delNode(index)">删 除</el-button>
                        </div>
                    </div>
                </li>
                <li class="addBtn">
                    <i class="el-icon-plus" @click="addNode"> 添加显微放大节点</i>
                </li>
            </ol>
        </div>
        <div class="btns" style="margin-bottom:32px;">
            <el-button type="primary" 
            :disabled="isDisabled"
            @click="zipFiles">压 缩</el-button>
            <el-button type="danger"
            @click="toList">取 消</el-button>
        </div>
        
        <el-dialog title="图片展示" :center="true" :visible.sync="dialogVisible" width="50%" class="rotaDialog">
            <img class="dialogImg" :src="dialogImageUrl" alt="">
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
            
            <div slot="footer" class="dialog-footer">
                <el-button id="pluploadZip" type="primary" :disabled="isUpDisabled">上 传</el-button>
                <el-button type="danger" :disabled="isSuccess" @click="zipCancel">完 成</el-button>
            </div>
        </el-dialog>
  </div>
</template>

<script>
import jsZip from 'jszip'
import fs from 'file-saver'
import Plupload from '@/components/base/plupload'
import upImg from '@/components/base/upImg'

export default {
    data () {
        return {
            options: [{
                value: '美丽科学',
                label: '美丽科学'
                }, {
                value: 'twig',
                label: 'twig'
            }],
            upBtnVisible:false,
            pluploadImg:'pluploadImg',
            //图片数组
            ofileImg:{},
            bigImgList:[],
            bigImgListArr:[],
            imgNameArr:[],
            dialogVisible:false,
            dialogImageUrl:'',
            //轴节点数组
            nodeData:[],
            zipPercent:0,
            isPercent:false,
            isUpDisabled:false,
            isSuccess:true,
            uuidZip:'',
            //需要传至后台的数据
            resourceData:{
                name:'',
                tag:'美丽科学',
                thumb:'',
                zip:'',
                md5:'',
                file_size:''
            },
            levels:[],
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
          let data = this.resourceData
          return data.name == ''? true :(data.tag == ''? true : (data.thumb == ''? true :false))
      }  
    },
    mounted () {
        // this.listLength = this.nodeData.length
        this.qiniuZip();
    },
    methods: {
        // changeName(data){
        //     this.resourceData.name = data
        // },
        // changeTag(data){
        //     this.resourceData.tag = data
        // },
        changeThumb(data){
             this.resourceData.thumb = data
        },
        changeSrc(data){
            this.formData.thumb = data;
        },

        imgDelete(index){
            this.bigImgList.splice(index,1); 
            this.bigImgListArr.splice(index,1);
            this.imgNameArr.splice(index,1);
        },
        imgDialog(url){
            this.dialogVisible = true;
            this.dialogImageUrl = url;
        },
        focusInput(){
            this.ofileImg = document.getElementById('changeImg');
            this.ofileImg.click();
        },
        fileZip(){
            this.ofileImg = document.getElementById('changeImg').files[0];                       
            var reader  = new FileReader();
            reader.addEventListener("load", function () {
               this.bigImgList.push(reader.result);               
            }.bind(this), false);
            if (this.ofileImg) {
                reader.readAsDataURL(this.ofileImg);                             
                this.bigImgListArr.push(this.ofileImg);
                this.imgNameArr.push(this.ofileImg.name);              
            }
        },

        editNode(index){
            this.nodeData[index].isAdd = false;
            this.nodeData[index].isEdit = true;
        },
        submitNode(index){
            this.nodeData[index].isAdd = false;
            this.nodeData[index].isEdit = false;
        },
        delNode(id){
            this.nodeData.splice(id,1);
        },
        addNode(){
            this.nodeData.push({
                num:'',
                text:'',
                isAdd:true,
                isEdit:false
            })
        },

        zipFiles(){
            let that = this;
            if( this.bigImgListArr.length>0){
                this.upBtnVisible = true;
                var zip = new jsZip();
                for(let i=0;i<this.bigImgListArr.length;i++){
                    zip.file(this.bigImgListArr[i].name,this.bigImgListArr[i])
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
                this.$message.error('错误！ 请确保放大图片资源文件已选取');
            }
        },
        toList(){
            if(!this.$refs['pluploadImg'].uuidImg == ''){
                this.$refs['pluploadImg'].imgDelete()
            }
            this.$router.push('/media/Zoom_in')
        },

        upDone(){
            let that = this;
            this.axios.post('/BeautyScience/zoom_ins',{
                zoom_in:{
                    images:that.imgNameArr.join('|'),
                    levels:that.nodeData,
                    meta_info:that.resourceData
                }
            })
            .then(function(){
                console.log(that.resourceData)
                that.$router.push('/media/Zoom_in')
            })
        },
        zipCancel(){
            this.upBtnVisible = false;
            this.zipPercent = 0;
            this.upDone();
        },
        stopUp(){
            this.uploaderZip.stop();
            this.upBtnVisible = false;
            this.zipPercent = 0;
        },
        qiniuZip() {
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
        }
    },
    components: {
        Plupload,upImg
    }
}
</script>

<style scoped>
/* .addZoomin .upImg{
    width: 480px;
    height: 270px;
    background-color: #f0f0f0;
    text-align: center;
    margin-top: 32px;
}
.upImg i,.dislog_upImg i{
    font-size: 20px;
    color:#999;
    font-weight: 700;
    cursor: pointer;
    line-height: 270px;
} */
.nodeList{
    width: 100%;
    box-sizing: border-box;
    padding:20px 40px;
    border:1px solid #e6e6e6;
    margin-bottom: 48px;
}
.nodeList>div{
    font-size: 20px;
    color:#333;
    font-weight: 700;
    line-height: 32px;
    margin-bottom: 5px;
}
.nodeList ol{
    font-size: 20px;
    color: #47a8de;
    font-weight: 700;
}
.nodeList ol li{
    padding: 20px 48px 0; 
}
.nodeList ol li:hover{background-color: #F0F0F0;}
.nodeList ol li:last-child{
    margin-bottom: 0;
}
.nodeList ol li:last-child:hover{background-color: #FFF;}
.nodeList li>.dataBox{
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    height: 36px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e6e6e6; 
}
.nodeList li>span{ float: left; width: 50px; display: inline-block; text-align: left; line-height: 36px;}
.nodeList li>.dataBox>div{
    margin-right: 32px;
}
/* .nodeList .imgBox{
    flex: 2; 
    width: 240px;
    min-width: 240px;
} */
.nodeList .textBox{
    flex: 1;
}
.nodeList .btns{
    flex: 1;
    display: inline-flex;
    align-items: flex-end;
    justify-content: flex-end;
    flex-flow: row nowrap;
    margin-right: 0 !important;
}
/* .nodeList .imgBox>img{
    width: 100%;
    max-height: 150px;
}
.nodeList li>.dataBox p{
    margin: 0;
    font-size: 20px;
    color: #999;
} */
.nodeList .addBtn{
    padding-left:96px;
}
.nodeList .addBtn i{
    margin: 12px 0;
    font-size: 20px;
    color: #999;
    font-weight: 700;
    cursor: pointer;
}
.timeName{color: #444; text-align: left; line-height: 36px;}
.timeName .el-input{width: 200px}

.bigImgList{border: 1px solid #F1F1F1; padding: 20px 40px; margin-bottom: 30px; overflow: hidden;}
.bigImgList .title h3{font-size: 22px; display: inline-block;}
.bigImgList .title em{color: #3a96d6; font-size: 12px; padding: 0 10px; font-style: normal;}
.bigImgList .title span{font-size: 12px; color: #878787;font-weight: 100px}
.bigImgList>ul li{float: left; width: 20%; height: 136px; margin-right: 5%; margin-top: 30px; position: relative; display: flex; }
.bigImgList>ul li em{display: inline-block; width: 30px; text-align: left; font-size: 20px; color: #3a96d6;font-style: normal; }
.bigImgList>ul li div{-webkit-box-flex:1; flex:1; height: 136px; text-align: center; position: relative;  }
.bigImgList>ul li div img{width: 100%; height: 100%}
.bigImgList>ul li div.addPicBtn{background-color: #F0F0F0; font-size: 17px; color: #999999}
.bigImgList>ul li div.addPicBtn i{font-weight: 700; margin-right: 5px; line-height: 136px; cursor: pointer; }
.bigImgList>ul li div .opt-icon{width: 100%; height: 100%; position: absolute; background: rgba(0,0,0,0.5); color: #ffffff; text-align: center; top: 0; left: 0; font-size: 24px; line-height: 130px; display: none;}
.bigImgList>ul li div:hover .opt-icon{display: block;}
.dialogImg{max-height: 100%; max-width: 100%;}

.dislog_upImg{
    width: 100%;
    height:280px;
    background-color: #f0f0f0;
    text-align: center;
    line-height: 280px;
}
</style>
