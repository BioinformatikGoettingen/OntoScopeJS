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
    import cytoscape from '@/components/Cytoscape'
    //import config from '@/utils/dummy-config'
    import CyObj from '@/components/cy-object'
    import cxtmenu from 'cytoscape-cxtmenu'

    //load the class given as argument
    async function get_Cls(Cls) {
        try {
          var url = "http://oba.sybig.de";
          var ontology = "tribolium";
          var searchString = Cls.label;
          axios.defaults.headers = {
              'Accept': 'application/json'
          };
            var response  = await axios ({
                url: url + '/' + ontology + "/functions/basic/searchCls/" + searchString,
                method: "get",
                timeout: 8000
            })
            console.log(response.data)
            return response.data

        } catch (err) {
            console.log(err)
        }
        //return axios.get(url + '/' + ontology + "/functions/basic/searchCls/" + searchString);
        /*return  axios.get(url + '/' + ontology + "/functions/basic/searchCls/" + searchString)
           .then(function (response) {
               return response
           });*/

    }


    class Ontology_class {

        constructor(json) {
            this.json = json;
            this.oc_children = json.children;
            this.oc_annotations = json.annotations;
            this.oc_name = json.name;
            this.oc_namespace = json.namespace;
            this.oc_parents = json.parents;
            this.oc_shell = json.shell
            //var shell = this.json.shell
            //var children = this.json.children
        }

        get children() {

            if (!this.json.shell && this._children.length == 0) {
                return null;
            }
            if (this.json.shell) {
                this.fillCls(this)
            }
            return this.json.children
        }


        get id() {
            return this.json.name;
        }

        getChildren() {
            if (!this.oc_shell && this.oc_children.length == 0) {
                return null;
            }
            if (this.oc_shell) {
                this.fillCls()
                return this.oc_children
              //  this.fillCls().then( data => { return this.oc_children}
                //hier Promise.all mit getCls, fillCls, and fillWithTemplate
            }else {
                return this.oc_children
            }
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

        fillCls(){
            var data = get_Cls(this)
            this.fillWithTemplate(data)
        }
        // //here we now need to overwrite this.json data
        // fillCls() {
        //     var response = async function () {
        //         let newCls = await get_Cls(this).then(data => {
        //             var data2 = data.data
        //             this.fillWithTemplate(data2)})
        //     }
        //    let results = await Promise.all(get_Cls(this))
        //    this.fillWithTemplate(results)
        //     return results
        //
        //     get_Cls(this).then(data => {
        //         var data2 = data.data
        //         this.fillWithTemplate(data2)
        //     })
            //console.log(get_Cls(this))
            // get_Cls(this).then(data => {
            //    var data2 = data.data

            //this.fillWithTemplate(data2)
            // })
            fillClsWithStaticData(){

            var data2 =
                    {
                        "shell": false,
                        "name": "TrOn_0000007",
                        "namespace": "http://purl.org/obo/owlapi/tribolium.anatomy#",
                        "annotations": [
                            {
                                "language": "",
                                "name": "created_by",
                                "namespace": "http://purl.org/obo/owlapi/tribolium.anatomy#",
                                "value": "juergen"
                            },
                            {
                                "language": "",
                                "name": "xref",
                                "namespace": "http://www.geneontology.org/formats/oboInOwl#",
                                "value": "FBbt:00007000"
                            },
                            {
                                "language": "",
                                "name": "label",
                                "namespace": "http://www.w3.org/2000/01/rdf-schema#",
                                "value": "appendage"
                            },
                            {
                                "language": "",
                                "name": "creation_date",
                                "namespace": "http://purl.org/obo/owlapi/tribolium.anatomy#",
                                "value": "2011-05-10T02:30:33Z"
                            }
                        ],
                        "children": [
                            {
                                "shell": true,
                                "name": "TrOn_0000008",
                                "namespace": "http://purl.org/obo/owlapi/tribolium.anatomy#",
                                "annotations": [
                                    {
                                        "language": "",
                                        "name": "label",
                                        "namespace": "http://www.w3.org/2000/01/rdf-schema#",
                                        "value": "leg"
                                    },
                                    {
                                        "language": "",
                                        "name": "created_by",
                                        "namespace": "http://purl.org/obo/owlapi/tribolium.anatomy#",
                                        "value": "juergen"
                                    },
                                    {
                                        "language": "",
                                        "name": "creation_date",
                                        "namespace": "http://purl.org/obo/owlapi/tribolium.anatomy#",
                                        "value": "2011-05-10T02:31:26Z"
                                    }
                                ],
                                "children": [],
                                "parents": []
                            },
                            {
                                "shell": true,
                                "name": "TrOn_0000696",
                                "namespace": "http://purl.org/obo/owlapi/tribolium.anatomy#",
                                "annotations": [
                                    {
                                        "language": "",
                                        "name": "created_by",
                                        "namespace": "http://purl.org/obo/owlapi/tribolium.anatomy#",
                                        "value": "Daniela"
                                    },
                                    {
                                        "language": "",
                                        "name": "creation_date",
                                        "namespace": "http://purl.org/obo/owlapi/tribolium.anatomy#",
                                        "value": "2011-06-28T05:05:47Z"
                                    },
                                    {
                                        "language": "",
                                        "name": "label",
                                        "namespace": "http://www.w3.org/2000/01/rdf-schema#",
                                        "value": "gnathal_appendage"
                                    }
                                ],
                                "children": [],
                                "parents": []
                            },
                            {
                                "shell": true,
                                "name": "TrOn_0000697",
                                "namespace": "http://purl.org/obo/owlapi/tribolium.anatomy#",
                                "annotations": [
                                    {
                                        "language": "",
                                        "name": "created_by",
                                        "namespace": "http://purl.org/obo/owlapi/tribolium.anatomy#",
                                        "value": "Daniela"
                                    },
                                    {
                                        "language": "",
                                        "name": "label",
                                        "namespace": "http://www.w3.org/2000/01/rdf-schema#",
                                        "value": "procephalic_appendage"
                                    },
                                    {
                                        "language": "",
                                        "name": "creation_date",
                                        "namespace": "http://purl.org/obo/owlapi/tribolium.anatomy#",
                                        "value": "2011-06-28T05:05:47Z"
                                    }
                                ],
                                "children": [],
                                "parents": []
                            },
                            {
                                "shell": true,
                                "name": "TrOn_0000328",
                                "namespace": "http://purl.org/obo/owlapi/tribolium.anatomy#",
                                "annotations": [
                                    {
                                        "language": "",
                                        "name": "creation_date",
                                        "namespace": "http://purl.org/obo/owlapi/tribolium.anatomy#",
                                        "value": "2011-06-09T08:18:24Z"
                                    },
                                    {
                                        "language": "",
                                        "name": "created_by",
                                        "namespace": "http://purl.org/obo/owlapi/tribolium.anatomy#",
                                        "value": "Daniela"
                                    },
                                    {
                                        "language": "",
                                        "name": "label",
                                        "namespace": "http://www.w3.org/2000/01/rdf-schema#",
                                        "value": "wing"
                                    }
                                ],
                                "children": [],
                                "parents": []
                            }
                        ],
                        "parents": [
                            {
                                "shell": true,
                                "name": "TrOn_0000006",
                                "namespace": "http://purl.org/obo/owlapi/tribolium.anatomy#",
                                "annotations": [
                                    {
                                        "language": "",
                                        "name": "created_by",
                                        "namespace": "http://purl.org/obo/owlapi/tribolium.anatomy#",
                                        "value": "juergen"
                                    },
                                    {
                                        "language": "",
                                        "name": "creation_date",
                                        "namespace": "http://purl.org/obo/owlapi/tribolium.anatomy#",
                                        "value": "2011-05-10T02:29:55Z"
                                    },
                                    {
                                        "language": "",
                                        "name": "label",
                                        "namespace": "http://www.w3.org/2000/01/rdf-schema#",
                                        "value": "organism subdivision"
                                    }
                                ],
                                "children": [],
                                "parents": []
                            }
                        ]
                    }
                    return data2
        }
        //     get_Cls(this).then(data => {
        //         var data2 = data.data
        //         this.fillWithTemplate(data2)
        //     });
        //
        // }


        /*
        })*/


        fillWithTemplate(data) {
            this.oc_children = data.entities[0].children;
            this.oc_parents = data.entities[0].parents;
            this.oc_shell = data.entities[0].shell;
            this.oc_annotations = data.entities[0].annotations;
            this.oc_name = data.entities[0].name;
            this.oc_namespace = data.entities[0].namespace;
            this.json = data.entities[0]
        }
        fillWithTemplate2(data) {
            this.oc_children = data.children;
            this.oc_parents = data.parents;
            this.oc_shell = data.shell;
            this.oc_annotations = data.annotations;
            this.oc_name = data.name;
            this.oc_namespace = data.namespace;
            this.json = data
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

    function add_first(json_response, cy) {
        //temporary function to add the first node, will be replaced by a selection list
        //console.log("add first node from search result")
        if (json_response.status !== 200 || json_response.data.entities.length < 1) {
            console.log("no entities found");
            return;
        }
        var onto_cls = new Ontology_class(json_response.data.entities[0]);
        console.log(onto_cls);
        add_data(onto_cls, cy);


    }

    function add_node_with_parents(onto_cls, cyInst) {
        //todo check if node is already in graph.

        cyInst.then(cy => {
            cy.add([{
                group: 'nodes',
                data: {id: onto_cls.id, label: onto_cls.label, children: onto_cls.json.children, data: onto_cls}
            }]);
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

    function add_data(onto_cls, cyInst) {
        cyInst.then(cy => {
            cy.add([{group: 'nodes', data: {id: onto_cls.id, label: onto_cls.label, object: onto_cls}}]);
            for (const p of onto_cls.json.parents) {
                var parent_cls = new Ontology_class(p); // set flag to fill object
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
            for (const p of onto_cls.json.children) {
                var children_cls = new Ontology_class(p); // set flag to fill object
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
                let menu = cy.cxtmenu({
                    selector: 'node',
                    commands: [
                        {
                            content: "load object",
                            fillColor: 'green',
                            select: function (tmp) {
                                var json = tmp.json();
                                var object = json.data.object;
                                object.getChildren();
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
                                var children = object.getChildren();
                                var children2 = async () => {
                                    await  object.getChildren();
                                };
                                var test2 = children2
                                var test = object.oc_children
                                if (children2) {
                                    //console.log("children:")
                                    for (const p of children) {
                                        var children_cls = new Ontology_class(p); // set flag to fill object
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

                                //  var onto_cls = new Ontology_class(tmp);


                            }
                        },
                        {
                            content: 'show object',
                            select: function (tmp) {
                                var json = tmp.json();
                                var data = json.data;
                                var object = data.object;
                                console.log(object)
                            }
                        },

                        {
                            content: 'get children length',
                            select: function (tmp) {
                                var json = tmp.json();
                                var data = json.data;
                                var object = data.object;
                                var children = object.getChildren();
                                var length = children.length
                                var test = "12"
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
            search_for_class(searchString, url = "http://oba.sybig.de", ontology = "tribolium") {
                console.log(this.$refs);
                axios.defaults.headers = {
                    'Accept': 'application/json'
                };
                var cy = this.$cytoscape.instance;
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
