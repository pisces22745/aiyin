/**
 * Created by shaol on 2017/7/19.
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    projects: []
  },
  actions: {
    LOAD_PROJECT_LIST: function ({commit}) {

    }
  },
  mutations: {},
  getters: {}
})
export default store
