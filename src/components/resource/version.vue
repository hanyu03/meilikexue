<template>
    <div>
        <ResBreadcrumb></ResBreadcrumb>
        <div class="bg_white">
            <ul class="edition-content padding-aside"> 
                <li v-for='(item,index) in listData' :key="index">
                    <h3>{{item.name}}</h3>
                    <div>
                        <el-button type="primary" size="small"
                        @click="editBooks(item.id)">编辑</el-button>
                        <el-button type="danger" size="small"
                        @click="deteleBooks(item.id)">删除</el-button>
                        <el-button type="success" size="small"
                        @click="linkTo(item.name,item.id)">详情</el-button>
                    </div>
                </li>
                <li class="edition-addBtn"><span @click="dialogFormVisible = true;dialogTitle = '编辑新版本'">点击添加 新版本</span></li>
            </ul>
            <el-dialog :title="dialogTitle" 
                :visible.sync="dialogFormVisible"
                :before-close="cancel"
                center>
                <el-form :model="titleForm" ref="titleForm">
                    <el-form-item prop="name">
                        <el-input v-model="titleForm.name"
                        auto-complete="off"
                        placeholder="请输入版本标题"></el-input>
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
    </div>
  
</template>

<script>
import Bus from '@/bus.js'
import ResBreadcrumb from '@/components/base/resourceBreadcrumb'

export default {
    data () {
        return {
            dialogTitle:'添加新版本',
            navLevel:'',
            listData:[],
            dialogFormVisible:false,
            titleForm: {
                name: '',
            },
            formLabelWidth: '120px'
        }
    },
    components:{
        ResBreadcrumb
    },
    mounted () {
        this.getBooks()
    },
    methods: {
        cancel(){
            this.$refs['titleForm'].resetFields();
            this.dialogFormVisible = false; 
        },
        getBooks(){
           let that = this;
           this.axios.get('/BeautyScience/books')
            .then(function(response){
                that.listData = response.data.records
            }) 
        },
        editBooks(id){
           let that = this;
           this.axios.get('/BeautyScience/books/'+id)
            .then(function(response){
                that.dialogTitle = "编辑版本"
                that.titleForm.name = response.data.name
                that.titleForm.id = response.data.id
            })
            this.dialogFormVisible = true
        
        },
        deteleBooks(id){
           let that = this;
           this.axios.delete('/BeautyScience/books/'+id)
            .then(function(response){
                that.getBooks();
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
        submit(){
            let that = this;
            if(this.titleForm.id){
                   this.axios.patch('/BeautyScience/books/'+this.titleForm.id,{
                       book:{
                            name:this.titleForm.name
                        }
                   })
                    .then(function(response){
                        that.titleForm.id = null;
                        that.cancel();
                        that.getBooks();
                    }) 
            }else{
                this.axios.post('/BeautyScience/books',{
                    book:{
                        name:this.titleForm.name
                    }
                })
                .then(function(response){
                    that.cancel();
                    that.getBooks();
                })
            }
            
        },
        linkTo(version,id){
            this.$router.push({ name:'edition',params:{edition:version},query: {book_id:id}})
        }
    }
  
}
</script>

<style scoped>
.edition-content{
    padding-top:48px;
    padding-bottom: 48px;
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
    background-color: #f0f0f0; 
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
    font-size: 24px;
    color:#000;
}
</style>
