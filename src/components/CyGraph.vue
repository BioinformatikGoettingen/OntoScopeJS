<template>
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
        console.log("hier")
        console.log(onto_cls)
        console.log(onto_cls2)
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

    function add_data(onto_cls, cyInst) { // what is the diffence to the function above???
        cyInst.then(cy => {
            cy.add([{group: 'nodes', data: {
                    id: onto_cls.id,
                    label: onto_cls.label,
                    object: onto_cls
            }}]);
            console.log("adding parents for " + onto_cls.id)
            for (const parent_cls of onto_cls.parents) {
                console.log("parent " + parent_cls)
                // var parent_cls = new OntoCls(p); // TODO get parent should return OntoClass objects
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
                            content: "load object",
                            fillColor: 'green',
                            select: function (tmp) {
                                var json = tmp.json();
                                var object = json.data.object;
                                object.children();
                                console.log(object);
                                //console.log(object.getChildren());
                            }
                        },
                        {
                            content: 'get children',
                            fillColor: "blue",
                            //load children from node, cia the children getter
                            select: function (tmp) {
                                var json = tmp.json();
                                var object = json.data.object;
                                console.log(object.children)
                                for (const p of children) {
                                    var children_cls = new OntoCls(p); // set flag to fill object
                                    cy.add([{
                                        group: 'nodes',
                                        data: {id: children_cls.id, label: children_cls.label, object: children_cls}
                                    },
                                        {group: 'edges', data: {source: children_cls.id, target: object.id}}]);
                                }
                                ////http://js.cytoscape.org/#collection/layout
                                cy.layout({
                                    name: 'cose'
                                }).run()
                                var children2 = async () => {
                                    //maybe inside a async function, creating the nodes
                                    await object.children;

                                };
                                var test2 = children2
                                var test = object.oc_children
                                if (children2) {
                                    //console.log("children:")
                                    for (const p of children) {
                                        var children_cls = new OntoCls(p); // set flag to fill object
                                        cy.add([{
                                            group: 'nodes',
                                            data: {id: children_cls.id, label: children_cls.label, object: children_cls}
                                        },
                                            {group: 'edges', data: {source: children_cls.id, target: object.id}}]);
                                    }
                                    ////http://js.cytoscape.org/#collection/layout
                                    cy.layout({
                                        name: 'cose'
                                    }).run();
                                } else {
                                    console.log("no children to display!")
                                }
                                //console.log(object)
                                //load the children
                                //hier liegt ein widerspruch vor, deswegen muss auch zweimal geladen werden
                                //console.log(newobject.json)
                                //console.log(newobject.json.shell
                                //these are all children from the node

                                //  var onto_cls = new OntoCls(tmp);


                            }
                        },
                        {
                            content: 'show children',
                            select: async function (tmp) {
                                    var json = tmp.json();
                                    var data = json.data;
                                    var object = data.object;
                                    var children = await object.children;
                                console.log("children")
                                console.log(children)
                                    if(children.length > 0) {
                                        for (var children_cls of children) {
                                            console.log(children_cls.id )
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
                                        ////http://js.cytoscape.org/#collection/layout
                                        cy.layout({
                                            name: 'cose'
                                        }).run()
                                    }else {
                                        alert("no children to display")
                                    }
                            }
                        },

                        {
                            content: 'show object',
                            fillColor: 'pink',
                            select: async function (tmp) {
                                var json = tmp.json();
                                var data = json.data;
                                var object = data.object;
                                console.log(object);
                            }
                        }
                    ]
                });

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
                var searchedResult = await connector.search_for_class(searchString);
                add_searched_cls_to_graph(searchedResult[0], this.$cytoscape.instance, false)

            }
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
