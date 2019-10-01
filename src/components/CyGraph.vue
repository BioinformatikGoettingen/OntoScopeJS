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

<script>


    import axios from 'axios'
    import CyObj from '@/components/cy-object'
    import cxtmenu from 'cytoscape-cxtmenu'
    import OntoCls from './OntoCls'
    import GenericConnector from "./GenericConnector"
    //import TriboliumConnector from "./TriboliumConnector"


    let connector = new GenericConnector() //TODO make it dependent on the ontology
    //let triboliumConnector = new TriboliumConnector()

    var devStageColor = []
    var colors = ["#001f3f","#0074D9","#7FDBFF", "#39CCCC","#3D9970","#2ECC40","#01FF70","#FFDC00","#FF851B","#FF4136","#85144b","#F012BE","#B10DC9","#111111","#AAAAAA","#DDDDDD"]

    /* eslint-disable */
    const config = {
        style: [
            {
                selector: "node",
                style: {
                    "background-color": "data(color)",
                    label: "data(label)",
                    "height": 20,
                    "width": 20,
                    "font-size": 10
                }
            },
            {
                selector: "edge",
                style: {
                    'curve-style': 'straight',
                    width: 3,
                    'target-arrow-shape': 'triangle',
                    label: "data(label)",
                    'text-rotation': 'autorotate',
                    "font-size": 7,
                    "text-margin-x" : 3,
                    "text-margin-y" : 3
                }
            },
            {
              selector: ':selected',
              style: {
                "background-color": "red"
              }
            }
        ]
    };


    async function add_data(onto_cls, cyInst) {
        console.log(onto_cls)
          var devStage = await onto_cls.devStage

          if(!devStageColor[devStage]){
            devStageColor[devStage] = colors[0]

            var table = document.getElementById("legend");
            var tr = document.createElement("tr");
            var tddot = document.createElement("td");
            var tddesc = document.createElement("td");

            var tddotnode = document.createElement("span");
            tddotnode.className += "dot"
            tddotnode.style.backgroundColor = colors[0]

            var tddescnode = document.createTextNode(devStage)

            tddot.appendChild(tddotnode);
            tddesc.appendChild(tddescnode);

            tr.appendChild(tddot);
            tr.appendChild(tddesc);

            table.appendChild(tr)
            table.style.display = "block"

            colors.shift();
          }

          var tmp = [] ;
          var paren = await onto_cls.parents;
          console.log(onto_cls.parents)
          for (const parent_cls of onto_cls.parents) {

            //parent_cls.fillCls()
            var devStageParent =  await parent_cls.devStage;
            tmp[parent_cls.id] = devStageParent;
            if(!devStageColor[devStageParent]){
              devStageColor[devStageParent] = colors[0]
              var table = document.getElementById("legend");
              var tr = document.createElement("tr");
              var tddot = document.createElement("td");
              var tddesc = document.createElement("td");

              var tddotnode = document.createElement("span");
              tddotnode.className += "dot"
              tddotnode.style.backgroundColor = colors[0]


              var tddescnode = document.createTextNode(devStageParent)

              tddot.appendChild(tddotnode);
              tddesc.appendChild(tddescnode);

              tr.appendChild(tddot);
              tr.appendChild(tddesc);

              table.appendChild(tr)
            table.style.display = "block"

              colors.shift();
            }
          }

      await onto_cls.fillCls();

        cyInst.then(cy => {
            cy.add([{group: 'nodes', data: {
                    id: onto_cls.id,
                    label: onto_cls.label,
                    object: onto_cls,
                    color: devStageColor[devStage]
            }}]);

            for (const parent_cls of onto_cls.parents) {
              if(connector.ontoname == "tribolium") {
                var parentdev = tmp[parent_cls.id]
              }

              //var parent_cls =  connector.createNewOntoCs(parent_cls)
                //var parent_cls = new OntoCls(parent_cls); // TODO get parent should return OntoClass objects
                //var searchString = parent_cls.label
                cy.add([{group: 'nodes', data: {id: parent_cls.id, label: parent_cls.label, object: parent_cls,color: devStageColor[parentdev]}},
                    {group: 'edges', data: {source: parent_cls.id, target: onto_cls.id, label: "subclass"}}]);
            }
            cy.layout({
                name: 'cose'
            }).run();
        })


    }

    export default {
        name: "CyGraph",
        data() {
            return {
                config,
                searchTerm: "",
                i: 0
            };
        },
        components: {

        },
        methods: {
            preConfig(cytoscape) {
                console.log("calling pre-config");
                cytoscape.use(cxtmenu);

            },
            afterCreated: function (cy) {
                let menu;
                console.log(cy);
                let menu2 = this.$refs.menu;
                //cy.on("dragfree", "node", evt => this.setCyElements(cy));
                // cy.on('tap', 'node', function (event) {
                //     const data = event.target.data()
                //     //if you are using vuex you can dispatch your events this way
                //     console.log(event.originalEvent.clientX) ;
                //     menu2.open(event.originalEvent, menu2)
                //
                // })
                cy.on('tap', 'node', async function (event) {
                  //delete existing elements
                  var elements = document.getElementsByClassName("infopanelelement");
                  while(elements.length > 0){
                      elements[0].parentNode.removeChild(elements[0]);
                  }
                  var node = event.target.json();
                  var profile = document.getElementById("profile");
                  var object = node.data.object;
                  console.log(object)
                  var name = await object.name;
                  var id = await object.id;
                  //var devStage;
                  var devStage = await object.devStage;

                  var def;
                  for (var anno of object.json.annotations) {
                    if(anno.name === "def") {
                      def = anno.value;
                      }
                  }
                  //if def is empty fill with "no defintion available"

                  //create header
                  var idheader = document.createElement("p");
                  var nameheader = document.createElement("p");
                  var defheader = document.createElement("p");
                  var devStageheader = document.createElement("p");

                  idheader.className += "header";
                  nameheader.className += "header";
                  defheader.className += "header";
                  devStageheader.className += "header";

                  idheader.className += " infopanelelement";
                  nameheader.className += " infopanelelement";
                  defheader.className += " infopanelelement";
                  devStageheader.className += " infopanelelement";

                  var idheadernode = document.createTextNode("ID:");
                  var nameheadernode = document.createTextNode("Name:");
                  var defheadernode = document.createTextNode("Defintion:");
                  var devStageheadernode = document.createTextNode("Developmental Stage:");


                  idheader.appendChild(idheadernode);
                  nameheader.appendChild(nameheadernode);
                  defheader.appendChild(defheadernode);
                  devStageheader.appendChild(devStageheadernode);


                  //create text
                  var idtext = document.createElement("p");
                  var nametext = document.createElement("p");
                  var deftext = document.createElement("p");
                  var devStagetext = document.createElement("p");

                  idtext.className += "text";
                  nametext.className += "text";
                  deftext.className += "text";
                  devStagetext.className += "text";
                  idtext.className += " infopanelelement";
                  nametext.className += " infopanelelement";
                  deftext.className += " infopanelelement";
                  devStagetext.className += " infopanelelement";

                  var idtextnode = document.createTextNode(id);
                  var nametextnode = document.createTextNode(name);
                  var deftextnode = document.createTextNode(def);
                  var devStagetextnode = document.createTextNode(devStage);

                  idtext.appendChild(idtextnode);
                  nametext.appendChild(nametextnode);
                  deftext.appendChild(deftextnode);
                  devStagetext.appendChild(devStagetextnode);

                  var profile = document.getElementById("profile");

                  profile.appendChild(idheader);
                  profile.appendChild(idtext);

                  profile.appendChild(nameheader);
                  profile.appendChild(nametext);

                  profile.appendChild(defheader);
                  profile.appendChild(deftext);

                  profile.appendChild(devStageheader);
                  profile.appendChild(devStagetext);
                });
                //if nodes need different context menue, we need to create a cy.cxtmenu for each type of node
                menu = cy.cxtmenu({
                    selector: 'node',
                    commands: [
                        {
                            content: "expand",
                            fillColor: 'green',
                            select: async function (tmp) {
                                var json = tmp.json();
                                var data = json.data;
                                var object = data.object;


                                var properties = await object.properties;
                                var children = await object.children;
                                var parent = await object.parents;



                                if(children == null && parent == null && !properties) {
                                  alert("no children, parents or properties to display")
                                }else {
                                  var propertytype = []
                                  //properties
                                if(properties != null){

                                    for (var properties_cls of properties) {
                                      //create a array with all types of
                                      if(!propertytype.includes(properties_cls.property.name)){
                                        propertytype.push(properties_cls.property.name)
                                      }
                                    }

                                    for( var type of propertytype){
                                      //load all nodes of certain type
                                      var nodes_of_type = []
                                      for(var prop  of properties){
                                        if(prop.property.name === type){
                                          nodes_of_type.push(prop)
                                          //nodes_of_type.push(prop.target)
                                        }
                                      }

                                      var modal = document.getElementById("myModal");

                                      modal.style.display = "block";
                                      var span = document.getElementsByClassName("close")[0];
                                      var string = "load "+ type + "(" + nodes_of_type.length + ")";
                                      var node = document.createElement("div");
                                      var textnode = document.createTextNode(string);
                                      node.id = type
                                      node.className += "listelement"
                                      node.appendChild(textnode);
                                      document.getElementById("modal-content").appendChild(node);

                                      // hier dann node erstellen
                                      // HIER PROBLEM MIT nodes_of_type : WIRD ÜBERSCHRIEBEN! Hier muss nochmal ein array erstellt werden
                                    document.getElementById(type).onclick = async function() {
                                        for (var properties_cls of properties) {
                                          if(properties_cls.property.name === this.id) {

                                            if(connector.ontoname == "tribolium") {
                                              var devStage = await properties_cls.target.devStage
                                              if(!devStageColor[devStage]){
                                                devStageColor[devStage] = colors[0]
                                                var table = document.getElementById("legend");
                                                var tr = document.createElement("tr");
                                                var tddot = document.createElement("td");
                                                var tddesc = document.createElement("td");

                                                var tddotnode = document.createElement("span");
                                                tddotnode.className += "dot"
                                                tddotnode.style.backgroundColor = colors[0]

                                                var tddescnode = document.createTextNode(devStage)

                                                tddot.appendChild(tddotnode);
                                                tddesc.appendChild(tddescnode);

                                                tr.appendChild(tddot);
                                                tr.appendChild(tddesc);

                                                table.appendChild(tr)
                                                table.style.display = "block"

                                                colors.shift();
                                              }
                                            }else {
                                              await properties_cls.target.devStage
                                            }
                                            cy.add([{
                                               group: 'nodes',
                                               data: {
                                                   id: properties_cls.target.id,
                                                   label: properties_cls.target.label,
                                                   object: properties_cls.target,
                                                   color: devStageColor[devStage]
                                               }
                                            },
                                               {group: 'edges', data: {source: properties_cls.target.id, target: object.id, label: properties_cls.property.name}}]);
                                          }
                                        }
                                        cy.layout({
                                            name: 'cose'
                                        }).run()
                                      modal.style.display = "none";
                                      var elements = document.getElementsByClassName("listelement");
                                          while(elements.length > 0){
                                              elements[0].parentNode.removeChild(elements[0]);
                                          }
                                        }
                                    }
                                  }

                              //children
                                if(children != null){
                                  if(children.length > 0) {
                                  var modal = document.getElementById("myModal");
                                  modal.style.display = "block";
                                  var span = document.getElementsByClassName("close")[0];
                                    var string = "load children (" + children.length + ")";
                                    var node = document.createElement("div");
                                    var textnode = document.createTextNode(string);
                                    node.id = "children"
                                    node.className += "listelement"
                                    node.appendChild(textnode);
                                    document.getElementById("modal-content").appendChild(node);

                               document.getElementById("children").onclick = async function() {
                                   for (var children_cls of children) {
                                        if(connector.ontoname == "tribolium") {
                                          var devStage = await children_cls.devStage
                                          if(!devStageColor[devStage]){
                                            devStageColor[devStage] = colors[0]
                                            var table = document.getElementById("legend");
                                            var tr = document.createElement("tr");
                                            var tddot = document.createElement("td");
                                            var tddesc = document.createElement("td");

                                            var tddotnode = document.createElement("span");
                                            tddotnode.className += "dot"
                                            tddotnode.style.backgroundColor = colors[0]

                                            var tddescnode = document.createTextNode(devStage)

                                            tddot.appendChild(tddotnode);
                                            tddesc.appendChild(tddescnode);

                                            tr.appendChild(tddot);
                                            tr.appendChild(tddesc);

                                            table.appendChild(tr)
                                            table.style.display = "block"

                                            colors.shift();
                                          }
                                      }
                                       cy.add([{
                                           group: 'nodes',
                                           data: {
                                               id: children_cls.id,
                                               label: children_cls.label,
                                               object: children_cls,
                                               color: devStageColor[devStage]
                                           }
                                       },
                                           {group: 'edges', data: {source: children_cls.id, target: object.id, label: "is a"}}]);
                                   }
                                   cy.layout({
                                       name: 'cose'
                                   }).run()
                                   modal.style.display = "none";
                                   var elements = document.getElementsByClassName("listelement");
                                       while(elements.length > 0){
                                           elements[0].parentNode.removeChild(elements[0]);
                                       }

                               }
                                  }
                                }
                               //parent
                                if(parent != null) {
                                 if(parent.length > 0 ) {
                                   var modal = document.getElementById("myModal");
                                   modal.style.display = "block";
                                   var span = document.getElementsByClassName("close")[0];
                                     var string = "load parent (" + parent.length + ")";
                                     var node = document.createElement("div");
                                     var textnode = document.createTextNode(string);
                                     node.id = "parent"
                                     node.className += "listelement"
                                     node.appendChild(textnode);
                                     document.getElementById("modal-content").appendChild(node);




                                 document.getElementById("parent").onclick = async function() {
                                    for(var parent_cls of parent) {
                                     if(connector.ontoname == "tribolium") {
                                        var devStage = await parent_cls.devStage
                                        if(!devStageColor[devStage]){
                                          devStageColor[devStage] = colors[0]

                                          var table = document.getElementById("legend");
                                          var tr = document.createElement("tr");
                                          var tddot = document.createElement("td");
                                          var tddesc = document.createElement("td");

                                          var tddotnode = document.createElement("span");
                                          tddotnode.className += "dot"
                                          tddotnode.style.backgroundColor = colors[0]

                                          var tddescnode = document.createTextNode(devStage)

                                          tddot.appendChild(tddotnode);
                                          tddesc.appendChild(tddescnode);

                                          tr.appendChild(tddot);
                                          tr.appendChild(tddesc);

                                          table.appendChild(tr)
                                          table.style.display = "block"

                                          colors.shift();
                                        }
                                      }
                                    /*  if(connector.ontoname == "cytomer") {
                                        var tmp = parent[0]
                                        console.log(tmp.oc_name)
                                      }*/

                                         cy.add([{
                                             group: 'nodes',
                                             data: {
                                                 id: parent_cls.id,
                                                 label: parent_cls.label,
                                                 object: parent_cls,
                                                 color: devStageColor[devStage]
                                             }
                                         },
                                             {group: 'edges', data: {source: parent_cls.id, target: object.id, label: "subclass"}}]);
                                           }
                                     cy.layout({
                                         name: 'cose'
                                     }).run()
                                     modal.style.display = "none";
                                     var elements = document.getElementsByClassName("listelement");
                                         while(elements.length > 0){
                                             elements[0].parentNode.removeChild(elements[0]);
                                         }


                               }
                                  }

                               span.onclick = function() {
                                    modal.style.display = "none";
                                    var elements = document.getElementsByClassName("listelement");
                                        while(elements.length > 0){
                                            elements[0].parentNode.removeChild(elements[0]);
                                        }
                                }
                                window.onclick = function(event) {
                                    if (event.target == modal) {
                                        modal.style.display = "none";
                                        var elements = document.getElementsByClassName("listelement");
                                            while(elements.length > 0){
                                                elements[0].parentNode.removeChild(elements[0]);
                                            }

                                    }
                                }
                                }

                            }
                          }
                        },
                        {
                          content: 'delete node',
                          fillColor: 'red',
                          select: function (tmp) {
                            tmp.remove()
                          }
                        }
                    ]
                });

                this.setCyElements(cy);
                // the default values of each option are outlined below:

            },
            cyKey() {
                console.log("-------- cyKey");
                const that = this;
                CyObj.reset();
                CyObj.instance.then(cy => {
                    console.log('cy', cy);
                    cy.on('tap', event => {
                        console.log('tapped');
                        that.i++
                    })
                });
                console.log('computing cyKey cy' + this.i);
                return 'cy' + this.i
            },
            setCyElements(cy) {
                console.log("setCyElements");
                let cytoElems = [
                ];
                cy.startBatch();
                cy.elements().remove();
                for (let el of cytoElems) {
                    cy.add(el);
                }
                cy.endBatch();
                cy.fit();
            },
            async search_for_class(searchString, url = "http://oba.sybig.de") {
                var ontology = connector.ontoname
                var searchedResult = await connector.first_search(searchString);
                var cytoscape = this.$cytoscape.instance;
                if(searchedResult.length == 1) {
                  var cls = searchedResult[0]
                //  if(ontology == "tribolium"){
                      cls.fillCls();
                //  }
                  add_data(cls, cytoscape)
                }else {
                var modal = document.getElementById("myModal");
                modal.style.display = "block";
                var span = document.getElementsByClassName("close")[0];

                for(var i = 0; i< searchedResult.length; i++){
                  var string = searchedResult[i].label;
                  var node = document.createElement("div");
                  var textnode = document.createTextNode(string);
                   node.classList.add("selection");
                   node.id = searchedResult[i].id
                  node.appendChild(textnode);
                  document.getElementById("modal-content").appendChild(node);
                }

                var elements = document.querySelectorAll(".selection");
                for (var i = 0; i < elements.length; i++) {
                    elements[i].onclick = async function() {
                      var id = await event.srcElement.id
                      var cls = searchedResult.find(function(element) {
                        return element.oc_name == id
                      })
                    //  if(ontology == "tribolium"){
                          cls.fillCls();
                      // }
                      add_data(cls, cytoscape)
                      modal.style.display = "none";
                      var elements = document.getElementsByClassName("selection");
                          while(elements.length > 0){
                              elements[0].parentNode.removeChild(elements[0]);
                          }
                    }
                }
              }


                span.onclick = function() {
                    modal.style.display = "none";
                    var elements = document.getElementsByClassName("selection");
                        while(elements.length > 0){
                            elements[0].parentNode.removeChild(elements[0]);
                        }
                }
                window.onclick = function(event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                        var elements = document.getElementsByClassName("selection");
                            while(elements.length > 0){
                                elements[0].parentNode.removeChild(elements[0]);
                            }
                    }
                }


            },

        }


    };


</script>

<style>
    #holder {
        width: 79%;
        height: 75vh;
        border: 1px red solid;
        float:left;
    }
    #infopanel {
      background-color: lightgrey;
        border: 1px grey solid;
      float: right;
      width: 20%;
      height: 75vh;
      overflow:auto;
    }
    #legend {
      border: 1px grey solid;
      float: right;
      display: none;
    }
    .modal {
        display: none;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0,0,0);
        background-color: rgba(0,0,0,0.4);
    }
    .modal-content {
        background-color: #fefefe;
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
    }
    .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }

    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
    .listelement {
        border-style: solid;
        border-width: 2px;
        boder-color: #d3d3d3;
        width: 80%;
    }
    .listelement:hover {
        background-color: #d3d3d3;
        cursor: pointer;
    }
    .selection {
        border-style: solid;
        border-width: 2px;
        boder-color: #d3d3d3;
        width: 80%;
    }
    .selection:hover {
        background-color: #d3d3d3;
        cursor: pointer;
    }
    .header {
      font-weight: bold;
      background-color: rgba(0,0,0,0.16);
    }
    .dot {
      height: 15px;
      width: 15px;
      border-radius: 50%;
      display: inline-block;
}
</style>
