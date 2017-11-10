<template>
  <div class="addHeader">
      <slot></slot>
      <el-row :gutter="20" type="flex" align='middle' style="margin-right:0;">
          <el-col :span='15' style="display:inline-flex;padding:0;margin-left:10px;">
              <i class="icon-blue"></i>
              <el-input v-model="title" placeholder="请输入标题"></el-input>
          </el-col>
          <el-col :span='9' :offset='1' style="padding:0;">
            <el-select v-model="optionValue" placeholder="请选择标签">
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
    .icon-blue{
        display: inline-block;
        width: 16px;
        background-color: #47a8de;
    }
</style>
