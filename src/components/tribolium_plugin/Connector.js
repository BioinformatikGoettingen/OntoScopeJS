import axios from 'axios'
import OntoCls from "../OntoCls";
class Connector {

  constructor() {
    this.url = "http://oba.sybig.de/tribolium"
    this.SUB_RESOURCE = "/functions/tribolium/";
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
    console.log("hier get edge color; plugin")
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
      console.log(this.url + this.SUB_RESOURCE  + 'devStageOfCls/' + cls_id)


      axios.defaults.headers = {
        'Accept': 'application/json'
      };
      let response = await axios({
          url: this.url + this.SUB_RESOURCE  + 'devStageOfCls/' + cls_id,
          method: "get",
          timeout: 4000
      });
      
      await response
      console.log("response")
      console.log(response)
      for(var anno of response.data.annotations) {
        if(anno.name === 'label') {
          return anno.value
        }
      }


    } catch (err) {
      console.log(err)
    }
  }
}

const configuration = [
    {
      "url": "http://oba.sybig.de/tribolium",
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