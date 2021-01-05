import axios from 'axios'
class Connector {

  constructor() {
    this.url = "http://oba.sybig.de/cytomer"
    this.SUB_RESOURCE = "/functions/cytomer/";
    this.edgecolorpool =["#f98d06","#fdcd04","#f0ff00","#f6c398","#DAF7A6","#581845"]  
    this.nodecolorpool = ["red","green","black","#3D9970","#2ECC40","#01FF70","#FFDC00","#FF851B","#FF4136","#85144b","#F012BE","#B10DC9","#111111","#AAAAAA","#DDDDDD"]
    this.edge_color =[]
    this.node_color = []
  };

  async get_node_color(onto_cls){
    var color_cat = await this.getColorCatOfCls(onto_cls)
    if(color_cat == "undefined" || color_cat == undefined) {
      return undefined
    }
    if(color_cat in this.node_color) {
      return this.node_color[color_cat]
    } else {
      this.node_color[color_cat] = this.nodecolorpool[0]
      this.nodecolorpool.shift()
      return this.node_color[color_cat]
    }
  }

  //ordnet jeder edge art nach und nach eine Farbe zu
  get_edge_color(edge_type) {
    if(edge_type in this.edge_color) {
      return this.edge_color[edge_type]
    }else {
      this.edge_color[edge_type] = this.edgecolorpool[0]
      this.edgecolorpool.shift()
      return this.edge_color[edge_type]
    }
    
  }

  //this need to be defined for every connector
  // every one need to check if the prev conn found sth, and if sth was found then dont overwrite its
//maybe color_cat in the CyGraph only need to be checked if the legend is updadet
  async getColorCatOfCls(Cls) {
    try{
      var cls_id = Cls.id;
      var namespace = Cls.oc_namespace
      console.log(this.url + this.SUB_RESOURCE  + 'systemsOf/' + cls_id+"?ns=" + namespace)
      
      axios.defaults.headers = {
        'accept': 'application/json'
      };
      let response = await axios({
          url: this.url + this.SUB_RESOURCE  + 'systemsOf/' + cls_id+"?ns=" + namespace,
          method: "get",
          timeout: 2500
      });
      
      if(response === undefined || response.data == "") {
        var color_cat = "undefined"
      }else {
        var color_cat = response.data.entities[0].name
      }

    return await color_cat

    } catch (err) {
      console.log(err)
    }
  }

}

const configuration = [
  {
    "searchtip": "i.e. search for leg"
  }
]

export {Connector, configuration} 