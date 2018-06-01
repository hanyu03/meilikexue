<template>
    <div class="addVideo padding-aside" style="background:#fff;">        
        <div class="addHeader">
            <h3 class="addHeader-title">视频</h3>
            <el-row :gutter="20" type="flex" align='middle' style="margin-right:0;">
                <el-col :span='15' style="display:inline-flex;padding:0;margin-left:10px;">
                    <i class="icon-blue"></i>
                    <el-input v-model="addData.name" placeholder="请输入标题" @blur="getsign()"></el-input>
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
        
        <el-row class="addVideo-content m-t" :gutter="20">            
            <el-col :span='10'><plupload @listenThumb="changeThumb"></plupload></el-col>
        </el-row>
        <el-row class="PolyvBox" :gutter="30">
            <el-col :span="16">
                <div class="upVideo upBox" v-loading="loading" element-loading-text="正在上传至云端...">
                    <i class="el-icon-plus upVideoIcon" @click="focusInput"> 点击上传视频</i>
                    <img style="z-index:2002;position: absolute;right:20px;bottom:20px;" src="../../assets/images/video_icon.png" alt="">
                    <div class="upContent clearBoth" v-show="boxVisible">
                        <video id="videoId" :src="VideoUrl" poster></video>
                        <div class="upContent-icon">
                            <i class="el-icon-upload margin-right-20" @click="upPL"></i>
                            <i class="el-icon-delete margin-right-20" @click="imgDelete"></i>
                            <i class="el-icon-view" @click="imgDialog"></i>
                            <p v-show="isUp">上传成功</p>
                        </div>
                    </div>
                    <el-dialog
                        title="视频展示"
                        :visible.sync="dialogVisible"
                        :before-close="closeVideo"
                        width="80%">
                        <video width="100%" :src="dialogVideoUrl" autoplay poster></video>
                    </el-dialog>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="upPolyv upInput">
                    <form id="myForm" name="myForm">
                        <input type="file"  id= "Filedata" name="Filedata"
                        accept=".avi, .wmv, .mp4, .mp3, .mov, .flv, .mkv, .rmvb"
                        @change="planVideo">
                        <br/>
                        <input type="text"  id= "JSONRPC" name="JSONRPC" v-model="jsonrpc_str">
                        <br/>
                        <input type="text"  id= "writetoken" name="writetoken" v-model="plToken">
                        <br/>
                        <input type="text"  id= "sign" name="sign" v-model="plSign">
                        <br/>
                        <input type="text"  id= "cataid" name="cataid" value="1" >
                        <br/>
                        <input type="number"  id= "luping" name="luping" value="1" >
                    </form>
                </div>
            </el-col>
        </el-row>
        <div class="margin-top-20">
            <el-button type="primary" @click="submit" :disabled="isDisabled">完 成</el-button>
            <el-button type="danger" @click="$router.back(-1)">取 消</el-button>
        </div>
    </div>
</template>

<script>
// import '../../../static/js/jquery.uploadify.min.js'
// import '../../../static/js/polyvPlay.js'
// import upVideo from '@/components/base/upVideo'
import plupload from '@/components/base/plupload'

export default {
  data(){
      return {
          loading:false,
        qiniuToken:'',
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
        videoFile:{},
        dialogVideoUrl:'',
        VideoUrl:'',
        isUp:false,
        addData:{
            name:'',
            thumb:'',
            tag:'美丽科学',
            images:'',
            zip:'',
            md5:'',
            file_size:''                
        },
        vid:'',
        length:'',
        width:'',
        height:'',
        filesize:'',
        jsonrpc:{
            title:'',
            tag:'',
            desc:''
        },
        plToken:'',
        plSign:'',
        jsonrpc_str:'',
        dialogVisible:false,
        boxVisible:false
      }
  },
  mounted () {
    
  },
  computed: {
    isDisabled(){
        let data = this.addData,
        vid = this.vid
        return data.name == ''? true :(data.tag == ''? true : (vid == ''? true :false))
    },  
  },
  methods:{
      changeThumb(data){//缩略图
          this.addData.thumb = data;
      },
      getsign(){
          let that = this;
          this.jsonrpc.title = this.addData.name
          this.jsonrpc.desc = Math.random().toString();
          this.axios.post('/BeautyScience/polyv_video/sign_upload',{
            JSONRPC:JSON.stringify({
                "title":that.jsonrpc.title,
                "tag": that.jsonrpc.tag,
                "desc": that.jsonrpc.desc
            })
          })
          .then(function(res){
            that.plSign = res.data.sign;
            that.plToken = res.data.writetoken;
            that.jsonrpc_str =JSON.stringify(that.jsonrpc)
          })
      },
      submit(){
          let that = this;
          this.axios.post('BeautyScience/polyv_videos',{
              polyv_video:{
                meta_info:that.addData,
                vid:that.vid,
                length:that.length,
                width:that.width,
                height:that.height,
                filesize:that.filesize
              }
          })
          .then(function(response){
              that.$router.push('/media/Polyv_video')
          })
      },
      focusInput(){
            document.getElementById("Filedata").click();
      },
      planVideo(){
            this.videoFile = document.getElementById("Filedata").files[0];
            let VideoBox = document.getElementById("videoId");
            let reader  = new FileReader();
            reader.addEventListener("load", function () {
                VideoBox.setAttribute("width", "100%");
                VideoBox.setAttribute("height", "100%");
                this.VideoUrl = reader.result;
            }.bind(this), false);
            if (this.videoFile) {
                reader.readAsDataURL(this.videoFile);
                this.boxVisible = true;
            }
        },
        upPL(){
            this.loading = true;
            if(!this.addData.name == ""){
                let that = this;
                let videoFile = document.getElementById('myForm');
                let formData = new FormData(videoFile);
                $.ajax({
                    url: 'https://v.polyv.net/uc/services/rest?method=uploadfile',
                    type: 'POST',
                    cache: false,
                    data: formData,
                    processData: false,
                    contentType: false
                }).done(function(res) {
                    that.loading = false;
                    if(res.error == "0"){
                        let plData = res.data[0];
                        that.isUp = true;
                        that.length = plData.duration;
                        that.height = plData.playerheight;
                        that.width = plData.playerwidth;
                        that.vid = plData.vid;
                        that.filesize = plData.source_filesize;
                        that.addData.file_size = plData.source_filesize
                    }
                }).fail(function(res) {
                    that.loading = false;
                    that.$message({
                        message: '可能由于网络原因或者服务器原因，本次上传失败！',
                        type: 'warning'
                    });
                });
            }else{
                this.loading = false;
                this.$message({
                    message: '请先填写视频名称!',
                    type: 'warning'
                });
            }
        },
      imgDelete(){
        this.boxVisible = false;
        this.isUp = false;
        this.videoFile = {};
        this.VideoUrl = "";
        document.getElementById("Filedata").files = null;
      },
      imgDialog(){
          this.dialogVisible = true;
          this.dialogVideoUrl = this.VideoUrl;
      },
      closeVideo(){
        this.dialogVisible = false;
        this.dialogVideoUrl = "";
      }
  },
  components: {
      plupload
  }
}
</script>

<style scoped>
.addVideo-content{       
    padding-bottom: 30px;
}
.upPolyv{
    border: 1px solid red;
    /* width: 86%; */
    height:200px;
    margin-bottom: 50px;
    padding: 40px;
}
.upVideo{
height: 560px;
}
.upVideoIcon{
    width: 100%;
    height: 560px;
    font-size: 18px;
    font-weight: 700;
    color:#999;
    line-height: 560px;
    text-align: center;
    background-color: #f0f0f0;
}
.upContent video{
    max-width: 100%;
    max-height: 100%;
}
.upContent div{
    line-height: 560px;
}
.upContent-icon>p{
    position: absolute;
    top: 310px;
    width: 100%;
    line-height: 28px;
    text-align: center;
    font-size: 18px;
    color: #fff;
}
</style>
