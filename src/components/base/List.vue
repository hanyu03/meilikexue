<template>
    <div class="list">
        <ul class="listHeader border-bottom padding-aside">
            <li class="list-img">缩略图</li>
            <li class="list-title">标题</li>
            <li class="list-select">
                <el-select v-model="select.all" placeholder="全部状态">
                    <el-option
                    v-for="item in select.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </li>
            <li class="list-time">时间/大小</li>
            <li class="list-handle">操作</li>
        </ul>
        <ul class="listContent">
            <li class="border-bottom padding-aside"
             v-for="(item,index) in listData" :key="index">
                <div class="list-img lc-img">
                    <div>
                        <img :src="item.imgUrl" alt="">
                    </div>
                </div>
                <div class="list-title lc-title">{{item.title}}</div>
                <div class="list-select">
                    <span :class="[item.select == '已发布'? '':item.select == '待发布'? greenClass : blueClass]">{{item.select}}</span>
                </div>
                <div class="list-time">{{item.time}}</div>
                <div class="list-handle">
                    <el-button type="primary">编辑</el-button>
                    <el-button v-if="item.select == '已发布'" type="danger" disabled>删除</el-button>
                    <el-button v-else type="danger">删除</el-button>
                </div>
            </li>
        </ul>

    </div>
</template>

<script>
export default {
  data () {
      return {
          select:{
              all:'',
              options:[
                {value: '选项1',
                label: '全部状态'
                }, {
                value: '选项2',
                label: '已发布'
                }, {
                value: '选项3',
                label: '待发布'
                }, {
                value: '选项4',
                label: '未发布'
                }]
          },
          greenClass:'green',
          blueClass:'blue',
          listData:[
              {imgUrl:'/static/images/zoom_in.png',
              title:'观察根茎叶',
              select:'已发布',
              time:'2017-7-26 / 32M'},
              {imgUrl:'/static/images/zoom_in.png',
              title:'观察根茎叶',
              select:'待发布',
              time:'2017-7-26 / 32M'},
              {imgUrl:'/static/images/zoom_in.png',
              title:'自定义标题',
              select:'未发布',
              time:'2017-7-26 / 32M'}
          ]
      }
  },
  mounted () {
      
  },
  methods: {
      
  }
}
</script>

<style scoped>
.listHeader{
    display: flex;
    align-items: center;
    height:48px;
    font-size: 14px;
    color:#444;
}
.listHeader li{
    text-align: left;   
}
.list-img{
    flex: 2.5;
}
.list-title{
    flex: 1.5;
}
.list-select{
    flex: 1.5;
}
.list-time{
    flex: 3.5;
}
.list-handle{
    flex: 1.6;
}
.listContent li{
    display: flex;
    padding-top:24px;
    padding-bottom:24px;
    text-align: left;
    font-size: 14px;
    color:#999;
}
.listContent li .lc-title{
    font-weight: 700;
    color:#000;
}
.listContent li .lc-img{
    display: inline-flex;
}
.listContent li .lc-img>div{
    width: 160px;
    height: 90px;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    overflow: hidden;
}
.listContent li .lc-img img{
    max-width: 100% !important;
    height: auto;
}
</style>
