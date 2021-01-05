export class PluginHandler {

    constructor() {
    }

    async loadPluginfromUrl(pluginpath) {
       
        pluginpath = pluginpath + "/Connector.js"
        var PluginHandler = this
        var loadedPlugin = import(`${pluginpath}`).then(function(callback){
            var connector = new callback.Connector()
            return connector

        })
        await loadedPlugin
        return loadedPlugin
    }

    async loadConfigfromPlugin(pluginpath) {
        
        pluginpath = pluginpath + "/Connector.js"
        var PluginHandler = this
        var loadedconfig = import(`${pluginpath}`).then(function(callback){
            var config = callback.configuration
            return config

        })
        await loadedconfig
        return loadedconfig

    }
    async loadGenericController() {
        var loadedGenericConnector = import("./genericConnector.js").then(function(callback) {
            var connector = new callback.genericConnector()
            return connector
        })
        await loadedGenericConnector
        return loadedGenericConnector
    }
}


