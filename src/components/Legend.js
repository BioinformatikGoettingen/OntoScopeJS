export default class Legend {
    constructor() {
        //legendlist include nodes and edges
        //evtl laden der farben aus der config
        this.nodelist = {}
        this.edgelist = {}
    }

    get list() {
        return this.nodelist
    }
    
    set list(json) {
        this.nodelist = json
        return this.nodelist
    }

    add_node_to_legend(node_cat,color){
        if(!this.nodelist[node_cat]){
            this.nodelist[node_cat] = color
            this.update_dom()
        }
        return this.nodelist
    }

    add_edge_to_legend(edge_cat,color){
        if(!this.edgelist[edge_cat]){
            this.edgelist[edge_cat] = color
            this.update_dom()
        }
        return this.edgelist
    }

    update_dom() {
        var nodetable = document.getElementById("nodetable")
        var nodelist = this.nodelist        

        Object.keys(this.nodelist).forEach(function(key) {
            console.log(key + nodelist[key])
            if(!document.getElementById("nodelegend:" + key)) {
                var tablerow = document.createElement("tr")
                var dot = document.createElement("td")
                var nodedesc = document.createElement("td")

                nodedesc.id = "nodelegend:" + key 

            
                var dotnode = document.createElement("span")
                dotnode.className += "dot"
                dotnode.style.backgroundColor = nodelist[key]

                var descnode = document.createTextNode(key)

                dot.appendChild(dotnode);
                nodedesc.appendChild(descnode);

                tablerow.appendChild(dot)
                tablerow.appendChild(nodedesc)

                nodetable.appendChild(tablerow)
            }
        })

        var edgetable = document.getElementById("edgetable")
        var edgelist = this.edgelist

        Object.keys(this.edgelist).forEach(function(key) {
            console.log(key + edgelist[key])
            if(!document.getElementById("edgelegend:" + key)) {
                var tablerow = document.createElement("tr")
                var dot = document.createElement("td")
                var edgedesc = document.createElement("td")

                edgedesc.id = "edgelegend:" + key

            
                var dotnode = document.createElement("span")
                dotnode.className += "vl"
                dotnode.style.borderColor = edgelist[key]

                var descnode = document.createTextNode(key)

                dot.appendChild(dotnode);
                edgedesc.appendChild(descnode);

                tablerow.appendChild(dot)
                tablerow.appendChild(edgedesc)

                edgetable.appendChild(tablerow)
                
            }
        })
    }
}