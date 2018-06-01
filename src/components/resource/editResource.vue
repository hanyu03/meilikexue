<template>
    <div class="edit_resource padding-aside">
        <div class="editRes_header">
            <el-row :gutter="20" type="flex" align='middle' style="margin-right:0;margin-bottom:32px;">
                <el-col :span='10' style="display:inline-flex;padding:0;margin-left:10px;">
                    <i class="icon-blue"></i>
                    <el-input class="input_56"
                    v-model="resourceData.name"
                    placeholder="请输入标题"></el-input>
                </el-col>
                <el-col :span='7' style="display:inline-flex;padding:0;margin-left:10px;">
                    <el-select v-model="resourceData.scenarios" placeholder="请选择教学场景" style="width:100%;">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span='7' :offset='1' style="padding:0;margin-left:10px;">
                    <el-input class="input_56"
                    v-model="resourceData.index"
                    placeholder="请输入序号"></el-input>
                </el-col>
            </el-row>
            <el-row :gutter="20" type="flex" align='middle' style="margin-right:0;margin-bottom:32px;">
                <el-col :span='7' style="display:inline-flex;padding:0;margin-left:10px;">
                    <div class="addResource">
                        <i class="el-icon-plus" @click="linkToRes">添加资源</i>
                        <div class="thumbRes" v-show="isImg">
                            <img :src="thumbSrc" alt="">
                            <i class="el-icon-error" @click="deleteRes"></i>
                        </div>
                    </div>
                </el-col>
                <el-col :span='17' :offset='1' style="padding:0;">
                    <div class="briefBox">
                        <h3 class="briefBox_title">外层短简介</h3>
                        <el-input  type="textarea"
                        v-model="resourceData.brief"
                        placeholder="请输入外层简介"></el-input>
                    </div>
                </el-col>
            </el-row>
            <el-row style="margin-bottom:32px;">
                <el-col :span='24' style="padding:0;">
                    <div class="briefBox introBox">
                        <h3 class="briefBox_title">内层长简介</h3>
                        <el-input  type="textarea"
                        v-model="resourceData.intro"
                        placeholder="请输入内层简介"></el-input>
                    </div>
                </el-col>
            </el-row>
            <div class="btn_handle">
                <el-button type="primary" @click="submit">提交</el-button>
                <el-button type="danger" @click="cancel">取消</el-button>
            </div>
        </div>
        <ResList ref="resList" v-on:listenResid = "residChange"></ResList>
    </div>
</template>

<script>
import ResList from '@/components/resource/resList'

export default {
    name:'editRes',
    data () {
        return {
            resourceData:{
                name:'',
                index:'',
                brief:'',
                intro:'',
                meta_info_id:'',
                lesson_id:'',
                scenarios:''
            },
            thumbSrc:'',
            isImg:false,
            options: [{
                value: '课堂引入',
                label: '课堂引入'
                }, {
                value: '课堂活动',
                label: '课堂活动'
                }, {
                value: '总结拓展',
                label: '总结拓展'
            }],
        }
    },
    components:{
        ResList
    },
    mounted () {
        if(this.$route.query.resId){
            let id = this.$route.query.resId;
            this.getResData(id);
        }
        this.resourceData.lesson_id = this.$route.query.lesson_id
    },
    methods: {
        residChange(data){
            this.getRes(data)
        },
        getRes(id){
            let that = this;
            this.axios.get('/BeautyScience/meta_infos/'+id)
            .then(function(res){
                let data = res.data
                that.resourceData.meta_info_id = res.data.id;
                that.axios.post('/BeautyScience/qiniu/url',{
                    res_name:data.thumb
                })
                .then(function(res){
                    that.isImg = true;
                    that.thumbSrc = res.data.url;
                })
            })
        },
        deleteRes(){
            this.isImg = false;
            this.thumbSrc = '';
            this.resourceData.meta_info_id = '';
        },
        //跳转资源列表
        linkToRes(){
            this.$refs['resList'].dialogTableVisible = true;
        },
        submit(){
            let that = this;
            if(this.$route.query.resId){
                let id = this.$route.query.resId;
                this.axios.patch('/BeautyScience/resources/'+id,{
                    resource:that.resourceData
                })
                .then(function(res){
                    that.$router.go(-1)
                })
                .catch(function(error){
                    if(error.response.status == 422){
                        let msg = error.response.data.msg
                        that.$message({
                            message: msg,
                            type: 'warning'
                        });
                    }
                })
            }else{
                this.axios.post('/BeautyScience/resources',{
                    resource:that.resourceData
                })
                .then(function(res){
                    that.$router.go(-1)
                })
                .catch(function(error){
                    if(error.response.status == 422){
                        let msg = error.response.data.msg
                        that.$message({
                            message: msg,
                            type: 'warning'
                        });
                    }
                })
            }
        },
        cancel(){
            this.$router.go(-1)
        },
        //编辑
        getResData(id){
            let that = this;
            this.axios.get('/BeautyScience/resources/'+id)
            .then(function(res){
                that.resourceData.name = res.data.name
                that.resourceData.index = res.data.index
                that.resourceData.brief = res.data.brief
                that.resourceData.intro = res.data.intro
                that.resourceData.meta_info_id = res.data.meta_info.id
                that.resourceData.scenarios = res.data.scenarios
                that.axios.post('/BeautyScience/qiniu/url',{
                    res_name:res.data.meta_info.thumb
                })
                .then(function(res){
                    that.isImg = true;
                    that.thumbSrc = res.data.url;
                })
            })
        }
    }
}
</script>

<style>
.editRes_header .el-select .el-input__inner{
    height: 56px;
    border-radius:0;
}
.editRes_header .el-select .el-input__inner::placeholder{
    font-size: 18px;
    color:#999;
}
</style>

<style scoped>
.edit_resource{
    padding-top: 48px;
}
.icon-blue{
    display: inline-block;
    width: 16px;
    background-color: #47a8de;
}
.addResource{
    position: relative;
    width: 100%;
    height: 270px;
    line-height: 270px;
    background-color: #f0f0f0;
    text-align: center;
}
.addResource i{
    font-size: 20px;
    color: #999;
    font-weight: 700;
    cursor: pointer;
}

.addResource .thumbRes{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}
.addResource .thumbRes img{
    width: 100%;
    height: 270px;
}
.addResource .thumbRes i{
    position: absolute;
    top: 10px;
    right: 10px;
}
.briefBox{
    box-sizing: border-box;
    padding:20px 48px 24px 48px;
    height: 270px;
    border:1px solid #ddd;
}
.introBox{
    height: 336px;
}
.briefBox .briefBox_title::before{
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #47a8de;
    margin-right: 4px;
}
.btn_handle{
    margin-bottom: 48px;
}
</style>

