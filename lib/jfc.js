(function () {

    'use strict';

    var
        root = this,
        fs   = require('fs'),
        path = require('path'),
        yaml = require('js-yaml'),
        colors = require('colors'),

        _extPriority = ['.yml', '.json', '.js'],
        _imports = [];

    colors.setTheme({
        input: 'grey',
        verbose: 'cyan',
        prompt: 'grey',
        info: 'green',
        data: 'grey',
        help: 'cyan',
        warn: 'yellow',
        debug: 'blue',
        error: 'red'
    });

    /**
     * @private
     *
     **/
    var _log = function (msg, type) {
        if (type === undefined) {
            type = 'input';
        }
        console.log(msg[type]);
    };

    /**
     * @private
     *
     **/
    var _sortByExtPriority = function (a, b) {
        var
            firstExt  = _extPriority.indexOf(path.extname(a)),
            secondExt = _extPriority.indexOf(path.extname(b));

        return firstExt - secondExt;

    };


    /**
     * @private
     *
     **/
    var _findFirstPriorFile = function (dir, pattern) {

        var files = fs.readdirSync(dir).filter(function (file) {
            return path.basename(file).indexOf(pattern) > -1;
        });

        return files.sort(_sortByExtPriority)[0];
    };


    /**
     * @private
     *
     **/
    var _search = function (fileName) {

    };

    /**
     * @private
     */
    var _findIndex = function (input) {
        var rootPath = path.resolve(path.dirname(input));
        process.chdir(rootPath);

        var indexFile = path.basename(input);

        try {

            var stats = fs.statSync(indexFile);

            if (stats.isDirectory()) {

                process.chdir(indexFile);
                rootPath = process.cwd();
                indexFile = _findFirstPriorFile(rootPath, 'index.');
            }
        } catch (e) {
            indexFile = _findFirstPriorFile(rootPath, indexFile);
        }

        if (!indexFile) {
            _log('No index file found', 'error');
            process.exit(1);
        }

        return indexFile;
    };


    /**
     * @private
     *
     **/
    var _parseContent = function(content, currentDir, rootPath) {

        if (!rootPath) {
            rootPath = currentDir;
        }

        var
            pattern = /(\/\/\s*@import\s+[\w\-\.\/]+)*/gmi,
            result = content.match(pattern);

        result.forEach(function (file) {
            if (!!file && file !== '') {
                var fileName = file.replace(/\/\/\s*@import/gi, '').trim();
                console.log(fileName);
            }
        });

        /*  result.forEach(function(item) {
         if (!!item && item !== '') {
         var module_name = item.replace(/\/\/\s*@import/gi, '').trim();
         module_name = _path + '/' + module_name;
         if (path.extname(module_name) === '') {
         module_name += '.js';
         }
         if (imports.indexOf(module_name) === -1) {
         imports.push(module_name);
         var sub_content = parseFile(fs.readFileSync(module_name, 'utf-8'), dir);
         content = content.replace(item, sub_content);
         } else {
         content = content.replace(item, '');
         }
         }
         }); */

        return content;
    };

    /**
     * @function assemble
     * @param input - input directory/file
     * @param output - output file, if not set will be script.js
     */
    root.assemble = function (input, output) {

        var indexFile = _findIndex(input);

        _imports.push(indexFile);

        var file = fs.readFileSync(indexFile, 'utf-8');
        var content = _parseContent(file, rootPath);
        content = content.replace(/[\n]+/gi, '\n').trim();

        if (!output) {
            output = 'script.js';
        }
        fs.writeFileSync(output, content);
        _log(output + ' was created successfully', 'info');
    };

    /**
     * @function trace
     * @param input
     */
    root.trace = function (input) {
        var indexFile = _findIndex(input);
        _log(indexFile, 'info');
    };

}).call(this);
