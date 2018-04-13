"use strict";

const index = require("../index.js");
const loadTree = index.loadTree;
const buildTree = index.buildTree;
const mergeTree = index.mergeTree;
const compileExpr = index.compileExpr;
const evaluate = index.evaluate;

describe("example", function() {
  it("uses all the exported functions of this package", function() {
    const content = [
      "DANK/1 123 3\n",
      "this is ~/\n",
      "./global/123\n",
      "./foo/123\n",

      "DANK/1 123 2\n",
      "this is ~/global/\n",
      "$.add(x, y) = #!add\n",

      "DANK/1 123 2\n",
      "this is ~/foo/\n",
      "$.embiggen(x) = x + 5\n"
    ].join("");
    var base = loadTree("~/", content);
    const expr = compileExpr("~/", "Foo.embiggen(2)");
    expect(evaluate(expr, base)).toEqual(7);
    const editLines = ["this is ~/foo/\n", "$.embiggen(x) = x + 10\n"];
    const edit = buildTree("~/foo/", "123", editLines, {});
    const merged = mergeTree(base, edit);
    expect(evaluate(expr, merged)).toEqual(12);
  });
});
