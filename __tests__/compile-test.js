"use strict";
// Tests for ../src/compile.js

const immutable = require("../src/immutable2.js");
const List = immutable.List;
const Map = immutable.Map;

const compile = require("../src/compile.js");
const compileObject = compile.compileObject;
const compileExpr = compile.compileExpr;

describe("compileObject", function() {
  it("throws parser errors", function() {
    expect(function() {
      compileObject(["r"], "$.m() = <");
    }).toThrow("syntax");
  });
  it("reports the classname and the line of the parser error", function() {
    try {
      compileObject(["r"], "$.a() = 1\n$.b() = <\n$.c() = 3");
    } catch (err) {
      expect(err.classname).toEqual("R");
      expect(err.line).toEqual("$.b() = <");
    }
  });
  it("throws checker errors", function() {
    expect(function() {
      compileObject(["r"], '$.m() = "\\z"');
    }).toThrow("unknown character escape in string");
  });
  it("reports the classname and the line of the checker error", function() {
    try {
      compileObject(["r"], '$.a() = "a"\n$.b() = "\\z"\n$.c() = "c"');
    } catch (err) {
      expect(err.classname).toEqual("R");
      expect(err.line).toEqual('$.b() = "\\z"');
    }
  });
  it("line continuation", function() {
    const v = compileObject(
      ["r"],
      '$["a"] = [\n3,   	\n4,\n5,\n]\n$["b"] = {\n"x": 3,\n"y": 4,\n}\n'
    );
    const obj = Map.of("a", List([3, 4, 5]), "b", Map({ x: 3, y: 4 }));
    expect(v).toEqual(obj);
  });
  it("renames relative class names", function() {
    const v = compileObject(["r", "s"], "$.m() = @A");
    const expr = Map({ val: List(["r", "s", "a"]) });
    const obj = Map.of("m", Map.of(1, Map.of(undefined, expr)));
    expect(v).toEqual(obj);
  });
  it("makes and returns the object", function() {
    const v = compileObject(["r"], "$.m() = 123");
    const expr = Map({ val: 123 });
    const obj = Map.of("m", Map.of(1, Map.of(undefined, expr)));
    expect(v).toEqual(obj);
  });
});

describe("compileExpr", function() {
  it("throws parser errors", function() {
    expect(function() {
      compileExpr(["r"], "<");
    }).toThrow("syntax");
  });
  it("throws checker errors", function() {
    expect(function() {
      compileExpr(["r"], '"\\z"');
    }).toThrow("unknown character escape in string");
  });
  it("renames relative class names", function() {
    const v = compileExpr(["r", "s"], "@A");
    const ev = Map({ val: List(["r", "s", "a"]) });
    expect(v).toEqual(ev);
  });
  it("makes and returns the expression", function() {
    const v = compileExpr(["r"], "123");
    const ev = Map({ val: 123 });
    expect(v).toEqual(ev);
  });
});
