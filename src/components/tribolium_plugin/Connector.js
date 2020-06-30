import axios from 'axios'
import OntoCls from "../OntoCls";
class Connector {

    constructor() {
      this.ontoname = "tribolium";
      //this.category = "Development Stage";
      this.url = "http://oba.sybig.de"
      this.SUB_RESOURCE = "functions/tribolium/";
      this.edgecolorpool =["#f98d06","#fdcd04","#f0ff00","f6c398","#DAF7A6","#581845"]  
      this.nodecolorpool = ["#001f3f","#0074D9","#7FDBFF","#39CCCC","#3D9970","#2ECC40","#01FF70","#FFDC00","#FF851B","#FF4136","#85144b","#F012BE","#B10DC9","#111111","#AAAAAA","#DDDDDD"]
      this.edge_color =[]
      this.node_color=[]
    };

    async get_node_color(onto_cls){
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
    get_edge_color(edge_type) {
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

      const response = await axios.get(this.url + "/tribolium/functions/basic/searchCls/" + searchString + "*")
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
      const response = await axios.get(this.url + "/tribolium/functions/basic/searchCls/" + searchString + "*")
      let result_cls = []

      for (let jsonCls of response.data.entities) {
        var data = jsonCls;
          let cls = this.createNewOntoCs(jsonCls)
          //fill with template lite, das nur das label und den namen und die annotations übernimt, aber keine e
          // eigene Anfrage an den Server stellt, somit sollte die Performance deutlich verbessert werden


          //cls.fillCls()
          result_cls.push(cls)
      }
      console.log(result_cls)
      return result_cls
  }

  async get_cls_data(Cls) {
      try {
          var cls_id = Cls.id;
          console.log("fetching " + cls_id)
          axios.defaults.headers = {
              'Accept': 'application/json'
          };
          console.log(this.url + "/tribolium/cls/" + cls_id)
          let response = await axios({
              url: this.url + "/tribolium/cls/" + cls_id, // add also (encoded) NS
  
              method: "get",
              timeout: 8000
          });

          //console.log(await response)
          return await response

      } catch (err) {
          console.log(err)
      }
  }

  //this need to be defined for every connector
  async getColorCatOfCls(Cls) {
    try{
      var cls_id = Cls.id;
      console.log(this.url + "/tribolium/" + this.SUB_RESOURCE  + 'devStageOfCls/' + cls_id)


      axios.defaults.headers = {
        'Accept': 'application/json'
      };
      let response = await axios({
          url: this.url + "/tribolium/" + this.SUB_RESOURCE  + 'devStageOfCls/' + cls_id,
          method: "get",
          timeout: 8000
      });
      
      await response

      for(var anno of response.data.annotations) {
        if(anno.name === 'label') {
          return anno.value
        }
      }


    } catch (err) {
      console.log(err)
    }
  }
  

  createNewOntoCs(json) {
      let cls = new OntoCls(json, this)
      return cls
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