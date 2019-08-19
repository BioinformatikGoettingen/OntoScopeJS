export default class OntoCls {
connector

    constructor(json, connector) {
        this.json = json;
        this.oc_children = json.children;
        this.oc_annotations = json.annotations;
        this.oc_name = json.name;
        this.oc_namespace = json.namespace;

        this.oc_shell = json.shell
        //var shell = this.json.shell
        //var children = this.json.children
        this.connector = connector
    }

    get id() {
        return this.json.name;
    }


      get children() {
         console.log("get children for " + this.label)
         if (!this.oc_shell && this.oc_children.length == 0) {
             return null;
         }
         if (this.oc_shell) {
             this.fillCls()
         }
             //  this.fillCls().then( data => { return this.oc_children}
             //hier Promise.all mit getCls, fillCls, and fillWithTemplate

         console.log(this.oc_children.length + " children")
         return this.oc_children

     }

    get parents(){
        console.log("get parents " + this.oc_parents + "  _ " + this.json.parents)
        console.log(this.json.parents)
        if (this.oc_parents === undefined && this.json.parents.length > 0){
            //TODO check if the root node is handled correct and add a comment here why json.parents.length > 0
            // this.fillCls()
            this.oc_parents = []
            for (let p of this.json.parents){
                this.parents.push(this.connector.createNewOntoCs(p))
            }
        }
        return this.oc_parents
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
        return this.json.label;
    }

     async fillCls(){
        console.log("filling class " + this.id)
        const data = this.connector.get_cls_data(this)
        console.log("fetched data, now fill " )
        // console.log(data)
        //await this.fillWithTemplate(data)
        await data.then(this.fillWithTemplate(data))
         
    }


    fillWithTemplate(data) {
        const json_cls = data
        this.oc_children = []
        for (let c of json_cls.children){
            this.oc_children.push(this.connector.createNewOntoCs(c))
        }


        this.oc_shell = json_cls.shell;
        this.oc_annotations = json_cls.annotations;
        this.oc_name = json_cls.name;
        this.oc_namespace = json_cls.namespace;
        this.json = json_cls
    }


}