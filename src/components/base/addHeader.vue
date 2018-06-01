<template>
  <div class="addHeader">
      <slot></slot>
      <el-row :gutter="20" type="flex" align='middle' style="margin-right:0;">
          <el-col :span='15' style="display:inline-flex;padding:0;margin-left:10px;">
              <i class="icon-blue"></i>
              <el-input v-model="name" placeholder="请输入标题" :change="listenName()"></el-input>
          </el-col>
          <el-col :span='9' :offset='1' style="padding:0;">
            <el-select v-model="optionValue" placeholder="请选择标签" :change="listenTag()">
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
    // props:['title','optionValue'],
    data(){
        return {
            name:'',
            optionValue: '',
            options: [{
            value: '美丽科学',
            label: '美丽科学'
            }, {
            value: 'twig',
            label: 'twig'
            }]
        }
    },
    beforeRouteEnter:(to, from, next) => {
        //does NOT have access to `this` component instance}
        next(vm => {
            if(vm.$route.query.id){
                vm.axios.get('BeautyScience/zoom_ins/'+vm.$route.query.id)
                .then(function(response){
                    console.log(1111,response)
                })
            }
        })
    },
    methods: {
        listenName(){
            if(!this.name == ''){
                this.$emit('listenName',this.name)
            }
        },
        listenTag(){
            if(!this.optionValue == ''){
                this.$emit('listenTag',this.optionValue)
            }
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
