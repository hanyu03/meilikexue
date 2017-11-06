<template>
  <div class="addHeader">
      <slot></slot>
      <el-row :gutter="20" type="flex" align='middle'>
          <el-col :span='16'>
              <el-input v-model="title" placeholder="请输入标题"></el-input>
          </el-col>
          <el-col :span='8'>
            <el-select v-model="optionValue" placeholder="请选择">
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
</template>

<script>
export default {
  data(){
      return {
        title:'',
        optionValue: '',
        options: [{
        value: '选项1',
        label: '美丽科学'
        }, {
        value: '选项2',
        label: 'twig'
        }]
      }
  }
}
</script>

<style scoped>

</style>
