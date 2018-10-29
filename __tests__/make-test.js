"use strict";
// Tests for ../src/make.js

const immutable = require("../src/immutable2.js");
const List = immutable.List;
const Map = immutable.Map;
const Set = immutable.Set;

const scan = require("../src/scan.js");
const Scanner = scan.Scanner;

const parse = require("../src/parse.js");
const parseDecl = parse.parseDecl;
const parseExpr = parse.parseExpr;

const make = require("../src/make.js");
const makeObject = make.makeObject;
const makeExpr = make.makeExpr;

describe("makeObject", function() {
  const expr123 = Map({ val: 123 });
  const expr321 = Map({ val: 321 });

  const make = function(lines) {
    var decls = [];
    for (var i = 0; i < lines.length; i++) {
      decls.push(parseDecl(new Scanner(lines[i])));
    }
    return makeObject(decls);
  };
  it("makes a prop_decl", function() {
    const v = make(["$.x = 123"]);
    const ev = Map.of("x", 123);
    expect(v).toEqual(ev);
  });
  it("makes an entry_decl", function() {
    const v = make(['$["x"] = 456']);
    const ev = Map.of("x", 456);
    expect(v).toEqual(ev);
  });
  it("makes a rule_decl with no params", function() {
    const v = make(["$.m() = 123"]);
    const ev = Map.of("m", Map.of(1, Map.of(undefined, expr123)));
    expect(v).toEqual(ev);
  });
  it("makes a rule_decl with an unmatched param", function() {
    const v = make(["$.m(a) = 123"]);
    var ev = Map.of("m", Map.of(2, Map.of(undefined, expr123)));
    expect(v).toEqual(ev);
  });
  it("makes a rule_decl with a matched param", function() {
    const v = make(["$.m(a: 8) = 123"]);
    var ev = Map.of("m", Map.of(2, Map.of(8, expr123)));
    expect(v).toEqual(ev);
  });
  it("combines rules at name map", function() {
    const v = make(["$.m(a) = 123", "$.n() = 321"]);
    const ev = Map.of(
      "m",
      Map.of(2, Map.of(undefined, expr123)),
      "n",
      Map.of(1, Map.of(undefined, expr321))
    );
    expect(v).toEqual(ev);
  });
  it("combines rules at size map", function() {
    const v = make(["$.m(a) = 123", "$.m() = 321"]);
    const ev = Map.of(
      "m",
      Map.of(2, Map.of(undefined, expr123), 1, Map.of(undefined, expr321))
    );
    expect(v).toEqual(ev);
  });
  it("combines rules at parameter map", function() {
    const v = make(["$.m(a) = 123", "$.m(a: 55) = 321"]);
    const ev = Map.of("m", Map.of(2, Map.of(undefined, expr123, 55, expr321)));
    expect(v).toEqual(ev);
  });
  it("makes the rhs", function() {
    const a = Map({ param: 1 });
    const b = Map({ param: 2 });
    const vA = make(["$.m(a, b) = a"]);
    const evA = Map.of("m", Map.of(3, Map.of(undefined, a)));
    expect(vA).toEqual(evA);
    const vB = make(["$.m(a, b) = b"]);
    const evB = Map.of("m", Map.of(3, Map.of(undefined, b)));
    expect(vB).toEqual(evB);
  });
  it("makes a positive number value", function() {
    const v = make(["$[0] = 3"]);
    const ev = Map.of(0, 3);
    expect(v).toEqual(ev);
  });
  it("makes a negative number value", function() {
    const v = make(["$[0] = -3"]);
    const ev = Map.of(0, -3);
    expect(v).toEqual(ev);
  });
  it("makes a true value", function() {
    const v = make(["$[0] = true"]);
    const ev = Map.of(0, true);
    expect(v).toEqual(ev);
  });
  it("makes a false value", function() {
    const v = make(["$[0] = false"]);
    const ev = Map.of(0, false);
    expect(v).toEqual(ev);
  });
  it("makes a NaN value", function() {
    const v = make(["$[0] = NaN"]);
    const ev = Map.of(0, NaN);
    expect(v).toEqual(ev);
  });
  it("makes an undefined value", function() {
    const v = make(["$[0] = undefined"]);
    const ev = Map.of(0, undefined);
    expect(v).toEqual(ev);
  });
  it("makes a string value", function() {
    const v = make(['$[0] = "abc\\n\\t"']);
    const ev = Map.of(0, "abc\n\t");
    expect(v).toEqual(ev);
  });
  it("makes a list value", function() {
    const v = make(["$[0] = [3, 4, 5]"]);
    const ev = Map.of(0, List([3, 4, 5]));
    expect(v).toEqual(ev);
  });
  it("makes a map value", function() {
    const v = make(["$[0] = {3: 4, 5: 6}"]);
    const ev = Map.of(0, Map.of(3, 4, 5, 6));
    expect(v).toEqual(ev);
  });
  it("makes a set value", function() {
    const v = make(["$[0] = #{3, 4, 5}"]);
    const ev = Map.of(0, Set([3, 4, 5]));
    expect(v).toEqual(ev);
  });
});

describe("makeExpr", function() {
  const w = Map({ param: 6 });
  const x = Map({ param: 7 });
  const y = Map({ param: 8 });
  const z = Map({ param: 9 });
  const Global = Map({ path: List(["global"]) });

  const make = function(line) {
    const expr = parseExpr(new Scanner(line));
    return makeExpr(expr, { w: 6, x: 7, y: 8, z: 9 });
  };
  it("makes x in y", function() {
    const v = make("x in y");
    const ev = Map({ call: "has", args: List([y, x]) });
    expect(v).toEqual(ev);
  });
  it("makes x || y", function() {
    const v = make("x || y");
    const ev = Map({ call: "lor", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x && y", function() {
    const v = make("x && y");
    const ev = Map({ call: "land", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x == y", function() {
    const v = make("x == y");
    const ev = Map({ call: "eq", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x != y", function() {
    const v = make("x != y");
    const ev = Map({ call: "ne", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x < y", function() {
    const v = make("x < y");
    const ev = Map({ call: "lt", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x <= y", function() {
    const v = make("x <= y");
    const ev = Map({ call: "le", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x > y", function() {
    const v = make("x > y");
    const ev = Map({ call: "gt", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x >= y", function() {
    const v = make("x >= y");
    const ev = Map({ call: "ge", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x + y", function() {
    const v = make("x + y");
    const ev = Map({ call: "add", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x - y", function() {
    const v = make("x - y");
    const ev = Map({ call: "sub", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x | y", function() {
    const v = make("x | y");
    const ev = Map({ call: "or", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x ^ y", function() {
    const v = make("x ^ y");
    const ev = Map({ call: "xor", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x * y", function() {
    const v = make("x * y");
    const ev = Map({ call: "mul", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x / y", function() {
    const v = make("x / y");
    const ev = Map({ call: "div", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x % y", function() {
    const v = make("x % y");
    const ev = Map({ call: "rem", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x << y", function() {
    const v = make("x << y");
    const ev = Map({ call: "lsh", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x >> y", function() {
    const v = make("x >> y");
    const ev = Map({ call: "rsh", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x >>> y", function() {
    const v = make("x >>> y");
    const ev = Map({ call: "zrsh", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x & y", function() {
    const v = make("x & y");
    const ev = Map({ call: "and", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes !x", function() {
    const v = make("!x");
    const ev = Map({ call: "lnot", args: List([x]) });
    expect(v).toEqual(ev);
  });
  it("makes -x", function() {
    const v = make("-x");
    const ev = Map({ call: "neg", args: List([x]) });
    expect(v).toEqual(ev);
  });
  it("makes ~x", function() {
    const v = make("~x");
    const ev = Map({ call: "not", args: List([x]) });
    expect(v).toEqual(ev);
  });
  it("makes a method call", function() {
    const v = make("x.m(y, z)");
    const ev = Map({ call: "m", args: List([x, y, z]) });
    expect(v).toEqual(ev);
  });
  it("makes a property", function() {
    const v = make("x.p");
    const ev = Map({ call: "get", args: List([x, Map({ val: "p" })]) });
    expect(v).toEqual(ev);
  });
  it("makes x[y]", function() {
    const v = make("x[y]");
    const ev = Map({ call: "get", args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes a positive number", function() {
    const v = make("3");
    const ev = Map({ val: 3 });
    expect(v).toEqual(ev);
  });
  it("makes a negative number", function() {
    const v = make("-3");
    const ev = Map({ val: -3 });
    expect(v).toEqual(ev);
  });
  it("makes true", function() {
    const v = make("true");
    const ev = Map({ val: true });
    expect(v).toEqual(ev);
  });
  it("makes false", function() {
    const v = make("false");
    const ev = Map({ val: false });
    expect(v).toEqual(ev);
  });
  it("makes NaN", function() {
    const v = make("NaN");
    const ev = Map({ val: NaN });
    expect(v).toEqual(ev);
  });
  it("makes undefined", function() {
    const v = make("undefined");
    const ev = Map({ val: undefined });
    expect(v).toEqual(ev);
  });
  it("makes a string", function() {
    const v = make('"abc\\n\\t"');
    const ev = Map({ val: "abc\n\t" });
    expect(v).toEqual(ev);
  });
  it("makes a path", function() {
    const v1 = make("Aaz_09");
    const ev1 = Map({ path: List(["aaz_09"]) });
    expect(v1).toEqual(ev1);
    const v2 = make("Aaz_09Baz_09");
    const ev2 = Map({ path: List(["aaz_09", "baz_09"]) });
    expect(v2).toEqual(ev2);
    const v3 = make("Aaz_09Baz_09Caz_09");
    const ev3 = Map({ path: List(["aaz_09", "baz_09", "caz_09"]) });
    expect(v3).toEqual(ev3);
  });
  it("makes a constructor", function() {
    const v = make("A(x, y)");
    const p = Map({ path: List(["a"]) });
    const ev = Map({ call: "make", args: List([p, x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes a function expression", function() {
    const v = make("#!abc");
    const ev = Map({ func: "abc" });
    expect(v).toEqual(ev);
  });
  it("makes a global method call", function() {
    const v = make("m(x, y)");
    const ev = Map({ call: "m", args: List([Global, x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes a parameter expression", function() {
    const v = make("x");
    const ev = x;
    expect(v).toEqual(ev);
  });
  it("makes $", function() {
    const v = make("$");
    const ev = Map({ param: 0 });
    expect(v).toEqual(ev);
  });
  it("makes a list", function() {
    const v0 = make("[]");
    const ev0 = Map({ val: List([]) });
    expect(v0).toEqual(ev0);
    const v1 = make("[x]");
    const ev1 = Map({ call: "push", args: List([ev0, x]) });
    expect(v1).toEqual(ev1);
    const v2 = make("[x, y]");
    const ev2 = Map({ call: "push", args: List([ev1, y]) });
    expect(v2).toEqual(ev2);
  });
  it("makes a map", function() {
    const v0 = make("{}");
    const ev0 = Map({ val: Map({}) });
    expect(v0).toEqual(ev0);
    const v1 = make("{w: x}");
    const ev1 = Map({ call: "set", args: List([ev0, w, x]) });
    expect(v1).toEqual(ev1);
    const v2 = make("{w: x, y: z}");
    const ev2 = Map({ call: "set", args: List([ev1, y, z]) });
    expect(v2).toEqual(ev2);
  });
  it("makes a set", function() {
    const v0 = make("#{}");
    const ev0 = Map({ val: Set([]) });
    expect(v0).toEqual(ev0);
    const v1 = make("#{x}");
    const ev1 = Map({ call: "add", args: List([ev0, x]) });
    expect(v1).toEqual(ev1);
    const v2 = make("#{x, y}");
    const ev2 = Map({ call: "add", args: List([ev1, y]) });
    expect(v2).toEqual(ev2);
  });
});
