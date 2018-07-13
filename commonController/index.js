
const fs = require('fs');
const path = require('path');
let modules = {};

fs.readdirSync(__dirname).forEach((file) => {
    if(file.indexOf('.js') !== -1 && file !== 'index.js') {
        let key = file.substring(0, file.indexOf('.js'));
        modules[file.substring(0, file.indexOf('.js'))] = require(path.join(__dirname, key));
    }
});

module.exports = modules;