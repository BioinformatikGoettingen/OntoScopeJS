import axios from 'axios'
import OntoCls from "../OntoCls";
class Connector {

    constructor() {
      this.ontoname = "cytomer";
      //this.category = "Development Stage";
      this.url = "http://oba.sybig.de"
      this.SUB_RESOURCE = "functions/cytomer/";
      this.edgecolorpool =["#f98d06","#fdcd04","#f0ff00","f6c398","#DAF7A6","#581845"]  
      this.nodecolorpool = ["#001f3f","#0074D9","#7FDBFF","#39CCCC","#3D9970","#2ECC40","#01FF70","#FFDC00","#FF851B","#FF4136","#85144b","#F012BE","#B10DC9","#111111","#AAAAAA","#DDDDDD"]
      this.edge_color =[]
      this.node_color=[]
    };

    async get_node_color(onto_cls, prev_conn = undefined){
      var color_cat = await this.getColorCatOfCls(onto_cls)

    
      if(color_cat in this.node_color) {
        return this.node_color[color_cat]
      } else {
        this.node_color[color_cat] = this.nodecolorpool[0]
        this.nodecolorpool.shift()
        return this.node_color[color_cat]
        
      }

    }


    //ordnet jeder edge art nach und nach eine Farbe zu
    get_edge_color(edge_type, prev_conn = undefined) {
      if(edge_type in this.edge_color) {
        return this.edge_color[edge_type]
      }else {
        this.edge_color[edge_type] = this.edgecolorpool[0]
        this.edgecolorpool.shift()
        return this.edge_color[edge_type]
      }
      
    }

  //this need to be defined for every connector
  async getColorCatOfCls(Cls, prev_conn = undefined) {
    try{
      var cls_id = Cls.id;
      var namespace = Cls.oc_namespace
      console.log(this.url + "/cytomer/" + this.SUB_RESOURCE  + 'systemsOf/' + cls_id+"?ns=" + namespace)
      console.log("get_color_data"+cls_id)
      
      axios.defaults.headers = {
        'accept': 'application/json'
      };
      let response = await axios({
          url: this.url + "/cytomer/" + this.SUB_RESOURCE  + 'systemsOf/' + cls_id+"?ns=" + namespace,
          method: "get",
          timeout: 4000
      });
      
      console.log("hier wichtige response")
      console.log(response)
      if(response === undefined || response.data == "") {
        var color_cat = "undefined"
      }else {
        var color_cat = response.data.entities[0].name
      }
      return await color_cat

      //console.log(response.data)


    } catch (err) {
      console.log(err)
    }
  }

}

const configuration = [
    {
      "url": "http://oba.sybig.de",
      "link": "./Connector.js",
      "predefinitions" : {
        "#001f3f" : "undefinded",
        "#0074D9" : "adult"
      },
      "colors" : {
        "nodecolors" : ["#001f3f","#0074D9","#7FDBFF","#39CCCC","#3D9970","#2ECC40","#01FF70","#FFDC00","#FF851B","#FF4136","#85144b","#F012BE","#B10DC9","#111111","#AAAAAA","#DDDDDD"],
        "edgecolors" : ["#f98d06","#fdcd04","#f0ff00","f6c398","#DAF7A6","#581845"]
      }
    }
  ]

export {configuration, Connector} 