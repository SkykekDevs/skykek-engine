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
    const ev = Map.of("M", Map.of(1, Map.of(undefined, expr123)));
    expect(v).toEqual(ev);
  });
  it("makes a rule_decl with an unmatched param", function() {
    const v = make(["$.M(a) = 123"]);
    var ev = Map.of("M", Map.of(2, Map.of(undefined, expr123)));
    expect(v).toEqual(ev);
  });
  it("makes a rule_decl with a matched param", function() {
    const v = make(["$.M(a: 8) = 123"]);
    var ev = Map.of("M", Map.of(2, Map.of(8, expr123)));
    expect(v).toEqual(ev);
  });
  it("combines rules at name map", function() {
    const v = make(["$.M(a) = 123", "$.N() = 321"]);
    const ev = Map.of(
      "M",
      Map.of(2, Map.of(undefined, expr123)),
      "N",
      Map.of(1, Map.of(undefined, expr321))
    );
    expect(v).toEqual(ev);
  });
  it("combines rules at size map", function() {
    const v = make(["$.M(a) = 123", "$.M() = 321"]);
    const ev = Map.of(
      "M",
      Map.of(2, Map.of(undefined, expr123), 1, Map.of(undefined, expr321))
    );
    expect(v).toEqual(ev);
  });
  it("combines rules at parameter map", function() {
    const v = make(["$.M(a) = 123", "$.M(a: 55) = 321"]);
    const ev = Map.of("M", Map.of(2, Map.of(undefined, expr123, 55, expr321)));
    expect(v).toEqual(ev);
  });
  it("makes the rhs", function() {
    const a = Map({ Param: 1 });
    const b = Map({ Param: 2 });
    const vA = make(["$.M(a, b) = a"]);
    const evA = Map.of("M", Map.of(3, Map.of(undefined, a)));
    expect(vA).toEqual(evA);
    const vB = make(["$.M(a, b) = b"]);
    const evB = Map.of("M", Map.of(3, Map.of(undefined, b)));
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
  it("makes a path value", function() {
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
    const ev = Map({ Call: "Lor", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x && y", function() {
    const v = make("x && y");
    const ev = Map({ Call: "Land", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x == y", function() {
    const v = make("x == y");
    const ev = Map({ Call: "Eq", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x != y", function() {
    const v = make("x != y");
    const ev = Map({ Call: "Ne", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x < y", function() {
    const v = make("x < y");
    const ev = Map({ Call: "Lt", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x <= y", function() {
    const v = make("x <= y");
    const ev = Map({ Call: "Le", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x > y", function() {
    const v = make("x > y");
    const ev = Map({ Call: "Gt", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x >= y", function() {
    const v = make("x >= y");
    const ev = Map({ Call: "Ge", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x in y", function() {
    const v = make("x in y");
    const ev = Map({ Call: "Has", Args: List([y, x]) });
    expect(v).toEqual(ev);
  });
  it("makes x + y", function() {
    const v = make("x + y");
    const ev = Map({ Call: "Add", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x - y", function() {
    const v = make("x - y");
    const ev = Map({ Call: "Sub", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x | y", function() {
    const v = make("x | y");
    const ev = Map({ Call: "Or", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x ^ y", function() {
    const v = make("x ^ y");
    const ev = Map({ Call: "Xor", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x * y", function() {
    const v = make("x * y");
    const ev = Map({ Call: "Mul", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x / y", function() {
    const v = make("x / y");
    const ev = Map({ Call: "Div", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x % y", function() {
    const v = make("x % y");
    const ev = Map({ Call: "Rem", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x ** y", function() {
    const v = make("x ** y");
    const ev = Map({ Call: "Pow", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x ++ y", function() {
    const v = make("x ++ y");
    const ev = Map({ Call: "Concat", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x << y", function() {
    const v = make("x << y");
    const ev = Map({ Call: "Lsh", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x >> y", function() {
    const v = make("x >> y");
    const ev = Map({ Call: "Rsh", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x >>> y", function() {
    const v = make("x >>> y");
    const ev = Map({ Call: "Zrsh", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes x & y", function() {
    const v = make("x & y");
    const ev = Map({ Call: "And", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes !x", function() {
    const v = make("!x");
    const ev = Map({ Call: "Lnot", Args: List([x]) });
    expect(v).toEqual(ev);
  });
  it("makes -x", function() {
    const v = make("-x");
    const ev = Map({ Call: "Neg", Args: List([x]) });
    expect(v).toEqual(ev);
  });
  it("makes ~x", function() {
    const v = make("~x");
    const ev = Map({ Call: "Not", Args: List([x]) });
    expect(v).toEqual(ev);
  });
  it("makes a get_expr", function() {
    const v = make("x[y]");
    const ev = Map({ Call: "Get", Args: List([x, y]) });
    expect(v).toEqual(ev);
  });
  it("makes a load_expr", function() {
    const v = make("x#");
    const ev = Map({ Call: "Load", Args: List([x]) });
    expect(v).toEqual(ev);
  });
  it("makes a constructor_expr", function() {
    const v = make("x(y, z)");
    const p = Map({ Call: "Load", Args: List([x]) });
    const ev = Map({ Call: "Init", Args: List([p, y, z]) });
    expect(v).toEqual(ev);
  });
  it("makes a call_expr", function() {
    const v = make("x.M(y, z)");
    const ev = Map({ Call: "M", Args: List([x, y, z]) });
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
    const v1 = make("Aaz_09");
    const ev1 = Map({ Val: "Aaz_09" });
    expect(v1).toEqual(ev1);
    const v2 = make("Aaz_09Baz_09");
    const ev2 = Map({ Val: "Aaz_09Baz_09" });
    expect(v2).toEqual(ev2);
    const v3 = make("Aaz_09Baz_09Caz_09");
    const ev3 = Map({ Val: "Aaz_09Baz_09Caz_09" });
    expect(v3).toEqual(ev3);
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
    const v0 = make("[]");
    const ev0 = Map({ Val: List([]) });
    expect(v0).toEqual(ev0);
    const v1 = make("[x]");
    const ev1 = Map({ Call: "Push", Args: List([ev0, x]) });
    expect(v1).toEqual(ev1);
    const v2 = make("[x, y]");
    const ev2 = Map({ Call: "Push", Args: List([ev1, y]) });
    expect(v2).toEqual(ev2);
  });
  it("makes a map", function() {
    const v0 = make("{}");
    const ev0 = Map({ Val: Map({}) });
    expect(v0).toEqual(ev0);
    const v1 = make("{w: x}");
    const ev1 = Map({ Call: "Set", Args: List([ev0, w, x]) });
    expect(v1).toEqual(ev1);
    const v2 = make("{w: x, y: z}");
    const ev2 = Map({ Call: "Set", Args: List([ev1, y, z]) });
    expect(v2).toEqual(ev2);
  });
  it("makes a set", function() {
    const v0 = make("#{}");
    const ev0 = Map({ Val: Set([]) });
    expect(v0).toEqual(ev0);
    const v1 = make("#{x}");
    const ev1 = Map({ Call: "Add", Args: List([ev0, x]) });
    expect(v1).toEqual(ev1);
    const v2 = make("#{x, y}");
    const ev2 = Map({ Call: "Add", Args: List([ev1, y]) });
    expect(v2).toEqual(ev2);
  });
});
