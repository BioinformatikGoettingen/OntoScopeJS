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

  var tmp = [] ;
  var parents = await onto_cls.parents;
    
    for (const parent_cls of parents) {
      await parent_cls.fillCls()
      var color_cat = await parent_cls.get_color_cat()

      var parentColor = await parent_cls.get_color()
      tmp[parent_cls.id] = parentColor;
      
      console.log(parentColor)
      console.log("parentColor")
      session_legend.add_node_to_legend(color_cat,parentColor)
    
    }
    console.log("hier fillCLs")
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
        for (const parent_cls of onto_cls.parents) {
          //vielleicht hier auch eher die onto_cls fragen
          session_legend.add_edge_to_legend("subclass",store.state.connectorArray[0].get_edge_color("subclass"))

          cy.add([{group: 'nodes', data: {id: parent_cls.id, label: parent_cls.label, object: parent_cls,color:tmp[parent_cls.id]/*datanodeColor[parentdev]*/}},
              {group: 'edges', data: {source: parent_cls.id, target: onto_cls.id, label: "subclass",color:/*edgeColor["subclass"]*/store.state.connectorArray[0].get_edge_color("subclass")}}])

              
        
          cy.layout({
            name: 'cose'
          }).run();
        
          session_history.add_to_list(cy,cy.json(),onto_cls.oc_label,"search")
          
        }
    })
    console.log("connector")
    console.log(onto_cls.connector)
    

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
      
      //  store.dispatch("addGenericConnector")
        store.dispatch("loadConnector")

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
                              for (var property_cls of properties) {
                                console.log("property_cls")
                                console.log(property_cls)
                                await property_cls.target.fillCls()

                                var color_cat = await property_cls.target.get_color_cat()
                                var propertyColor = await property_cls.target.get_color()
                                session_legend.add_node_to_legend(color_cat,propertyColor)
                                session_legend.add_edge_to_legend(property_cls.property.name,store.state.connectorArray[0].get_edge_color(properties_cls.property.name))
                                
                                
                                    cy.add([{
                                        group: 'nodes',
                                        data: {
                                            id: property_cls.target.id,
                                            label: property_cls.target.label,
                                            object: property_cls.target,
                                            color: propertyColor
                                            //color: nodeColor[devStage]
                                        }
                                    },
                                        {group: 'edges', data: {source: property_cls.target.id, target: object.id, label: property_cls.property.name,color:/*edgeColor[properties_cls.property.name]*/store.state.connectorArray[0].get_edge_color(properties_cls.property.name)}}]);
                                  
                              }
                              cy.layout({
                                  name: 'cose'
                              }).run()
                              session_history.add_to_list(cy,cy.json(),object.oc_label,"add")
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
                              await children_cls.fillCls()
                              var color_cat = await children_cls.get_color_cat()
                              var childenColor = await children_cls.get_color()
                              session_legend.add_node_to_legend(color_cat,childenColor)
                              session_legend.add_edge_to_legend("is a",store.state.connectorArray[0].get_edge_color("is a"))
                              
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
                                    {group: 'edges', data: {source: children_cls.id, target: object.id, label: "is a",color:/*edgeColor["is a"]*/store.state.connectorArray[0].get_edge_color("is a")}}]);
                            }
                            cy.layout({
                                name: 'cose'
                            }).run()
                            session_history.add_to_list(cy,cy.json(),object.oc_label,"add")
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
                              await parent_cls.fillCls()
                              var color_cat = await parent_cls.get_color_cat()
                              var parentColor = await parent_cls.get_color()
                              session_legend.add_node_to_legend(color_cat,parentColor)
                              session_legend.add_edge_to_legend("subclass",store.state.connector.get_edge_color("subclass"))
                              
                                  cy.add([{
                                      group: 'nodes',
                                      data: {
                                          id: parent_cls.id,
                                          label: parent_cls.label,
                                          object: parent_cls,
                                          color: parentColor
                                      }
                                  },
                                      {group: 'edges', data: {source: parent_cls.id, target: object.id, label: "subclass",color:/*edgeColor["subclass"]*/store.state.connectorArray[0].get_edge_color("subclass")}}]);
                                    }

                              cy.layout({
                                  name: 'cose'
                              }).run()
                              session_history.add_to_list(cy,cy.json(),object.oc_label,"add")


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
                    session_history.add_to_list(cy,cy.json(),tmp.json().data.object.oc_label,"delete")

                  }
                },
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
      async search_for_class(searchString) {
          
        //var ontology = store.state.connector.ontoname
        var searchedResult = await store.state.connectorArray[0].first_search(searchString);
        var cytoscape = this.$cytoscape.instance;
        console.log("connectorArray")
        console.log(store.state.connectorArray)
        if(searchedResult.length == 1) {

          var cls = searchedResult[0]
          cls.fillCls();
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
              
              cls.fillCls();
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

          var imagebox = document.getElementById('imagebox')

            domtoimage.toPng(legend).then(function (dataUrl) {
                var legendimage = new Image();
                legendimage.src = dataUrl;
                legendimage.onload = drawactualimage
            }).catch(function (error) {
                console.error('oops, something went wrong!', error);
            });


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
        })
        
      }
  }
}

