
import Vue from 'vue'
import App from './App.vue'



import VueCytoscape from 'vue-cytoscape'
import 'vue-cytoscape/dist/vue-cytoscape.css'
import './components/CyGraph.css'
import ontology_parser from "./components/ontology_parser"

var urlParams = new URLSearchParams(window.location.search);
var connectorpath = urlParams.get("ontologypackage")
var loadedconnector = ontology_parser.parse(connectorpath)

loadedconnector.then(function(){
  Vue.config.productionTip = false

  Vue.use(VueCytoscape)
  
  new Vue({
    render: h => h(App),
  }).$mount('#app')
})


