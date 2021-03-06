export default class OntoCls {

  constructor(json, connectorArray, url = undefined) {
    this.json = json;
    this.oc_children = json.children;
    this.oc_annotations = json.annotations;
    this.oc_name = json.name;
    var tmp = false
    for(var annotation of this.json.annotations) {
      if(annotation.name === 'label' && annotation.language === '') {
        tmp = true
        this.oc_label = annotation.value
      }
    }
    if(!tmp) {
      this.oc_label = json.name
    }
    
    this.oc_namespace = json.namespace;
    this.oc_parents = json.parents;
    this.oc_shell = json.shell;
    if(json.properties){
      this.oc_properties = json.properties;
    }else {
      this.oc_properties = null;
    }
    this.connectorArray = connectorArray
    this.url = url
  }

  get id() {
    return this.oc_name;
  }

  get properties() {

    if (this.oc_shell) {
      return this.fillCls().then(data => {
        return this.oc_properties
      });
    }else {
        return this.oc_properties
    }
  }

  get children() {
    //console.log("get children for " + this.label)
    if (!this.oc_shell && this.oc_children.length == 0) {
        return null;
    }
    if (this.oc_shell) {
        //console.log("hier getchildren")
        return this.fillCls().then(data => {
            return this.oc_children
        });
    }else {
        return this.oc_children
    }
  }

  get parents() {
    //console.log("get parents for " + this.label)
    if (!this.oc_shell && this.oc_parents.length == 0) {
      return null;
    }
    if (this.oc_shell) {
      //console.log("hier getparents")
      return this.fillCls().then(data => {
        return this.oc_parents
      });
    }else {
      return this.oc_parents
    }
  }


  get label() {
    //console.log("hier get label")
    return this.oc_label
  }

  get name() {
    return this.fillCls().then(data => {
      for (var anno of this.json.annotations) {
          if (anno.name === 'label') {
            return anno.value;
          }
        }
      })
  }
  async get_color_cat() {
    console.log("get colocat for" + this.id)
    var genericCallback = this.connectorArray[0].getColorCatOfCls(this) 
    var prev_callback = genericCallback
    for(var i = 1; i<this.connectorArray.length; i++) {
      var pluginCallback = await this.connectorArray[i].getColorCatOfCls(this, prev_callback)
      if(pluginCallback != undefined) {
        prev_callback = pluginCallback
      }
      
    }
    if(prev_callback == undefined) {
      return "undefined"
    } else {
      return prev_callback
    }
  }

  async get_color() {
    console.log("get color for" +  this.id)
    var genericCallback = this.connectorArray[0].get_node_color(this)
    var prev_callback = genericCallback
    for(var i = 1; i < this.connectorArray.length; i++) {
      var pluginCallback = await this.connectorArray[i].get_node_color(this)
      if(pluginCallback != undefined) {
        prev_callback = pluginCallback
      }
    }
    if(prev_callback == undefined) {
      return "undefined"
    } else {
      return prev_callback
    }
  }
  //check if class need to be filled
  async fillCls() {
    if(this.oc_shell){
      const promise = await this.connectorArray[0].get_cls_data(this)
      if(promise != undefined) {
        var data =  promise.data;
        this.fillWithTemplate(data)
      }
      return promise
    }else {
      return this
    }
  }

  fillWithTemplate(data) {
    //console.log("filling class " + this.id)

    const json_cls = data
    this.oc_children = []
    for (let c of json_cls.children) {
      this.oc_children.push(this.connectorArray[0].createNewOntoCs(c, this.url))
    }
    this.oc_shell = json_cls.shell;
    this.oc_annotations = json_cls.annotations;
    this.oc_name = json_cls.name;
    this.oc_namespace = json_cls.namespace;
    this.oc_properties = []

    if(json_cls.properties) {
      for (let c of json_cls.properties){
        this.oc_properties.push({
          "property" : c.property,
          "target" : this.connectorArray[0].createNewOntoCs(c.target, this.url)
        })
      }
    }

    this.oc_parents = []

    for (let c of json_cls.parents){
      this.oc_parents.push(this.connectorArray[0].createNewOntoCs(c, this.url))
    }
    // this.oc_parents = json_cls.parents;
    this.json = json_cls
  }
}
