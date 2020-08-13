import Vue from 'vue'
import Vuex from 'vuex'
import {PluginHandler} from "../components/PluginHandler"
var handler = new PluginHandler()

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      count: 0,
      connectorArray : []
  },
  mutations: {
      increment(state) {
          state.count++
      },
  
      addConnector(state, connector) {
        state.connectorArray.push(connector)
      }
  },
  actions: {
    incrementAsync ({ commit }) {
        setTimeout(() => {
          commit('increment')
        }, 1000)
    },
    async loadConnector({ commit, state }) {
      var urlParams = new URLSearchParams(window.location.search);
      var configpath = urlParams.get("ontologypackage");
      var url_for_generic = urlParams.get("ontology")
      var name_for_generic = urlParams.get("ontologyname")
      if(!configpath && !(url_for_generic && name_for_generic)) {
        alert("U need to define a URL and the name for an ontlogy OR name a pluginpath")
        return null
      }
      if(configpath) {
        var callback = await handler.loadConfigfromUrl()
        commit("addConnector", callback)
      }
      if(url_for_generic && name_for_generic){
        var callback2 = await handler.loadGenericController()
        commit("addConnector", callback2)
        
      }
      return state.connectorArray
      
    },
    async addGenericConnector ({ commit, state}) {
      var callback = await handler.loadGenericController()

      commit("addConnector", callback)
      return state.connectorArray
    }
    
  },
  modules: {
  }
})
