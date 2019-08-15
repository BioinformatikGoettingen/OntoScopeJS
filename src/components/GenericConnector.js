import axios from 'axios'
import OntoCls from "./OntoCls";

export default class GenericConnector {


    async search_for_class(searchString, url = "http://oba.sybig.de", ontology = "tribolium") {
        axios.defaults.headers = {
            'Accept': 'application/json'
        };

        const response = await axios.get(url + '/' + ontology + "/functions/basic/searchCls/" + searchString)
        //TODO if their is no result, repeat the search once with wildcard
        let result_cls = []
        for (let jsonCls of response.data.entities) {
            let cls = this.createNewOntoCs(jsonCls)
            result_cls.push(cls)
        }
        console.log("returning search results " + result_cls.length)
        return result_cls
    }

    async get_cls_data(Cls) {
        try {
            var url = "http://oba.sybig.de";
            var ontology = "tribolium";
            var searchString = Cls.label;
            axios.defaults.headers = {
                'Accept': 'application/json'
            };
            var response = await axios({
                url: url + '/' + ontology + "/functions/basic/searchCls/" + searchString,
                method: "get",
                timeout: 8000
            })
            console.log(response.data)
            return response.data

        } catch (err) {
            console.log(err)
        }
    }

    createNewOntoCs(json) {
        let cls = new OntoCls(json, this)
        return cls
    }
}