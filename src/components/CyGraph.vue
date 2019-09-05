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
    import GenericConnector from "./GenericConnector";  //TODO move to GenericConnecotr


    let connector = new GenericConnector() //TODO make it dependent on the ontology






    /* eslint-disable */
    const config = {
        style: [
            {
                selector: "node",
                style: {
                    "background-color": "#666",
                    label: "data(label)"
                }
            },
            {
                selector: "edge",
                style: {
                    width: 3,
                    "line-color": "#ccc",
                    "target-arrow-color": "#ccc",
                    "target-arrow-shape": "triangle"
                }
            }
        ]
    };

    function add_searched_cls_to_graph(json_response, cy) {
        //temporary function to add the first node, will be replaced by a selection list
        //console.log("add first node from search result")
        // if (json_response.status !== 200 || json_response.data.entities.length < 1) {
        //     console.log("no entities found");
        //     return;
        // }
        var onto_cls2 = new OntoCls(json_response.json);
        var onto_cls = json_response
        add_data(onto_cls, cy);


    }

    function add_node_with_parents(onto_cls, cyInst) {
        //todo check if node is already in graph.

        cyInst.then(cy => {
            cy.add([{
                group: 'nodes',
                data: {id: onto_cls.id, label: onto_cls.label, children: onto_cls.json.children, data: onto_cls}
            }]);
            for (const parent of onto_cls.parents) {
                //var parent_cls = new OntoCls(p); // set flag to fill object
                //var searchString = parent_cls.label
                cy.add([{group: 'nodes', data: {id: parent_cls.id, label: parent_cls.label, data: parent_cls}},
                    {group: 'edges', data: {source: parent_cls.id, target: onto_cls.id}}]);
            }
            cy.layout({
                name: 'cose'
            }).run();
        })
    }

    async function add_data(onto_cls, cyInst) { // what is the diffence to the function above???
        cyInst.then(cy => {
            cy.add([{group: 'nodes', data: {
                    id: onto_cls.id,
                    label: onto_cls.label,
                    object: onto_cls
            }}]);
            console.log("adding parents for " + onto_cls.id)
            console.log(onto_cls)

            for (const parent_cls of onto_cls.parents) {
              console.log("test")
              console.log(parent_cls)
              //var parent_cls =  connector.createNewOntoCs(parent_cls)
                //var parent_cls = new OntoCls(parent_cls); // TODO get parent should return OntoClass objects
                //var searchString = parent_cls.label
                cy.add([{group: 'nodes', data: {id: parent_cls.id, label: parent_cls.label, object: parent_cls}},
                    {group: 'edges', data: {source: parent_cls.id, target: onto_cls.id}}]);
            }
            cy.layout({
                name: 'cose'
            }).run();
        })
    }

    function add_node_with_children(onto_cls, cyInst) {
        cyInst.then(cy => {
            cy.add([{group: 'nodes', data: {id: onto_cls.id, label: onto_cls.label, creation: onto_cls.created_by}}]);
            for (const children_cls of onto_cls.json.children) {
                //var children_cls = new OntoCls(p); // set flag to fill object
                //load data
                // Problem: kein zugriff auf die daten
                //  var children_cls_data = load_node(children_cls.label)
                cy.add([{
                    group: 'nodes',
                    data: {
                        id: children_cls.id,
                        label: children_cls.label,
                        data: children_cls_data,
                        children: children_cls
                    }
                },
                    {group: 'edges', data: {source: children_cls.id, target: onto_cls.id}}]);

            }
            cy.layout({
                name: "cose"
            }).run();
        })
    }


    /*function load_node(searchString, url = "http://oba.sybig.de", ontology = "tribolium") {
          var strr = [];
          axios.defaults.headers = {
              'Accept': 'application/json'
          };
          axios.get(url + '/' + ontology + "/functions/basic/searchCls/" + searchString)
              .then(function (response) {
              strr.push(response.data.entities[0])

              });
              return strr;
    }*/

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
            //  cytoscape
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
                //     // if you are using vuex you can dispatch your events this way
                //     console.log(event.originalEvent.clientX) ;
                //     menu2.open(event.originalEvent, menu2)
                //
                // })
                cy.on('tap', 'node', function (event) {
                    var node = event.target.json();
                    console.log(node.data.object)
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
                                //https://vuejs.org/v2/examples/modal.html
                                //https://stackoverflow.com/questions/35785997/custom-popup-window
                                //create modal

                              //children
                              var children = await object.children;
                              console.log(children)
                              if(children == null){
                                alert("no children to display")
                              }else  if(children.length > 0) {
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
                                }
                               document.getElementById("children").onclick = function() {
                                   for (var children_cls of children) {
                                       cy.add([{
                                           group: 'nodes',
                                           data: {
                                               id: children_cls.id,
                                               label: children_cls.label,
                                               object: children_cls
                                           }
                                       },
                                           {group: 'edges', data: {source: children_cls.id, target: object.id}}]);
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


                               //parent
                               var parent = await object.parents;
                               console.log(parent)
                               if(parent == null){
                                 alert("no parent available")
                               }else  if(parent.length > 0) {
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
                                 }

                                 document.getElementById("parent").onclick = function() {
                                         console.log(parent[0].id)
                                         cy.add([{
                                             group: 'nodes',
                                             data: {
                                                 id: parent[0].id,
                                                 label: parent[0].label,
                                                 object: parent[0]
                                             }
                                         },
                                             {group: 'edges', data: {source: parent[0].id, target: object.id}}]);

                                     cy.layout({
                                         name: 'cose'
                                     }).run()
                                     modal.style.display = "none";
                                     var elements = document.getElementsByClassName("listelement");
                                         while(elements.length > 0){
                                             elements[0].parentNode.removeChild(elements[0]);
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
                        },
                        {
                          content: 'delete node',
                          fillColor: 'red',
                          select: function (tmp) {
                            tmp.remove()
                          }
                        },

                        {
                            content: 'get parent',
                            fillColor: 'pink',
                            select: async function (tmp) {
                                var json = tmp.json();
                                var data = json.data;
                                var object = data.object;
                                var parent = await object.parents
                                console.log(parent.length)
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
                    //{
                    // node a
                    // data: {id: "a"},
                    //position: {x: 100, y: 100}
                    //},
                    //{
                    // node b
                    //data: {id: "b"},
                    //position: {x: 200, y: 100}
                    //},
                    //{
                    // edge ab
                    //data: {id: "ab", source: "a", target: "b"}
                    // }
                ];
                cy.startBatch();
                cy.elements().remove();
                for (let el of cytoElems) {
                    cy.add(el);
                }
                cy.endBatch();
                cy.fit();
            },
            async search_for_class(searchString, url = "http://oba.sybig.de", ontology = "tribolium") {
                var searchedResult = await connector.first_search(searchString);
                var cytoscape = this.$cytoscape.instance;
                if(searchedResult.length == 1) {
                  var cls = searchedResult[0]
                  console.log("cls")
                  console.log(cls)
                  add_data(cls, cytoscape, false)
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
                    elements[i].onclick = function() {
                      var id = event.srcElement.id
                      var cls = searchedResult.find(function(element) {
                        return element.oc_name == id
                      })
                      console.log("cls")
                      console.log(cls)
                      add_data(cls, cytoscape, false)
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
        width: 600px;
        height: 600px;
        border: 1px red solid;
    }
    .modal {
        display: none; /* Hidden by default */
        position: fixed; /* Stay in place */
        z-index: 1; /* Sit on top */
        left: 0;
        top: 0;
        width: 100%; /* Full width */
        height: 100%; /* Full height */
        overflow: auto; /* Enable scroll if needed */
        background-color: rgb(0,0,0); /* Fallback color */
        background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    }

    /* Modal Content/Box */
    .modal-content {
        background-color: #fefefe;
        margin: 15% auto; /* 15% from the top and centered */
        padding: 20px;
        border: 1px solid #888;
        width: 80%; /* Could be more or less, depending on screen size */
    }

    /* The Close Button */
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
    /*#app {*/
    /*font-family: "Avenir", Helvetica, Arial, sans-serif;*/
    /*-webkit-font-smoothing: antialiased;*/
    /*-moz-osx-font-smoothing: grayscale;*/
    /*text-align: left;*/
    /*color: #2c3e50;*/
    /*margin-top: 60px;*/
    /*}*/
</style>
