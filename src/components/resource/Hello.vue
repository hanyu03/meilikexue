<template>
  <div class="hello">    
    <rich-text-editor :text="content" :insertimg="insertImg" @editorChange="editorChange">
    </rich-text-editor>
    内容：{{content}}
    <el-button type="danger" @click="onSubmit">完 成</el-button>
  </div>  
</template>

<script>
  import richTextEditor from '../base/richTextEditor.vue'
export default {
  name: 'hello',
  components: {richTextEditor},
  data () {
    return {      
      insertImg:['dbe96b2e-9c8e-40be-9951-c698d3cbb34a','f1e7c1a4-ee28-4157-90b2-fb6a353f2607','77f9e07e-7c8d-4cb5-b8f2-a3cf9096d01e','c40274d7-91ed-455e-a1ab-dc809371d694'],//如果插入的数组里有，编辑器里没有就删除
      editImg:[],
      content: '你j是我的小<img src="https://publictest.kquestions.com/dbe96b2e-9c8e-40be-9951-c698d3cbb34a"><img src="https://publictest.kquestions.com/f1e7c1a4-ee28-4157-90b2-fb6a353f2607"><img src="https://publictest.kquestions.com/77f9e07e-7c8d-4cb5-b8f2-a3cf9096d01e"><img src="https://publictest.kquestions.com/c40274d7-91ed-455e-a1ab-dc809371d694">'
    }
  },
  methods: {
    editorChange: function(html) {
      this.content = html
    },
    delImg(uuid){//删除七牛上面图片
      this.axios.post('BeautyScience/qiniu/delete',{
         res_name: uuid
      })
      .then(function(response){
         console.log(uuid+'删除成功',response);
      })
    },
    qnuuid(str){//获取字符串中图片在七牛上的UUID
        this.editImg = [];
        var that = this;         
        str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
          let imgUid = capture.split("/");
          that.editImg.push(imgUid[3]);
        });        
    },
    onSubmit(){
      console.log(this.insertImg,this.editImg);
      var array1 = this.insertImg;
      var array2 = this.editImg;
      var result = [];
      for(var i = 0; i < array1.length; i++){
          var obj = array1[i];          
          var isExist = false;
          for(var j = 0; j < array2.length; j++){
              var aj = array2[j];              
              if(aj == obj){
                  isExist = true;
                  console.log(aj);
                  break;
              }
          }
          if(!isExist){
            this.delImg(obj);              
          }
      }
    }
  },
  updated(){    
    var str = this.content;
    this.qnuuid(str);    
  },
  mounted() {
    //console.log(this.insertImg,this.editImg);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
