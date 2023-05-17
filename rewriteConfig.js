const path = require("path");
const fs = require("fs");
const electronics = require('./electronics')
var confige = {};
fs.readFile(path.join(__dirname, 'electronics.json'), (error, data) => {
    if (error) {
        console.error(error);
        throw error;
    }
    confige = JSON.parse(data)
    console.log('reading complete');
    electronics.writeConfig(confige)
})