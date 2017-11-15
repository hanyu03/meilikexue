<template>
    <div class="upImg upBox">
        <i class="el-icon-plus upImgIcon" @click="focusInput"> 点击上传视频</i>
        <input id="fileVideo" class="upInput" type="file" @change="fileZip">
        <div class="upContent clearBoth" v-show="boxVisible">
            <video id="ovideo" :src="dialogVideoUrl" poster></video>
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
  data () {
      return {
          dialogVisible:false,
          boxVisible:false,
          dialogVideoUrl:'',
          videoFile:{}
      }
  },
  methods: {
      //选择文件
      focusInput(){
          let ofileVideo = document.getElementById("fileVideo")
          ofileVideo.click();
      },
      fileZip(){
        let ofileVideo = document.getElementById("fileVideo").files[0];
        let oVideo = document.getElementById("ovideo");
        let reader  = new FileReader();
        reader.addEventListener("load", function () {
            // oVideo.src = reader.result;
            oVideo.setAttribute("width", "100%");
            oVideo.setAttribute("height", "100%");
            this.dialogVideoUrl = reader.result;
        }.bind(this), false);
        if (ofileVideo) {
            reader.readAsDataURL(ofileVideo);
            this.videoFile = ofileVideo;
            this.boxVisible = true;
            // zip.file(ofileImg.name,ofileImg)
        }
    //   zip.generateAsync({type:"blob",comment:"ssss"})   // 生成一个zipObj
    //   .then(function(content) {
    //       // see FileSaver.js
    //       fs.saveAs(content, "test.zip");  //使用fileSave 保存至本地
    //       console.log('22',zip)
    //   });
        },
        imgDialog(){
            this.dialogVisible = true;
        },
        imgDelete(){
            let ofileVideoIput = document.getElementById("fileVideo")
            let ofileVideo = document.getElementById("fileVideo").files[0];
            ofileVideoIput.value = null;
            ofileVideo = null;
            this.videoFile = {};
            this.dialogVideoUrl = '';
            this.boxVisible = false;
        },
        closeVideo(){
            // this.dialogVideoUrl = '';
        }
  }
}
</script>

<style scoped>
.upImg{
    height: 560px;
}
.upImgIcon{
    width: 100%;
    height: 560px;
    font-size: 18px;
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

</style>

