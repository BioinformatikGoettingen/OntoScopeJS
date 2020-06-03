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
        <div>
         <fieldset class = "fieldset" id = "legendfieldset">
             <legend>Legend</legend>
             <table id = "nodetable">
             </table>
             <table id = "edgetable">
             </table>
         </fieldset>
        </div>
        <input id="searchClass" v-model="searchTerm" v-on:keyup.enter="search_for_class(searchTerm)"/>
         <button id="searchClassButton" v-on:click="search_for_class(searchTerm)" ref="mybutton">Search</button>
        <div id ="historydiv">
            <fieldset class="fieldset" id = "historyfieldset">
                <legend>History</legend>
                <div id = "historybox">

                </div>
            </fieldset>
        </div>
        </div>
        <div id = "infopanel">
          <b> Profile </b>
          <div id = "profile">

          </div>
        </div>
        <div id="myModal" class="modal">
            <div id = "modal-header">
                <div id = "heading"> </div>
                <span class="close">&times;</span>  
                <div id = "subtitle"> </div>
             </div>
            <div id ="modal-content" class="modal-content"></div>
        </div>
        <div id = "imagebox">
            <canvas id = "canvas"> </canvas>
            <img id = "graph-image" />
            <a href = "" class = "button" id = "imagedownload" download> Download this image </a>
             <span class="close">&times;</span>  

        </div>
        <button id="PngButton" v-on:click="createpng()" ref="mybutton">Create PNG</button>

    </div>
</template>
<script type="text/javascript" src="./CyGraph.js"></script>
