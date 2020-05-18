<template>
    <div>
        <div id="holder">
         <cytoscape
                :key="'cyKey()'"
                :config="config"
                :preConfig="preConfig"
                :afterCreated="afterCreated"
                :debug="true"
         />
         <input id="searchClass" v-model="searchTerm" v-on:keyup.enter="search_for_class(searchTerm)"/>
         <button id="searchClassButton" v-on:click="search_for_class(searchTerm)" ref="mybutton">Search</button>
        </div>
        <div id = "infopanel">
          <b> Profile </b>
          <div id = "profile">

          </div>
        </div>
        <table id = "legend"></table>
        <div id = "historybox"><p style="margin:0">History:</p></div>
        <div id="myModal" class="modal">
            <div id = "modal-header">
                <div id = "heading"> </div>
                <span class="close">&times;</span>  
                <div id = "subtitle"> </div>
             </div>
            <div id ="modal-content" class="modal-content"></div>
        </div>
    </div>
</template>

<script type="text/javascript" src="./CyGraph.js"></script>
