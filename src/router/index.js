import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/media/Home'
import Login from '@/components/login/login'
import MediaType from '@/components/media/mediaType'
import PPTType from '@/components/media/pptType'
import AddZoomin from '@/components/media/addZoomin'
import AddHeatmap from '@/components/media/addHeatmap'
import AddVR from '@/components/media/addVR'
import AddTimelapse from '@/components/media/addTimelapse'
import AddVideo from '@/components/media/addVideo'
import AddRotation from '@/components/media/addRotation'
import AddPartial from '@/components/media/addPartial'
import AddInnerstruct from '@/components/media/addInnerstruct'
import AddMultiangle from '@/components/media/addMultiangle'
import AddPPT from '@/components/media/addPPT'
import resourceView from '@/components/resource/resourceView'
import version from '@/components/resource/version'
import edition from '@/components/resource/edition'
import grades from '@/components/resource/grades'
import charpters from '@/components/resource/charpters'
import lesson from '@/components/resource/lesson'
import editResource from '@/components/resource/editResource'
import editTeachPlan from '@/components/resource/editTeachPlan'
import resList from '@/components/resource/resList'
import resEdit from '@/components/resource/Hello'
//用户
import ManageIndex from '@/components/manage/Index.vue'
import ManaAddUser from '@/components/manage/user/AddUser.vue'
import ManaEditUser from '@/components/manage/user/EditUser.vue'
import ManaUserList from '@/components/manage/user/List.vue'
import ManaVipList from '@/components/manage/vip/List.vue'
import ManaGradeList from '@/components/manage/grade/List.vue'

//消息
import MessageList from '@/components/message/List.vue'

//权限管理
import AdminList from '@/components/admin/List.vue'
import AdminReg from '@/components/admin/Register.vue'

// 编辑页面
import ZoominEdit from '@/components/media/edit/zoominEdit.vue'
import HeatmapEdit from '@/components/media/edit/heatmapEdit.vue'
import VrEdit from '@/components/media/edit/vrEdit.vue'
import TimelapseEdit from '@/components/media/edit/timelapseEdit.vue'
import PolyvideoEdit from '@/components/media/edit/polyvideoEdit.vue'
import RotationEdit from '@/components/media/edit/360rotationEdit.vue'
import PartialEdit from '@/components/media/edit/partialEdit.vue'
import InnerstructEdit from '@/components/media/edit/innerstructEdit.vue'
import MultiangleEdit from '@/components/media/edit/multiangleEdit.vue'
import CoursewaresEdit from '@/components/media/edit/coursewaresEdit.vue'

Vue.use(Router)





export default new Router({
  // mode: 'history',
  routes: [
    {
      path:'/login',
      name:'login',
      component: Login
    },
    {
      path: '/',
      name:'home',
      component: Home
    },
    {
      path:'/media/:type',
      component: MediaType
    },
    {
      path:'/media_/PPT',
      component: PPTType
    },
    {
      path:'/media/Zoom_in/add',
      name:'addZoom',
      component: AddZoomin
    },
    {
      path:'/media/Heat_map/add',
      name:'addHeatmap',
      component: AddHeatmap
    },
    {
      path:'/media/Virtual_reality/add',
      name:'addVR',
      component: AddVR
    },
    {
      path:'/media/Time_lapse/add',
      name:'addTimelapse',
      component: AddTimelapse
    },
    {
      path:'/media/Polyv_video/add',
      name:'addVideo',
      component: AddVideo
    },
    {
      path:'/media/360Rotation/add',
      name:'addRotation',
      component: AddRotation
    },
    {
      path:'/media/photo_hot_zone/add',
      name:'addPartial',
      component: AddPartial
    },
    {
      path:'/media/photos/add',
      name:'addInnerstruct',
      component: AddInnerstruct
    },
    {
      path:'/media/Multi_angle/add',
      name:'addMultiangle',
      component: AddMultiangle
    },
    {
      path:'/media/PPT/add',
      name:'addPPT',
      component: AddPPT
    },
    {
      path:'/manage',
      name:'ManageIndex',
      component: ManageIndex,
      redirect: { path: '/manage/user/list' },
      children: [
        { path: '/manage/user/list', component: ManaUserList, name: 'ManaUserList'},
        { path: '/manage/vip/list', component: ManaVipList, name: 'ManaVipList'},
        { path: '/manage/grade/list', component: ManaGradeList, name: 'ManaGradeList'},        
      ]
    },
    {
      path:'/manage/adduser',
      name:'ManaAddUser',
      component: ManaAddUser
    },
    {
      path:'/manage/edituser/:id',
      name:'ManaEditUser',
      component: ManaEditUser
    },
    {
      path:'/resource/editor',
      name:'resEdit',
      component: resEdit
    },
    // {
    //   path:'/admin',
    //   name:'AdminList',
    //   component: AdminList
    // },    
    {
      path:'/message',
      name:'MessageList',
      component: MessageList
    },
    {
      path:'/admin',
      name:'AdminList',
      component: AdminList
    },
    {
      path:'/admin/register',
      name:'AdminReg',
      component: AdminReg
    },   
    {
      path: '/resource',
      component: resourceView,
      children:[
        {
          path:'/',
          name:'version',
          component:version
        },
        {
          path:'/resource/edition/:edition',
          name:'edition',
          component:edition
        },
        {
          path:'/resource/grades/:edition/:grade',
          name:'grades',
          component:grades
        },
        {
          path:'/resource/charpters/:edition/:grade/:charpter',
          name:'charpters',
          component:charpters
        },
        {
          path:'/resource/lesson/:edition/:grade/:charpter/:lesson',
          name:'lesson',
          component:lesson
        },
        {
          path:'/resource/edit_resource',
          name:'editResource',
          component: editResource
        },
        {
          path:'/resource/edit_teachPlan',
          name:'editTeachPlan',
          component: editTeachPlan
        },
        // {
        //   path:'/resource/list',
        //   name:'resList',
        //   component:resList
        // },
      ]
    },
    {
      path:'/media/Zoom_in/edit/:id',
      name:'zoominEdit',
      component: ZoominEdit
    },
    {
      path:'/media/Heat_map/edit/:id',
      name:'heatmapEdit',
      component: HeatmapEdit
    },
    {
      path:'/media/Virtual_reality/edit/:id',
      name:'vrEdit',
      component: VrEdit
    },
    {
      path:'/media/Time_lapse/edit/:id',
      name:'timelapseEdit',
      component: TimelapseEdit
    },
    {
      path:'/media/Polyv_video/edit/:id',
      name:'polyvideoEdit',
      component: PolyvideoEdit
    },
    {
      path:'/media/360Rotation/edit/:id',
      name:'rotationEdit',
      component: RotationEdit
    },
    {
      path:'/media/Partial/edit/:id',
      name:'partialEdit',
      component: PartialEdit
    },
    {
      path:'/media/Inner_struct/edit/:id',
      name:'innerstructEdit',
      component: InnerstructEdit
    },
    {
      path:'/media/Multi_angle/edit/:id',
      name:'multiangleEdit',
      component: MultiangleEdit
    },
    {
      path:'/media/coursewares/edit/:id',
      name:'coursewaresEdit',
      component: CoursewaresEdit
    },
  ]
})
