
<template>

  <div>
    <div>
      <nav class="navbar navbar-expand navbar-light" style="background-color: #e3f2fd;">
        <a class="navbar-brand" href="#">OntoScope</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
            <li class="nav-item active">
              <button type="button" class="btn btn-outline-secondary mx-2 " v-on:click="align()" >align Graph</button>
            </li>

            <li class="nav-item">
              <button type="button" class="btn btn-outline-secondary " v-on:click="createpng()" >Create PNG</button>
            </li>
          </ul>
        
          <input class="mr-sm-2" id="searchClass" v-model="searchTerm" v-on:keyup.enter="search_for_class(searchTerm)"/>
          <button class="btn btn-outline-success my-2 my-sm-0" id="searchClassButton" v-on:click="search_for_class(searchTerm)" ref="mybutton">Search</button>

          <b-modal id="Modal" scrollable title="Select addition to graph">
           <div class="container" id ="ResultModal">
            <div id ="Resultontology">
            </div>
          </div>


  </b-modal>
        
        </div>
      </nav>
    </div>  

  <div class="row">
    <div id="holder" class="col-md-10">
      <cytoscape
            :key="'cyKey()'"
            :config="config"
            :preConfig="preConfig"
            :afterCreated="afterCreated"
            :debug="true"
      />
    </div>
      <div id = "infopanel" class="col-12 col-md-2">
      <b> Profile </b>
      <div id = "profile">

      </div>
      </div>
  </div>

  <div class="row">
    <div id ="historydiv" class ="col-12 col-md-6" style="background-color: #e3f2fd;">
      <fieldset class="fieldset" id = "historyfieldset">
          <legend>History</legend>
          <div id = "historybox">
            <div id= "first_searchtip">Tip: Search for a term in the searchbox and select a result to draw the first node. </div>

          </div>
      </fieldset>
      </div>
      <div id="legenddiv" class="col-12 col-md-4" style="background-color: #e3f2fd;">
        <fieldset class = "fieldset" id = "legendfieldset">
          <legend>Legend</legend>
          <table id = "nodetable">
          </table>
          <table id = "edgetable">
          </table>
        </fieldset>
      </div>
  </div>
  <div id="myModal" class="modal">
    
    <div class="row" style="z-index:2">
      <div class="col-12 col-md-6 col-lg-4 selectheader" style="z-index:2">
        <h4 class="text-muted" style="z-index:3">Search Result</h4> 
        <h6 class="text-muted" style="z-index:3">Select Ontology class to add to the graph</h6>
      </div> 
      
    </div>
    <div id = "modal-header">
        <div id = "heading"> </div>
        <span class="close">&times;</span>  
        <div id = "subtitle"> </div>
      </div>
    
  </div>
  <div id = "imagebox">
      <canvas id = "canvas"> </canvas>
      <img id = "graph-image" />
      <a href = "" class = "button" id = "imagedownload" download> Download this image </a>
        <span class="close">&times;</span>  

  </div>
        
    

    </div>
</template>
<script type="text/javascript" src="./CyGraph.js"></script>
