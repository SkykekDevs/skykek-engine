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
  it("joins lines that end with a backslash (line continuation)", function() {
    const obj = Map.of("a", 3, "b", 4, "c", 5);
    const v = compileObject(["r"], "$.a = \\\n3\n$.b = \\   \n4\n$.c = 5");
    expect(v).toEqual(obj);
  });
  it("renames relative class names", function() {
    const expr0 = Map({ path: List(["a"]) });
    const obj0 = Map.of("m", Map.of(1, Map.of(undefined, expr0)));
    const v0 = compileObject([], "$.m() = @A");
    expect(v0).toEqual(obj0);

    const expr1 = Map({ path: List(["r", "a"]) });
    const obj1 = Map.of("m", Map.of(1, Map.of(undefined, expr1)));
    const v1 = compileObject(["r"], "$.m() = @A");
    expect(v1).toEqual(obj1);

    const expr2 = Map({ path: List(["r", "s", "a"]) });
    const obj2 = Map.of("m", Map.of(1, Map.of(undefined, expr2)));
    const v2 = compileObject(["r", "s"], "$.m() = @A");
    expect(v2).toEqual(obj2);
  });
  it("makes and returns the object", function() {
    const expr = Map({ val: 123 });
    const obj = Map.of("m", Map.of(1, Map.of(undefined, expr)));
    const v = compileObject(["r"], "$.m() = 123");
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
    const v0 = compileExpr([], "@A");
    const ev0 = Map({ path: List(["a"]) });
    expect(v0).toEqual(ev0);
    const v1 = compileExpr(["r"], "@A");
    const ev1 = Map({ path: List(["r", "a"]) });
    expect(v1).toEqual(ev1);
    const v2 = compileExpr(["r", "s"], "@A");
    const ev2 = Map({ path: List(["r", "s", "a"]) });
    expect(v2).toEqual(ev2);
  });
  it("makes and returns the expression", function() {
    const v = compileExpr(["r"], "123");
    const ev = Map({ val: 123 });
    expect(v).toEqual(ev);
  });
});
