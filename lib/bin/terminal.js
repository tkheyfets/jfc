#! /usr/bin/env node

var
    args = process.argv.slice(2),
    jfc = require('../jfc.js').jfc;

jfc.apply(this, args);