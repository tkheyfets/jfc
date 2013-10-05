#! /usr/bin/env node

var
    args = process.argv.slice(2),
    fs = require('fs'),
    imports = [];


var hasExtension = function(filename, ext) {
    return filename.split('.').pop() == ext;
};

var parseFile = function(content, root_dir) {

    var pattern = /(\/\/\s*@import\s+[\w\-\.\/]+)*/gmi;
    var result = content.match(pattern);

    result.forEach(function(item) {
        if (!!item && item != '') {
            var module_name = item.replace(/\/\/|@import/gi, '').trim();
            module_name = root_dir + '/' + module_name;
            if (!hasExtension(module_name, 'js')) {
                module_name += '.js';
            }
            if (imports.indexOf(module_name) == -1) {
                imports.push(module_name);
                var sub_content = parseFile(fs.readFileSync(module_name, 'utf-8'), root_dir);
                content = content.replace(item, sub_content);
            } else {
                content = content.replace(item, '');
            }
        }
    });

    return content;
};

/**
 * @root_dir
 * @output
 */
var main = function () {
    var dir = arguments[0], out = arguments[1];

    if (fs.existsSync(dir)) {
        var index = dir+'/index.js';
        imports.push(index);
        var data = fs.readFileSync(index, 'utf-8');


        var content = parseFile(data, dir);
        content = content.replace(/[\n]+/gi, '\n').trim();

        if (!!out) {
            fs.writeFileSync(out, content);
        } else {
            console.log(content);
        }
        return content;
    } else {
        console.log('Set the right directory');
    }
};

main.apply(this, args);
exports.jfc = main;
