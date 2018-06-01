<template>
    <div class="oupImg upBox">
        <i class="el-icon-plus oupImgIcon" @click="focusInput"> <slot>添加缩略图</slot></i>
        <input :id="inputId" class="upInput" type="file" @change="fileZip">
        <div class="upContent clearBoth" v-show="boxVisible">
            <img :id="imgId" class="" :src="dialogImageUrl" alt="">
            <div class="upContent-icon">
                <i class="el-icon-delete margin-right-20" @click="imgDelete"></i>
                <i class="el-icon-view" @click="imgDialog"></i>
            </div>
        </div>
        <el-dialog
        title="图片展示"
        :center="true"
        :visible.sync="dialogVisible"
        width="70%">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <!-- <el-button id="ppp" type="danger"></el-button> -->
    </div>
</template>

<script>

export default {
  props:['inputId','imgId','parentImgFileArr','parentlistItem'],
  data () {
      return {
          dialogVisible:false,
          boxVisible:false,
          dialogImageUrl:'',
          imgFile:{},
          ofileImg:{},
      }
  },
  mounted () {
    
  },
  methods: {
      listenItemSrc(src){
          this.$emit('listenItemSrc',src)
      },
      //选择文件
      focusInput(){
          this.ofileImg = document.getElementById(this.inputId);
          this.ofileImg.click();
      },
    fileZip(){
        this.ofileImg = document.getElementById(this.inputId).files[0];
        let oImg = document.getElementById(this.imgId);
        let reader  = new FileReader();
        reader.addEventListener("load", function () {
            // oImg.src = reader.result;
            oImg.setAttribute("width", "100%");
            oImg.setAttribute("height", "100%");
            this.dialogImageUrl = reader.result;
            this.listenItemSrc(reader.result);
            if(this.parentlistItem){
                this.parentlistItem.thumb = reader.result; //addZoomin 中传入
            }
            
        }.bind(this), false);
        if (this.ofileImg) {
            reader.readAsDataURL(this.ofileImg);
            this.imgFile = this.ofileImg;
            if(this.parentImgFileArr){
                this.parentImgFileArr.push(this.ofileImg); //addZoomin 中传入
            }
            this.boxVisible = true;
        }
    },
    imgDialog(){
        this.dialogVisible = true;
    },
    imgDelete(){
        // console.log(this.parentImgFileArr)
        let ofileImgIput = document.getElementById(this.inputId);
        // let ofileImg = document.getElementById(this.inputId).files[0];
        ofileImgIput.value = null;
        this.ofileImg = null;
        this.imgFile = {};
        this.parentImgFileArr.splice(-1,1);
        this.dialogImageUrl = '';
        this.boxVisible = false;
    }
  }
}
</script>

<style scoped>
.oupImg{
    /* width: 100%; */
    height: 270px;
}
.oupImgIcon{
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

