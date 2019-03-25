// index.js is the entry point for this package.

"use strict";

const compile = require("./src/compile.js");
exports.compileExpr = compile.compileExpr;
exports.compileObject = compile.compileObject;
exports.EMPTY_MAP = compile.EMPTY_MAP;

const evaluate = require("./src/evaluate.js");
exports.evaluate = evaluate.evaluate;
