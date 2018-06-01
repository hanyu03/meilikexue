<template>
    <div class="upVideo upBox">
        <i class="el-icon-plus upVideoIcon" @click="focusInput"> 点击上传视频</i>
        <img style="z-index:2002;position: absolute;right:20px;bottom:20px;" src="../../assets/images/video_icon.png" alt="">
        <input :id="inputId" class="upInput" type="file" @change="fileZip">
        <div class="upContent clearBoth" v-show="boxVisible">
            <video :id="videoId" :src="VideoUrl" poster></video>
            <div class="upContent-icon">
                <i class="el-icon-delete margin-right-20" @click="imgDelete"></i>
                <i class="el-icon-view" @click="imgDialog"></i>
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
</template>

<script>

export default {
    props:['inputId','videoId','parentVideoFileArr','parentlistItem'],
  data () {
      return {
          dialogVisible:false,
          boxVisible:false,
          VideoUrl:'',
          dialogVideoUrl:'',
          videoFile:{},
          ofileVideo:{}
      }
  },
  methods: {
      //选择文件
      focusInput(){
          this.ofileVideo = document.getElementById(this.inputId)
          this.ofileVideo.click();
      },
      fileZip(){
            this.ofileVideo = document.getElementById(this.inputId).files[0];
            let oVideo = document.getElementById(this.videoId);
            let reader  = new FileReader();
            reader.addEventListener("load", function () {
                // oVideo.src = reader.result;
                oVideo.setAttribute("width", "100%");
                oVideo.setAttribute("height", "100%");
                this.VideoUrl = reader.result;
                if(this.parentlistItem){
                    this.parentlistItem.thumb = reader.result; //addZoomin 中传入
                }
            }.bind(this), false);
            if (this.ofileVideo) {
                reader.readAsDataURL(this.ofileVideo);
                this.videoFile = this.ofileVideo;
                if(this.parentVideoFileArr){
                    this.parentVideoFileArr.push(this.ofileVideo); //addZoomin 中传入
                }
                this.boxVisible = true;
            }
        },
        imgDialog(){
            this.dialogVisible = true;
            this.dialogVideoUrl = this.VideoUrl;
        },
        imgDelete(){
            let ofileVideoIput = document.getElementById(this.inputId)
            // let ofileVideo = document.getElementById("fileVideo").files[0];
            ofileVideoIput.value = null;
            this.ofileVideo = null;
            this.videoFile = {};
            this.parentVideoFileArr.splice(-1,1);
            this.VideoUrl = '';
            this.boxVisible = false;
        },
        closeVideo(){
            this.dialogVideoUrl = '';
            this.dialogVisible = false;
        }
  }
}
</script>

<style scoped>
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

</style>

