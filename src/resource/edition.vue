<template>
  <div>
      <ResBreadcrumb></ResBreadcrumb>
      <ul class="edition-content padding-aside"> 
            <li v-for='(item,index) in editionData' :key="index">
                <h3>{{item.grader}}</h3>
                <div>
                    <el-button type="primary" size="small">编辑</el-button>
                    <el-button type="danger" size="small">删除</el-button>
                    <el-button type="success" size="small" @click="linkTo(item.grader,item.level)">详情</el-button>
                </div>
            </li>
            <li class="edition-addBtn"><span @click="dialogFormVisible = true">点击添加 新版本</span></li>
        </ul>
        <el-dialog title="添加年级" 
        :visible.sync="dialogFormVisible"
        center>
            <el-form :model="titleForm" ref="titleForm">
                <el-form-item prop="name">
                    <el-input v-model="titleForm.name"
                    auto-complete="off"
                    placeholder="请输入年级"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" @click="cancel">取 消</el-button>
                <el-button type="primary"
                :disabled="titleForm.name == '' ? true : false"
                @click="submit">提 交</el-button>
            </div>
        </el-dialog>
  </div>
</template>

<script>
import ResBreadcrumb from '@/components/base/resourceBreadcrumb'

export default {
    data () {
        return {
          editionData:[
              {
                grader:'人教版一年级（上）',
                level:1
              },
              {
                grader:'人教版一年级（下）',
                level:1
              },
              {
                grader:'人教版二年级（上）',
                level:1
              },
              {
                grader:'人教版二年级（下）',
                level:1
              }
            ],
          dialogFormVisible:false,
          titleForm: {
                name: '',
            },
          formLabelWidth: '120px'
        }
    },
    mounted () {
        // this.navLevel = this.$route.params.navLevel
        console.log(111,this.$route.query)
    },
    methods: {
        linkTo(grader,level){
            this.$router.push({ name: 'grades', query:{nav:grader,level:level} })
        },
        cancel(){
            this.$refs['titleForm'].resetFields();
            this.dialogFormVisible = false;
        },
        submit(){
            this.$refs['titleForm'].resetFields();
            this.dialogFormVisible = false;
        }
    },
    components: {
      ResBreadcrumb
    }
  
}
</script>

<style scoped>
.edition-content{
    padding-top:48px;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-start;
}
.edition-content li{
    display: inline-flex;
    flex-flow: column;
    justify-content: space-between;
    box-sizing: border-box;
    width: 28%;
    min-width: 276px;
    height: 200px;
    margin-right: 40px;
    margin-bottom: 48px;
    padding: 40px 40px 48px 40px;
    background-color: #fff; 
}
.edition-content .edition-addBtn span{
    display: inline-block;
    line-height: 100px;
    text-align: center;
    font-size: 24px;
    color: #999;
    font-weight: 700;
    cursor: pointer;
}
.edition-content li h3{
    font-size: 22px;
    color:#000;
}
</style>
