import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)



const state = {
    fileImg:{},
    fileVideo:{}
}

export default new vuex({
    state
})
