import axios from 'axios'
import OntoCls from "./OntoCls";

export default class GenericConnector {

    constructor() {
        const urlParams = new URLSearchParams(window.location.search);
        this.ontoname = urlParams.get("ontology");
    }

    async search_for_class(searchString, url = "http://oba.sybig.de") {
        axios.defaults.headers = {
            'Accept': 'application/json'
        };

        const response = await axios.get(url + '/' + this.ontoname + "/functions/basic/searchCls/" + searchString + "*")
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
    async first_search(searchString, url = "http://oba.sybig.de") {
        axios.defaults.headers = {
            'Accept': 'application/json'
        };

        const response = await axios.get(url + '/' + this.ontoname + "/functions/basic/searchCls/" + searchString + "*")
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
            var url = "http://oba.sybig.de";
            var cls_id = Cls.id;
            console.log("fetching " + cls_id)
            axios.defaults.headers = {
                'Accept': 'application/json'
            };
            console.log(url + '/' + this.ontoname + "/cls/" + cls_id)
            let response = await axios({
                url: url + '/' + this.ontoname + "/cls/" + cls_id, // add also (encoded) NS
    
                method: "get",
                timeout: 8000
            });

            //console.log(await response)
            return await response

        } catch (err) {
            console.log(err)
        }
    }

    async getDevStageOfCls(Cls) {
        try {

            var cls_id = Cls.id;
            var SUB_RESOURCE = "functions/tribolium/";
            var URL = "http://oba.sybig.de/";
            axios.defaults.headers = {
                'Accept': 'application/json'
            };
            let response = await axios({
                url: URL + this.ontoname + "/" + SUB_RESOURCE + 'devStageOfCls/' + cls_id,
                method: "get",
                timeout: 8000
            });

            return await response;

        } catch (err) {
            console.log(err)
        }
    }

    createNewOntoCs(json) {
        let cls = new OntoCls(json, this)
        return cls
    }
}
