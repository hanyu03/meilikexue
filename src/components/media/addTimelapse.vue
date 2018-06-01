<template>
    <div class="addVideo padding-aside" style="background:#fff;">
        <div class="addHeader">
            <h3 class="addHeader-title">延时摄影</h3>
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
        
        <el-row class="addVideo-content">
            <el-col class="upImg padding-right-20" :span='8'>
                <div class="width:100%;height:270px;">
                    <plupload v-on:listenThumb="changeThumb"></plupload>
                </div>
                <p class="thumbText">缩略图尺寸要求: 960*540px </p>
            </el-col>

            <el-col class="upVideo padding-left-20" :span='16'>
                <div class="upImg upBox">
                    <upVideo
                        :inputId = 'upVideo_inputId'
                        :videoId = 'upVideo_videoId'
                        :parentVideoFileArr = 'videoArr'>
                    </upVideo>
                </div>
                <p class="thumbText">视频尺寸要求: 1920*1200px </p>
            </el-col>
        </el-row>
        <div class="nodeList">
            <div>轴节点（{{nodeData.length}}）</div>
            <ol>
                <li v-for="(item,index) in nodeData" :key="index">
                    <span>{{index+1}}.</span>
                    <div class="dataBox">
                        <div class="timeName">
                            <span v-if="item.isEdit == false && item.isAdd == false">{{item.time}}</span>
                            <el-input v-model="item.time" v-else placeholder="添加时间节点"></el-input>
                        </div>
                        <div class="btns">
                            <el-button type="primary" size="small"
                            @click="editNode(index)" v-if="item.isEdit == false && item.isAdd == false">编 辑</el-button>
                            <el-button type="success" size="small"
                            @click="submitNode(index)" v-if="item.isEdit || item.isAdd" :disabled="item.time == ''?true:false">确 认</el-button>
                            <el-button type="danger" size="small"
                            @click="delNode(index)">删 除</el-button>
                        </div>
                    </div>
                </li>
                <li class="addBtn">
                    <i class="el-icon-plus" @click="addNode"> 添加时间节点</i>
                </li>
            </ol>
        </div>
        <div class="btns" style="margin-bottom:32px;">
            <el-button type="primary" :disabled="isDisabledZip" @click="zipFiles">压 缩</el-button>
            <el-button type="danger" @click="$router.back(-1)">取 消</el-button>
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
import fs from 'file-saver'  //用于保存文件到本地
import plupload from '@/components/base/plupload'
import upVideo from '@/components/base/upVideo'

export default {
    components: {
        plupload,upVideo
    },
    data(){
      return {
        options: [{
            value: '美丽科学',
            label: '美丽科学'
        }, {
            value: 'twig',
            label: 'twig'
        }],        
        //需要传至后台的数据
        addData:{
            name:'',
            tag:'美丽科学',
            thumb:'',
            times:'',
            video:'',
            zip:'',
            md5:'',
            file_size:''
        },
        timeArr:[],       
        //video
        upVideo_inputId:'timeLapseFileInput',
        upVideo_videoId:'timeLapseFileVideo',
        videoArr:[],
        //轴节点列表
        nodeData:[],        
        uuidZip:'',
        zipPercent:0,
        isPercent:false,
        isUpDisabled:false,
        upBtnVisible:false,
        isSuccess:true,
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
        },  
    },
  methods:{
        changeThumb(data){
            this.addData.thumb = data
        },
        addNode(){//添加
            this.nodeData.push({
                time:'',
                isAdd:true,
                isEdit:false
            })
        },
        editNode(index){//编辑
            this.nodeData[index].isAdd = false;
            this.nodeData[index].isEdit = true;            
        },
        submitNode(index){//确认
            this.nodeData[index].isAdd = false;
            this.nodeData[index].isEdit = false;
        },
        delNode(id){//删除
            this.nodeData.splice(id,1);                     
        },      
        zipFiles(){//压缩 
            var that = this;
            var valid = true;
            this.nodeData.forEach(function (item,index) {
                if(item.time == ''){
                    that.$message.error('请确保轴节点都已填写！');
                    valid = false;
                }if(item.isAdd == true || item.isEdit == true){//没有确认
                    that.$message.error('请确保轴节点都已确认！');
                    valid = false;
                }else{
                    that.timeArr.push(item.time);
                    valid = true;
                }                   
                                   
            });
            if(valid){
                if( this.videoArr.length>0){                
                    this.upBtnVisible = true;
                    var zip = new jsZip();
                    for(let i=0;i<this.videoArr.length;i++){
                        zip.file(this.videoArr[i].name,this.videoArr[i])
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
                    this.addData.video = this.videoArr[0].name;                 
                    this.addData.times = this.timeArr.join("|");
                }else{
                    this.$message.error('错误！ 请确保资源文件已上传');
                } 
            }           
            console.log(this.nodeData)         
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
                    'UploadProgress': function (up, file) {
                        // 每个文件上传时，处理相关的事情
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
        onSubmit(){//完成            
            var that = this;
            that.axios({
              method:'post',
              url: '/BeautyScience/time_lapses',
              data:{                
                time_lapse:{
                    meta_info:{
                        name:that.addData.name,
                        tag:that.addData.tag,
                        thumb:that.addData.thumb,
                        zip:that.addData.zip,
                        md5:that.addData.md5,
                        file_size:that.addData.file_size
                    },
                    video:that.addData.video,
                    times:that.addData.times
                }
              }
            }).then(function (res) {                
              if(res.status == 201){
                that.$message.success('添加成功');
                that.$router.push('/media/Time_lapse');
              }else{
                that.$message.error('添加失败');
              }                           
            }).catch(function (error) {
              console.log(error);             
            });            
        }
    },
    mounted () {      
       this.qiniuZip();
    }    
}
</script>

<style scoped>
.addVideo-content{
    padding-top:30px;
    padding-bottom: 50px;
}
.upImg{    
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    position: relative;
    
}
 
.upImgIcon{
    width: 100%;
    height: 560px;
    font-size: 20px;
    font-weight: 700;
    color:#999;
    line-height: 560px;
    text-align: center;
    background-color: #f0f0f0;
}
.upContent img{
    max-width: 100%;
    max-height: 100%;
}
.upContent div{
    line-height: 560px;
}
.nodeList{
    width: 100%;
    box-sizing: border-box;
    padding:24px 0;
    border:1px solid #e6e6e6;
    margin-bottom: 48px;
}
.nodeList>div{
    font-size: 20px;
    color:#333;
    font-weight: 700;
    line-height: 32px;
    margin-bottom: 5px;
    padding-left: 48px;
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
.nodeList .textBox{
    flex: 1;
}
.nodeList .btns{
    flex: 1;
    display: inline-flex;
    align-items: flex-end;
    flex-flow: row nowrap;
    margin-right: 0 !important;
}
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
.timeName{ width: 500px; color: #444; text-align: left; line-height: 36px;}
.timeName .el-input{width: 200px}
</style>
