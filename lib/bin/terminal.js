#!/usr/bin/env node

var
    program = require('commander'),
    jfc = require('jfc');

program
    .version('0.4.0')
    .usage('[options] <file ...>')
    .option('-a, --assemble <input> <output>', 'Assemble script file', jfc.assemble)
    .option('-t, --trace <input>', 'Shows file tree', jfc.trace)
    .parse(process.argv);