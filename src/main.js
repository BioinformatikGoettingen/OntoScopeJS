import Vue from 'vue'
import App from './App.vue'



import VueCytoscape from 'vue-cytoscape'
import 'vue-cytoscape/dist/vue-cytoscape.css'
import './components/CyGraph.css'
import PluginHandler from "./components/PluginHandler"

var pluginhandler = new PluginHandler()



Vue.config.productionTip = false
Vue.use(VueCytoscape)
new Vue({

    render: h => h(App),
}).$mount('#app')



