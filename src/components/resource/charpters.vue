<template>
    <div>
        <ResBreadcrumb></ResBreadcrumb>
        <div class="charptersView bg_white">
            <ul class="charpters-content padding-aside"> 
                <li v-for='(item,index) in listData' :key="index">
                    <span>{{item.index}}</span>
                    <h3 class="className">{{item.name}}</h3>
                    <div>
                        <el-button type="primary" size="small"
                        @click="editChapter(item.id)">编辑</el-button>
                        <el-button type="danger" size="small"
                        @click="deteleChapter(item.id)">删除</el-button>
                        <el-button type="success" size="small"
                        @click="linkTo(item.name,item.id)">详情</el-button>
                    </div>
                </li>
                <li class="edition-addBtn"><span @click="dialogShow"> + 点击添加 新课程</span></li>
            </ul>
            <el-dialog :title="dialogTitle" ref="dialog"
                :visible.sync="dialogFormVisible"
                :before-close="cancel"
                :show-close="false"
                center>
                <el-form :model="titleForm" ref="titleForm">
                    <el-form-item prop="name">
                        <el-input v-model="titleForm.name"
                        auto-complete="off"
                        placeholder="请输入课程名称"></el-input>
                    </el-form-item>
                    <el-form-item prop="index">
                        <el-input v-model="titleForm.index"
                        auto-complete="off"
                        placeholder="请输入课程序号"></el-input>
                    </el-form-item>
                    <el-form-item prop="brief">
                        <el-input type="textarea" v-model="titleForm.brief"
                        auto-complete="off"
                        placeholder="请输入单元简介 (非必填)"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="danger" @click="cancel">取 消</el-button>
                    <el-button type="primary"
                    :disabled="titleForm.name == '' ? true : false"
                    @click="submit(charpters_id)">提 交</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
  
</template>

<script>
// import Bus from '@/bus.js'
import ResBreadcrumb from '@/components/base/resourceBreadcrumb'

export default {
    data () {
        return {
            dialogTitle:'添加课程',
            dialog:'dialog',
            charpters_id:'',
            listData:[],
            dialogFormVisible:false,
            titleForm: {
            name: '',
            index:'',
            brief:'',
            thumb:''
            },
            formLabelWidth: '120px',
        }
    },
    components:{
        ResBreadcrumb
    },
    mounted () {
        this.charpters_id = this.$route.query.charpters_id
        this.getClesses(this.charpters_id)
    },
    methods: {
        dialogShow(){
            this.dialogFormVisible = true;
            this.dialogTitle = '添加课程';
        },
        cancel(){
            this.$refs['titleForm'].resetFields();
            this.dialogFormVisible = false;
        },
        getClesses(id){
           let that = this;
           this.axios.get('/BeautyScience/lessons',{
               params:{
                   chapter_id:id
               }
           })
            .then(function(response){
                that.listData = response.data.records
            }) 
        },
        editChapter(id){
           let that = this;
           this.dialogTitle = '编辑课程';
           this.axios.get('/BeautyScience/lessons/'+id)
            .then(function(response){
                that.titleForm = response.data
            })
            this.dialogFormVisible = true
        },
        deteleChapter(id){
           let that = this;
           this.axios.delete('/BeautyScience/lessons/'+id)
            .then(function(response){
                that.listData = []
                that.getClesses(that.charpters_id);
            })
            .catch(function(error){
                if(error.response.status == 422){
                    let msg = error.response.data.msg
                    that.$message({
                        message: msg+' 不可删除',
                        type: 'warning'
                    });
                }
            })
        },
        submit(charpters_id){
            let that = this;
            if(this.titleForm.id){
                   this.axios.patch('/BeautyScience/lessons/'+this.titleForm.id,{
                       lesson:{
                            name:this.titleForm.name,
                            index:this.titleForm.index,
                            brief:this.titleForm.brief,
                            charpters_id:charpters_id
                        }
                   })
                    .then(function(response){
                        that.titleForm.id = null;
                        that.listData = [];
                        that.cancel();
                        that.getClesses(that.charpters_id);
                    }) 
            }else{
                this.axios.post('/BeautyScience/lessons',{
                    lesson:{
                        name:this.titleForm.name,
                        index:this.titleForm.index,
                        brief:this.titleForm.brief,
                        chapter_id :charpters_id
                    }
                })
                .then(function(response){
                    that.listData = [];
                    that.cancel();
                    that.getClesses(that.charpters_id);
                })
            }
            
        },
        linkTo(lessons,id){
            let edition = this.$route.params.edition;
            let grade = this.$route.params.grade;
            let charpter = this.$route.params.charpter;
            let book_id = this.$route.query.book_id;
            let grade_id = this.$route.query.grade_id;
            let charpters_id = this.$route.query.charpters_id;
            this.$router.push({ name: 'lesson',params:{edition:edition,grade:grade,charpter:charpter,lesson:lessons},query:{book_id:book_id,grade_id:grade_id,charpters_id:charpters_id,lesson_id:id}})
        }
    }
  
}
</script>

<style scoped>
.charpters-content{
    padding-top:24px;
    padding-bottom: 48px;
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: flex-start;
}
.charpters-content li{
    display: flex;
    flex-flow: row;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 97px;
    border-bottom: 1px solid #e6e6e6;
    padding: 24px 0 24px 48px;
    background-color: #fff; 
}
.charpters-content li span{
    font-size: 14px;
    color:#47a8de;
    margin-right:48px;
}
.charpters-content .edition-addBtn span{
    display: inline-block;
    line-height: 100px;
    text-align: center;
    font-size: 24px;
    color: #999;
    font-weight: 700;
    cursor: pointer;
}
.charpters-content li h3{
    width: 288px;
    font-size: 22px;
    color:#000;
}
.thumbInput{
    display: none;
}
.upImgBox{
    position: relative;
    width: 100%;
    height: 250px;
    line-height: 250px;
    text-align: center;
    font-size: 24px;
    background-color: #e6e6e6;
}
#grades-upImg{
    display: inline-block;
    cursor: pointer;
}
</style>
