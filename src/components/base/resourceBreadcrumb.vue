<template>
  <div class="Breadcrumb padding-aside">
    <el-breadcrumb class="Breadcrumb-inner" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>版本</el-breadcrumb-item>
      <el-breadcrumb-item v-if="edition.isEdition">{{edition.value}}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="grades.isGrades">{{grades.value}}</el-breadcrumb-item>
      <el-breadcrumb-item v-if="charpter.isCharpter">{{charpter.value}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
    data () {
      return {
        edition:{
          value:'',
          isEdition:false
        },
        grades:{
          value:'',
          isGrades:false
        },
        charpter:{
          value:'',
          isCharpter:false
        },
      }
    }
}
</script>

<style scoped>
.Breadcrumb{
  padding-top:56px;
  background-color: #f0f0f0;
}
.Breadcrumb-inner{
  font-size: 14px;
  color: #444;
  background-color: #fff;
  height:48px;
  line-height: 48px;
  padding-left:48px;
}
</style>
