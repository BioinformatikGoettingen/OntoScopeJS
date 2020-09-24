import axios from 'axios'
import OntoCls from "./OntoCls";
import store from "../store"

class genericConnector {

  constructor() {
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.get("url")){
      this.url = urlParams.get("url")
    }else {
      this.url = undefined
    }
    this.edgecolorpool =["#f98d06","#fdcd04","#f0ff00","f6c398","#DAF7A6","#581845"]  
    this.nodecolorpool = ["#001f3f","#0074D9","#7FDBFF","#39CCCC","#3D9970","#2ECC40","#01FF70","#FFDC00","#FF851B","#FF4136","#85144b","#F012BE","#B10DC9","#111111","#AAAAAA","#DDDDDD"]
    this.edge_color =[]
    this.node_color=[]
  }

  async get_node_color(onto_cls){
    return this.nodecolorpool[0]
  }

  //ordnet jeder edge art nach und nach eine Farbe zu
  get_edge_color(edge_type) {
    //console.log("hier get edge color; generic connector")
    if(edge_type in this.edge_color) {
      return this.edge_color[edge_type]
    }else {
      this.edge_color[edge_type] = this.edgecolorpool[0]
      this.edgecolorpool.shift()
      return this.edge_color[edge_type]
    }
    
  }
  async search_for_class(searchString) {
    axios.defaults.headers = {
        'Accept': 'application/json'
    };

    const response = await axios.get(this.url + "/functions/basic/searchCls/" + searchString + "*")
    //TODO if their is no result, repeat the search once with wildcard
    let result_cls = []
    var data = response.data.entities[0]
    for (let jsonCls of response.data.entities) {
        let cls = this.createNewOntoCs(jsonCls)
        cls.fillWithTemplate(data)
        result_cls.push(cls)
    }
    return result_cls
  }
  //returns the results in an array
  async first_search(searchString) {
      axios.defaults.headers = {
          'Accept': 'application/json'
      };
      const response = await axios.get(this.url +"/functions/basic/searchCls/" + searchString + "*")
      let result_cls = []

      for (let jsonCls of response.data.entities) {
        var data = jsonCls;
          let cls = this.createNewOntoCs(jsonCls)
          //fill with template lite, das nur das label und den namen und die annotations übernimt, aber keine e
          // eigene Anfrage an den Server stellt, somit sollte die Performance deutlich verbessert werden


          //cls.fillCls()
          result_cls.push(cls)
      }
      //console.log(result_cls)
      return result_cls
  }

  async get_cls_data(Cls) {
    try {
      var cls_id = Cls.id;
      var namespace = Cls.oc_namespace
      axios.defaults.headers = {
          'Accept': 'application/json'
      };
      console.log(this.url + "/cls/" + cls_id + "?ns=" + namespace)
      let response = await axios({
          url: this.url + "/cls/" + cls_id + "?ns=" + namespace, // add also (encoded) NS

          method: "get",
          timeout: 4000
      });
      return await response

    } catch (err) {
        console.log(err)
    }
  }
  
  async getColorCatOfCls(Cls) {
    return undefined
  }

  createNewOntoCs(json) {
    let cls = new OntoCls(json, store.state.connectorArray)
    return cls
  }
}

export {genericConnector} 