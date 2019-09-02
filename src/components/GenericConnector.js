import axios from 'axios'
import OntoCls from "./OntoCls";

export default class GenericConnector {


    async search_for_class(searchString, url = "http://oba.sybig.de", ontology = "tribolium") {
        axios.defaults.headers = {
            'Accept': 'application/json'
        };

        const response = await axios.get(url + '/' + ontology + "/functions/basic/searchCls/" + searchString + "*")
        //TODO if their is no result, repeat the search once with wildcard
        let result_cls = []
        console.log("response.data")
        console.log(response.data)
        var data = response.data.entities[0]
        for (let jsonCls of response.data.entities) {
            let cls = this.createNewOntoCs(jsonCls)
            cls.fillWithTemplate(data)
            result_cls.push(cls)
        }
        return result_cls
    }
    //returns the results in an array
    async first_search(searchString, url = "http://oba.sybig.de", ontology = "tribolium") {
        axios.defaults.headers = {
            'Accept': 'application/json'
        };

        const response = await axios.get(url + '/' + ontology + "/functions/basic/searchCls/" + searchString + "*")
        let result_cls = []

        for (let jsonCls of response.data.entities) {
          var data = jsonCls;
            let cls = this.createNewOntoCs(jsonCls)
            cls.fillWithTemplate(data)
            result_cls.push(cls)
        }
        return result_cls
    }

    async get_cls_data(Cls) {
        try {
            var url = "http://oba.sybig.de";
            var ontology = "tribolium";
            var cls_id = Cls.id;
            console.log("fetching " + cls_id)
            axios.defaults.headers = {
                'Accept': 'application/json'
            };
            let response = await axios({
                url: url + '/' + ontology + "/cls/" + cls_id, // add also (encoded) NS
                method: "get",
                timeout: 8000
            });

            //console.log(await response)
            return await response

        } catch (err) {
            console.log(err)
        }
    }

    createNewOntoCs(json) {
        let cls = new OntoCls(json, this)
        return cls
    }
}
