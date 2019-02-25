<template>
    <div id="holder">
        <cytoscape
                :config="config"
                :preConfig="preConfig"
                :afterCreated="afterCreated"
                :debug="true"
        />
        <input v-model="searchTerm" v-on:keyup.enter="search_for_class(searchTerm)"></input>
        <button v-on:click="search_for_class(searchTerm)">Search</button>

    </div>
</template>

<script>
    import axios from 'axios'

    class Ontology_class {

        constructor(json) {
            this.json = json;
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
        if (json_response.status !== 200 || json_response.data.entities.length < 1) {
            console.log("no entities found")
            return;
        }
        console.log(cy)
        var onto_cls = new Ontology_class(json_response.data.entities[0]);
        //console.log(onto_cls);
        add_node_with_parents(onto_cls, cy);
    }

    function add_node_with_parents(onto_cls, cyInst) {
        //todo check if node is already in graph.
        cyInst.then(cy => {
            cy.add([{group: 'nodes', data: {id: onto_cls.id, label: onto_cls.label}}]);
            for (const p of onto_cls.json.parents) {

                var parent_cls = new Ontology_class(p); // set flag to fill object
                cy.add([{group: 'nodes', data: {id: parent_cls.id, label: parent_cls.label, json: parent_cls}},
                    {group: 'edges', data: {source: parent_cls.id, target: onto_cls.id}}]);
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
                searchTerm: ""
            };
        },
        methods: {
            preConfig(cytoscape) {
                console.log("calling pre-config");
            },
            afterCreated(cy) {
                console.log("after created");
                cy.on("dragfree", "node", evt => this.setCyElements(cy));
                this.setCyElements(cy);
            },
            setCyElements(cy) {
                console.log("setCyElements");
                let cytoElems = [
                    // {
                    //     // node a
                    //     data: {id: "a"},
                    //     position: {x: 100, y: 100}
                    // },
                    // {
                    //     // node b
                    //     data: {id: "b"},
                    //     position: {x: 200, y: 100}
                    // },
                    // {
                    //     // edge ab
                    //     data: {id: "ab", source: "a", target: "b"}
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
                axios.defaults.headers = {
                    'Accept': 'application/json'
                }
                var cy = this.$cytoscape.instance
                axios.get(url + '/' + ontology + "/functions/basic/searchCls/" + searchString)
                    .then(function (response) {

                        add_first(response, cy);
                    });
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
