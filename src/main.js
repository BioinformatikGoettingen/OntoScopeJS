import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/vue-popper.css';

import VueCytoscape from 'vue-cytoscape'
import 'vue-cytoscape/dist/vue-cytoscape.css'
import './components/CyGraph.css'
//import Popper from 'popper'
 

Vue.config.productionTip = false
Vue.use(VueCytoscape)
Vue.use(BootstrapVue)

new Vue({
    render: h => h(App),
}).$mount('#app')



    



