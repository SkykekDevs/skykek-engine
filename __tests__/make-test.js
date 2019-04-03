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
  const expr123 = Map({ Val: 123 });
  const expr321 = Map({ Val: 321 });

  const make = function(lines) {
    var decls = [];
    for (var i = 0; i < lines.length; i++) {
      decls.push(parseDecl(new Scanner(lines[i])));
    }
    return makeObject(decls);
  };
  it("makes a prop_decl", function() {
    const v = make(['$["x"] = 456']);
    const ev = Map.of("x", 456);
    expect(v).toEqual(ev);
  });
  it("makes a rule_decl with no params", function() {
    const v = make(["$.M() = 123"]);
    const ev = Map.of("M", Map.of(0, Map.of(undefined, expr123)));
    expect(v).toEqual(ev);
  });
  it("makes a rule_decl with an unmatched param", function() {
    const v = make(["$.M(a) = 123"]);
    var ev = Map.of("M", Map.of(1, Map.of(undefined, expr123)));
    expect(v).toEqual(ev);
  });
  it("makes a rule_decl with a matched param", function() {
    const v = make(["$.M(a: 8) = 123"]);
    var ev = Map.of("M", Map.of(1, Map.of(8, expr123)));
    expect(v).toEqual(ev);
  });
  it("combines rules at name map", function() {
    const v = make(["$.M(a) = 123", "$.N() = 321"]);
    const ev = Map.of(
      "M",
      Map.of(1, Map.of(undefined, expr123)),
      "N",
      Map.of(0, Map.of(undefined, expr321))
    );
    expect(v).toEqual(ev);
  });
  it("combines rules at size map", function() {
    const v = make(["$.M(a) = 123", "$.M() = 321"]);
    const ev = Map.of(
      "M",
      Map.of(1, Map.of(undefined, expr123), 0, Map.of(undefined, expr321))
    );
    expect(v).toEqual(ev);
  });
  it("combines rules at parameter map", function() {
    const v = make(["$.M(a) = 123", "$.M(a: 55) = 321"]);
    const ev = Map.of("M", Map.of(1, Map.of(undefined, expr123, 55, expr321)));
    expect(v).toEqual(ev);
  });
  it("makes the rhs", function() {
    const a = Map({ Param: 2 });
    const b = Map({ Param: 3 });
    const vA = make(["$.M(a, b) = a"]);
    const evA = Map.of("M", Map.of(2, Map.of(undefined, a)));
    expect(vA).toEqual(evA);
    const vB = make(["$.M(a, b) = b"]);
    const evB = Map.of("M", Map.of(2, Map.of(undefined, b)));
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
  it("makes a name value", function() {
    const v = make(["$[0] = ABC"]);
    const ev = Map.of(0, "ABC");
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
  const w = Map({ Param: 6 });
  const x = Map({ Param: 7 });
  const y = Map({ Param: 8 });
  const z = Map({ Param: 9 });

  const make = function(line) {
    const expr = parseExpr(new Scanner(line));
    return makeExpr(expr, { w: 6, x: 7, y: 8, z: 9 });
  };
  it("makes x || y", function() {
    const v = make("x || y");
    const m = Map({ Val: "Lor" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x && y", function() {
    const v = make("x && y");
    const m = Map({ Val: "Land" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x == y", function() {
    const v = make("x == y");
    const m = Map({ Val: "Eq" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x != y", function() {
    const v = make("x != y");
    const m = Map({ Val: "Ne" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x < y", function() {
    const v = make("x < y");
    const m = Map({ Val: "Lt" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x <= y", function() {
    const v = make("x <= y");
    const m = Map({ Val: "Le" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x > y", function() {
    const v = make("x > y");
    const m = Map({ Val: "Gt" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x >= y", function() {
    const v = make("x >= y");
    const m = Map({ Val: "Ge" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x in y", function() {
    const v = make("x in y");
    const m = Map({ Val: "Has" });
    const ev = Map({ Call: List([y, m, x]) });
    expect(v).toEqual(ev);
  });
  it("makes x + y", function() {
    const v = make("x + y");
    const m = Map({ Val: "Add" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x - y", function() {
    const v = make("x - y");
    const m = Map({ Val: "Sub" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x | y", function() {
    const v = make("x | y");
    const m = Map({ Val: "Or" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x ^ y", function() {
    const v = make("x ^ y");
    const m = Map({ Val: "Xor" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x * y", function() {
    const v = make("x * y");
    const m = Map({ Val: "Mul" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x / y", function() {
    const v = make("x / y");
    const m = Map({ Val: "Div" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x % y", function() {
    const v = make("x % y");
    const m = Map({ Val: "Rem" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x ** y", function() {
    const v = make("x ** y");
    const m = Map({ Val: "Pow" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x ++ y", function() {
    const v = make("x ++ y");
    const m = Map({ Val: "Concat" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x << y", function() {
    const v = make("x << y");
    const m = Map({ Val: "Lsh" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x >> y", function() {
    const v = make("x >> y");
    const m = Map({ Val: "Rsh" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x >>> y", function() {
    const v = make("x >>> y");
    const m = Map({ Val: "Zrsh" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x & y", function() {
    const v = make("x & y");
    const m = Map({ Val: "And" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes !x", function() {
    const v = make("!x");
    const m = Map({ Val: "Lnot" });
    const ev = Map({ Call: List([x, m]) });
    expect(v).toEqual(ev);
  });
  it("makes -x", function() {
    const v = make("-x");
    const m = Map({ Val: "Neg" });
    const ev = Map({ Call: List([x, m]) });
    expect(v).toEqual(ev);
  });
  it("makes ~x", function() {
    const v = make("~x");
    const m = Map({ Val: "Not" });
    const ev = Map({ Call: List([x, m]) });
    expect(v).toEqual(ev);
  });
  it("makes a get_expr", function() {
    const v = make("x[y]");
    const m = Map({ Val: "Get" });
    const ev = Map({ Call: List([x, m, y]) });
    expect(v).toEqual(ev);
  });
  it("makes a load_expr", function() {
    const v = make("x#");
    const m = Map({ Val: "Load" });
    const ev = Map({ Call: List([x, m]) });
    expect(v).toEqual(ev);
  });
  it("makes a constructor_expr", function() {
    const v = make("x(y, z)");
    const mLoad = Map({ Val: "Load" });
    const p = Map({ Call: List([x, mLoad]) });
    const mNew = Map({ Val: "New" });
    const ev = Map({ Call: List([p, mNew, y, z]) });
    expect(v).toEqual(ev);
  });
  it("makes a call_expr", function() {
    const v = make("w.x(y, z)");
    const ev = Map({ Call: List([w, x, y, z]) });
    expect(v).toEqual(ev);
  });
  it("makes a positive number", function() {
    const v = make("3");
    const ev = Map({ Val: 3 });
    expect(v).toEqual(ev);
  });
  it("makes a negative number", function() {
    const v = make("-3");
    const ev = Map({ Val: -3 });
    expect(v).toEqual(ev);
  });
  it("makes true", function() {
    const v = make("true");
    const ev = Map({ Val: true });
    expect(v).toEqual(ev);
  });
  it("makes false", function() {
    const v = make("false");
    const ev = Map({ Val: false });
    expect(v).toEqual(ev);
  });
  it("makes NaN", function() {
    const v = make("NaN");
    const ev = Map({ Val: NaN });
    expect(v).toEqual(ev);
  });
  it("makes undefined", function() {
    const v = make("undefined");
    const ev = Map({ Val: undefined });
    expect(v).toEqual(ev);
  });
  it("makes a string", function() {
    const v = make('"abc\\n\\t"');
    const ev = Map({ Val: "abc\n\t" });
    expect(v).toEqual(ev);
  });
  it("makes a name expression", function() {
    const v = make("AbcDef");
    const ev = Map({ Val: "AbcDef" });
    expect(v).toEqual(ev);
  });
  it("makes a function expression", function() {
    const v = make("#!/abc");
    const ev = Map({ Func: "abc" });
    expect(v).toEqual(ev);
  });
  it("makes a parameter expression", function() {
    const v = make("x");
    const ev = x;
    expect(v).toEqual(ev);
  });
  it("makes $", function() {
    const v = make("$");
    const ev = Map({ Param: 0 });
    expect(v).toEqual(ev);
  });
  it("makes a list", function() {
    const mPush = Map({ Val: "Push" });
    const v0 = make("[]");
    const ev0 = Map({ Val: List([]) });
    expect(v0).toEqual(ev0);
    const v1 = make("[x]");
    const ev1 = Map({ Call: List([ev0, mPush, x]) });
    expect(v1).toEqual(ev1);
    const v2 = make("[x, y]");
    const ev2 = Map({ Call: List([ev1, mPush, y]) });
    expect(v2).toEqual(ev2);
  });
  it("makes a map", function() {
    const mSet = Map({ Val: "Set" });
    const v0 = make("{}");
    const ev0 = Map({ Val: Map({}) });
    expect(v0).toEqual(ev0);
    const v1 = make("{w: x}");
    const ev1 = Map({ Call: List([ev0, mSet, w, x]) });
    expect(v1).toEqual(ev1);
    const v2 = make("{w: x, y: z}");
    const ev2 = Map({ Call: List([ev1, mSet, y, z]) });
    expect(v2).toEqual(ev2);
  });
  it("makes a set", function() {
    const mAdd = Map({ Val: "Add" });
    const v0 = make("#{}");
    const ev0 = Map({ Val: Set([]) });
    expect(v0).toEqual(ev0);
    const v1 = make("#{x}");
    const ev1 = Map({ Call: List([ev0, mAdd, x]) });
    expect(v1).toEqual(ev1);
    const v2 = make("#{x, y}");
    const ev2 = Map({ Call: List([ev1, mAdd, y]) });
    expect(v2).toEqual(ev2);
  });
});
