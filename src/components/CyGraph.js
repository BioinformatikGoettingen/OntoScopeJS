import axios from 'axios'
import CyObj from '@/components/cy-object'
import cxtmenu from 'cytoscape-cxtmenu'
import OntoCls from './OntoCls'
import GenericConnector from "./GenericConnector"
import ontology_parser from "./ontology_parser"
import { get_color_of_node } from './TriboliumConnector'

let connector = new GenericConnector() //TODO make it dependent on the ontology

var urlParams = new URLSearchParams(window.location.search);

// load the config file from the url
var path = urlParams.get("config")
var configuration = ontology_parser.parse(path)
configuration.then(function(value){
  var loadedurl = value[0]['url'];
  var loadedlink = value[0]['link'];
})

//var connectorpath = urlParams.get("ontologypackage")
//var loadedconnector = ontology_parser.parse(connectorpath)



var devStageColor = []
var colors = ["#001f3f","#0074D9","#7FDBFF","#39CCCC","#3D9970","#2ECC40","#01FF70","#FFDC00","#FF851B","#FF4136","#85144b","#F012BE","#B10DC9","#111111","#AAAAAA","#DDDDDD"]

/* eslint-disable */
const config = {
    style: [
        {
            selector: "node",
            style: {
                "background-color": "data(color)",
                label: "data(label)",
                "height": 5,
                "width": 5,
                "font-size": 3
            }
        },
        {
            selector: "edge",
            style: {
                'curve-style': 'straight',
                width: 0.5,
                'target-arrow-shape': 'triangle',
                label: "data(label)",
                'text-rotation': 'autorotate',
                "font-size": 2,
                "text-margin-x" : 1,
                "text-margin-y" : 1,
                "arrow-scale": 0.4
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
        //tddotnode.style.backgroundColor = get_color_of_node(tddotnode);
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

    //first node plus parent added
    cyInst.then(cy => {
        cy.add([{group: 'nodes', data: {
                id: onto_cls.id,
                label: onto_cls.label,
                object: onto_cls,
                //color: devStageColor[devStage]
                color: get_color_of_node(onto_cls)
        }}]);

        for (const parent_cls of onto_cls.parents) {
          if(connector.ontoname == "tribolium") {
            var parentdev = tmp[parent_cls.id]
          }
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
            cy.on('tap', 'node', async function (event) {
              //delete existing elements
              var elements = document.getElementsByClassName("infopanelelement");
              while(elements.length > 0){
                  elements[0].parentNode.removeChild(elements[0]);
              }
              var node = event.target.json();
              var profile = document.getElementById("profile");
              var object = node.data.object;
              var json_object = await object.json;
              var json_result = [];
              for(var i in json_object) {
                json_result.push([i,json_object[i]])
              }
              var profile = document.getElementById("profile");

              for(var i = 1; i < json_result.length; i++) {
                if(json_result[i][0] == 'annotations') {
                  console.log(json_result)
                  var innerArrayLength = json_result[i][1].length;
                  for (var j = 0; j < innerArrayLength; j++) {
                    var temp = json_result[i][1][j];
                    if(!(temp.value === "")){
                      var header = document.createElement('p');
                      header.className += 'header infopanelelement';
                      if(!(temp.language === "")) {
                        var headernode = document.createTextNode(temp.name + "(" + temp.language + ")");
                      }else {
                        var headernode = document.createTextNode(temp.name);
                      }
                      header.appendChild(headernode);
                      profile.appendChild(header);
                      var text = document.createElement('p');
                      text.className += 'text infopanelelement';
                      var textnode = document.createTextNode(temp.value);
                      text.appendChild(textnode);
                      profile.appendChild(text);
                    }
                  }
                }
              }
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
                            var modal = document.getElementById("myModal");
                            var heading = document.getElementById("heading");
                            heading.innerHTML =  "Expand the Graph";
                            var subtitle = document.getElementById("subtitle");
                            subtitle.innerHTML = "Please select the relation to be added to the graph";
                            
                            //check if expand menu is needed
                            var children_exist = true;
                            var parent_exist = true;
                            var properties_exist = true;

                            if(children ==  null){
                              children_exist = false
                            }else if (children.length == 0 ){
                              children_exist = false
                            }
                            if(parent ==  null){
                              parent_exist = false
                            }else if (parent.length == 0 ){
                              parent_exist = false
                            }
                            if(properties ==  null){
                              properties_exist = false
                            }else if (properties.length == 0 ){
                              properties_exist = false
                            }
                            if(!children_exist && !parent_exist && !properties_exist) {
                              alert("nothing to expand")
                            }

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
            var heading = document.getElementById("heading");
            heading.innerHTML =  "SearchResult";
            var subtitle = document.getElementById("subtitle");
            subtitle.innerHTML = "Please select one ontology class to add to the graph";
            for(var i = 0; i< searchedResult.length; i++){
              var string = searchedResult[i].label;
              var node = document.createElement("div");
              var textnode2 = document.createTextNode(string);
               node.classList.add("selection");
               node.id = searchedResult[i].id
              node.appendChild(textnode2);
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
