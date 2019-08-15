import axios from 'axios'
import OntoCls from "./OntoCls";

export default class GenericConnector{

    async  search_for_class(searchString, url = "http://oba.sybig.de", ontology = "tribolium") {
        axios.defaults.headers = {
            'Accept': 'application/json'
        };

        const response = await axios.get(url + '/' + ontology + "/functions/basic/searchCls/" + searchString)
        //TODO if their is no result, repeat the search once with wildcard
        let result_cls = []
        for (const jsonCls of response.data.entities){
            let cls = new OntoCls(jsonCls)
            result_cls.push(cls)
        }
        console.log("returning search results " + result_cls.length)
        return result_cls
    }
}