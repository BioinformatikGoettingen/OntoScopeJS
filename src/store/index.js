import Vue from 'vue'
import Vuex from 'vuex'
import {PluginHandler} from "../components/PluginHandler"
var handler = new PluginHandler()

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      count: 0,
      connector: "",
  },
  mutations: {
      increment(state) {
          state.count++
      },
      changeConnector(state, connector) {
          state.connector = connector
      }
  },
  actions: {
    incrementAsync ({ commit }) {
        setTimeout(() => {
          commit('increment')
        }, 1000)
    },
    async loadConnector({ commit, state }) {
        var callback = await handler.loadConfigfromUrl()
        commit("changeConnector", callback)
        return state.connector

    }
    
  },
  modules: {
  }
})
