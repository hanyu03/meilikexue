<template>
    <div class="addVideo padding-aside" style="background:#fff;">
        <AddHeader>
            <h3 class="addHeader-title">视频</h3>
        </AddHeader>
        <el-row class="addVideo-content">
            <el-col :span='8'>
             <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                list-type="picture-card"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :auto-upload="false">
                <i class="el-icon-plus">添加缩略图</i>
            </el-upload>
            <el-dialog v-model="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            </el-col>
            <el-col :span='16'>
                
            </el-col>
        </el-row>
    </div>
</template>

<script>
import AddHeader from '@/components/base/addHeader'

export default {
  data(){
      return {
        dialogImageUrl: '',
        dialogVisible: false
      }
  },
  methods:{
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
  },
  components: {
      AddHeader
  }
}
</script>

<style scoped>

</style>
