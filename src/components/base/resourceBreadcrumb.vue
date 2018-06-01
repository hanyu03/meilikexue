<template>
  <div class="Breadcrumb padding-aside">
    <el-breadcrumb class="Breadcrumb-inner" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="/resource">版本</el-breadcrumb-item>
      <el-breadcrumb-item v-if="edition.isEdition"><span @click="toEdition">{{edition.value}}</span></el-breadcrumb-item>
      <el-breadcrumb-item v-if="grades.isGrades"><span @click="toGrades">{{grades.value}}</span></el-breadcrumb-item>
      <el-breadcrumb-item v-if="charpters.isCharpter"><span @click="toCharpters">{{charpters.value}}</span></el-breadcrumb-item>
      <el-breadcrumb-item v-if="lessons.isLesson">{{lessons.value}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import Bus from '@/bus.js'

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
      charpters:{
        value:'',
        isCharpter:false
      },
      lessons:{
        value:'',
        isLesson:false
      }
    }
  },
  mounted () {
    this.showCrumb()
  },
  methods: {
    showCrumb(){
      if(this.$route.params.edition && this.$route.params.grade && this.$route.params.charpter && this.$route.params.lesson){
        this.edition = {
          value:this.$route.params.edition,
          isEdition:true
        };
        this.grades = {
          value:this.$route.params.grade,
          isGrades:true
        };
        this.charpters = {
          value:this.$route.params.charpter,
          isCharpter:true
        };
        this.lessons = {
          value:this.$route.params.lesson,
        isLesson:true
        }
      }else if(this.$route.params.edition && this.$route.params.grade && this.$route.params.charpter){
        this.edition = {
          value:this.$route.params.edition,
          isEdition:true
        };
        this.grades = {
          value:this.$route.params.grade,
          isGrades:true
        };
        this.charpters = {
          value:this.$route.params.charpter,
          isCharpter:true
        };
      }else if(this.$route.params.edition && this.$route.params.grade){
        this.edition = {
          value:this.$route.params.edition,
          isEdition:true
        }
        this.grades = {
          value:this.$route.params.grade,
          isGrades:true
        }
      }else if(this.$route.params.edition){
        this.edition = {
          value:this.$route.params.edition,
          isEdition:true
        }
      }
    },
    toEdition(){
      let edition = this.$route.params.edition;
      let book_id = this.$route.query.book_id;
      this.$router.push({ name: 'edition',params:{edition:edition},query:{book_id:book_id}})
    },
    toGrades(){
      let edition = this.$route.params.edition;
      let grade = this.$route.params.grade;
      let book_id = this.$route.query.book_id;
      let grade_id = this.$route.query.grade_id;
      this.$router.push({ name: 'grades',params:{edition:edition,grade:grade},query:{book_id:book_id,grade_id:grade_id}})
    },
    toCharpters(){
      let edition = this.$route.params.edition;
      let grade = this.$route.params.grade;
      let charpter = this.$route.params.charpter;
      let book_id = this.$route.query.book_id;
      let grade_id = this.$route.query.grade_id;
      let charpters_id = this.$route.query.charpters_id;
      this.$router.push({ name: 'charpters',params:{edition:edition,grade:grade,charpter:charpter},query:{book_id:book_id,grade_id:grade_id,charpters_id:charpters_id}})
    }
  }
}
</script>

<style scoped>
.Breadcrumb{
  padding-top:56px;
  background-color: #fff;
  }
.Breadcrumb-inner{
  font-size: 14px;
  color: #444;
  background-color: #f0f0f0;
  height:48px;
  line-height: 48px;
  padding-left:48px;
}
</style>
