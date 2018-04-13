// index.js is the entry point for this package.

"use strict";

const build = require("./src/build.js");
exports.loadTree = build.loadTree;
exports.buildTree = build.buildTree;
exports.mergeTree = build.mergeTree;

const compile = require("./src/compile.js");
exports.compileExpr = compile.compileExpr;

const evaluate = require("./src/evaluate.js");
exports.evaluate = evaluate.evaluate;
