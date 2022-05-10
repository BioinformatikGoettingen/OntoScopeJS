import axios from 'axios'
import OntoCls from "./OntoCls";
import store from "../store"

class genericConnector {

  constructor() {
    var urlParams = new URLSearchParams(window.location.search);
    this.url = []
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
    if(edge_type in this.edge_color) {
      return this.edge_color[edge_type]
    }else {
      this.edge_color[edge_type] = this.edgecolorpool[0]
      this.edgecolorpool.shift()
      return this.edge_color[edge_type]
    }
    
  }

  async search_for_class(searchString, is_id=false) {
    var multi_result = {}
    for(let urlexamp of this.url) {
      axios.defaults.headers = {
        'Accept': 'application/json'
      };

      if (is_id) {
        const response = await axios.get(urlexamp + "/cls/" + searchString).catch(err => {
          console.log("Error searching with id", err)
        })
        if(response) {
            let cls = this.createNewOntoCs(response.data, urlexamp)
            cls.fillWithTemplate(response.data)
            multi_result[urlexamp] = [cls]
        }
        continue
      }

      console.log(urlexamp + "/functions/basic/searchCls/" + searchString)
      const response = await axios.get(urlexamp + "/functions/basic/searchCls/" + searchString).catch(err => {
        console.log(err)
      })
      let result_cls = []
      if(response) {
        for (let jsonCls of response.data.entities) {
          let cls = this.createNewOntoCs(jsonCls, urlexamp)
          cls.fillWithTemplate(jsonCls)
          result_cls.push(cls)
        }
      }else {
        const response_with_wildcard = await axios.get(urlexamp + "/functions/basic/searchCls/" + searchString + "*").catch(err => {
          console.log(err)
        })
        if(response_with_wildcard) {
          var data = response_with_wildcard.data.entities[0]
          for (let jsonCls of response_with_wildcard.data.entities) {
            let cls = this.createNewOntoCs(jsonCls, urlexamp)
            cls.fillWithTemplate(data)
            result_cls.push(cls)
          }
        }
      }
      multi_result[urlexamp] = result_cls
    }
    return multi_result
    
  }
  async get_cls_data(Cls) {
    try {
      var cls_id = Cls.id;
      var namespace = Cls.oc_namespace
      axios.defaults.headers = {
          'Accept': 'application/json'
      };
      console.log(Cls.url + "/cls/" + cls_id + "?ns=" + namespace)
      let response = await axios({
          url: Cls.url + "/cls/" + cls_id + "?ns=" + namespace, // add also (encoded) NS

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

  createNewOntoCs(json, url = undefined) {
    let cls = new OntoCls(json, store.state.connectorArray, url)
    return cls
  }
}

export {genericConnector} 
