<template>
  <div>
    <quill-editor
      ref="newEditor"
      :options="newOption"
      style="height: 200px; margin-bottom: 54px"
      v-model="editorContent"
      @change="editorChange">
    </quill-editor>
    <el-upload class="upload-demo" 
    :action="qnLocation" 
    :before-upload='beforeUpload' 
    :data="uploadData" 
    :on-success='upScuccess'
      ref="upload" style="display:none">
      <el-button size="small" type="primary" id="imgInput" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="插入中,请稍候">点击上传</el-button>
    </el-upload>
  </div>
</template>
<script>
  import { quillEditor } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import Quill from 'quill'
  import { ImageImport } from './modules/ImageImport.js'
  import { ImageResize } from './modules/ImageResize.js'
  Quill.register('modules/imageImport', ImageImport)
  Quill.register('modules/imageResize', ImageResize)

  const STATICDOMAIN = 'https://publictest.kquestions.com/'

  export default {
    props: ['text', 'editorId','insertimg'],
    components: {quillEditor},
    data(){
      return {
        editorContent: '',        
        imgPercent: 0,        
        uploadData:{},        
        fullscreenLoading:false,        
        uploadType:'',
        newOption: {
          placeholder: '请填写简介',
          history: {
            delay: 100,
            maxStack: 2,
            userOnly: false
          },
          modules: {
            toolbar: [              
              [{ 'size': ['small' ,'large', 'huge'] }],
              ['bold', 'italic', 'underline'],
              ['blockquote'],
              [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
              [{ 'font': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link', 'image', 'video']
            ],
            imageImport: true,
            imageResize: {
              displaySize: true
            },
          },
          strict: false,//should be false for ignore unexpected update
        }        
      }
    },
    computed: {
      qnLocation() {
        if (location.protocol === 'http:') {
          return 'http://upload.qiniu.com'
        }
        return 'https://up.qbox.me'
      }
    },
    methods: {
      editorChange({ editor, html, text }) {
        var vm = this
        vm.$emit('editorChange', html)
      },
      qnUpload(file) {//上传到七牛
        let vm = this
        this.fullscreenLoading = true
        const suffix = file.name.split('.')
        const ext = suffix.splice(suffix.length - 1, 1)[0]        
        if (this.uploadType === 'image') {
           return this.axios.all([vm.axios.get('BeautyScience/uuid'),vm.axios.get('/BeautyScience/qiniu/get_public_token')])
                .then(vm.axios.spread(function (acct, perms) {
                    //两个请求现已完成
                    vm.uploadData = {
                        key:acct.data.uuid,
                        token:perms.data.uptoken
                    }
                }));
        }
      },
      // 图片上传之前调取的函数
      beforeUpload(file) {
        return this.qnUpload(file)
      },

      // 图片上传成功回调   插入到编辑器中
      upScuccess(e, file, fileList) {
        this.fullscreenLoading = false
        let vm = this
        let url = ''
        if (this.uploadType === 'image') {    // 获得文件上传后的URL地址
          url = STATICDOMAIN + e.key
        }
        if (url != null && url.length > 0) {  // 将文件上传后的URL地址插入到编辑器文本中
          let value = url
          vm.addRange = vm.$refs.newEditor.quill.getSelection()
          value = value.indexOf('http') !== -1 ? value : 'http:' + value
          vm.$refs.newEditor.quill.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, vm.uploadType, value, Quill.sources.USER)   // 调用编辑器的 insertEmbed 方法，插入URL
          vm.insertimg.push(e.key);
        } else {
          this.$message.error(`${vm.uploadType}插入失败`)
        }
        this.$refs['upload'].clearFiles()    // 插入成功后清除input的内容
        //console.log(this.insertimg)
      },      
      // 点击图片ICON触发事件
      imgHandler(state) {
        this.addRange = this.$refs.newEditor.quill.getSelection()
        if (state) {
          let fileInput = document.getElementById('imgInput')
          fileInput.click() // 加一个触发事件
        }
        this.uploadType = 'image'
      }        
    },
    created: function () {
      var vm = this
      vm.imgPercent = 0
      vm.editorContent = vm.text      
    },
    watch:{
      text: function () {
        var vm = this
        vm.editorContent = vm.text
      }
    },
    mounted() {
      // 为图片ICON绑定事件  getModule 为编辑器的内部属性
      this.$refs.newEditor.quill.getModule('toolbar').addHandler('image', this.imgHandler);          
    }
  }
</script>
<style scoped>

</style>
