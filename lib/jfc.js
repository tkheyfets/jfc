(function () {

    'use strict';

    var
        fs = require('fs'),
        path = require('path'),
        imports = [],
        root = this;

    var parseFile = function(content, _path) {

        var pattern = /(\/\/\s*@import\s+[\w\-\.\/]+)*/gmi;
        var result = content.match(pattern);

        result.forEach(function(item) {
            if (!!item && item !== '') {
                var module_name = item.replace(/\/\/|@import/gi, '').trim();
                module_name = _path + '/' + module_name;
                if (path.extname(module_name) === '') {
                    module_name += '.js';
                }
                if (imports.indexOf(module_name) === -1) {
                    imports.push(module_name);
                    var sub_content = parseFile(fs.readFileSync(module_name, 'utf-8'), _path);
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
    root.assemble = function () {

        var
            input = arguments[0],
            root_dir = path.resolve(path.dirname(input)),
            index = root_dir + '/' + path.basename(input),
            _out = arguments[1];

        if (fs.existsSync(index)) {

            if (fs.statSync(index).isDirectory()) {
                index = root_dir + '/index.js';
            }

            imports.push(index);

            var
                data = fs.readFileSync(index, 'utf-8'),
                content = parseFile(data, root_dir);

            content = content.replace(/[\n]+/gi, '\n').trim();

            if (!!_out) {
                fs.writeFileSync(_out, content);
            } else {
                console.log(content);
            }
            return content;
        } else {
            console.log('Set the right path');
        }
    };

}).call(this);
