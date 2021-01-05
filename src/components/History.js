export default class History {
    constructor() {
        this.historylist = []
        this.json = ""
      
    }
    get list() {
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
        element.className = "btn btn-primary historybutton"
        element.style.margin =" 3px 3px"
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
                ungreyelement.style.margin =" 3px 3px"
                ungreyelement.classList.remove("greyed")
            }
            //grey all elements with clickedId < id < history_length
            for(var i = clickedId+1; i < history_length; i++){
                var greyedelement = document.getElementById(i)
                greyedelement.style = "background-color:grey"
                greyedelement.style.margin =" 3px 3px"

                greyedelement.classList.add("greyed")
            }
        }
        var holder = document.getElementById("historybox")
        holder.appendChild(element)

        return this.historylist
    }

    //check for greyed DOM-elements and delete them, also in the historylist
    delete_previous() {
        // delete searchtip
        var first_searchtip = document.getElementById("first_searchtip")
        var urlParams = new URLSearchParams(window.location.search);
        if(urlParams.get("defaultNode")) {
            if(first_searchtip && this.historylist.length > 0) {
                first_searchtip.parentNode.removeChild(first_searchtip)
            }
        }else {
            if(first_searchtip) {
                first_searchtip.parentNode.removeChild(first_searchtip)
            }
        }

        var greyed = document.getElementsByClassName("greyed")
        while(greyed.length > 0){
            var deleteelement = document.getElementById(greyed[0].id)
            deleteelement.parentNode.removeChild(deleteelement)
            this.historylist.pop()
        }
    }
}