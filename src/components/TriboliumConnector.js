export class TriboliumConnector {

    constructor() {
        this.ontology = "tribolium";
        this.category = "Development Stage";
        this.colors = ["red","blue"]  
        this.color = "green" 
    };


    get_all_colors() {
        return this.colors;
    };
    get_color() {
        return this.color
    }
}
// import from config
const url = "http://oba.sybig.de"
const listofcolors = ["#001f3f","#0074D9","#7FDBFF","#39CCCC","#3D9970","#2ECC40","#01FF70","#FFDC00","#FF851B","#FF4136","#85144b","#F012BE","#B10DC9","#111111","#AAAAAA","#DDDDDD"]

// colors with definiton will be safed in the config, with a hardcoded color-devStage
// Definition

//function will take the node and the current color definitons and look if devstage has been definded, 
// if not it will take a color from a predefined listofcolors[] and expand the colors[] list
export default async function get_color_of_node(node,colors) {
    /*var devStage = await node.devStage;

    if(!colors[devStage]){
        colors[devStage] = listofcolors[0]
        listofcolors.shift()
    }

    console.log("hier get color of node")
    return colors[devStage]*/
    return "red"
}

//needen i.e. for the legend
 export function get_all_colors() {
     return 
 }