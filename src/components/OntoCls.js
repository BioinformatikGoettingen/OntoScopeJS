export default class OntoCls {
connector
//triboliumConnector
    constructor(json, connector, triboliumConnector) {
        this.json = json;
        this.oc_children = json.children;
        this.oc_annotations = json.annotations;
        this.oc_name = json.name;
        if(connector.ontoname == "tribolium") {
          this.oc_label = json.label
        }
        if(connector.ontoname == "cytomer") {
          this.oc_label = json.name
        }
        this.oc_namespace = json.namespace;
        this.oc_parents = json.parents;
        this.oc_shell = json.shell;
        this.oc_properties = json.properties;
        this.connector = connector
    }

    get id() {
        return this.oc_name;
    }

    get properties() {
      console.log("get properties for " + this.label)

      if (this.oc_shell) {
          console.log("hier getproperties")
          return this.fillCls().then(data => {
              return this.oc_properties
          });
      }else {
          return this.oc_properties
      }
        return this.oc_properties
    }

    get children() {
         console.log("get children for " + this.label)
         if (!this.oc_shell && this.oc_children.length == 0) {
             return null;
         }
          if (this.oc_shell) {
              console.log("hier getchildren")
              return this.fillCls().then(data => {
                  return this.oc_children
              });
          }else {
              return this.oc_children
          }
     }

     get parents() {
          console.log("get parents for " + this.label)
          if (!this.oc_shell && this.oc_parents.length == 0) {
              return null;
          }
           if (this.oc_shell) {
               console.log("hier getparents")
               return this.fillCls().then(data => {
                   return this.oc_parents
               });
           }else {
               return this.oc_parents
           }
      }


    get label() {
        // later on switch between name of the class or label annotation
        // also switch language
        //
        for (var anno of this.json.annotations) {
            if (anno.name === 'label') {
                //this.label = anno.value;
                return anno.value;
            }
        }
        return this.json.name;
    }


    get name() {
      return this.fillCls().then(data => {
        for (var anno of this.json.annotations) {
            if (anno.name === 'label') {
                //this.label = anno.value;
                return anno.value;
            }
        }
        })
    }

    get devStage() {
      return this.connector.getDevStageOfCls(this).then(data => {
        if(data === undefined) {
          return "undefined";
        }else {
          var data = data.data.annotations;
          for (var anno of data) {
              if (anno.name === 'label') {
                return anno.value;
              }
          }
        }
      })

    }

     async fillCls(){
        //console.log("filling class " + this.id)
        const promise = await this.connector.get_cls_data(this)
        var data =  promise.data;
        this.fillWithTemplate(data)

        return promise

    }


    fillWithTemplate(data) {
        const json_cls = data
        this.oc_children = []
        for (let c of json_cls.children) {
            this.oc_children.push(this.connector.createNewOntoCs(c))
        }
        this.oc_shell = json_cls.shell;
        this.oc_annotations = json_cls.annotations;
        this.oc_name = json_cls.name;
        this.oc_namespace = json_cls.namespace;
        this.oc_parents = []
        this.oc_properties = json_cls.properties;
        this.oc_properties = []
        for (let c of json_cls.properties){
          this.oc_properties.push({
            "property" : c.property,
            "target" : this.connector.createNewOntoCs(c.target)
          })


        }
        for (let c of json_cls.parents){
            this.oc_parents.push(this.connector.createNewOntoCs(c))
        }
       // this.oc_parents = json_cls.parents;
        this.json = json_cls
    }


}
