<template>
  <div id="app">
    <CyGraph />
  </div>
</template>

<script>

import CyGraph from './components/CyGraph.vue'
import Vue from 'vue'
 


export default {
  name: 'app',
 
  components: {
    CyGraph
  }
}



</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  
}
</style>
