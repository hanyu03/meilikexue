import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/media/Home'
import Login from '@/components/login/login'
import MediaType from '@/components/media/mediaType'
import AddZoomin from '@/components/media/addZoomin'
import AddHeatmap from '@/components/media/addHeatmap'
import AddVR from '@/components/media/addVR'
import AddTimelapse from '@/components/media/addTimelapse'
import AddVideo from '@/components/media/addVideo'
import AddRotation from '@/components/media/addRotation'
import AddPartial from '@/components/media/addPartial'
import AddInnerstruct from '@/components/media/addInnerstruct'
import AddMultiangle from '@/components/media/addMultiangle'
import resourceView from '@/components/resource/resourceView'
import version from '@/components/resource/version'
import edition from '@/components/resource/edition'
import grades from '@/components/resource/grades'

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
      path:'/media/Zoom in/add',
      name:'addZoom',
      component: AddZoomin
    },
    {
      path:'/media/Heat Map/add',
      name:'addHeatmap',
      component: AddHeatmap
    },
    {
      path:'/media/Virtual Reality/add',
      name:'addVR',
      component: AddVR
    },
    {
      path:'/media/Time Lapse/add',
      name:'addTimelapse',
      component: AddTimelapse
    },
    {
      path:'/media/Polyv Video/add',
      name:'addVideo',
      component: AddVideo
    },
    {
      path:'/media/360 Rotation/add',
      name:'addRotation',
      component: AddRotation
    },
    {
      path:'/media/Partial/add',
      name:'addPartial',
      component: AddPartial
    },
    {
      path:'/media/Inner struct/add',
      name:'addInnerstruct',
      component: AddInnerstruct
    },
    {
      path:'/media/Multi Angle/add',
      name:'addMultiangle',
      component: AddMultiangle
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
          path:'/resource/edition',
          name:'edition',
          component:edition
        },
        {
          path:'/resource/grades',
          name:'grades',
          component:grades
        },
      ]
    },
  ]
})
