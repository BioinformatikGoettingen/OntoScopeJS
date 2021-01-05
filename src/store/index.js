import Vue from 'vue'
import Vuex from 'vuex'
import {PluginHandler} from "../components/PluginHandler"
var handler = new PluginHandler()

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      configArray: [],
      connectorArray : [],
      urlArray: []
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
      },
      addUrl(state, url) {
        state.urlArray.push(url)
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
      var plugin = urlParams.getAll("plugin");
      var url = urlParams.getAll("url")

      if(plugin.length == 0  && url.length == 0) {
        alert("You need to define a URL and the name for an ontlogy OR name a pluginpath")
        return null
      } 

      //load generic Connector
      var genericConnector = await handler.loadGenericController()
      commit("addConnector", genericConnector)
      
      //load pluginConnector and overwrite url in genericConnector
      if(plugin.length > 0) {
        for(var i = 0; i< plugin.length; i++){

          var loadedPlugin = await handler.loadPluginfromUrl(plugin[i])
          commit("addConnector", loadedPlugin)

          var config = await handler.loadConfigfromPlugin(plugin[i])
          commit("addconfig", config)

          if(loadedPlugin.url) {
            commit("addUrl", loadedPlugin.url)
          }
          //hier mal überlegen, wie die reihenfolge für die urls sind
          /*
          state.connectorArray[0].url.push(state.connectorArray[state.connectorArray.length - 1].url)
          if(url.length > 0) {
            for(var j = 0; j < state.connectorArray.length; j++){
              state.connectorArray[j].url = url
            }
          }*/
        }
        
      }
      if(url.length > 0) {
        for(var i = 0; i<url.length; i++) {
          commit("addUrl",url[i])
        }
      }

      //add url to generic connector
      state.connectorArray[0].url = state.urlArray
      
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
