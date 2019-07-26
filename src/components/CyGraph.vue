<template>
    <div id="holder">
        <cytoscape
                :key="'cyKey()'"
                :config="config"
                :preConfig="preConfig"
                :afterCreated="afterCreated"
                :debug="true"
        />
        <input id ="searchClass" v-model="searchTerm" v-on:keyup.enter="search_for_class(searchTerm)"/>
        <button  id ="searchClassButton" v-on:click="search_for_class(searchTerm)" ref="mybutton">Search</button>

    </div>
</template>

<script>
    import axios from 'axios'
    import cytoscape from '@/components/Cytoscape'
    //import config from '@/utils/dummy-config'
    import CyObj from '@/components/cy-object'
    import cxtmenu from 'cytoscape-cxtmenu'


    class Ontology_class {

        constructor(json) {
            this.json = json;
        }

        get children() {

        }

        get id() {
            return this.json.name;
        }

        get label() {
            // later on switch between name of the class or label annotation
            // also switch language
            //
            for (var anno of this.json.annotations) {
                if (anno.name === 'label') {
                    //this.label = anno.value;
                    return anno.value;
                }
            }
            return this.json.name;
        }

        get name() {
          return this.json.label;
        }
    }

    /* eslint-disable */
    const config = {
        style: [
            {
                selector: "node",
                style: {
                    "background-color": "#666",
                    label: "data(id)"
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

    function add_first(json_response, cy, children = false) {
        //temporary function to add the first node, will be replaced by a selection list
        //console.log("add first node from search result")
        if (json_response.status !== 200 || json_response.data.entities.length < 1) {
            console.log("no entities found")
            return;
        }
        var onto_cls = new Ontology_class(json_response.data.entities[0]);
        if(children) {
          add_node_with_children(onto_cls, cy);
        }else {
          add_node_with_parents(onto_cls, cy);
        }

    }

    function add_node_with_parents(onto_cls, cyInst) {
        //todo check if node is already in graph.

        cyInst.then(cy => {
            cy.add([{group: 'nodes', data: {id: onto_cls.id, label: onto_cls.label,  children: onto_cls.json.children, data: onto_cls}}]);
            for (const p of onto_cls.json.parents) {
                var parent_cls = new Ontology_class(p); // set flag to fill object
                //var searchString = parent_cls.label
                cy.add([{group: 'nodes', data: {id: parent_cls.id, label: parent_cls.label, data: parent_cls}},
                    {group: 'edges', data: {source: parent_cls.id, target: onto_cls.id}}]);
            }
            cy.layout({
                name: 'cose'
            }).run();
        })
    }

    function add_node_with_children(onto_cls,cyInst) {
      cyInst.then(cy => {
        cy.add([{group:'nodes', data: {id:onto_cls.id, label: onto_cls.label, creation: onto_cls.created_by}}]);
        for (const p of onto_cls.json.children) {
          var children_cls = new Ontology_class(p); // set flag to fill object
          //load data
          // Problem: kein zugriff auf die daten
        //  var children_cls_data = load_node(children_cls.label)
          cy.add([{group: 'nodes', data: {id: children_cls.id, label: children_cls.label, data: children_cls_data , children: children_cls}},
              {group: 'edges', data: {source: children_cls.id, target: onto_cls.id}}]);

        }
        cy.layout({
          name:"cose"
        }).run();
      })
    }



    function load_node(searchString, url = "http://oba.sybig.de", ontology = "tribolium") {
          var strr = [];
          axios.defaults.headers = {
              'Accept': 'application/json'
          }
          axios.get(url + '/' + ontology + "/functions/basic/searchCls/" + searchString)
              .then(function (response) {
              strr.push(response.data.entities[0])

              });
              return strr;
    }

    function testneu() {
      return "yes"
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
          //  cytoscape
        },
        methods: {
            preConfig(cytoscape) {
                console.log("calling pre-config");
                cytoscape.use(cxtmenu);

            },
            afterCreated(cy) {
              console.log(cy)
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
                  var node = event.target.json()
                  console.log(node.data.data)
                })
                //if nodes need different context menue, we need to create a cy.cxtmenu for each type of node
                let menu = cy.cxtmenu({selector: 'node',
                    commands: [
                    {
                        content: "load node",
                        fillColor: 'green',
                        select: function(tmp) {
                            var label = tmp.json()
                            var name = label.data.label
                            var test = new Ontology_class(load_node(name));
                            console.log(test)

                        }
                    },
                    {
                        content: 'get children',
                        fillColor: "blue",
                        select: function(tmp) {
                          var label = tmp.json();
                          var children = label.data.children;
                          var data = label.data.data;
                          console.log("data:")
                          console.log(data);
                          //these are all children from the node
                          if(children) {
                            //console.log("children:")
                            //console.log(children)
                            children.forEach(function(element){
                              //console.log(element.name)
                              })
                            for (const p of children) {
                              var children_cls = new Ontology_class(p); // set flag to fill object
                                cy.add([{group: 'nodes', data: {id: children_cls.id, label: children_cls.label, json: children_cls}},
                                    {group: 'edges', data: {source: children_cls.id, target: label.data.id}}]);
                                    console.log(children_cls.label);
                            }
                            cy.layout({
                                name: 'cose'
                                }).run();
                          }else {
                            console.log("no children to display!")
                          }
                        //  var onto_cls = new Ontology_class(tmp);



                        }
                    },
                    {
                        content: 'name',
                        select (tmp) {
                        var label = tmp.json()
                        console.log(label.data.label)               }
                    },
                    {
                    content: 'get data',
                    select (tmp) {
                      var data = tmp.json()
                      console.log(data)
                    }
                    }
                    ]
                })

                //cy.cxtmenu({selector: 'core',
                  //  commands: [
                  //  {
                    //    content: 'bg1',
                      //  select () {
                        //    console.log('bg1')
                        //}
                    //},
                      //  {
                        //    content: 'bg2',
                          //  select () {
                            //    console.log('bg2')
                            //}
                        //}
                    //]
                //})
                //cy.cxtmenu({selector: 'edge',
                  //  commands: [
                  //  {
                    //    content: 'edgemenue',
                      //  select () {
                        //    console.log('bg1')
                        //}
                    //}
                    //]
                //})
                this.setCyElements(cy);
                // the default values of each option are outlined below:

            },
            cyKey () {
                console.log("-------- cyKey")
                const that = this
                CyObj.reset()
                CyObj.instance.then(cy => {
                    console.log('cy', cy)
                    cy.on('tap', event => {
                        console.log('tapped')
                        that.i++
                    })
                })
                console.log('computing cyKey cy' + this.i)
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
            search_for_class(searchString, url = "http://oba.sybig.de", ontology = "tribolium") {
                console.log(this.$refs);
                axios.defaults.headers = {
                    'Accept': 'application/json'
                }
                var cy = this.$cytoscape.instance
                axios.get(url + '/' + ontology + "/functions/basic/searchCls/" + searchString)
                    .then(function (response) {

                        add_first(response, cy, false);
                    });
            },
            test2() {
            console.log("test")
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

    /*#app {*/
    /*font-family: "Avenir", Helvetica, Arial, sans-serif;*/
    /*-webkit-font-smoothing: antialiased;*/
    /*-moz-osx-font-smoothing: grayscale;*/
    /*text-align: left;*/
    /*color: #2c3e50;*/
    /*margin-top: 60px;*/
    /*}*/
</style>
