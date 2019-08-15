export default class OntoCls {

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