import VueCyObj from './cy-object';

export default class History {
    constructor() {
        this.historylist = []
        this.json = ""
      
    }
    get list() {
       // for(i = 0; i < this.historylist.length; i ++) {}
        return this.historylist;
    }
    set list(json) {
        this.historylist = json
    }
    //EINFACH CY OBJECT MIT AN DIE HISTORY ÜBERGEBEN
    //add history point to list and create DOM element
    add_to_list(cy,json,node_name,action = "undefined") {

        this.delete_previous();
        
        this.historylist.push([action,json])

        var element = document.createElement("button")
        element.className = "historybutton"
        element.id = this.historylist.length - 1
      

        if(action == "undefined"){
            var value = node_name 
        }else if(action == "search"){
            var value = "&#8853; " + node_name
        }else if(action == "add"){
            var value = "&#62; " + node_name
        }else if(action ="delete"){
            var value = "&#8854; " + node_name
        }
        
        element.innerHTML = element.value =value
        
        // import the json into the graph and grey all following history
        element.onclick = function() {
            cy.json(json)
            cy.layout({
                name:'cose'
            }).run()
            var clickedId = parseInt(element.id)
            var history_length = document.getElementsByClassName("historybutton").length

            //ungrey all the previous elements
            for(var i = 0; i <= clickedId; i++){
                var ungreyelement = document.getElementById(i)
                ungreyelement.style = "background-color:#0074D9"
                ungreyelement.classList.remove("greyed")
            }
            //grey all elements with clickedId < id < history_length
            for(var i = clickedId+1; i < history_length; i++){
                var greyedelement = document.getElementById(i)
                greyedelement.style = "background-color:grey"
                greyedelement.classList.add("greyed")
            }
        }
        var holder = document.getElementById("historybox")
        holder.appendChild(element)

        return this.historylist
    }

    //check for greyed DOM-elements and delete them, also in the historylist
    delete_previous() {

        var greyed = document.getElementsByClassName("greyed")
        
        while(greyed.length > 0){

            var deleteelement = document.getElementById(greyed[0].id)
            deleteelement.parentNode.removeChild(deleteelement)

            this.historylist.pop()
        }
    }
}