# ontoscope-js

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production <-to build for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### URL-Example with plugin

http://localhost:8080/?plugin=./cytomer_plugin

### URL-Example to use ontoscope without plugin

http://localhost:8080/?url=http://oba.sybig.de/cytomer

### You can also use a plugin for a different ontology

http://localhost:8080/?plugin=./cytomer_plugin&url=http://oba.sybig.de/tribolium

### You are able to set a default node in the URL by the name of the node, the first node from the search will be displayed

http://localhost:8080/?plugin=./cytomer_plugin&defaultNode=head