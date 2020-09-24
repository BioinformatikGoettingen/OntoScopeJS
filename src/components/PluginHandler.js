export class PluginHandler {

    constructor() {
        this.loadConfigfromUrl()
    }

    async loadPluginfromConfig(pluginlink) {
        var loadedConnectorfromPlugin = import(`${pluginlink}`).then(function(callback){
            var connector = new callback.Connector()
            return connector

        })
        await loadedConnectorfromPlugin
        return loadedConnectorfromPlugin
    }

    async loadConfigfromUrl() {
        var urlParams = new URLSearchParams(window.location.search);
        var configpath = urlParams.get("plugin");
        
        var PluginHandler = this
        var loadedConfig = import(`${configpath}`)
        .then(function(callback) {
            var pathtoplugin = callback.configuration[0]["link"]
            var Plugin = PluginHandler.loadPluginfromConfig(pathtoplugin).then(function(callback) {
                return callback
            }) 
            return Plugin
        })
        await loadedConfig
       return loadedConfig
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


