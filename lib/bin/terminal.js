#! /usr/bin/env node

var
    args = process.argv.slice(2),
    jfc = require('../jfc.js').assemble;

jfc.apply(this, args);