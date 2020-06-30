<template>
  <div id="app">

    OntoScope

    <CyGraph />

  </div>
</template>

<script>

import CyGraph from './components/CyGraph.vue'
import Vue from 'vue'




export default {
  name: 'app',
 
  components: {
    "CyGraph" : CyGraph,
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
  margin-top: 60px;
}
</style>
