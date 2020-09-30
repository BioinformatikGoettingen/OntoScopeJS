import Vue from 'vue'
import Vuex from 'vuex'
import {PluginHandler} from "../components/PluginHandler"
var handler = new PluginHandler()

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      configArray: [],
      connectorArray : []
  },
  mutations: {
      increment(state) {
          state.count++
      },
  
      addConnector(state, connector) {
        state.connectorArray.push(connector)
      },

      addconfig(state, config) {
        state.configArray.push(config)
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
      var plugin = urlParams.get("plugin");
      var url = urlParams.get("url")

      if(!plugin && !url) {
        alert("U need to define a URL and the name for an ontlogy OR name a pluginpath")
        return null
      } 
      

      //load generic Connector
      var callback2 = await handler.loadGenericController()
      commit("addConnector", callback2)
    
      //load pluginConnector and overwrite url in genericConnector
      if(plugin) {
        var callback = await handler.loadPluginfromUrl()
        commit("addConnector", callback)
        var config = await handler.loadConfigfromPlugin()
        commit("addconfig", config)
        state.connectorArray[0].url = state.connectorArray[state.connectorArray.length - 1].url
        if(url) {
          for(var i = 0; i < state.connectorArray.length; i++){
            state.connectorArray[i].url = url
          }
        }
      }

      // add searchtip to searchbox
      var searchbox = document.getElementById("searchClass")
      searchbox.placeholder = state.configArray[0][0].searchtip
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
