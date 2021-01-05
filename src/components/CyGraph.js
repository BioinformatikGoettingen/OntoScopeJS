import CyObj from '@/components/cy-object'
import cxtmenu from 'cytoscape-cxtmenu'
import History from "./History"
import Legend from "./Legend"
// npm install dom-to-image
import domtoimage from "dom-to-image"
import store from "../store"


let session_history = new History()
let session_legend = new Legend()

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
                'curve-style': 'bezier',
                "control-point-step-size":5,
                "line-color": "data(color)",
                "target-arrow-color":"data(color)",
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

  await onto_cls.fillCls();

  var addednodes = []
  var tmp = [] ;
  var parents = await onto_cls.parents;
  if(parents != null){
    for (const parent_cls of parents) {
      await parent_cls.fillCls()
      //wenn man die farbe hat, hat man auch die kategorie

      var color_cat = await parent_cls.get_color_cat()

      var parentColor = await parent_cls.get_color()
      tmp[parent_cls.id] = parentColor;
      
      session_legend.add_node_to_legend(color_cat,parentColor)
    
    }
  }
  
  var color = await onto_cls.get_color()
  var color_cat = await onto_cls.get_color_cat()
  session_legend.add_node_to_legend(color_cat,color)

    //first node plus parent added
  cyInst.then(cy => {
    cy.add([{group: 'nodes', data: {
            id: onto_cls.id,
            label: onto_cls.label,
            object: onto_cls,
            color: color
    }}]);
    addednodes.push(onto_cls.id)
    if(parents != null) {
      for (const parent_cls of onto_cls.parents) {
        //vielleicht hier auch eher die onto_cls fragen
        var genericCallback = store.state.connectorArray[0].get_edge_color("subclass")
        var prev_callback = genericCallback
        for(var i = 1; i < store.state.connectorArray.length; i++) {
          var pluginCallback = store.state.connectorArray[i].get_edge_color("subclass",prev_callback)
          var prev_callback = pluginCallback
        }
        session_legend.add_edge_to_legend("subclass",prev_callback)
  
        cy.add([{group: 'nodes', data: {id: parent_cls.id, label: parent_cls.label, object: parent_cls,color:tmp[parent_cls.id]}},
          {group: 'edges', data: {id: parent_cls.id+"to"+onto_cls.id+"by"+"subclass",source: parent_cls.id, target: onto_cls.id, label: "subclass",color:prev_callback}}])
          addednodes.push(parent_cls.id)
      }
    }
    // get all nodes that have been added
    var strings= ""
    for(var node of addednodes) {
      console.log(node)
      var string = "#"+node + ","
      strings = strings + string
      
    }
    console.log(strings)
    cy.$(strings).layout({
      name: 'cose'
  }).run()
  
    session_history.add_to_list(cy,cy.json(),onto_cls.oc_label,"search")
    
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
      var cy = this
      store.dispatch("loadConnector").then(function(test) {
        cy.load_class_from_url()
      })
      var element = document.createElement("button")
      
      
      
      cytoscape.use(cxtmenu);
    },
    afterCreated: function (cy) {
    let menu;
    let menu2 = this.$refs.menu;
    var bvModal = this.$bvModal
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
      //console.log(json_object)
      var json_result = [];
      for(var i in json_object) {
        json_result.push([i,json_object[i]])
      }
      var profile = document.getElementById("profile");

      for(var i = 1; i < json_result.length; i++) {
        if(json_result[i][0] == 'annotations') {
          //console.log(json_result)
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
                  var loadednodes = []
                  var properties = await object.properties;
                  var children = await object.children;
                  var parent = await object.parents;
                  await bvModal.show("Modal")
                  
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
                    if(properties != null){

                      for (var properties_cls of properties) {
                        if(!propertytype.includes(properties_cls.property.name)){
                          propertytype.push(properties_cls.property.name)
                        }
                      }

                      for(var type of propertytype){
                        var nodes_of_type = []
                        for(var prop  of properties){
                          if(prop.property.name === type){
                            nodes_of_type.push(prop)
                            //nodes_of_type.push(prop.target)
                          }
                        }

                        var string = "load "+ type + "(" + nodes_of_type.length + ")";
                        var node = document.createElement("div");
                        var textnode = document.createTextNode(string);
                        node.id = type
                        node.className += "listelement"
                        node.appendChild(textnode);
                        document.getElementById("ResultModal").appendChild(node);

                        // hier dann node erstellen
                        // HIER PROBLEM MIT nodes_of_type : WIRD ÜBERSCHRIEBEN! Hier muss nochmal ein array erstellt werden
                        document.getElementById(type).onclick = async function(tmp) {
                          var selectednodes = []
                          
                          for(var prop  of properties){
                            if(prop.property.name === tmp.target.id){
                              selectednodes.push(prop)
                            }
                          }
                          for (var property_cls of selectednodes) {
                            
                            await property_cls.target.fillCls()

                            var color_cat = await property_cls.target.get_color_cat()
                            var propertyColor = await property_cls.target.get_color()
                            session_legend.add_node_to_legend(color_cat,propertyColor)

                            var genericCallback = store.state.connectorArray[0].get_edge_color(tmp.target.id)
                            var prev_callback = genericCallback
                            for(var i = 1; i < store.state.connectorArray.length; i++) {
                              var pluginCallback = store.state.connectorArray[i].get_edge_color(tmp.target.id,prev_callback)
                              var prev_callback = pluginCallback
                            }
                            session_legend.add_edge_to_legend(tmp.target.id,prev_callback)
                            var group = [{
                              group: 'nodes',
                              data: {
                                  id: property_cls.target.id,
                                  label: property_cls.target.label,
                                  object: property_cls.target,
                                  color: propertyColor
                              }
                          },
                          {group: 'edges', data: {id: object.id+"to"+property_cls.target.id+"by"+tmp.target.id,source: object.id, target: property_cls.target.id, label: tmp.target.id,color:prev_callback}}];
                          cy.add(group)
                          cy.layout({
                            name: 'cose'
                        }).run()
                          //loadednodes.push(group[0].data.id)
                        }

                        //for(var i = 0; i < loadednodes.length; i++) {
                         // loadednodes[i] = '#' + loadednodes[i]
                       // }
                        //var allnodes = loadednodes.join(', ')

                       // cy.$(allnodes).layout({ name: 'cose',fit: false,randomize: true}).run();

                        session_history.add_to_list(cy,cy.json(),object.oc_label,"add")
                        await bvModal.hide("Modal")
                        
                        //var elements = document.getElementsByClassName("listelement");
                       // while(elements.length > 0){
                         //   elements[0].parentNode.removeChild(elements[0]);
                        //}
                      }
                    }
                  }

                //children
                if(children != null){
                  if(children.length > 0) {
                  
                    var string = "load children (" + children.length + ")";
                    var node = document.createElement("div");
                    var textnode = document.createTextNode(string);
                    node.id = "children"
                    node.className += "listelement"
                    node.appendChild(textnode);
                    document.getElementById("ResultModal").appendChild(node);

                  document.getElementById("children").onclick = async function() {
                    for (var children_cls of children) {
                      await children_cls.fillCls()
                      var color_cat = await children_cls.get_color_cat()
                      var childenColor = await children_cls.get_color()
                      session_legend.add_node_to_legend(color_cat,childenColor)

                      var genericCallback = store.state.connectorArray[0].get_edge_color("is a")
                      var prev_callback = genericCallback
                      for(var i = 1; i < store.state.connectorArray.length; i++) {
                        var pluginCallback = store.state.connectorArray[i].get_edge_color("is a",prev_callback)
                        var prev_callback = pluginCallback
                      }


                      session_legend.add_edge_to_legend("is a",prev_callback)
                      
                      cy.add([{
                            group: 'nodes',
                            data: {
                                id: children_cls.id,
                                label: children_cls.label,
                                object: children_cls,
                                //color: color3
                                color: childenColor
                            }
                        },
                            {group: 'edges', data: {id: children_cls.id+"to"+object.id+"by"+"is_a",source: children_cls.id, target: object.id, label: "is a",color:prev_callback}}]);
                            cy.layout({
                              name: 'cose'
                          }).run()
                    }
                    
                    session_history.add_to_list(cy,cy.json(),object.oc_label,"add")
                    await bvModal.hide("Modal")    
                }
                  }
                }
                  //parent
                if(parent != null) {
                    if(parent.length > 0 ) {
                        var string = "load parent (" + parent.length + ")";
                        var node = document.createElement("div");
                        var textnode = document.createTextNode(string);
                        node.id = "parent"
                        node.className += "listelement"
                        node.appendChild(textnode);
                        document.getElementById("ResultModal").appendChild(node);

                    document.getElementById("parent").onclick = async function() {
                      for(var parent_cls of parent) {
                        await parent_cls.fillCls()
                        var color_cat = await parent_cls.get_color_cat()
                        var parentColor = await parent_cls.get_color()
                        session_legend.add_node_to_legend(color_cat,parentColor)

                        var genericCallback = store.state.connectorArray[0].get_edge_color("subclass")
                        var prev_callback = genericCallback
                        for(var i = 1; i < store.state.connectorArray.length; i++) {
                          var pluginCallback = store.state.connectorArray[i].get_edge_color("subclass",prev_callback)
                          var prev_callback = pluginCallback
                        }

                        session_legend.add_edge_to_legend("subclass",prev_callback)
                        cy.add([{
                            group: 'nodes',
                            data: {
                                id: parent_cls.id,
                                label: parent_cls.label,
                                object: parent_cls,
                                color: parentColor
                            }
                        },
                            {group: 'edges', data: {id:parent_cls.id+"to"+object.id+"by"+"subclass",source: parent_cls.id, target: object.id, label: "subclass",color:prev_callback}}]);
                            cy.layout({
                              name: 'cose'
                            }).run()
                          }

                        
                        session_history.add_to_list(cy,cy.json(),object.oc_label,"add")
                        await bvModal.hide("Modal")
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
              if(cy.$(':selected').length  > 1) {
                cy.$(':selected').remove()
                tmp.remove()
                session_history.add_to_list(cy,cy.json(),"multiple deletion","delete")
              } else if(cy.$(':selected').length  == 1) {
                if (tmp.json().data.object.id == cy.$(":selected").json().data.object.id) {
                  tmp.remove()
                  session_history.add_to_list(cy,cy.json(),tmp.json().data.object.oc_label,"delete")
                } else {
                  cy.$(':selected').remove()
                  tmp.remove()
                  session_history.add_to_list(cy,cy.json(),"multiple deletion","delete")
                }
              } else {
                tmp.remove()
                session_history.add_to_list(cy,cy.json(),tmp.json().data.object.oc_label,"delete")
              }

              
              

            }
          },
        ]
    });

    this.setCyElements(cy);
    // the default values of each option are outlined below:
    },
    cyKey() {
        //console.log("-------- cyKey");
        const that = this;
        CyObj.reset();
        CyObj.instance.then(cy => {
            //console.log('cy', cy);
            cy.on('tap', event => {
                //console.log('tapped');
                that.i++
            })
        });
        //console.log('computing cyKey cy' + this.i);
        return 'cy' + this.i
    },
    setCyElements(cy) {
        //console.log("setCyElements");
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
    async search_for_class(searchString) {
      var searchedResult = await store.state.connectorArray[0].search_for_class(searchString);
      var cytoscape = this.$cytoscape.instance;
      var check_for_results = false
      var result_counter = 0
      for(var onto in searchedResult){
        result_counter += searchedResult[onto].length
      }
      if(result_counter == 0) {
        alert("no results found")
      }else if(result_counter == 1) {
        for(var onto in searchedResult){
          if(searchedResult[onto].length == 1) {
            var cls = searchedResult[onto][0]
            cls.fillCls();
            add_data(cls, cytoscape)
          }
        }
      }else {
        var bvModal = this.$bvModal
        await bvModal.show("Modal")
       
        var holder = document.getElementById("ResultModal")
        
        for(onto in searchedResult) { 
          //shorten url for button
          var label = onto
          if(label.length > 50) {
            label = "..."+ label.substring(label.length-47,label.length)
          }
          var element = document.createElement("button")
          element.className = "btn btn-primary ontologybutton"
          element.style.margin =" 3px 3px"
          element.style.width = "100%"
          element.id = onto
          element.title = onto
          element.innerHTML = element.value =label

          holder.appendChild(element)

          for(var i = 0; i< searchedResult[onto].length; i++){

            var string = searchedResult[onto][i].label;
            var node = document.createElement("div");
            var textnode2 = document.createTextNode(string);
            node.classList.add("selection");
            node.classList.add("result"+onto);
            node.id = searchedResult[onto][i].id
            node.appendChild(textnode2);
            node.style.display = 'none'
            document.getElementById("ResultModal").appendChild(node);
  
          }
         
          
        }

        var element = document.querySelectorAll(".ontologybutton")
        for (var i = 0; i < element.length; i++) {
          element[i].onclick = async function(){
            var nodes = document.getElementsByClassName("result"+this.id)
            for (var i = 0, max = nodes.length; i < max; i++) {
              if (nodes[i].style.display !== 'none') {
                nodes[i].style.display = 'none';
              }
              else {
                nodes[i].style.display = 'block';
              }
            }
              
            
          }
        }
        

        var elements = document.querySelectorAll(".selection");
        for (var i = 0; i < elements.length; i++) {
          elements[i].onclick = async function() {
            var id = await event.srcElement.id
            for(var onto in searchedResult){
              for(var num in searchedResult[onto]) {
                if(searchedResult[onto][num].oc_name == id) {
                  var cls = searchedResult[onto][num]
                }
              }
            }
            cls.fillCls();
            add_data(cls, cytoscape)
            await bvModal.hide("Modal")
            
          }
        }
       
      }


      
    },
    async load_class_from_url() {

      var urlParams = new URLSearchParams(window.location.search);
      var searchString = urlParams.get("defaultNode")
      if(searchString) {
        var searchedResult = await store.state.connectorArray[0].search_for_class(searchString);
        var cytoscape = this.$cytoscape.instance;
        var cls = searchedResult[0]
        cls.fillCls();
        add_data(cls, cytoscape)
      }
    },
    createpng() {

      var cyInst = this.$cytoscape.instance;
      cyInst.then(cy => {
        var cytoscape_png = cy.png({"bg":"white"})

        var canvas = document.getElementById('canvas')
        var context = canvas.getContext('2d');
        
        var legend = document.getElementById("legendfieldset")

        var cytoscape_image = new Image()
        cytoscape_image.src = cytoscape_png
        cytoscape_image.onload = drawactualimage


        domtoimage.toPng(legend).then(function (dataUrl) {
          var legendimage = new Image();
          legendimage.src = dataUrl;
          legendimage.onload = drawactualimage
        }).catch(function (error) {
          console.error('oops, something went wrong!', error);
        });

        var imagebox = document.getElementById('imagebox')

        function drawactualimage() {
            
          if (canvas.height < this.height) {
            canvas.height = this.height
          }
          if (canvas.width < this.width) {
            canvas.width = this.width
          }
          
          context.drawImage(this, 0, 0,this.width,this.height);
          
          var graphimg = document.getElementById("graph-image")
          graphimg.src = canvas.toDataURL("image/png")
          imagebox.style.display = "block"

          var downloadbutton = document.getElementById("imagedownload")
          downloadbutton.href = canvas.toDataURL("image/png")
        }

          var close = imagebox.getElementsByClassName("close")[0];
          close.onclick = function () {
            imagebox.style.display = "none"
          }

          var downloadbutton = document.getElementById("imagedownload")
          downloadbutton.onclick = function () {

          }

          window.addEventListener('click', function(e){   
            if (!document.getElementById('graph-image').contains(e.target)){
              console.log("click inside")
              imagebox.style.display = "none"
            } 
          });
      })
      
    },
    align() {
      var cyInst = this.$cytoscape.instance;
      cyInst.then(cy => {
        cy.fit()
      })

    }

  }
}

