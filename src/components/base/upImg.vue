<template>
    <div class="upImg upBox">
        <i class="el-icon-plus upImgIcon" @click="focusInput"> 添加缩略图</i>
        <input id="fileImg" class="upInput" type="file" @change="fileZip">
        <div class="upContent clearBoth" v-show="boxVisible">
            <img id="oImg" class="" :src="dialogImageUrl" alt="">
            <div class="upContent-icon">
                <i class="el-icon-delete margin-right-20" @click="imgDelete"></i>
                <i class="el-icon-view" @click="imgDialog"></i>
            </div>
        </div>
        <el-dialog
        title="图片展示"
        :visible.sync="dialogVisible"
        width="70%">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <el-button id="ppp" type="danger"></el-button>
    </div>
</template>

<script>

export default {
    props:['qiniuToken'],
  data () {
      return {
          dialogVisible:false,
          boxVisible:false,
          dialogImageUrl:'',
          imgFile:{}
      }
  },
  mounted () {
    //   console.log(this.qiniuToken)
    //   var uploader = Qiniu.uploader({
    //     runtimes: 'html5,flash,html4',      // 上传模式，依次退化
    //     browse_button: 'ppp',
    //     uptoken_func: function(){    // 在需要获取uptoken时，该方法会被调用
    //         let uptoken
    //         this.axios.post('BeautyScience/qiniu/token',{
    //           res_name:'123465'
    //       })
    //       .then(function(response){
    //           console.log(response)
    //           uptoken = response.data.uptoken
    //           console.log(uptoken)
    //       })
    //         return uptoken;
    //     },
    //   })
  },
  methods: {
      //选择文件
      focusInput(){
          let ofileImg = document.getElementById("fileImg");
          ofileImg.click();
      },
      fileZip(){
        let ofileImg = document.getElementById("fileImg").files[0];
        let oImg = document.getElementById("oImg");
        let reader  = new FileReader();
        reader.addEventListener("load", function () {
            // oImg.src = reader.result;
            oImg.setAttribute("width", "100%");
            oImg.setAttribute("height", "100%");
            this.dialogImageUrl = reader.result;
        }.bind(this), false);
        // reader.onprogress = function(){
        //     console.log(12)
        // }
        if (ofileImg) {
            reader.readAsDataURL(ofileImg);
            this.imgFile = ofileImg;
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
            let ofileImgIput = document.getElementById("fileImg")
            let ofileImg = document.getElementById("fileImg").files[0];
            ofileImgIput.value = null;
            ofileImg = null;
            this.imgFile = {};
            this.dialogImageUrl = '';
            this.boxVisible = false;
        }
  }
}
</script>

<style scoped>
.upImg{
    height: 270px;
}
.upImgIcon{
    width: 100%;
    height: 270px;
    font-size: 18px;
    font-weight: 700;
    color:#999;
    line-height: 270px;
    text-align: center;
    background-color: #f0f0f0;
}
.upContent img{
    max-width: 100%;
    max-height: 100%;
}
.upContent div{
    line-height: 270px;
}

</style>

