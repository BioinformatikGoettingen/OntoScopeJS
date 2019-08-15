export default class OntoCls {
connector

    constructor(json, connector) {
        this.json = json;
        this.oc_children = json.children;
        this.oc_annotations = json.annotations;
        this.oc_name = json.name;
        this.oc_namespace = json.namespace;
        this.oc_parents = json.parents;
        this.oc_shell = json.shell
        //var shell = this.json.shell
        //var children = this.json.children
        this.connector = connector
    }

    get id() {
        return this.json.name;
    }


    get children() {
        if (!this.oc_shell && this.oc_children.length == 0) {
            return null;
        }
        if (this.oc_shell) {
            this.fillCls()
            return this.oc_children
            //  this.fillCls().then( data => { return this.oc_children}
            //hier Promise.all mit getCls, fillCls, and fillWithTemplate
        }else {
            return this.oc_children
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
        return this.json.label;
    }

    fillCls(){
        var data = this.connector.get_cls_data(this)
        this.fillWithTemplate(data)
    }


    fillWithTemplate(data) {
        this.oc_children = data.entities[0].children;
        this.oc_parents = data.entities[0].parents;
        this.oc_shell = data.entities[0].shell;
        this.oc_annotations = data.entities[0].annotations;
        this.oc_name = data.entities[0].name;
        this.oc_namespace = data.entities[0].namespace;
        this.json = data.entities[0]
    }
    fillWithTemplate2(data) {
        this.oc_children = data.children;
        this.oc_parents = data.parents;
        this.oc_shell = data.shell;
        this.oc_annotations = data.annotations;
        this.oc_name = data.name;
        this.oc_namespace = data.namespace;
        this.json = data
    }

}