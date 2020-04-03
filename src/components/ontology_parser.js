export default class ontology_parser {
    //import the file from the url
    static async parse(path) {
        let {configuration} = await import(`${path}`);
        return configuration;   
    };

    //get the url from the corresponding file
    get_url(path) {
    };

    //get the color that is needed
    get_color(argument) {
    };

    // create a script tag with functions
    create_script(path) {
    };


}