export default class PluginHandler {

    constructor() {
        this.plugin  = "null"
        this.loadConfigfromUrl()
    }

    loadConfigfromUrl() {
        var urlParams = new URLSearchParams(window.location.search);
        var configpath = urlParams.get("config");
        var PluginHandler = this

        let myscript = document.createElement("script")
        myscript.setAttribute("src", configpath)
        myscript.setAttribute("async",false)
        let head = document.head
        head.insertBefore(myscript, head.firstElementChild)
        /*var loadedConfig = import(`${configpath}`)
        .then(function(callback) {
            var pathtoplugin = callback.configuration[0]["link"]
            PluginHandler.loadPluginfromConfig(pathtoplugin).then(function(callback) {
                return callback
            }) 
        })*/
    }

   async loadPluginfromConfig(pluginlink) {
        var loadedPlugin = await import(`${pluginlink}`)
        var test  = loadedPlugin.get_color()
        console.log(test)
    }

    getColorofNode(node) {
        //var colorofnode =  this.plugin.get_color()
        var handler = this
        this.loadConfigfromUrl().then(function(callback) {
            console.log(handler.plugin)
        })

    }
}