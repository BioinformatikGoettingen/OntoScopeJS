export class TriboliumConnector {

    constructor() {
        this.ontology = "tribolium";
        this.category = "Development Stage";
        this.colors = ["red","blue"]   
    };


    get_all_colors() {
        return this.colors;
    };
}

export default function get_color_of_node(node,colors) {
    /*if(!colors[category]){
        colors[category] = color
    }*/
    console.log("hier get color of node speaking")
    return "red"
}
