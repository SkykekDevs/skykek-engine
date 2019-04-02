"use strict";
// Tests for ../src/evaluate.js

const immutable = require("../src/immutable2.js");
const iList = immutable.List;
const iMap = immutable.Map;
const iSet = immutable.Set;
const is = immutable.is;

const compile = require("../src/compile.js");
const compileObject = compile.compileObject;
const compileExpr = compile.compileExpr;

const evaluate_ = require("../src/evaluate.js");
const evaluate = evaluate_.evaluate;

describe("evaluate", function() {
  const ev = function(line, classes) {
    const expr = compileExpr("", line);
    return evaluate(expr, classes);
  };
  it('throws "no matching rule found" on call with bad method name', function() {
    const classes = iMap();
    expect(function() {
      ev("(123).Hey()", classes);
    }).toThrow("no matching rule found");
  });
  it('throws "no matching rule found" on call with bad number of arguments', function() {
    const obj = compileObject("", "C", "$.M(x) = 3");
    const classes = iMap.of("C", obj);
    expect(function() {
      ev("C#.M()", classes);
    }).toThrow("no matching rule found");
  });
  it("evaluates calls", function() {
    const obj = compileObject("", "C", "$.M() = 3");
    const classes = iMap.of("C", obj);
    expect(ev("C#.M()", classes)).toEqual(3);
  });
  it("evaluates calls defined at run-time", function() {
    const obj = compileObject(
      "",
      "C",
      "$.M() = {N: {1: {undefined: {Val: 4}}}}.N()"
    );
    const classes = iMap.of("C", obj);
    expect(ev("C#.M()", classes)).toEqual(4);
  });
  it("built-in map methods have priority over normal methods", function() {
    const obj = compileObject(
      "",
      "C",
      '$.M() = {"x": 4, Get: {2: {"x": {Val: 5}}}}.Get("x")'
    );
    const classes = iMap.of("C", obj);
    expect(ev("C#.M()", classes)).toEqual(4);
  });
  it("objects are maps", function() {
    const obj = compileObject("", "C", '$["p1"] = 11\n$["p2"] = 22');
    const classes = iMap.of("C", obj);
    expect(ev("C#.Size()", classes)).toEqual(2);
    expect(ev('C#.Get("p1")', classes)).toEqual(11);
  });
  it("allocates load expression", function() {
    const obj = iMap({ prop: 123 });
    const classes = iMap.of("C", obj);
    const v = ev("C#", classes);
    expect(v).toEqual(obj);
  });
  it("allocates constructor expression", function() {
    const obj = compileObject("", "C", "$.New(a) = a + 1");
    const classes = iMap.of("C", obj);
    const v = ev("C(3)", classes);
    expect(v).toEqual(4);
  });
  it("allocates number expression", function() {
    const obj = compileObject("", "C", "$.M() = 6");
    const classes = iMap.of("C", obj);
    const v = ev("C#.M()", classes);
    expect(v).toEqual(6);
  });
  it("allocates string expression", function() {
    const obj = compileObject("", "C", '$.M() = "abc"');
    const classes = iMap.of("C", obj);
    const v = ev("C#.M()", classes);
    expect(v).toEqual("abc");
  });
  it("allocates boolean expression", function() {
    const obj = compileObject("", "C", "$.M() = true");
    const classes = iMap.of("C", obj);
    const v = ev("C#.M()", classes);
    expect(v).toEqual(true);
  });
  it("allocates name expression", function() {
    const obj = compileObject("", "C", "$.M() = SomeClass");
    const classes = iMap.of("C", obj);
    const v = ev("C#.M()", classes);
    expect(v).toEqual("SomeClass");
  });
  it("allocates func expression", function() {
    const obj = compileObject("", "C", "$.M(x) = #!/floor");
    const classes = iMap.of("C", obj);
    const v = ev("C#.M(3.9)", classes);
    expect(v).toEqual(3.0);
  });
  it("allocates param expression", function() {
    const obj = compileObject("", "C", "$.M(a, b, c) = b");
    const classes = iMap.of("C", obj);
    expect(ev("C#.M(3, 4, 5)", classes)).toEqual(4);
  });
  it("allocates $ expression", function() {
    const obj = compileObject("", "C", "$.M(a, b, c) = $");
    const classes = iMap.of("C", obj);
    expect(ev("C#.M(3, 4, 5)", classes)).toEqual(obj);
  });
  it("allocates list", function() {
    const obj = compileObject("", "C", "$.M() = [3, 4, 5, 6]");
    const classes = iMap.of("C", obj);
    const v = ev("C#.M()", classes);
    expect(v).toEqual(iList.of(3, 4, 5, 6));
  });
  it("allocates map", function() {
    const obj = compileObject("", "C", "$.M() = {3: 4, 5: 6}");
    const classes = iMap.of("C", obj);
    const v = ev("C#.M()", classes);
    expect(v).toEqual(iMap.of(3, 4, 5, 6));
  });
  it("allocates set", function() {
    const obj = compileObject("", "C", "$.M() = #{3, 4, 5, 6}");
    const classes = iMap.of("C", obj);
    const v = ev("C#.M()", classes);
    expect(v).toEqual(iSet.of(3, 4, 5, 6));
  });
  it("allocates call", function() {
    const obj = compileObject("", "C", "$.M() = $.N()\n$.N() = 3");
    const classes = iMap.of("C", obj);
    expect(ev("C#.M()", classes)).toEqual(3);
  });
  it("allocates val child of call", function() {
    const obj = compileObject("", "C", "$.M() = [3]");
    const classes = iMap.of("C", obj);
    const v = ev("C#.M()", classes);
    expect(v).toEqual(iList.of(3));
  });
  it("allocates param child of call", function() {
    const obj = compileObject("", "C", "$.M(b) = [b]");
    const classes = iMap.of("C", obj);
    const v = ev("C#.M(3)", classes);
    expect(v).toEqual(iList.of(3));
  });
  it("allocates call child of call", function() {
    const obj = compileObject("", "C", "$.M() = [$.N()]\n$.N() = 3");
    const classes = iMap.of("C", obj);
    const v = ev("C#.M()", classes);
    expect(v).toEqual(iList.of(3));
  });
});

describe("allocate", function() {
  const ev = function(line) {
    const expr = compileExpr("", line);
    const classes = iMap.of("C", iMap({ p: 123 }));
    return evaluate(expr, classes);
  };
  it("supports call expressions with wrongly-typed method name", function() {
    const args = '[{Val: {"p": 4}}, {Val: "p"}]';
    const call = "{Call: 33, Args: " + args + "}";
    const v = ev('{"M": {1: {undefined: ' + call + "}}}.M()");
    expect(v).toEqual(undefined);
  });
  it("supports call expressions with wrongly-named method", function() {
    const args = '[{Val: {"p": 4}}, {Val: "p"}]';
    const call = '{Call: "...", Args: ' + args + "}";
    const v = ev('{"M": {1: {undefined: ' + call + "}}}.M()");
    expect(v).toEqual(undefined);
  });
  it("supports call expressions with wrongly-typed arg list", function() {
    const call = "{Call: Get, Args: 33}";
    const v = ev('{"M": {1: {undefined: ' + call + "}}}.M()");
    expect(v).toEqual(undefined);
  });
  it("supports call expressions with empty arg list", function() {
    const call = "{Call: Get, Args: []}";
    const v = ev('{"M": {1: {undefined: ' + call + "}}}.M()");
    expect(v).toEqual(undefined);
  });
  it("supports well-formed call expressions", function() {
    const args = '[{Val: {"p": 4}}, {Val: "p"}]';
    const call = "{Call: Get, Args: " + args + "}";
    const v = ev('{"M": {1: {undefined: ' + call + "}}}.M()");
    expect(v).toEqual(4);
  });
  it("supports param expressions with wrongly-typed index", function() {
    const v = ev('{"M": {2: {undefined: {Param: "abc"}}}}.M(4)');
    expect(v).toEqual(undefined);
  });
  it("supports param expressions with index that is too low", function() {
    const v = ev('{"M": {2: {undefined: {Param: -1}}}}.M(4)');
    expect(v).toEqual(undefined);
  });
  it("supports param expressions with index that is too high", function() {
    const v = ev('{"M": {2: {undefined: {Param: 2}}}}.M(4)');
    expect(v).toEqual(undefined);
  });
  it("supports well-formed param expressions", function() {
    const v = ev('{"M": {2: {undefined: {Param: 1}}}}.M(4)');
    expect(v).toEqual(4);
  });
  it("supports func expressions with bad name", function() {
    const expr = '{Func: "qwertyuio"}';
    const v = ev('{"M": {3: {undefined: ' + expr + "}}}.M(2, 3)");
    expect(v).toEqual(undefined);
  });
  it("supports func expressions with wrong number of arguments", function() {
    const expr = '{Func: "add"}';
    const v = ev('{"M": {4: {undefined: ' + expr + "}}}.M(2, 3, 4)");
    expect(v).toEqual(undefined);
  });
  it("supports func expressions", function() {
    const expr = '{Func: "abs"}';
    const v = ev('{"M": {2: {undefined: ' + expr + "}}}.M(-5)");
    expect(v).toEqual(5);
  });
  it("supports val expressions", function() {
    const v = ev('{"M": {1: {undefined: {Val: 4}}}}.M()');
    expect(v).toEqual(4);
  });
  it("supports malformed expressions", function() {
    const vEmptyMap = ev('{"M": {1: {undefined: {}}}}.M()');
    expect(vEmptyMap).toEqual(undefined);
    const vNoMap = ev('{"M": {1: {undefined: 1234}}}.M()');
    expect(vNoMap).toEqual(undefined);
  });
});

describe("number", function() {
  const ev = function(line) {
    const expr = compileExpr("", line);
    return evaluate(expr, iMap({}));
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
  it("implements IsFinite()", function() {
    expect(ev("(123).IsFinite()")).toEqual(true);
    expect(ev("(Infinity).IsFinite()")).toEqual(false);
  });
  it("implements IsInteger()", function() {
    expect(ev("(3.0).IsInteger()")).toEqual(true);
    expect(ev("(3.5).IsInteger()")).toEqual(false);
  });
  it("implements IsNaN()", function() {
    expect(ev("(123).IsNaN()")).toEqual(false);
    expect(ev("(NaN).IsNaN()")).toEqual(true);
  });
  it("implements IsSafeInteger()", function() {
    expect(ev("(123).IsSafeInteger()")).toEqual(true);
    expect(ev("(0.5).IsSafeInteger()")).toEqual(false);
  });
  it("implements ToExponential()", function() {
    expect(ev("(2.341).ToExponential()")).toEqual("2.341e+0");
  });
  it("implements ToExponential(fractionDigits)", function() {
    expect(ev("(1.2).ToExponential(0)")).toEqual("1e+0");
    expect(ev("(1.2).ToExponential(20)")).toEqual("1.19999999999999995559e+0");
    expect(ev("(1.2).ToExponential([])")).toEqual(undefined);
    expect(ev("(1.2).ToExponential(NaN)")).toEqual(undefined);
    expect(ev("(1.2).ToExponential(-1)")).toEqual(undefined);
    expect(ev("(1.2).ToExponential(21)")).toEqual(undefined);
  });
  it("implements ToFixed()", function() {
    expect(ev("(2.3456).ToFixed()")).toEqual("2");
  });
  it("implements ToFixed(digits)", function() {
    expect(ev("(1.2).ToFixed(0)")).toEqual("1");
    expect(ev("(1.2).ToFixed(20)")).toEqual("1.19999999999999995559");
    expect(ev("(1.2).ToFixed([])")).toEqual(undefined);
    expect(ev("(1.2).ToFixed(NaN)")).toEqual(undefined);
    expect(ev("(1.2).ToFixed(-1)")).toEqual(undefined);
    expect(ev("(1.2).ToFixed(21)")).toEqual(undefined);
  });
  it("implements ToPrecision()", function() {
    expect(ev("(12.345).ToPrecision()")).toEqual("12.345");
  });
  it("implements ToPrecision(precision)", function() {
    expect(ev("(1.2).ToPrecision(1)")).toEqual("1");
    expect(ev("(1.2).ToPrecision(21)")).toEqual("1.19999999999999995559");
    expect(ev("(1.2).ToPrecision([])")).toEqual(undefined);
    expect(ev("(1.2).ToPrecision(NaN)")).toEqual(undefined);
    expect(ev("(1.2).ToPrecision(0)")).toEqual(undefined);
    expect(ev("(1.2).ToPrecision(22)")).toEqual(undefined);
  });
  it("implements ToBoolean()", function() {
    expect(ev("(-1).ToBoolean()")).toEqual(true);
    expect(ev("(0).ToBoolean()")).toEqual(false);
    expect(ev("(1).ToBoolean()")).toEqual(true);
  });
  it("implements ToString()", function() {
    expect(ev("(7).ToString()")).toEqual("7");
  });
  it("implements ToString(radix)", function() {
    expect(ev("(7).ToString(2)")).toEqual("111");
    expect(ev("(47).ToString(36)")).toEqual("1b");
    expect(ev("(7).ToString([])")).toEqual(undefined);
    expect(ev("(7).ToString(NaN)")).toEqual(undefined);
    expect(ev("(7).ToString(1)")).toEqual(undefined);
    expect(ev("(47).ToString(37)")).toEqual(undefined);
  });
  it("implements Type()", function() {
    expect(ev("3.Type()")).toEqual("number");
  });
});

describe("boolean", function() {
  const ev = function(line) {
    const expr = compileExpr("", line);
    return evaluate(expr, iMap({}));
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
  it("implements ToNumber", function() {
    expect(ev("(true).ToNumber()")).toEqual(1);
    expect(ev("(false).ToNumber()")).toEqual(0);
  });
  it("implements ToString()", function() {
    expect(ev("true.ToString()")).toEqual("true");
    expect(ev("false.ToString()")).toEqual("false");
  });
  it("implements Type()", function() {
    expect(ev("true.Type()")).toEqual("boolean");
  });
});

describe("string", function() {
  const ev = function(line) {
    const expr = compileExpr("", line);
    return evaluate(expr, iMap({}));
  };
  it("can be constructed", function() {
    expect(ev('"abc"')).toEqual("abc");
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
  it("implements x ++ y", function() {
    expect(ev('"abc" ++ "def"')).toEqual("abcdef");
    expect(ev('"abc" ++ []')).toEqual(undefined);
  });
  it("implements Get(index)", function() {
    expect(ev('"abc".Get(1)')).toEqual("b");
    expect(ev('"abc".Get(100)')).toEqual("");
    expect(ev('"abc".Get([])')).toEqual(undefined);
  });
  it("implements CharCodeAt(index)", function() {
    expect(ev('"abc".CharCodeAt(1)')).toEqual(98);
    expect(ev('"abc".CharCodeAt([])')).toEqual(undefined);
  });
  it("implements EndsWith(searchString)", function() {
    expect(ev('"abcdef".EndsWith("def")')).toEqual(true);
    expect(ev('"abcdef".EndsWith("abc")')).toEqual(false);
    expect(ev('"abcdef".EndsWith([])')).toEqual(undefined);
  });
  it("implements EndsWith(searchString, position)", function() {
    expect(ev('"abcdef".EndsWith("abc", 3)')).toEqual(true);
    expect(ev('"abcdef".EndsWith("abc", 4)')).toEqual(false);
    expect(ev('"abcdef".EndsWith([], 3)')).toEqual(undefined);
    expect(ev('"abcdef".EndsWith("abc", [])')).toEqual(undefined);
  });
  it("implements Includes(searchString)", function() {
    expect(ev('"abcdef".Includes("bcd")')).toEqual(true);
    expect(ev('"abcdef".Includes("bbb")')).toEqual(false);
    expect(ev('"abcdef".Includes([])')).toEqual(undefined);
  });
  it("implements Includes(searchString, position)", function() {
    expect(ev('"abcdef".Includes("bcd", 1)')).toEqual(true);
    expect(ev('"abcdef".Includes("bcd", 2)')).toEqual(false);
    expect(ev('"abcdef".Includes([], 2)')).toEqual(undefined);
    expect(ev('"abcdef".Includes("bcd", [])')).toEqual(undefined);
  });
  it("implements IndexOf(searchValue)", function() {
    expect(ev('"ababa".IndexOf("b")')).toEqual(1);
    expect(ev('"ababa".IndexOf([])')).toEqual(undefined);
  });
  it("implements IndexOf(searchValue, fromIndex)", function() {
    expect(ev('"ababa".IndexOf("b", 2)')).toEqual(3);
    expect(ev('"ababa".IndexOf([], 2)')).toEqual(undefined);
    expect(ev('"ababa".IndexOf("b", [])')).toEqual(undefined);
  });
  it("implements LastIndexOf(searchValue)", function() {
    expect(ev('"ababa".LastIndexOf("b")')).toEqual(3);
    expect(ev('"ababa".LastIndexOf([])')).toEqual(undefined);
  });
  it("implements LastIndexOf(searchValue, fromIndex)", function() {
    expect(ev('"ababa".LastIndexOf("b", 2)')).toEqual(1);
    expect(ev('"ababa".LastIndexOf([], 2)')).toEqual(undefined);
    expect(ev('"ababa".LastIndexOf("b", [])')).toEqual(undefined);
  });
  it("implements Length()", function() {
    expect(ev('"ababa".Length()')).toEqual(5);
  });
  it("implements Match(pattern)", function() {
    expect(ev('"abaca".Match("a.")')).toEqual(iList(["ab"]));
    expect(ev('"abaca".Match("z.")')).toEqual(iList([]));
    expect(ev('"abaca".Match([])')).toEqual(undefined);
    expect(ev('"abaca".Match("[")')).toEqual(undefined);
  });
  it("implements Match(pattern, flags)", function() {
    expect(ev('"abaca".Match("a.", "")')).toEqual(iList(["ab"]));
    expect(ev('"abaca".Match("z.", "")')).toEqual(iList([]));
    expect(ev('"abaca".Match("a.", "g")')).toEqual(iList(["ab", "ac"]));
    expect(ev('"abaca".Match([], "g")')).toEqual(undefined);
    expect(ev('"abaca".Match("[", "g")')).toEqual(undefined);
    expect(ev('"abaca".Match("a.", [])')).toEqual(undefined);
    expect(ev('"abaca".Match("a.", "z")')).toEqual(undefined);
  });
  it("implements Repeat(count)", function() {
    expect(ev('"abc".Repeat(2)')).toEqual("abcabc");
    expect(ev('"abc".Repeat([])')).toEqual(undefined);
    expect(ev('"abc".Repeat(-1)')).toEqual(undefined);
    expect(ev('"abc".Repeat(Infinity)')).toEqual(undefined);
  });
  it("implements Replace(pattern, newSubstr)", function() {
    expect(ev('"ababa".Replace("b.", "BA")')).toEqual("aBAba");
    expect(ev('"ababa".Replace("z.", "BA")')).toEqual("ababa");
    expect(ev('"ababa".Replace([], "BA")')).toEqual(undefined);
    expect(ev('"ababa".Replace("[", "BA")')).toEqual(undefined);
    expect(ev('"ababa".Replace("b.", [])')).toEqual(undefined);
  });
  it("implements Replace(pattern, newSubstr, flags)", function() {
    expect(ev('"ababa".Replace("b.", "BA", "")')).toEqual("aBAba");
    expect(ev('"ababa".Replace("b.", "<$&>", "")')).toEqual("a<ba>ba");
    expect(ev('"ababa".Replace("b.", "BA", "g")')).toEqual("aBABA");
    expect(ev('"ababa".Replace("z.", "BA", "g")')).toEqual("ababa");
    expect(ev('"ababa".Replace([], "BA", "g")')).toEqual(undefined);
    expect(ev('"ababa".Replace("[", "BA", "g")')).toEqual(undefined);
    expect(ev('"ababa".Replace("b.", [], "g")')).toEqual(undefined);
    expect(ev('"ababa".Replace("b.", "BA", "z")')).toEqual(undefined);
  });
  it("implements Search(pattern)", function() {
    expect(ev('"abcde".Search("cd")')).toEqual(2);
    expect(ev('"abcde".Search("cc")')).toEqual(-1);
    expect(ev('"abc".Search([])')).toEqual(undefined);
    expect(ev('"abc".Search("[")')).toEqual(undefined);
  });
  it("implements Search(pattern, flags)", function() {
    expect(ev('"abcd\\ne".Search("d$", "m")')).toEqual(3);
    expect(ev('"abcd\\ne".Search("d$", "")')).toEqual(-1);
    expect(ev('"abcde".Search([], "m")')).toEqual(undefined);
    expect(ev('"abc".Search("[", "m")')).toEqual(undefined);
    expect(ev('"abc".Search("abc", [])')).toEqual(undefined);
    expect(ev('"abc".Search("abc", "z")')).toEqual(undefined);
  });
  it("implements Slice(beginIndex)", function() {
    expect(ev('"abcdef".Slice(3)')).toEqual("def");
    expect(ev('"abcdef".Slice([])')).toEqual(undefined);
  });
  it("implements Slice(beginIndex, endIndex)", function() {
    expect(ev('"abcdef".Slice(3, 5)')).toEqual("de");
    expect(ev('"abcdef".Slice([], 5)')).toEqual(undefined);
    expect(ev('"abcdef".Slice(3, [])')).toEqual(undefined);
  });
  it("implements Split()", function() {
    expect(ev('"a b c".Split()')).toEqual(iList(["a b c"]));
  });
  it("implements Split(separator)", function() {
    expect(ev('"a b".Split(" ")')).toEqual(iList(["a", "b"]));
    expect(ev('"a b".Split([])')).toEqual(undefined);
  });
  it("implements Split(separator, limit)", function() {
    expect(ev('"a b".Split(" ", 1)')).toEqual(iList(["a"]));
    expect(ev('"a b".Split([], 1)')).toEqual(undefined);
    expect(ev('"a b".Split(" ", [])')).toEqual(undefined);
  });
  it("implements StartsWith(searchString)", function() {
    expect(ev('"abcdef".StartsWith("ab")')).toEqual(true);
    expect(ev('"abcdef".StartsWith("cd")')).toEqual(false);
    expect(ev('"abcdef".StartsWith([])')).toEqual(undefined);
  });
  it("implements StartsWith(searchString, position)", function() {
    expect(ev('"abcdef".StartsWith("ab", 2)')).toEqual(false);
    expect(ev('"abcdef".StartsWith("cd", 2)')).toEqual(true);
    expect(ev('"abcdef".StartsWith([], 2)')).toEqual(undefined);
    expect(ev('"abcdef".StartsWith("cd", [])')).toEqual(undefined);
  });
  it("implements Substr(start)", function() {
    expect(ev('"abcdef".Substr(3)')).toEqual("def");
    expect(ev('"abcdef".Substr([])')).toEqual(undefined);
  });
  it("implements Substr(start, length)", function() {
    expect(ev('"abcdef".Substr(3, 2)')).toEqual("de");
    expect(ev('"abcdef".Substr([], 2)')).toEqual(undefined);
    expect(ev('"abcdef".Substr(3, [])')).toEqual(undefined);
  });
  it("implements Substring(indexStart)", function() {
    expect(ev('"abcdef".Substring(3)')).toEqual("def");
    expect(ev('"abcdef".Substring([])')).toEqual(undefined);
  });
  it("implements Substring(indexStart, indexEnd)", function() {
    expect(ev('"abcdef".Substring(3, 5)')).toEqual("de");
    expect(ev('"abcdef".Substring([], 5)')).toEqual(undefined);
    expect(ev('"abcdef".Substring(3, [])')).toEqual(undefined);
  });
  it("implements Test(pattern)", function() {
    expect(ev('"abcdef".Test("c.e")')).toEqual(true);
    expect(ev('"abcdef".Test("c.f")')).toEqual(false);
    expect(ev('"abcdef".Test([])')).toEqual(undefined);
    expect(ev('"abcdef".Test("[")')).toEqual(undefined);
  });
  it("implements Test(pattern, flags)", function() {
    expect(ev('"abc\\ndef".Test("abc$", "m")')).toEqual(true);
    expect(ev('"abc\\ndef".Test("abc$", "")')).toEqual(false);
    expect(ev('"abcdef".Test([], "m")')).toEqual(undefined);
    expect(ev('"abcdef".Test("[", "m")')).toEqual(undefined);
    expect(ev('"abcdef".Test("abc", [])')).toEqual(undefined);
    expect(ev('"abcdef".Test("abc", "z")')).toEqual(undefined);
  });
  it("implements ToLowerCase()", function() {
    expect(ev('"ABC".ToLowerCase()')).toEqual("abc");
  });
  it("implements ToUpperCase()", function() {
    expect(ev('"abc".ToUpperCase()')).toEqual("ABC");
  });
  it("implements Trim()", function() {
    expect(ev('"   abc   ".Trim()')).toEqual("abc");
  });
  it("implements ToString()", function() {
    expect(ev('"abc".ToString()')).toEqual('"abc"');
  });
  it("implements Type()", function() {
    expect(ev('"abc".Type()')).toEqual("string");
  });
});

describe("list", function() {
  const ev = function(line) {
    const expr = compileExpr("", line);
    return evaluate(expr, iMap({}));
  };
  it("can be constructed", function() {
    expect(ev("[4, 5, 6]")).toEqual(iList([4, 5, 6]));
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
  it("implements Size()", function() {
    expect(ev("[4, 5, 6].Size()")).toEqual(3);
  });
  it("implements Set(index, value)", function() {
    expect(ev("[4, 5, 6].Set(1, 7)")).toEqual(iList([4, 7, 6]));
    expect(ev("[4].Set(2, 6)")).toEqual(iList([4, undefined, 6]));
    expect(ev("[4, 5, 6].Set([], 7)")).toEqual(undefined);
  });
  it("implements Delete(index)", function() {
    expect(ev("[4, 5, 6].Delete(1)")).toEqual(iList([4, 6]));
    expect(ev("[4, 5, 6].Delete(99)")).toEqual(iList([4, 5, 6]));
    expect(ev("[4, 5, 6].Delete([])")).toEqual(undefined);
  });
  it("implements Insert(index, value)", function() {
    expect(ev("[4, 5, 6].Insert(1, 7)")).toEqual(iList([4, 7, 5, 6]));
    expect(ev("[4, 5, 6].Insert([], 7)")).toEqual(undefined);
  });
  it("implements Clear()", function() {
    expect(ev("[4, 5, 6].Clear()")).toEqual(iList([]));
  });
  it("implements Push(value)", function() {
    expect(ev("[4, 5, 6].Push(7)")).toEqual(iList([4, 5, 6, 7]));
  });
  it("implements Pop()", function() {
    expect(ev("[4, 5, 6].Pop()")).toEqual(iList([4, 5]));
    expect(ev("[].Pop()")).toEqual(iList([]));
  });
  it("implements Unshift(value)", function() {
    expect(ev("[4, 5, 6].Unshift(3)")).toEqual(iList([3, 4, 5, 6]));
  });
  it("implements Shift()", function() {
    expect(ev("[4, 5, 6].Shift()")).toEqual(iList([5, 6]));
    expect(ev("[].Shift()")).toEqual(iList([]));
  });
  it("implements SetSize(size)", function() {
    expect(ev("[4, 5, 6].SetSize(1)")).toEqual(iList([4]));
    expect(ev("[4].SetSize(3)")).toEqual(iList([4, undefined, undefined]));
    expect(ev("[4].SetSize([])")).toEqual(undefined);
  });
  it("implements Get(index)", function() {
    expect(ev("[4, 5, 6].Get(2)")).toEqual(6);
    expect(ev("[4, 5, 6].Get(9)")).toEqual(undefined);
    expect(ev("[4, 5, 6].Get([])")).toEqual(undefined);
  });
  it("implements Get(index, default)", function() {
    expect(ev("[4, 5, 6].Get(2, 7)")).toEqual(6);
    expect(ev("[4, 5, 6].Get(3, 7)")).toEqual(7);
    expect(ev("[4, 5, 6].Get([], 7)")).toEqual(undefined);
  });
  it("implements Has(index)", function() {
    expect(ev("[4, 5, 6].Has(2)")).toEqual(true);
    expect(ev("[4, 5, 6].Has(3)")).toEqual(false);
    expect(ev("[4, 5, 6].Has([])")).toEqual(undefined);
  });
  it("implements Includes(value)", function() {
    expect(ev("[4, 5, 6].Includes(6)")).toEqual(true);
    expect(ev("[4, 5, 6].Includes(7)")).toEqual(false);
  });
  it("implements First()", function() {
    expect(ev("[4, 5, 6].First()")).toEqual(4);
    expect(ev("[].First()")).toEqual(undefined);
  });
  it("implements Last()", function() {
    expect(ev("[4, 5, 6].Last()")).toEqual(6);
    expect(ev("[].Last()")).toEqual(undefined);
  });
  it("implements Keys()", function() {
    expect(ev("[4, 5, 6].Keys()")).toEqual(iList([0, 1, 2]));
  });
  it("implements Reverse()", function() {
    expect(ev("[4, 5, 6].Reverse()")).toEqual(iList([6, 5, 4]));
  });
  it("implements Sort()", function() {
    expect(ev("[5, 4, 6].Sort()")).toEqual(iList([4, 5, 6]));
  });
  it("implements Slice()", function() {
    expect(ev("[4, 5, 6, 7].Slice()")).toEqual(iList([4, 5, 6, 7]));
  });
  it("implements Slice(begin)", function() {
    expect(ev("[4, 5, 6, 7].Slice(1)")).toEqual(iList([5, 6, 7]));
    expect(ev("[4, 5, 6, 7].Slice([])")).toEqual(undefined);
  });
  it("implements Slice(begin, end)", function() {
    expect(ev("[4, 5, 6, 7].Slice(1, 3)")).toEqual(iList([5, 6]));
    expect(ev("[4, 5, 6, 7].Slice([], 3)")).toEqual(undefined);
    expect(ev("[4, 5, 6, 7].Slice(1, [])")).toEqual(undefined);
  });
  it("implements Rest()", function() {
    expect(ev("[4, 5, 6].Rest()")).toEqual(iList([5, 6]));
    expect(ev("[].Rest()")).toEqual(iList([]));
  });
  it("implements ButLast()", function() {
    expect(ev("[4, 5, 6].ButLast()")).toEqual(iList([4, 5]));
    expect(ev("[].ButLast()")).toEqual(iList([]));
  });
  it("implements Skip(amount)", function() {
    expect(ev("[4, 5, 6, 7].Skip(2)")).toEqual(iList([6, 7]));
    expect(ev("[4, 5, 6].Skip([])")).toEqual(undefined);
  });
  it("implements SkipLast(amount)", function() {
    expect(ev("[4, 5, 6, 7].SkipLast(2)")).toEqual(iList([4, 5]));
    expect(ev("[4, 5, 6].SkipLast([])")).toEqual(undefined);
  });
  it("implements Take(amount)", function() {
    expect(ev("[4, 5, 6, 7].Take(2)")).toEqual(iList([4, 5]));
    expect(ev("[4, 5, 6].Take([])")).toEqual(undefined);
  });
  it("implements TakeLast(x)", function() {
    expect(ev("[4, 5, 6, 7].TakeLast(2)")).toEqual(iList([6, 7]));
    expect(ev("[4, 5, 6].TakeLast([])")).toEqual(undefined);
  });
  it("implements Concat(other)", function() {
    expect(ev("[1, 2].Concat([3, 4])")).toEqual(iList([1, 2, 3, 4]));
    expect(ev("[1, 2].Concat(3)")).toEqual(undefined);
  });
  it("implements Flatten()", function() {
    const v = ev("[4, [5, [6], 7], 8].Flatten()");
    expect(v).toEqual(iList([4, 5, 6, 7, 8]));
  });
  it("implements Interpose(separator)", function() {
    expect(ev("[1, 2, 3].Interpose(5)")).toEqual(iList([1, 5, 2, 5, 3]));
  });
  it("implements Splice(index)", function() {
    expect(ev("[3, 4, 5, 6, 7].Splice(2)")).toEqual(iList([3, 4]));
    expect(ev("[3, 4, 5].Splice([])")).toEqual(undefined);
  });
  it("implements Splice(index, removeNum)", function() {
    expect(ev("[3, 4, 5, 6, 7].Splice(2, 1)")).toEqual(iList([3, 4, 6, 7]));
    expect(ev("[3, 4, 5].Splice([], 1)")).toEqual(undefined);
    expect(ev("[3, 4, 5].Splice(2, [])")).toEqual(undefined);
  });
  it("implements Join()", function() {
    expect(ev('["a", "b", "c"].Join()')).toEqual("a,b,c");
  });
  it("implements Join(separator)", function() {
    expect(ev('["a", "b", "c"].Join(".")')).toEqual("a.b.c");
    expect(ev('["a", "b", "c"].Join(#{})')).toEqual("a#{}b#{}c");
  });
  it("implements IsEmpty()", function() {
    expect(ev("[].IsEmpty()")).toEqual(true);
    expect(ev("[3].IsEmpty()")).toEqual(false);
  });
  it("implements KeyOf(searchValue)", function() {
    expect(ev("[3, 4, 5, 4, 3].KeyOf(4)")).toEqual(1);
    expect(ev("[3, 4, 5].KeyOf(9)")).toEqual(undefined);
  });
  it("implements LastKeyOf(searchValue)", function() {
    expect(ev("[3, 4, 5, 4, 3].LastKeyOf(4)")).toEqual(3);
    expect(ev("[3, 4, 5].LastKeyOf(9)")).toEqual(undefined);
  });
  it("implements Max()", function() {
    expect(ev("[3, 4, 5, 4, 3].Max()")).toEqual(5);
  });
  it("implements Min()", function() {
    expect(ev("[5, 4, 3, 4, 5].Min()")).toEqual(3);
  });
  it("implements IndexOf(searchValue)", function() {
    expect(ev("[3, 4, 5, 4, 3].IndexOf(4)")).toEqual(1);
    expect(ev("[3, 4, 5].IndexOf(9)")).toEqual(-1);
  });
  it("implements LastIndexOf(searchValue)", function() {
    expect(ev("[3, 4, 5, 4, 3].LastIndexOf(4)")).toEqual(3);
    expect(ev("[3, 4, 5].LastIndexOf(9)")).toEqual(-1);
  });
  it("implements ToMap()", function() {
    const v = ev("[4, 5, 6].ToMap()");
    expect(v).toEqual(iMap.of(0, 4, 1, 5, 2, 6));
  });
  it("implements ToSet()", function() {
    const v = ev("[4, 5, 6].ToSet()");
    expect(is(v, iSet.of(4, 5, 6))).toEqual(true);
  });
  it("implements ToString()", function() {
    const v = ev('["a", "b", "c"].ToString()');
    expect(v).toEqual('[ "a", "b", "c" ]');
  });
  it("implements Type()", function() {
    expect(ev("[].Type()")).toEqual("list");
  });
});

describe("map", function() {
  const ev = function(line) {
    const expr = compileExpr("", line);
    return evaluate(expr, iMap({}));
  };
  it("can be constructed", function() {
    const v = ev("{4: 5, 6: 7, 8: 9}");
    expect(is(v, iMap.of(4, 5, 6, 7, 8, 9))).toEqual(true);
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
  it("implements Size()", function() {
    expect(ev("{4: 44, 5: 55, 6: 66}.Size()")).toEqual(3);
  });
  it("implements Set(key, value)", function() {
    const v = ev("{4: 44, 5: 55}.Set(5, 77)");
    expect(is(v, iMap.of(4, 44, 5, 77))).toEqual(true);
  });
  it("implements Delete(key)", function() {
    expect(is(ev("{4: 44, 5: 55}.Delete(5)"), iMap.of(4, 44))).toEqual(true);
    expect(is(ev("{4: 44}.Delete(5)"), iMap.of(4, 44))).toEqual(true);
  });
  it("implements Clear()", function() {
    const v = ev("{4: 44, 5: 55, 6: 66}.Clear()");
    expect(is(v, iMap.of())).toEqual(true);
  });
  it("implements First()", function() {
    expect(ev("{4: 44, 5: 55}.First()")).toEqual(44);
  });
  it("implements Rest()", function() {
    const v = ev("{4: 44, 5: 55}.Rest()");
    expect(is(v, iMap.of(5, 55))).toEqual(true);
  });
  it("implements Get(key)", function() {
    expect(ev("{4: 44, 5: 55}.Get(4)")).toEqual(44);
  });
  it("implements Get(key, default)", function() {
    expect(ev("{4: 44, 5: 55}.Get(4, 88)")).toEqual(44);
    expect(ev("{4: 44, 5: 55}.Get(8, 88)")).toEqual(88);
  });
  it("implements Has(key)", function() {
    expect(ev("{4: 44, 5: 55}.Has(4)")).toEqual(true);
    expect(ev("{4: 44, 5: 55}.Has(8)")).toEqual(false);
  });
  it("implements Keys()", function() {
    expect(ev("{4: 44, 5: 55}.Keys()")).toEqual(iList.of(4, 5));
  });
  it("implements ToList()", function() {
    expect(ev("{4: 44, 5: 55}.ToList()")).toEqual(iList.of(44, 55));
  });
  it("implements ToSet()", function() {
    const v = ev("{4: 44, 5: 55}.ToSet()");
    expect(is(v, iSet.of(44, 55))).toEqual(true);
  });
  it("implements ToString()", function() {
    const v = ev('{"x": 3, "y": 4}.ToString()');
    expect(v).toEqual('{ "x": 3, "y": 4 }');
  });
  it("implements Type()", function() {
    expect(ev("{}.Type()")).toEqual("map");
  });
});

describe("set", function() {
  const ev = function(line) {
    const expr = compileExpr("", line);
    return evaluate(expr, iMap({}));
  };
  it("can be constructed", function() {
    const v = ev("#{4, 5, 6}");
    expect(is(v, iSet.of(4, 5, 6))).toEqual(true);
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
  it("implements Size()", function() {
    expect(ev("#{4, 5, 6}.Size()")).toEqual(3);
  });
  it("implements Add(value)", function() {
    const v = ev("#{4, 5, 6}.Add(9)");
    expect(is(v, iSet.of(4, 5, 6, 9))).toEqual(true);
  });
  it("implements Delete(value)", function() {
    const v = ev("#{4, 5, 6}.Delete(5)");
    expect(is(v, iSet.of(4, 6))).toEqual(true);
  });
  it("implements Clear()", function() {
    const v = ev("#{4, 5, 6}.Clear()");
    expect(is(v, iSet.of())).toEqual(true);
  });
  it("implements Union(other)", function() {
    const v = ev("#{4, 5}.Union(#{5, 6})");
    expect(is(v, iSet.of(4, 5, 6))).toEqual(true);
    expect(ev("#{4, 5}.Union(5)")).toEqual(undefined);
  });
  it("implements Intersect(other)", function() {
    const v = ev("#{4, 5}.Intersect(#{5, 6})");
    expect(is(v, iSet.of(5))).toEqual(true);
    expect(ev("#{4, 5}.Intersect(5)")).toEqual(undefined);
  });
  it("implements Subtract(other)", function() {
    const v = ev("#{4, 5}.Subtract(#{5})");
    expect(is(v, iSet.of(4))).toEqual(true);
    expect(ev("#{4, 5}.Subtract(5)")).toEqual(undefined);
  });
  it("implements Has(value)", function() {
    expect(ev("#{4}.Has(3)")).toEqual(false);
    expect(ev("#{4}.Has(4)")).toEqual(true);
  });
  it("implements First()", function() {
    expect(ev("#{4}.First()")).toEqual(4);
  });
  it("implements Rest()", function() {
    const v = ev("#{4}.Rest()");
    expect(is(v, iSet.of())).toEqual(true);
  });
  it("implements Flatten()", function() {
    const v = ev("#{4, #{5, #{6}, 7}, 8}.Flatten()");
    expect(is(v, iSet.of(4, 5, 6, 7, 8))).toEqual(true);
  });
  it("implements Join()", function() {
    const v = ev('#{"a", "b"}.Join()');
    expect(v == "a,b" || v == "b,a").toEqual(true);
  });
  it("implements Join(separator)", function() {
    const v = ev('#{"a", "b"}.Join(".")');
    expect(v == "a.b" || v == "b.a").toEqual(true);
    expect(ev('#{"a", "b"}.Join([])')).toEqual(undefined);
  });
  it("implements IsEmpty()", function() {
    expect(ev("#{0}.IsEmpty()")).toEqual(false);
    expect(ev("#{}.IsEmpty()")).toEqual(true);
  });
  it("implements Max()", function() {
    expect(ev("#{4, 5, 6}.Max()")).toEqual(6);
  });
  it("implements Min()", function() {
    expect(ev("#{4, 5, 6}.Min()")).toEqual(4);
  });
  it("implements IsSubset(other)", function() {
    expect(ev("#{4, 5, 6}.IsSubset(#{5, 6, 7})")).toEqual(false);
    expect(ev("#{5, 6}.IsSubset(#{5, 6, 7})")).toEqual(true);
    expect(ev("#{5, 6}.IsSubset(5)")).toEqual(undefined);
  });
  it("implements IsSuperset(other)", function() {
    expect(ev("#{4, 5, 6}.IsSuperset(#{5, 6, 7})")).toEqual(false);
    expect(ev("#{4, 5, 6}.IsSuperset(#{5, 6})")).toEqual(true);
    expect(ev("#{4, 5, 6}.IsSuperset(5)")).toEqual(undefined);
  });
  it("implements ToList()", function() {
    const v = ev("#{4}.ToList()");
    expect(is(v, iList([4]))).toEqual(true);
  });
  it("implements ToString()", function() {
    expect(ev("#{3, 4}.ToString()")).toEqual("#{ 3, 4 }");
  });
  it("implements Type()", function() {
    expect(ev("#{}.Type()")).toEqual("set");
  });
});

describe("undefined", function() {
  const ev = function(line) {
    const expr = compileExpr("", line);
    return evaluate(expr, iMap({}));
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
    const v = ev("undefined.ToString()");
    expect(v).toEqual("undefined");
  });
  it("implements type()", function() {
    expect(ev("undefined.Type()")).toEqual("undefined");
  });
});

describe("functions", function() {
  const ev = function(line) {
    const source = [
      "$.Abs(x) = #!/abs",
      "$.Acos(x) = #!/acos",
      "$.Asin(x) = #!/asin",
      "$.Atan(x) = #!/atan",
      "$.Atan2(y,x) = #!/atan2",
      "$.Ceil(x) = #!/ceil",
      "$.Cos(x) = #!/cos",
      "$.Exp(x) = #!/exp",
      "$.Floor(x) = #!/floor",
      "$.Chr(x) = #!/chr",
      "$.Log(x) = #!/log",
      "$.Max(x,y) = #!/max",
      "$.Min(x,y) = #!/min",
      "$.ParseFloat(x) = #!/parsefloat",
      "$.ParseInt(x) = #!/parseint",
      "$.ParseInt(x, y) = #!/parseint2",
      "$.Pow(x,y) = #!/pow",
      "$.Round(x) = #!/round",
      "$.Sin(x) = #!/sin",
      "$.Sqrt(x) = #!/sqrt",
      "$.Tan(x) = #!/tan"
    ].join("\n");
    const obj = compileObject("", "F", source);
    const classes = iMap.of("F", obj);
    const expr = compileExpr("", line);
    return evaluate(expr, classes);
  };
  it("executes #!/abs", function() {
    expect(ev("F#.Abs(-2)")).toEqual(2);
    expect(ev("F#.Abs([])")).toEqual(undefined);
  });
  it("executes #!/acos", function() {
    expect(ev("F#.Acos(0.5)")).toEqual(Math.acos(0.5));
    expect(ev("F#.Acos([])")).toEqual(undefined);
  });
  it("executes #!/asin", function() {
    expect(ev("F#.Asin(0.5)")).toEqual(Math.asin(0.5));
    expect(ev("F#.Asin([])")).toEqual(undefined);
  });
  it("executes #!/atan", function() {
    expect(ev("F#.Atan(0.5)")).toEqual(Math.atan(0.5));
    expect(ev("F#.Atan([])")).toEqual(undefined);
  });
  it("executes #!/atan2", function() {
    expect(ev("F#.Atan2(1, 3)")).toEqual(Math.atan2(1, 3));
    expect(ev("F#.Atan2([], 3)")).toEqual(undefined);
    expect(ev("F#.Atan2(1, [])")).toEqual(undefined);
  });
  it("executes #!/ceil", function() {
    expect(ev("F#.Ceil(2.1)")).toEqual(3);
    expect(ev("F#.Ceil([])")).toEqual(undefined);
  });
  it("executes #!/cos", function() {
    expect(ev("F#.Cos(1)")).toEqual(Math.cos(1));
    expect(ev("F#.Cos([])")).toEqual(undefined);
  });
  it("executes #!/exp", function() {
    expect(ev("F#.Exp(2)")).toEqual(Math.exp(2));
    expect(ev("F#.Exp([])")).toEqual(undefined);
  });
  it("executes #!/floor", function() {
    expect(ev("F#.Floor(2.9)")).toEqual(2);
    expect(ev("F#.Floor([])")).toEqual(undefined);
  });
  it("executes #!/chr", function() {
    expect(ev("F#.Chr(97)")).toEqual("a");
    expect(ev("F#.Chr([])")).toEqual(undefined);
  });
  it("executes #!/log", function() {
    expect(ev("F#.Log(5)")).toEqual(Math.log(5));
    expect(ev("F#.Log([])")).toEqual(undefined);
  });
  it("executes #!/max", function() {
    expect(ev("F#.Max(5, 4)")).toEqual(5);
    expect(ev("F#.Max(4, 5)")).toEqual(5);
    expect(ev("F#.Max([], 4)")).toEqual(undefined);
    expect(ev("F#.Max(5, [])")).toEqual(undefined);
  });
  it("executes #!/min", function() {
    expect(ev("F#.Min(4, 5)")).toEqual(4);
    expect(ev("F#.Min(5, 4)")).toEqual(4);
    expect(ev("F#.Min([], 4)")).toEqual(undefined);
    expect(ev("F#.Min(5, [])")).toEqual(undefined);
  });
  it("executes #!/parsefloat", function() {
    expect(ev('F#.ParseFloat("2.5")')).toEqual(2.5);
    expect(ev("F#.ParseFloat([])")).toEqual(undefined);
  });
  it("executes #!/parseint", function() {
    expect(ev('F#.ParseInt("2.5")')).toEqual(2);
    expect(ev("F#.ParseInt([])")).toEqual(undefined);
  });
  it("executes #!/parseint2", function() {
    expect(ev('F#.ParseInt("11", 2)')).toEqual(3);
    expect(ev("F#.ParseInt([], 2)")).toEqual(undefined);
    expect(ev('F#.ParseInt("11", [])')).toEqual(undefined);
  });
  it("executes #!/pow", function() {
    expect(ev("F#.Pow(2, 3)")).toEqual(8);
    expect(ev("F#.Pow([], 3)")).toEqual(undefined);
    expect(ev("F#.Pow(2, [])")).toEqual(undefined);
  });
  it("executes #!/round", function() {
    expect(ev("F#.Round(2.1)")).toEqual(2);
    expect(ev("F#.Round(2.9)")).toEqual(3);
    expect(ev("F#.Round([])")).toEqual(undefined);
  });
  it("executes #!/sin", function() {
    expect(ev("F#.Sin(1)")).toEqual(Math.sin(1));
    expect(ev("F#.Sin([])")).toEqual(undefined);
  });
  it("executes #!/sqrt", function() {
    expect(ev("F#.Sqrt(16)")).toEqual(4);
    expect(ev("F#.Sqrt([])")).toEqual(undefined);
  });
  it("executes #!/tan", function() {
    expect(ev("F#.Tan(1)")).toEqual(Math.tan(1));
    expect(ev("F#.Tan([])")).toEqual(undefined);
  });
});
