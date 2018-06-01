<template>
    <div class="edit_teachPlan padding-aside">
        <div class="">
            <el-row type="flex" align='middle' style="margin-right:0;margin-bottom:32px;">
                <el-col :span='24' style="display:inline-flex;padding:0;">
                    <i class="icon-blue"></i>
                    <el-input class="input_56"
                    v-model="resourceData.title"
                    placeholder="请输入标题"></el-input>
                </el-col>
            </el-row>
            <el-row style="margin-right:0;margin-bottom:32px;">
                <el-col :span='24' style="padding:0;">
                    <div class="">
                        <Editor ref="planEditor" :parentContent="resourceData.content"></Editor>
                    </div>
                </el-col>
            </el-row>
            <el-row style="margin-bottom:32px;">
                <el-col :span='24' style="padding:0;">
                    <div class="briefBox">
                        <h3 class="briefBox_title">方案简介</h3>
                        <el-input  type="textarea"
                        v-model="resourceData.brief"
                        placeholder="请输入方案简介"></el-input>
                    </div>
                </el-col>
            </el-row>
            <div class="btn_handle">
                <el-button type="primary" @click="submit">提交</el-button>
                <el-button type="danger" @click="cancel">取消</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import Editor from '../base/planEditor.vue'

export default {
    components: {
        Editor
    },
  data () {
      return {
        resourceData:{
            title:'',
            content:'',
            brief:'',
            lesson_id:''
        },  
      }
  },
  mounted () {
    if(this.$route.query.teachId){
        let id = this.$route.query.teachId;
        this.getTeachData(id)
    }
    this.resourceData.lesson_id = this.$route.query.lesson_id
  },
  methods: {
        getTeachData(id){
            let that = this
            this.axios.get('/BeautyScience/teaching_plans/'+id)
            .then(function(res){
                that.resourceData = res.data
            })
        },
        submit(){
            let that = this;
            this.$refs.planEditor.qnuuid();
            this.resourceData.content = this.$refs.planEditor.content
            if(this.$route.query.teachId){
                let id = this.$route.query.teachId;
                this.axios.patch('/BeautyScience/teaching_plans/'+id,{
                    teaching_plan:that.resourceData
                })
                .then(function(res){
                    that.$router.go(-1)
                })
            }else{
                this.axios.post('/BeautyScience/teaching_plans',{
                    teaching_plan:that.resourceData
                })
                .then(function(res){
                    that.$router.go(-1)
                })
            }
        },
        cancel(){
            this.$router.go(-1)
        }
    }
}
</script>

<style scoped>
.edit_teachPlan{
    padding-top: 48px;
}
.briefBox{
    box-sizing: border-box;
    padding:20px 48px 24px 48px;
    height: 270px;
    border:1px solid #ddd;
}
.contentBox{
    height: 608px;
}
.briefBox .briefBox_title::before{
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #47a8de;
    margin-right: 4px;
}
</style>
