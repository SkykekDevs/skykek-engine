"use strict";
// Tests for ../src/evaluate.js

const immutable = require("../src/immutable2.js");
const List = immutable.List;
const Map = immutable.Map;
const Set = immutable.Set;
const is = immutable.is;

const compile = require("../src/compile.js");
const compileObject = compile.compileObject;
const compileExpr = compile.compileExpr;

const evaluate_ = require("../src/evaluate.js");
const evaluate = evaluate_.evaluate;

describe("evaluate", function() {
  const ev = function(line, tree) {
    const expr = compileExpr("~/m/", line);
    return evaluate(expr, tree);
  };
  it('throws "no matching rule found" on call with bad method name', function() {
    const tree = Map();
    expect(function() {
      ev("(123).hey()", tree);
    }).toThrow("no matching rule found");
  });
  it('throws "no matching rule found" on call with bad number of arguments', function() {
    const obj = compileObject("~/m/", "$.m(x) = 3");
    const path = List(["m"]);
    const tree = Map.of(path, obj);
    expect(function() {
      ev("M.m()", tree);
    }).toThrow("no matching rule found");
  });
  it("evaluates calls", function() {
    const obj = compileObject("~/m/", "$.m() = 3");
    const path = List(["m"]);
    const tree = Map.of(path, obj);
    expect(ev("M.m()", tree)).toEqual(3);
  });
  it("evaluates calls defined at run-time", function() {
    const obj = compileObject(
      "~/m/",
      '$.m() = {"n": {1: {undefined: {"val": 4}}}}.n()'
    );
    const path = List(["m"]);
    const tree = Map.of(path, obj);
    expect(ev("M.m()", tree)).toEqual(4);
  });
  it("built-in map methods have priority over normal methods", function() {
    const obj = compileObject(
      "~/m/",
      '$.m() = {"x": 4, "get": {2: {"x": {"val": 5}}}}.get("x")'
    );
    const path = List(["m"]);
    const tree = Map.of(path, obj);
    expect(ev("M.m()", tree)).toEqual(4);
  });
  it("objects are maps", function() {
    const obj = compileObject("~/m/", "$.p1 = 11\n$.p2 = 22");
    const path = List(["m"]);
    const tree = Map.of(path, obj);
    expect(ev("M.size()", tree)).toEqual(2);
    expect(ev('M.get("p1")', tree)).toEqual(11);
  });
  it("evaluates global calls", function() {
    const obj = compileObject("~/global/", "$.round(x) = #!round");
    const path = List(["global"]);
    const tree = Map.of(path, obj);
    expect(ev("round(1.8)", tree)).toEqual(2);
  });
  it("allocates number expression", function() {
    const obj = compileObject("~/m/", "$.m() = 6");
    const path = List(["m"]);
    const tree = Map.of(path, obj);
    const v = ev("M.m()", tree);
    expect(v).toEqual(6);
  });
  it("allocates string expression", function() {
    const obj = compileObject("~/m/", '$.m() = "abc"');
    const path = List(["m"]);
    const tree = Map.of(path, obj);
    const v = ev("M.m()", tree);
    expect(v).toEqual("abc");
  });
  it("allocates boolean expression", function() {
    const obj = compileObject("~/m/", "$.m() = true");
    const path = List(["m"]);
    const tree = Map.of(path, obj);
    const v = ev("M.m()", tree);
    expect(v).toEqual(true);
  });
  it("allocates path expression", function() {
    const obj = compileObject("~/m/", "$.m() = Other");
    const Other = Map({ prop: 123 });
    const path = List(["m"]);
    const tree = Map.of(path, obj, List(["other"]), Other);
    const v = ev("M.m()", tree);
    expect(v).toEqual(Other);
  });
  it("allocates func expression", function() {
    const obj = compileObject("~/m/", "$.m(x) = #!floor");
    const path = List(["m"]);
    const tree = Map.of(path, obj);
    const v = ev("M.m(3.9)", tree);
    expect(v).toEqual(3.0);
  });
  it("allocates param expression", function() {
    const obj = compileObject("~/m/", "$.m(a, b, c) = b");
    const path = List(["m"]);
    const tree = Map.of(path, obj);
    expect(ev("M.m(3, 4, 5)", tree)).toEqual(4);
  });
  it("allocates this expression", function() {
    const obj = compileObject("~/m/", "$.m(a, b, c) = this");
    const path = List(["m"]);
    const tree = Map.of(path, obj);
    expect(ev("M.m(3, 4, 5)", tree)).toEqual(obj);
  });
  it("allocates list constructor call", function() {
    const obj = compileObject("~/m/", "$.m() = [3, 4, 5, 6]");
    const path = List(["m"]);
    const tree = Map.of(path, obj);
    const v = ev("M.m()", tree);
    expect(v).toEqual(List.of(3, 4, 5, 6));
  });
  it("allocates map constructor call", function() {
    const obj = compileObject("~/m/", "$.m() = {3: 4, 5: 6}");
    const path = List(["m"]);
    const tree = Map.of(path, obj);
    const v = ev("M.m()", tree);
    expect(v).toEqual(Map.of(3, 4, 5, 6));
  });
  it("allocates set constructor call", function() {
    const obj = compileObject("~/m/", "$.m() = #{3, 4, 5, 6}");
    const path = List(["m"]);
    const tree = Map.of(path, obj);
    const v = ev("M.m()", tree);
    expect(v).toEqual(Set.of(3, 4, 5, 6));
  });
  it("allocates method call", function() {
    const obj = compileObject("~/m/", "$.m() = $.n()\n$.n() = 3");
    const path = List(["m"]);
    const tree = Map.of(path, obj);
    expect(ev("M.m()", tree)).toEqual(3);
  });
  it("allocates val child of call", function() {
    const obj = compileObject("~/m/", "$.m() = [3]");
    const path = List(["m"]);
    const tree = Map.of(path, obj);
    const v = ev("M.m()", tree);
    expect(v).toEqual(List.of(3));
  });
  it("allocates param child of call", function() {
    const obj = compileObject("~/m/", "$.m(b) = [b]");
    const path = List(["m"]);
    const tree = Map.of(path, obj);
    const v = ev("M.m(3)", tree);
    expect(v).toEqual(List.of(3));
  });
  it("allocates call child of call", function() {
    const obj = compileObject("~/m/", "$.m() = [$.n()]\n$.n() = 3");
    const path = List(["m"]);
    const tree = Map.of(path, obj);
    const v = ev("M.m()", tree);
    expect(v).toEqual(List.of(3));
  });
});

describe("allocate", function() {
  const ev = function(line) {
    const expr = compileExpr("~/r/", line);
    const tree = Map.of(List(["m"]), Map({ p: 123 }));
    return evaluate(expr, tree);
  };
  it("supports call expressions with wrongly-typed method name", function() {
    const args = '[{"val": {"p": 4}}, {"val": "p"}]';
    const call = '{"call": 33, "args": ' + args + "}";
    const v = ev('{"n": {1: {undefined: ' + call + "}}}.n()");
    expect(v).toEqual(undefined);
  });
  it("supports call expressions with wrongly-named method", function() {
    const args = '[{"val": {"p": 4}}, {"val": "p"}]';
    const call = '{"call": "...", "args": ' + args + "}";
    const v = ev('{"n": {1: {undefined: ' + call + "}}}.n()");
    expect(v).toEqual(undefined);
  });
  it("supports call expressions with wrongly-typed arg list", function() {
    const call = '{"call": "get", "args": 33}';
    const v = ev('{"n": {1: {undefined: ' + call + "}}}.n()");
    expect(v).toEqual(undefined);
  });
  it("supports call expressions with empty arg list", function() {
    const call = '{"call": "get", "args": []}';
    const v = ev('{"n": {1: {undefined: ' + call + "}}}.n()");
    expect(v).toEqual(undefined);
  });
  it("supports well-formed call expressions", function() {
    const args = '[{"val": {"p": 4}}, {"val": "p"}]';
    const call = '{"call": "get", "args": ' + args + "}";
    const v = ev('{"n": {1: {undefined: ' + call + "}}}.n()");
    expect(v).toEqual(4);
  });
  it("supports param expressions with wrongly-typed index", function() {
    const v = ev('{"n": {2: {undefined: {"param": "abc"}}}}.n(4)');
    expect(v).toEqual(undefined);
  });
  it("supports param expressions with index that is too low", function() {
    const v = ev('{"n": {2: {undefined: {"param": -1}}}}.n(4)');
    expect(v).toEqual(undefined);
  });
  it("supports param expressions with index that is too high", function() {
    const v = ev('{"n": {2: {undefined: {"param": 2}}}}.n(4)');
    expect(v).toEqual(undefined);
  });
  it("supports well-formed param expressions", function() {
    const v = ev('{"n": {2: {undefined: {"param": 1}}}}.n(4)');
    expect(v).toEqual(4);
  });
  it("supports path expressions with bad path", function() {
    const expr = '{"path": 32}';
    const v = ev('{"n": {1: {undefined: ' + expr + "}}}.n()");
    expect(is(v, undefined)).toBe(true);
  });
  it("supports path expressions with path not in tree", function() {
    const expr = '{"path": ["n"]}';
    const v = ev('{"n": {1: {undefined: ' + expr + "}}}.n()");
    expect(is(v, Map({}))).toBe(true);
  });
  it("supports path expressions", function() {
    const expr = '{"path": ["m"]}';
    const v = ev('{"n": {1: {undefined: ' + expr + "}}}.n()");
    expect(is(v, Map({ p: 123 }))).toBe(true);
  });
  it("supports func expressions with bad name", function() {
    const expr = '{"func": "qwertyuio"}';
    const v = ev('{"n": {3: {undefined: ' + expr + "}}}.n(2, 3)");
    expect(v).toEqual(undefined);
  });
  it("supports func expressions with wrong number of arguments", function() {
    const expr = '{"func": "add"}';
    const v = ev('{"n": {4: {undefined: ' + expr + "}}}.n(2, 3, 4)");
    expect(v).toEqual(undefined);
  });
  it("supports func expressions", function() {
    const expr = '{"func": "abs"}';
    const v = ev('{"n": {2: {undefined: ' + expr + "}}}.n(-5)");
    expect(v).toEqual(5);
  });
  it("supports val expressions", function() {
    const v = ev('{"n": {1: {undefined: {"val": 4}}}}.n()');
    expect(v).toEqual(4);
  });
  it("supports malformed expressions", function() {
    const vEmptyMap = ev('{"n": {1: {undefined: {}}}}.n()');
    expect(vEmptyMap).toEqual(undefined);
    const vNoMap = ev('{"n": {1: {undefined: 1234}}}.n()');
    expect(vNoMap).toEqual(undefined);
  });
});

describe("number", function() {
  const ev = function(line) {
    const expr = compileExpr("~/r/", line);
    return evaluate(expr, Map({}));
  };
  it("can be constructed", function() {
    expect(ev("123")).toEqual(123);
  });
  it("implements -x", function() {
    expect(ev("-6")).toEqual(-6);
  });
  it("implements ~x", function() {
    expect(ev("~6")).toEqual(-7);
  });
  it("implements x * y", function() {
    expect(ev("6 * 3")).toEqual(18);
    expect(ev("6 * []")).toEqual(undefined);
  });
  it("implements x / y", function() {
    expect(ev("6 / 3")).toEqual(2);
    expect(ev("6 / []")).toEqual(undefined);
  });
  it("implements x % y", function() {
    expect(ev("14 % 4")).toEqual(2);
    expect(ev("14 % []")).toEqual(undefined);
  });
  it("implements x ** y", function() {
    expect(ev("6 ** 2")).toEqual(36);
    expect(ev("6 ** []")).toEqual(undefined);
  });
  it("implements x << y", function() {
    expect(ev("6 << 1")).toEqual(12);
    expect(ev("6 << []")).toEqual(undefined);
  });
  it("implements x >> y", function() {
    expect(ev("-6 >> 1")).toEqual(-3);
    expect(ev("-6 >> []")).toEqual(undefined);
  });
  it("implements x >>> y", function() {
    expect(ev("-6 >>> 1")).toEqual(2147483645);
    expect(ev("-6 >>> []")).toEqual(undefined);
  });
  it("implements x & y", function() {
    expect(ev("6 & 4")).toEqual(4);
    expect(ev("6 & []")).toEqual(undefined);
  });
  it("implements x + y", function() {
    expect(ev("6 + 3")).toEqual(9);
    expect(ev("6 + []")).toEqual(undefined);
  });
  it("implements x - y", function() {
    expect(ev("6 - 3")).toEqual(3);
    expect(ev("6 - []")).toEqual(undefined);
  });
  it("implements x | y", function() {
    expect(ev("6 | 3")).toEqual(7);
    expect(ev("6 | []")).toEqual(undefined);
  });
  it("implements x ^ y", function() {
    expect(ev("6 ^ 3")).toEqual(5);
    expect(ev("6 ^ []")).toEqual(undefined);
  });
  it("implements x == y", function() {
    expect(ev("6 == 3")).toEqual(false);
    expect(ev("6 == 6")).toEqual(true);
    expect(ev("3 == 6")).toEqual(false);
    expect(ev("3 == []")).toEqual(false);
  });
  it("implements x != y", function() {
    expect(ev("6 != 3")).toEqual(true);
    expect(ev("6 != 6")).toEqual(false);
    expect(ev("3 != 6")).toEqual(true);
    expect(ev("3 != []")).toEqual(true);
  });
  it("implements x < y", function() {
    expect(ev("6 < 3")).toEqual(false);
    expect(ev("6 < 6")).toEqual(false);
    expect(ev("3 < 6")).toEqual(true);
    expect(ev("3 < []")).toEqual(undefined);
  });
  it("implements x <= y", function() {
    expect(ev("6 <= 3")).toEqual(false);
    expect(ev("6 <= 6")).toEqual(true);
    expect(ev("3 <= 6")).toEqual(true);
    expect(ev("3 <= []")).toEqual(undefined);
  });
  it("implements x > y", function() {
    expect(ev("6 > 3")).toEqual(true);
    expect(ev("6 > 6")).toEqual(false);
    expect(ev("3 > 6")).toEqual(false);
    expect(ev("3 > []")).toEqual(undefined);
  });
  it("implements x >= y", function() {
    expect(ev("6 >= 3")).toEqual(true);
    expect(ev("6 >= 6")).toEqual(true);
    expect(ev("3 >= 6")).toEqual(false);
    expect(ev("3 >= []")).toEqual(undefined);
  });
  it("implements isFinite()", function() {
    expect(ev("(123).isFinite()")).toEqual(true);
    expect(ev("(Infinity).isFinite()")).toEqual(false);
  });
  it("implements isInteger()", function() {
    expect(ev("(3.0).isInteger()")).toEqual(true);
    expect(ev("(3.5).isInteger()")).toEqual(false);
  });
  it("implements isNaN()", function() {
    expect(ev("(123).isNaN()")).toEqual(false);
    expect(ev("(NaN).isNaN()")).toEqual(true);
  });
  it("implements isSafeInteger()", function() {
    expect(ev("(123).isSafeInteger()")).toEqual(true);
    expect(ev("(0.5).isSafeInteger()")).toEqual(false);
  });
  it("implements toExponential()", function() {
    expect(ev("(2.341).toExponential()")).toEqual("2.341e+0");
  });
  it("implements toExponential(fractionDigits)", function() {
    expect(ev("(1.2).toExponential(0)")).toEqual("1e+0");
    expect(ev("(1.2).toExponential(20)")).toEqual("1.19999999999999995559e+0");
    expect(ev("(1.2).toExponential([])")).toEqual(undefined);
    expect(ev("(1.2).toExponential(NaN)")).toEqual(undefined);
    expect(ev("(1.2).toExponential(-1)")).toEqual(undefined);
    expect(ev("(1.2).toExponential(21)")).toEqual(undefined);
  });
  it("implements toFixed()", function() {
    expect(ev("(2.3456).toFixed()")).toEqual("2");
  });
  it("implements toFixed(digits)", function() {
    expect(ev("(1.2).toFixed(0)")).toEqual("1");
    expect(ev("(1.2).toFixed(20)")).toEqual("1.19999999999999995559");
    expect(ev("(1.2).toFixed([])")).toEqual(undefined);
    expect(ev("(1.2).toFixed(NaN)")).toEqual(undefined);
    expect(ev("(1.2).toFixed(-1)")).toEqual(undefined);
    expect(ev("(1.2).toFixed(21)")).toEqual(undefined);
  });
  it("implements toPrecision()", function() {
    expect(ev("(12.345).toPrecision()")).toEqual("12.345");
  });
  it("implements toPrecision(precision)", function() {
    expect(ev("(1.2).toPrecision(1)")).toEqual("1");
    expect(ev("(1.2).toPrecision(21)")).toEqual("1.19999999999999995559");
    expect(ev("(1.2).toPrecision([])")).toEqual(undefined);
    expect(ev("(1.2).toPrecision(NaN)")).toEqual(undefined);
    expect(ev("(1.2).toPrecision(0)")).toEqual(undefined);
    expect(ev("(1.2).toPrecision(22)")).toEqual(undefined);
  });
  it("implements toBoolean()", function() {
    expect(ev("(-1).toBoolean()")).toEqual(true);
    expect(ev("(0).toBoolean()")).toEqual(false);
    expect(ev("(1).toBoolean()")).toEqual(true);
  });
  it("implements toString()", function() {
    expect(ev("(7).toString()")).toEqual("7");
  });
  it("implements toString(radix)", function() {
    expect(ev("(7).toString(2)")).toEqual("111");
    expect(ev("(47).toString(36)")).toEqual("1b");
    expect(ev("(7).toString([])")).toEqual(undefined);
    expect(ev("(7).toString(NaN)")).toEqual(undefined);
    expect(ev("(7).toString(1)")).toEqual(undefined);
    expect(ev("(47).toString(37)")).toEqual(undefined);
  });
  it("implements type()", function() {
    expect(ev("3.type()")).toEqual("number");
  });
});

describe("boolean", function() {
  const ev = function(line) {
    const expr = compileExpr("~/r/", line);
    return evaluate(expr, Map({}));
  };
  it("can be constructed", function() {
    expect(ev("true")).toEqual(true);
    expect(ev("false")).toEqual(false);
  });
  it("implements x == y", function() {
    expect(ev("true == true")).toEqual(true);
    expect(ev("true == false")).toEqual(false);
    expect(ev("false == true")).toEqual(false);
    expect(ev("false == false")).toEqual(true);
    expect(ev("true == []")).toEqual(false);
  });
  it("implements x != y", function() {
    expect(ev("true != true")).toEqual(false);
    expect(ev("true != false")).toEqual(true);
    expect(ev("false != true")).toEqual(true);
    expect(ev("false != false")).toEqual(false);
    expect(ev("true != []")).toEqual(true);
  });
  it("implements x && y", function() {
    expect(ev("true && true")).toEqual(true);
    expect(ev("true && false")).toEqual(false);
    expect(ev("false && true")).toEqual(false);
    expect(ev("false && false")).toEqual(false);
    expect(ev("true && []")).toEqual(undefined);
  });
  it("implements x || y", function() {
    expect(ev("true || true")).toEqual(true);
    expect(ev("true || false")).toEqual(true);
    expect(ev("false || true")).toEqual(true);
    expect(ev("false || false")).toEqual(false);
    expect(ev("true || []")).toEqual(undefined);
  });
  it("implements !x", function() {
    expect(ev("!true")).toEqual(false);
    expect(ev("!false")).toEqual(true);
  });
  it("implements toNumber", function() {
    expect(ev("(true).toNumber()")).toEqual(1);
    expect(ev("(false).toNumber()")).toEqual(0);
  });
  it("implements toString()", function() {
    expect(ev("true.toString()")).toEqual("true");
    expect(ev("false.toString()")).toEqual("false");
  });
  it("implements type()", function() {
    expect(ev("true.type()")).toEqual("boolean");
  });
});

describe("string", function() {
  const ev = function(line) {
    const expr = compileExpr("~/r/", line);
    return evaluate(expr, Map({}));
  };
  it("can be constructed", function() {
    expect(ev('"abc"')).toEqual("abc");
  });
  it("implements x + y", function() {
    expect(ev('"abc" + "def"')).toEqual("abcdef");
    expect(ev('"abc" + []')).toEqual(undefined);
  });
  it("implements x == y", function() {
    expect(ev('"def" == "abc"')).toEqual(false);
    expect(ev('"def" == "def"')).toEqual(true);
    expect(ev('"def" == "ghi"')).toEqual(false);
    expect(ev('"def" == []')).toEqual(false);
  });
  it("implements x != y", function() {
    expect(ev('"def" != "abc"')).toEqual(true);
    expect(ev('"def" != "def"')).toEqual(false);
    expect(ev('"def" != "ghi"')).toEqual(true);
    expect(ev('"def" != []')).toEqual(true);
  });
  it("implements x < y", function() {
    expect(ev('"def" < "abc"')).toEqual(false);
    expect(ev('"def" < "def"')).toEqual(false);
    expect(ev('"def" < "ghi"')).toEqual(true);
    expect(ev('"def" < []')).toEqual(undefined);
  });
  it("implements x <= y", function() {
    expect(ev('"def" <= "abc"')).toEqual(false);
    expect(ev('"def" <= "def"')).toEqual(true);
    expect(ev('"def" <= "ghi"')).toEqual(true);
    expect(ev('"def" <= []')).toEqual(undefined);
  });
  it("implements x > y", function() {
    expect(ev('"def" > "abc"')).toEqual(true);
    expect(ev('"def" > "def"')).toEqual(false);
    expect(ev('"def" > "ghi"')).toEqual(false);
    expect(ev('"def" > []')).toEqual(undefined);
  });
  it("implements x >= y", function() {
    expect(ev('"def" >= "abc"')).toEqual(true);
    expect(ev('"def" >= "def"')).toEqual(true);
    expect(ev('"def" >= "ghi"')).toEqual(false);
    expect(ev('"def" >= []')).toEqual(undefined);
  });
  it("implements get(index)", function() {
    expect(ev('"abc".get(1)')).toEqual("b");
    expect(ev('"abc".get(100)')).toEqual("");
    expect(ev('"abc".get([])')).toEqual(undefined);
  });
  it("implements charCodeAt(index)", function() {
    expect(ev('"abc".charCodeAt(1)')).toEqual(98);
    expect(ev('"abc".charCodeAt([])')).toEqual(undefined);
  });
  it("implements concat(string)", function() {
    expect(ev('"abc".concat("def")')).toEqual("abcdef");
    expect(ev('"abc".concat([])')).toEqual(undefined);
  });
  it("implements endsWith(searchString)", function() {
    expect(ev('"abcdef".endsWith("def")')).toEqual(true);
    expect(ev('"abcdef".endsWith("abc")')).toEqual(false);
    expect(ev('"abcdef".endsWith([])')).toEqual(undefined);
  });
  it("implements endsWith(searchString, position)", function() {
    expect(ev('"abcdef".endsWith("abc", 3)')).toEqual(true);
    expect(ev('"abcdef".endsWith("abc", 4)')).toEqual(false);
    expect(ev('"abcdef".endsWith([], 3)')).toEqual(undefined);
    expect(ev('"abcdef".endsWith("abc", [])')).toEqual(undefined);
  });
  it("implements includes(searchString)", function() {
    expect(ev('"abcdef".includes("bcd")')).toEqual(true);
    expect(ev('"abcdef".includes("bbb")')).toEqual(false);
    expect(ev('"abcdef".includes([])')).toEqual(undefined);
  });
  it("implements includes(searchString, position)", function() {
    expect(ev('"abcdef".includes("bcd", 1)')).toEqual(true);
    expect(ev('"abcdef".includes("bcd", 2)')).toEqual(false);
    expect(ev('"abcdef".includes([], 2)')).toEqual(undefined);
    expect(ev('"abcdef".includes("bcd", [])')).toEqual(undefined);
  });
  it("implements indexOf(searchValue)", function() {
    expect(ev('"ababa".indexOf("b")')).toEqual(1);
    expect(ev('"ababa".indexOf([])')).toEqual(undefined);
  });
  it("implements indexOf(searchValue, fromIndex)", function() {
    expect(ev('"ababa".indexOf("b", 2)')).toEqual(3);
    expect(ev('"ababa".indexOf([], 2)')).toEqual(undefined);
    expect(ev('"ababa".indexOf("b", [])')).toEqual(undefined);
  });
  it("implements lastIndexOf(searchValue)", function() {
    expect(ev('"ababa".lastIndexOf("b")')).toEqual(3);
    expect(ev('"ababa".lastIndexOf([])')).toEqual(undefined);
  });
  it("implements lastIndexOf(searchValue, fromIndex)", function() {
    expect(ev('"ababa".lastIndexOf("b", 2)')).toEqual(1);
    expect(ev('"ababa".lastIndexOf([], 2)')).toEqual(undefined);
    expect(ev('"ababa".lastIndexOf("b", [])')).toEqual(undefined);
  });
  it("implements length()", function() {
    expect(ev('"ababa".length()')).toEqual(5);
  });
  it("implements match(pattern)", function() {
    expect(ev('"abaca".match("a.")')).toEqual(List(["ab"]));
    expect(ev('"abaca".match("z.")')).toEqual(List([]));
    expect(ev('"abaca".match([])')).toEqual(undefined);
    expect(ev('"abaca".match("[")')).toEqual(undefined);
  });
  it("implements match(pattern, flags)", function() {
    expect(ev('"abaca".match("a.", "")')).toEqual(List(["ab"]));
    expect(ev('"abaca".match("z.", "")')).toEqual(List([]));
    expect(ev('"abaca".match("a.", "g")')).toEqual(List(["ab", "ac"]));
    expect(ev('"abaca".match([], "g")')).toEqual(undefined);
    expect(ev('"abaca".match("[", "g")')).toEqual(undefined);
    expect(ev('"abaca".match("a.", [])')).toEqual(undefined);
    expect(ev('"abaca".match("a.", "z")')).toEqual(undefined);
  });
  it("implements repeat(count)", function() {
    expect(ev('"abc".repeat(2)')).toEqual("abcabc");
    expect(ev('"abc".repeat([])')).toEqual(undefined);
    expect(ev('"abc".repeat(-1)')).toEqual(undefined);
    expect(ev('"abc".repeat(Infinity)')).toEqual(undefined);
  });
  it("implements replace(newSubstr, pattern)", function() {
    expect(ev('"ababa".replace("BA", "b.")')).toEqual("aBAba");
    expect(ev('"ababa".replace("BA", "z.")')).toEqual("ababa");
    expect(ev('"ababa".replace([], "b.")')).toEqual(undefined);
    expect(ev('"ababa".replace("BA", [])')).toEqual(undefined);
    expect(ev('"ababa".replace("BA", "[")')).toEqual(undefined);
  });
  it("implements replace(newSubstr, pattern, flags)", function() {
    expect(ev('"ababa".replace("BA", "b.", "")')).toEqual("aBAba");
    expect(ev('"ababa".replace("<$&>", "b.", "")')).toEqual("a<ba>ba");
    expect(ev('"ababa".replace("BA", "b.", "g")')).toEqual("aBABA");
    expect(ev('"ababa".replace("BA", "z.", "g")')).toEqual("ababa");
    expect(ev('"ababa".replace([], "b.", "g")')).toEqual(undefined);
    expect(ev('"ababa".replace("BA", [], "g")')).toEqual(undefined);
    expect(ev('"ababa".replace("BA", "[", "g")')).toEqual(undefined);
    expect(ev('"ababa".replace("BA", "b.", "z")')).toEqual(undefined);
  });
  it("implements search(pattern)", function() {
    expect(ev('"abcde".search("cd")')).toEqual(2);
    expect(ev('"abcde".search("cc")')).toEqual(-1);
    expect(ev('"abc".search([])')).toEqual(undefined);
    expect(ev('"abc".search("[")')).toEqual(undefined);
  });
  it("implements search(pattern, flags)", function() {
    expect(ev('"abcd\\ne".search("d$", "m")')).toEqual(3);
    expect(ev('"abcd\\ne".search("d$", "")')).toEqual(-1);
    expect(ev('"abcde".search([], "m")')).toEqual(undefined);
    expect(ev('"abc".search("[", "m")')).toEqual(undefined);
    expect(ev('"abc".search("abc", [])')).toEqual(undefined);
    expect(ev('"abc".search("abc", "z")')).toEqual(undefined);
  });
  it("implements slice(beginIndex)", function() {
    expect(ev('"abcdef".slice(3)')).toEqual("def");
    expect(ev('"abcdef".slice([])')).toEqual(undefined);
  });
  it("implements slice(beginIndex, endIndex)", function() {
    expect(ev('"abcdef".slice(3, 5)')).toEqual("de");
    expect(ev('"abcdef".slice([], 5)')).toEqual(undefined);
    expect(ev('"abcdef".slice(3, [])')).toEqual(undefined);
  });
  it("implements split()", function() {
    expect(ev('"a b c".split()')).toEqual(List(["a b c"]));
  });
  it("implements split(separator)", function() {
    expect(ev('"a b".split(" ")')).toEqual(List(["a", "b"]));
    expect(ev('"a b".split([])')).toEqual(undefined);
  });
  it("implements split(separator, limit)", function() {
    expect(ev('"a b".split(" ", 1)')).toEqual(List(["a"]));
    expect(ev('"a b".split([], 1)')).toEqual(undefined);
    expect(ev('"a b".split(" ", [])')).toEqual(undefined);
  });
  it("implements startsWith(searchString)", function() {
    expect(ev('"abcdef".startsWith("ab")')).toEqual(true);
    expect(ev('"abcdef".startsWith("cd")')).toEqual(false);
    expect(ev('"abcdef".startsWith([])')).toEqual(undefined);
  });
  it("implements startsWith(searchString, position)", function() {
    expect(ev('"abcdef".startsWith("ab", 2)')).toEqual(false);
    expect(ev('"abcdef".startsWith("cd", 2)')).toEqual(true);
    expect(ev('"abcdef".startsWith([], 2)')).toEqual(undefined);
    expect(ev('"abcdef".startsWith("cd", [])')).toEqual(undefined);
  });
  it("implements substr(start)", function() {
    expect(ev('"abcdef".substr(3)')).toEqual("def");
    expect(ev('"abcdef".substr([])')).toEqual(undefined);
  });
  it("implements substr(start, length)", function() {
    expect(ev('"abcdef".substr(3, 2)')).toEqual("de");
    expect(ev('"abcdef".substr([], 2)')).toEqual(undefined);
    expect(ev('"abcdef".substr(3, [])')).toEqual(undefined);
  });
  it("implements substring(indexStart)", function() {
    expect(ev('"abcdef".substring(3)')).toEqual("def");
    expect(ev('"abcdef".substring([])')).toEqual(undefined);
  });
  it("implements substring(indexStart, indexEnd)", function() {
    expect(ev('"abcdef".substring(3, 5)')).toEqual("de");
    expect(ev('"abcdef".substring([], 5)')).toEqual(undefined);
    expect(ev('"abcdef".substring(3, [])')).toEqual(undefined);
  });
  it("implements test(pattern)", function() {
    expect(ev('"abcdef".test("c.e")')).toEqual(true);
    expect(ev('"abcdef".test("c.f")')).toEqual(false);
    expect(ev('"abcdef".test([])')).toEqual(undefined);
    expect(ev('"abcdef".test("[")')).toEqual(undefined);
  });
  it("implements test(pattern, flags)", function() {
    expect(ev('"abc\\ndef".test("abc$", "m")')).toEqual(true);
    expect(ev('"abc\\ndef".test("abc$", "")')).toEqual(false);
    expect(ev('"abcdef".test([], "m")')).toEqual(undefined);
    expect(ev('"abcdef".test("[", "m")')).toEqual(undefined);
    expect(ev('"abcdef".test("abc", [])')).toEqual(undefined);
    expect(ev('"abcdef".test("abc", "z")')).toEqual(undefined);
  });
  it("implements toLowerCase()", function() {
    expect(ev('"ABC".toLowerCase()')).toEqual("abc");
  });
  it("implements toUpperCase()", function() {
    expect(ev('"abc".toUpperCase()')).toEqual("ABC");
  });
  it("implements trim()", function() {
    expect(ev('"   abc   ".trim()')).toEqual("abc");
  });
  it("implements toString()", function() {
    expect(ev('"abc".toString()')).toEqual('"abc"');
  });
  it("implements type()", function() {
    expect(ev('"abc".type()')).toEqual("string");
  });
});

describe("list", function() {
  const ev = function(line) {
    const expr = compileExpr("~/r/", line);
    return evaluate(expr, Map({}));
  };
  it("can be constructed", function() {
    expect(ev("[4, 5, 6]")).toEqual(List([4, 5, 6]));
  });
  it("implements x == y", function() {
    expect(ev("[2, 3, 4] == [2, 3, 4]")).toEqual(true);
    expect(ev("[2, 3, 4] == [2, 3, 5]")).toEqual(false);
    expect(ev("[2, 3, 4] == 2")).toEqual(false);
  });
  it("implements x != y", function() {
    expect(ev("[2, 3, 4] != [2, 3, 4]")).toEqual(false);
    expect(ev("[2, 3, 4] != [2, 3, 5]")).toEqual(true);
    expect(ev("[2, 3, 4] != 2")).toEqual(true);
  });
  it("implements size()", function() {
    expect(ev("[4, 5, 6].size()")).toEqual(3);
  });
  it("implements set(index, value)", function() {
    expect(ev("[4, 5, 6].set(1, 7)")).toEqual(List([4, 7, 6]));
    expect(ev("[4].set(2, 6)")).toEqual(List([4, undefined, 6]));
    expect(ev("[4, 5, 6].set([], 7)")).toEqual(undefined);
  });
  it("implements delete(index)", function() {
    expect(ev("[4, 5, 6].delete(1)")).toEqual(List([4, 6]));
    expect(ev("[4, 5, 6].delete(99)")).toEqual(List([4, 5, 6]));
    expect(ev("[4, 5, 6].delete([])")).toEqual(undefined);
  });
  it("implements insert(index, value)", function() {
    expect(ev("[4, 5, 6].insert(1, 7)")).toEqual(List([4, 7, 5, 6]));
    expect(ev("[4, 5, 6].insert([], 7)")).toEqual(undefined);
  });
  it("implements clear()", function() {
    expect(ev("[4, 5, 6].clear()")).toEqual(List([]));
  });
  it("implements push(value)", function() {
    expect(ev("[4, 5, 6].push(7)")).toEqual(List([4, 5, 6, 7]));
  });
  it("implements pop()", function() {
    expect(ev("[4, 5, 6].pop()")).toEqual(List([4, 5]));
    expect(ev("[].pop()")).toEqual(List([]));
  });
  it("implements unshift(value)", function() {
    expect(ev("[4, 5, 6].unshift(3)")).toEqual(List([3, 4, 5, 6]));
  });
  it("implements shift()", function() {
    expect(ev("[4, 5, 6].shift()")).toEqual(List([5, 6]));
    expect(ev("[].shift()")).toEqual(List([]));
  });
  it("implements setSize(size)", function() {
    expect(ev("[4, 5, 6].setSize(1)")).toEqual(List([4]));
    expect(ev("[4].setSize(3)")).toEqual(List([4, undefined, undefined]));
    expect(ev("[4].setSize([])")).toEqual(undefined);
  });
  it("implements get(index)", function() {
    expect(ev("[4, 5, 6].get(2)")).toEqual(6);
    expect(ev("[4, 5, 6].get(9)")).toEqual(undefined);
    expect(ev("[4, 5, 6].get([])")).toEqual(undefined);
  });
  it("implements get(index, default)", function() {
    expect(ev("[4, 5, 6].get(2, 7)")).toEqual(6);
    expect(ev("[4, 5, 6].get(3, 7)")).toEqual(7);
    expect(ev("[4, 5, 6].get([], 7)")).toEqual(undefined);
  });
  it("implements has(index)", function() {
    expect(ev("[4, 5, 6].has(2)")).toEqual(true);
    expect(ev("[4, 5, 6].has(3)")).toEqual(false);
    expect(ev("[4, 5, 6].has([])")).toEqual(undefined);
  });
  it("implements includes(value)", function() {
    expect(ev("[4, 5, 6].includes(6)")).toEqual(true);
    expect(ev("[4, 5, 6].includes(7)")).toEqual(false);
  });
  it("implements first()", function() {
    expect(ev("[4, 5, 6].first()")).toEqual(4);
    expect(ev("[].first()")).toEqual(undefined);
  });
  it("implements last()", function() {
    expect(ev("[4, 5, 6].last()")).toEqual(6);
    expect(ev("[].last()")).toEqual(undefined);
  });
  it("implements keys()", function() {
    expect(ev("[4, 5, 6].keys()")).toEqual(List([0, 1, 2]));
  });
  it("implements reverse()", function() {
    expect(ev("[4, 5, 6].reverse()")).toEqual(List([6, 5, 4]));
  });
  it("implements sort()", function() {
    expect(ev("[5, 4, 6].sort()")).toEqual(List([4, 5, 6]));
  });
  it("implements slice()", function() {
    expect(ev("[4, 5, 6, 7].slice()")).toEqual(List([4, 5, 6, 7]));
  });
  it("implements slice(begin)", function() {
    expect(ev("[4, 5, 6, 7].slice(1)")).toEqual(List([5, 6, 7]));
    expect(ev("[4, 5, 6, 7].slice([])")).toEqual(undefined);
  });
  it("implements slice(begin, end)", function() {
    expect(ev("[4, 5, 6, 7].slice(1, 3)")).toEqual(List([5, 6]));
    expect(ev("[4, 5, 6, 7].slice([], 3)")).toEqual(undefined);
    expect(ev("[4, 5, 6, 7].slice(1, [])")).toEqual(undefined);
  });
  it("implements rest()", function() {
    expect(ev("[4, 5, 6].rest()")).toEqual(List([5, 6]));
    expect(ev("[].rest()")).toEqual(List([]));
  });
  it("implements butLast()", function() {
    expect(ev("[4, 5, 6].butLast()")).toEqual(List([4, 5]));
    expect(ev("[].butLast()")).toEqual(List([]));
  });
  it("implements skip(amount)", function() {
    expect(ev("[4, 5, 6, 7].skip(2)")).toEqual(List([6, 7]));
    expect(ev("[4, 5, 6].skip([])")).toEqual(undefined);
  });
  it("implements skipLast(amount)", function() {
    expect(ev("[4, 5, 6, 7].skipLast(2)")).toEqual(List([4, 5]));
    expect(ev("[4, 5, 6].skipLast([])")).toEqual(undefined);
  });
  it("implements take(amount)", function() {
    expect(ev("[4, 5, 6, 7].take(2)")).toEqual(List([4, 5]));
    expect(ev("[4, 5, 6].take([])")).toEqual(undefined);
  });
  it("implements takeLast(x)", function() {
    expect(ev("[4, 5, 6, 7].takeLast(2)")).toEqual(List([6, 7]));
    expect(ev("[4, 5, 6].takeLast([])")).toEqual(undefined);
  });
  it("implements concat(other)", function() {
    expect(ev("[1, 2].concat([3, 4])")).toEqual(List([1, 2, 3, 4]));
    expect(ev("[1, 2].concat(3)")).toEqual(undefined);
  });
  it("implements flatten()", function() {
    const v = ev("[4, [5, [6], 7], 8].flatten()");
    expect(v).toEqual(List([4, 5, 6, 7, 8]));
  });
  it("implements interpose(separator)", function() {
    expect(ev("[1, 2, 3].interpose(5)")).toEqual(List([1, 5, 2, 5, 3]));
  });
  it("implements splice(index)", function() {
    expect(ev("[3, 4, 5, 6, 7].splice(2)")).toEqual(List([3, 4]));
    expect(ev("[3, 4, 5].splice([])")).toEqual(undefined);
  });
  it("implements splice(index, removeNum)", function() {
    expect(ev("[3, 4, 5, 6, 7].splice(2, 1)")).toEqual(List([3, 4, 6, 7]));
    expect(ev("[3, 4, 5].splice([], 1)")).toEqual(undefined);
    expect(ev("[3, 4, 5].splice(2, [])")).toEqual(undefined);
  });
  it("implements join()", function() {
    expect(ev('["a", "b", "c"].join()')).toEqual("a,b,c");
  });
  it("implements join(separator)", function() {
    expect(ev('["a", "b", "c"].join(".")')).toEqual("a.b.c");
    expect(ev('["a", "b", "c"].join(#{})')).toEqual("a#{}b#{}c");
  });
  it("implements isEmpty()", function() {
    expect(ev("[].isEmpty()")).toEqual(true);
    expect(ev("[3].isEmpty()")).toEqual(false);
  });
  it("implements keyOf(searchValue)", function() {
    expect(ev("[3, 4, 5, 4, 3].keyOf(4)")).toEqual(1);
    expect(ev("[3, 4, 5].keyOf(9)")).toEqual(undefined);
  });
  it("implements lastKeyOf(searchValue)", function() {
    expect(ev("[3, 4, 5, 4, 3].lastKeyOf(4)")).toEqual(3);
    expect(ev("[3, 4, 5].lastKeyOf(9)")).toEqual(undefined);
  });
  it("implements max()", function() {
    expect(ev("[3, 4, 5, 4, 3].max()")).toEqual(5);
  });
  it("implements min()", function() {
    expect(ev("[5, 4, 3, 4, 5].min()")).toEqual(3);
  });
  it("implements indexOf(searchValue)", function() {
    expect(ev("[3, 4, 5, 4, 3].indexOf(4)")).toEqual(1);
    expect(ev("[3, 4, 5].indexOf(9)")).toEqual(-1);
  });
  it("implements lastIndexOf(searchValue)", function() {
    expect(ev("[3, 4, 5, 4, 3].lastIndexOf(4)")).toEqual(3);
    expect(ev("[3, 4, 5].lastIndexOf(9)")).toEqual(-1);
  });
  it("implements toMap()", function() {
    const v = ev("[4, 5, 6].toMap()");
    expect(v).toEqual(Map.of(0, 4, 1, 5, 2, 6));
  });
  it("implements toSet()", function() {
    const v = ev("[4, 5, 6].toSet()");
    expect(is(v, Set.of(4, 5, 6))).toEqual(true);
  });
  it("implements toString()", function() {
    const v = ev('["a", "b", "c"].toString()');
    expect(v).toEqual('[ "a", "b", "c" ]');
  });
  it("implements type()", function() {
    expect(ev("[].type()")).toEqual("list");
  });
});

describe("map", function() {
  const ev = function(line) {
    const expr = compileExpr("~/r/", line);
    return evaluate(expr, Map({}));
  };
  it("can be constructed", function() {
    const v = ev("{4: 5, 6: 7, 8: 9}");
    expect(is(v, Map.of(4, 5, 6, 7, 8, 9))).toEqual(true);
  });
  it("implements x == y", function() {
    expect(ev("{2: 3} == {2: 3}")).toEqual(true);
    expect(ev("{2: 3} == {2: 4}")).toEqual(false);
    expect(ev("{2: 3} == []")).toEqual(false);
  });
  it("implements x != y", function() {
    expect(ev("{2: 3} != {2: 3}")).toEqual(false);
    expect(ev("{2: 3} != {2: 4}")).toEqual(true);
    expect(ev("{2: 3} != []")).toEqual(true);
  });
  it("implements size()", function() {
    expect(ev("{4: 44, 5: 55, 6: 66}.size()")).toEqual(3);
  });
  it("implements set(key, value)", function() {
    const v = ev("{4: 44, 5: 55}.set(5, 77)");
    expect(is(v, Map.of(4, 44, 5, 77))).toEqual(true);
  });
  it("implements delete(key)", function() {
    expect(is(ev("{4: 44, 5: 55}.delete(5)"), Map.of(4, 44))).toEqual(true);
    expect(is(ev("{4: 44}.delete(5)"), Map.of(4, 44))).toEqual(true);
  });
  it("implements clear()", function() {
    const v = ev("{4: 44, 5: 55, 6: 66}.clear()");
    expect(is(v, Map.of())).toEqual(true);
  });
  it("implements first()", function() {
    expect(ev("{4: 44, 5: 55}.first()")).toEqual(44);
  });
  it("implements rest()", function() {
    const v = ev("{4: 44, 5: 55}.rest()");
    expect(is(v, Map.of(5, 55))).toEqual(true);
  });
  it("implements get(key)", function() {
    expect(ev("{4: 44, 5: 55}.get(4)")).toEqual(44);
  });
  it("implements get(key, default)", function() {
    expect(ev("{4: 44, 5: 55}.get(4, 88)")).toEqual(44);
    expect(ev("{4: 44, 5: 55}.get(8, 88)")).toEqual(88);
  });
  it("implements has(key)", function() {
    expect(ev("{4: 44, 5: 55}.has(4)")).toEqual(true);
    expect(ev("{4: 44, 5: 55}.has(8)")).toEqual(false);
  });
  it("implements keys()", function() {
    expect(ev("{4: 44, 5: 55}.keys()")).toEqual(List.of(4, 5));
  });
  it("implements toList()", function() {
    expect(ev("{4: 44, 5: 55}.toList()")).toEqual(List.of(44, 55));
  });
  it("implements toSet()", function() {
    const v = ev("{4: 44, 5: 55}.toSet()");
    expect(is(v, Set.of(44, 55))).toEqual(true);
  });
  it("implements toString()", function() {
    const v = ev('{"x": 3, "y": 4}.toString()');
    expect(v).toEqual('{ "x": 3, "y": 4 }');
  });
  it("implements type()", function() {
    expect(ev("{}.type()")).toEqual("map");
  });
});

describe("set", function() {
  const ev = function(line) {
    const expr = compileExpr("~/r/", line);
    return evaluate(expr, Map({}));
  };
  it("can be constructed", function() {
    const v = ev("#{4, 5, 6}");
    expect(is(v, Set.of(4, 5, 6))).toEqual(true);
  });
  it("implements x == y", function() {
    expect(ev("#{2, 3, 4} == #{2, 3, 4}")).toEqual(true);
    expect(ev("#{2, 3, 4} == #{2, 3, 5}")).toEqual(false);
    expect(ev("#{2, 3, 4} == [2, 3, 4]")).toEqual(false);
  });
  it("implements x != y", function() {
    expect(ev("#{2, 3, 4} != #{2, 3, 4}")).toEqual(false);
    expect(ev("#{2, 3, 4} != #{2, 3, 5}")).toEqual(true);
    expect(ev("#{2, 3, 4} != [2, 3, 4]")).toEqual(true);
  });
  it("implements size()", function() {
    expect(ev("#{4, 5, 6}.size()")).toEqual(3);
  });
  it("implements add(value)", function() {
    const v = ev("#{4, 5, 6}.add(9)");
    expect(is(v, Set.of(4, 5, 6, 9))).toEqual(true);
  });
  it("implements delete(value)", function() {
    const v = ev("#{4, 5, 6}.delete(5)");
    expect(is(v, Set.of(4, 6))).toEqual(true);
  });
  it("implements clear()", function() {
    const v = ev("#{4, 5, 6}.clear()");
    expect(is(v, Set.of())).toEqual(true);
  });
  it("implements union(other)", function() {
    const v = ev("#{4, 5}.union(#{5, 6})");
    expect(is(v, Set.of(4, 5, 6))).toEqual(true);
    expect(ev("#{4, 5}.union(5)")).toEqual(undefined);
  });
  it("implements intersect(other)", function() {
    const v = ev("#{4, 5}.intersect(#{5, 6})");
    expect(is(v, Set.of(5))).toEqual(true);
    expect(ev("#{4, 5}.intersect(5)")).toEqual(undefined);
  });
  it("implements subtract(other)", function() {
    const v = ev("#{4, 5}.subtract(#{5})");
    expect(is(v, Set.of(4))).toEqual(true);
    expect(ev("#{4, 5}.subtract(5)")).toEqual(undefined);
  });
  it("implements has(value)", function() {
    expect(ev("#{4}.has(3)")).toEqual(false);
    expect(ev("#{4}.has(4)")).toEqual(true);
  });
  it("implements first()", function() {
    expect(ev("#{4}.first()")).toEqual(4);
  });
  it("implements rest()", function() {
    const v = ev("#{4}.rest()");
    expect(is(v, Set.of())).toEqual(true);
  });
  it("implements flatten()", function() {
    const v = ev("#{4, #{5, #{6}, 7}, 8}.flatten()");
    expect(is(v, Set.of(4, 5, 6, 7, 8))).toEqual(true);
  });
  it("implements join()", function() {
    const v = ev('#{"a", "b"}.join()');
    expect(v == "a,b" || v == "b,a").toEqual(true);
  });
  it("implements join(separator)", function() {
    const v = ev('#{"a", "b"}.join(".")');
    expect(v == "a.b" || v == "b.a").toEqual(true);
    expect(ev('#{"a", "b"}.join([])')).toEqual(undefined);
  });
  it("implements isEmpty()", function() {
    expect(ev("#{0}.isEmpty()")).toEqual(false);
    expect(ev("#{}.isEmpty()")).toEqual(true);
  });
  it("implements max()", function() {
    expect(ev("#{4, 5, 6}.max()")).toEqual(6);
  });
  it("implements min()", function() {
    expect(ev("#{4, 5, 6}.min()")).toEqual(4);
  });
  it("implements isSubset(other)", function() {
    expect(ev("#{4, 5, 6}.isSubset(#{5, 6, 7})")).toEqual(false);
    expect(ev("#{5, 6}.isSubset(#{5, 6, 7})")).toEqual(true);
    expect(ev("#{5, 6}.isSubset(5)")).toEqual(undefined);
  });
  it("implements isSuperset(other)", function() {
    expect(ev("#{4, 5, 6}.isSuperset(#{5, 6, 7})")).toEqual(false);
    expect(ev("#{4, 5, 6}.isSuperset(#{5, 6})")).toEqual(true);
    expect(ev("#{4, 5, 6}.isSuperset(5)")).toEqual(undefined);
  });
  it("implements toList()", function() {
    const v = ev("#{4}.toList()");
    expect(is(v, List([4]))).toEqual(true);
  });
  it("implements toString()", function() {
    expect(ev("#{3, 4}.toString()")).toEqual("#{ 3, 4 }");
  });
  it("implements type()", function() {
    expect(ev("#{}.type()")).toEqual("set");
  });
});

describe("undefined", function() {
  const ev = function(line) {
    const expr = compileExpr("~/r/", line);
    return evaluate(expr, Map({}));
  };
  it("can be constructed", function() {
    const v = ev("undefined");
    expect(v).toEqual(undefined);
  });
  it("implements x == y", function() {
    const vEq = ev("undefined == undefined");
    expect(vEq).toEqual(true);
    const vNeq = ev("undefined == 3");
    expect(vNeq).toEqual(false);
  });
  it("implements x != y", function() {
    const vEq = ev("undefined != undefined");
    expect(vEq).toEqual(false);
    const vNeq = ev("undefined != 3");
    expect(vNeq).toEqual(true);
  });
  it("implements toString()", function() {
    const v = ev("undefined.toString()");
    expect(v).toEqual("undefined");
  });
  it("implements type()", function() {
    expect(ev("undefined.type()")).toEqual("undefined");
  });
});

describe("functions", function() {
  const ev = function(line) {
    const source = [
      "$.abs(x) = #!abs",
      "$.acos(x) = #!acos",
      "$.asin(x) = #!asin",
      "$.atan(x) = #!atan",
      "$.atan2(y,x) = #!atan2",
      "$.ceil(x) = #!ceil",
      "$.cos(x) = #!cos",
      "$.exp(x) = #!exp",
      "$.floor(x) = #!floor",
      "$.chr(x) = #!chr",
      "$.log(x) = #!log",
      "$.max(x,y) = #!max",
      "$.min(x,y) = #!min",
      "$.parseFloat(x) = #!parseFloat",
      "$.parseInt(x) = #!parseInt",
      "$.parseInt(x, y) = #!parseInt2",
      "$.pow(x,y) = #!pow",
      "$.round(x) = #!round",
      "$.sin(x) = #!sin",
      "$.sqrt(x) = #!sqrt",
      "$.tan(x) = #!tan"
    ].join("\n");
    const obj = compileObject("~/f/", source);
    const path = List(["f"]);
    const tree = Map.of(path, obj);
    const expr = compileExpr("~/m/", line);
    return evaluate(expr, tree);
  };
  it("executes #!abs", function() {
    expect(ev("F.abs(-2)")).toEqual(2);
    expect(ev("F.abs([])")).toEqual(undefined);
  });
  it("executes #!acos", function() {
    expect(ev("F.acos(0.5)")).toEqual(Math.acos(0.5));
    expect(ev("F.acos([])")).toEqual(undefined);
  });
  it("executes #!asin", function() {
    expect(ev("F.asin(0.5)")).toEqual(Math.asin(0.5));
    expect(ev("F.asin([])")).toEqual(undefined);
  });
  it("executes #!atan", function() {
    expect(ev("F.atan(0.5)")).toEqual(Math.atan(0.5));
    expect(ev("F.atan([])")).toEqual(undefined);
  });
  it("executes #!atan2", function() {
    expect(ev("F.atan2(1, 3)")).toEqual(Math.atan2(1, 3));
    expect(ev("F.atan2([], 3)")).toEqual(undefined);
    expect(ev("F.atan2(1, [])")).toEqual(undefined);
  });
  it("executes #!ceil", function() {
    expect(ev("F.ceil(2.1)")).toEqual(3);
    expect(ev("F.ceil([])")).toEqual(undefined);
  });
  it("executes #!cos", function() {
    expect(ev("F.cos(1)")).toEqual(Math.cos(1));
    expect(ev("F.cos([])")).toEqual(undefined);
  });
  it("executes #!exp", function() {
    expect(ev("F.exp(2)")).toEqual(Math.exp(2));
    expect(ev("F.exp([])")).toEqual(undefined);
  });
  it("executes #!floor", function() {
    expect(ev("F.floor(2.9)")).toEqual(2);
    expect(ev("F.floor([])")).toEqual(undefined);
  });
  it("executes #!chr", function() {
    expect(ev("F.chr(97)")).toEqual("a");
    expect(ev("F.chr([])")).toEqual(undefined);
  });
  it("executes #!log", function() {
    expect(ev("F.log(5)")).toEqual(Math.log(5));
    expect(ev("F.log([])")).toEqual(undefined);
  });
  it("executes #!max", function() {
    expect(ev("F.max(5, 4)")).toEqual(5);
    expect(ev("F.max(4, 5)")).toEqual(5);
    expect(ev("F.max([], 4)")).toEqual(undefined);
    expect(ev("F.max(5, [])")).toEqual(undefined);
  });
  it("executes #!min", function() {
    expect(ev("F.min(4, 5)")).toEqual(4);
    expect(ev("F.min(5, 4)")).toEqual(4);
    expect(ev("F.min([], 4)")).toEqual(undefined);
    expect(ev("F.min(5, [])")).toEqual(undefined);
  });
  it("executes #!parseFloat", function() {
    expect(ev('F.parseFloat("2.5")')).toEqual(2.5);
    expect(ev("F.parseFloat([])")).toEqual(undefined);
  });
  it("executes #!parseInt", function() {
    expect(ev('F.parseInt("2.5")')).toEqual(2);
    expect(ev("F.parseInt([])")).toEqual(undefined);
  });
  it("executes #!parseInt2", function() {
    expect(ev('F.parseInt("11", 2)')).toEqual(3);
    expect(ev("F.parseInt([], 2)")).toEqual(undefined);
    expect(ev('F.parseInt("11", [])')).toEqual(undefined);
  });
  it("executes #!pow", function() {
    expect(ev("F.pow(2, 3)")).toEqual(8);
    expect(ev("F.pow([], 3)")).toEqual(undefined);
    expect(ev("F.pow(2, [])")).toEqual(undefined);
  });
  it("executes #!round", function() {
    expect(ev("F.round(2.1)")).toEqual(2);
    expect(ev("F.round(2.9)")).toEqual(3);
    expect(ev("F.round([])")).toEqual(undefined);
  });
  it("executes #!sin", function() {
    expect(ev("F.sin(1)")).toEqual(Math.sin(1));
    expect(ev("F.sin([])")).toEqual(undefined);
  });
  it("executes #!sqrt", function() {
    expect(ev("F.sqrt(16)")).toEqual(4);
    expect(ev("F.sqrt([])")).toEqual(undefined);
  });
  it("executes #!tan", function() {
    expect(ev("F.tan(1)")).toEqual(Math.tan(1));
    expect(ev("F.tan([])")).toEqual(undefined);
  });
});
