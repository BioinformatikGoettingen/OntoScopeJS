<template>
  <div id="app">

    OntoScope

  <Results  :msg="childData" />

    <CyGraph @inputData="updateMessage" />

  </div>
</template>

<script>
import CyGraph from './components/CyGraph.vue'

import Results from "./components/Results.vue";

export default {
  name: 'app',
  components: {
    "CyGraph" : CyGraph,
    "Results" : Results
  },
  data: function() {
    return {
      childData: ""
    };
  },
  methods: {
    updateMessage(variable) {
      this.childData = variable;
    }
  }
}
</script>

<style>
#results {
  float:right;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  margin-top: 60px;
}
</style>
