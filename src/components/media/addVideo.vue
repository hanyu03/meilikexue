<template>
    <div class="addVideo padding-aside" style="background:#fff;">
        <AddHeader>
            <h3 class="addHeader-title">视频</h3>
        </AddHeader>
        
        <el-row class="addVideo-content">
            <el-col class="upImg padding-right-20" :span='8'>
                <plupload></plupload>
                <!-- <upImg :qiniuToken = "qiniuToken"></upImg> -->
                <div>
                    <el-button type="primary" @click="beforeUp">压缩</el-button>
                    <el-button type="danger">取消</el-button>
                </div>
            </el-col>

            <el-col class="upVideo padding-left-20" :span='16'>
                <upVideo></upVideo>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import AddHeader from '@/components/base/addHeader'
import upImg from '@/components/base/upImg'
import upVideo from '@/components/base/upVideo'
import plupload from '@/components/base/plupload'

export default {
  data(){
      return {
        qiniuToken:''
      }
  },
  methods:{
      beforeUp(){
          alert(1123)
          let that = this;
          this.axios.post('BeautyScience/qiniu/token',{
              res_name:'123465'
          })
          .then(function(response){
              that.qiniuToken = response.data.uptoken
              console.log(that.qiniuToken)
          })
      },
      fileUrl(){
          let file = document.getElementById("fileItem").files
          console.log(file)
      }
  },
  mounted () {
  },
  components: {
      AddHeader,upVideo,plupload
  }
}
</script>

<style scoped>
    .addVideo-content{
        padding-top:30px;
        padding-bottom: 50px;
    }
    .upImg{
        height: 560px;
        display: flex;
        flex-flow: column;
        justify-content: space-between;
    }
</style>
