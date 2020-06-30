export class PluginHandler {

    constructor() {
        this.loadConfigfromUrl()
    }

    async loadPluginfromConfig(pluginlink) {
        var loadedConnectorfromPlugin = import(`${pluginlink}`).then(function(callback){
            var pathtoplugin = callback.configuration[0]["link"]
            var connector = new callback.Connector()
            return connector

        })
        await loadedConnectorfromPlugin
        return loadedConnectorfromPlugin
    }

    async loadConfigfromUrl() {
        var urlParams = new URLSearchParams(window.location.search);
        var configpath = urlParams.get("ontologypackage");
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
}


