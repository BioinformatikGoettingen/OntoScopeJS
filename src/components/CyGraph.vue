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
        <div id="myModal" class="modal">

            <!-- Modal content -->
            <div id ="modal-content" class="modal-content">
                <h2> Expand the graph</h2>
                <span class="close">&times;</span>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript" src="./CyGraph.js"></script>
