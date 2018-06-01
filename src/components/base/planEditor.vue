<template>
  <div class="vueEditorBox">
    <quill-editor ref="quillEditor"
    v-model="content"
    :options="editorOptions">
    </quill-editor>

    <el-upload class="uploadQiniu"
    ref="upload"
    :action="qnLocation"
    :before-upload="beforeUpload"
    :data="uploadData"
    :on-success="upSuccess">
        <el-button id="imgInput"
        size="small"
        type="primary"
        v-loading.fullscreen.lock="fullscreenLoading"
        element-loading-text="图片插入中，请等待···"></el-button>
    </el-upload>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Quill from 'quill'
// import { ImageImport } from './modules/ImageImport.js'
import { ImageResize } from './modules/ImageResize.js'
// Quill.register('modules/imageImport', ImageImport)
Quill.register('modules/imageResize', ImageResize)

// const staticDomain = 'https://publictest.kquestions.com/'
const staticDomain = 'https://content.kquestions.com/'

export default {
    props:['parentContent'],
  data(){
      return{
        content:'',
        editorOptions:{
            placeholder:'请编辑方案内容',
            modules: {
                toolbar: [ 
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],   
                    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                    [{ 'align': [] }, { 'indent': '-1'}, { 'indent': '+1' }, { 'direction': 'rtl' }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                    ['blockquote', 'code-block'],              // custom button values
                    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                    ['link', 'image'],
                    ['clean'] 
                ],
                imageResize: {
                    displaySize: true,
                },
            },
        },
        uploadData:{},
        fullscreenLoading:false,
        uuidImg:'',
        addRange:[],
        photoUrl:'',
        uploadType:'',
        addImgArr:[],
        submitImgArr:[]
      }
  },
  computed: {
      qnLocation(){
          return location.protocol === 'http:' ? 'http://upload.qiniu.com' : 'https://up.qbox.me'
      }
  },
  watch: {
      parentContent(){
          this.content = this.parentContent
      }
  },
  mounted () {
      //为编辑器图片ICON绑定事件
      this.$refs.quillEditor.quill.getModule('toolbar').addHandler('image',this.imgHandler)
  },
  methods: {
      beforeUpload(file){
        let _this = this;
        return this.qnUpload(file)
      },
      qnUpload(file){
        let _this = this;
        this.fullscreenLoading = true;
        // const suffix = file.name.split('.');
        // const ext = suffix.splice(suffix.length - 1,1)[0];
        if(this.uploadType === 'image'){
            return this.axios.all([_this.axios.get('BeautyScience/uuid'),_this.axios.get('/BeautyScience/qiniu/get_public_token')])
                .then(_this.axios.spread(function (acct, perms) {
                    //两个请求现已完成
                    _this.uploadData = {
                        key:acct.data.uuid,
                        token:perms.data.uptoken
                    }
                }));
        }else{
            this.$message.error('不可以上传图片类型以外的文件')
        }
      },
      upSuccess(e,file,fileList){
          console.log(e);
          this.fullscreenLoading = false;
          let _this = this,url = '';
          if(this.uploadType === 'image'){
              url = staticDomain + e.key;
            if(url != null && url.length > 0){
                let value = url;
                _this.addRange = _this.$refs.quillEditor.quill.getSelection()
                value = value.indexOf('http') !== -1 ? value : 'http:'+value;
                _this.$refs.quillEditor.quill.insertEmbed(_this.addRange !== null ? _this.addRange.index : 0, _this.uploadType, value, Quill.sources.USER)
                _this.addImgArr.push(e.key)
            }else{
                _this.$message.error(`${_this.uploadType}插入失败`)
            }
            _this.$refs['upload'].clearFiles();
          };
          
      },
      //点击图片ICON
      imgHandler(state){
          this.addRange = this.$refs.quillEditor.quill.getSelection();
          if(state){
              let fileInput = document.getElementById('imgInput');
              fileInput.click();
          }
          this.uploadType = 'image'
      },
      delImgApi(uuidDelete){//删除七牛上面图片
        console.log('delete',uuidDelete)
        this.axios.post('BeautyScience/qiniu/delete',{
            res_name: uuidDelete,
            public:true
        })
        .then(function(response){
            console.log(uuidDelete+'删除成功',response);
        })
      },
      //提交前查询img
      qnuuid(){//获取字符串中图片在七牛上的UUID
        var that = this;
        this.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
          let imgUid = capture.split("/");
          that.submitImgArr.push(imgUid[3]);
          console.log(44,that.submitImgArr)
        });
        this.getDeleteKey()
      },
    // 获取编辑器已删除的img的key
    getDeleteKey(){
        let arr1 = this.addImgArr,arr2 = this.submitImgArr;
        for(let i = 0; i < arr1.length; i++){         
            let isExist = false;
            for(let j = 0; j < arr2.length; j++){             
                if(arr1[i] == arr2[j]){
                    isExist = true;
                    break;  
                }
            }
            if(!isExist){
                this.delImgApi(arr1[i]);
            }
        }
    }
  }
}
</script>

<style>
.quill-editor{
    /* height: 600px; */
    /* margin-bottom: 54px; */
}
.quill-editor .ql-container{
    min-height: 535px;
}
.ql-snow .ql-editor img{
    /* max-width: 300px; */
}
.uploadQiniu{
    display: none;
}
</style>
