"use strict";
// Tests for ../src/parse.js

const scan = require("../src/scan.js");
const Scanner = scan.Scanner;

const parse = require("../src/parse.js");
const parseDecl = parse.parseDecl;
const parseExpr = parse.parseExpr;

describe("parseDecl()", function() {
  const parse = function(line) {
    return parseDecl(new Scanner(line));
  };
  const a = ["param_expr", "a"];
  const b = ["param_expr", "b"];
  const x = ["unmatched_param", "x"];
  const y = ["unmatched_param", "y"];
  const A = ["name_expr", "A"];
  const B = ["name_expr", "B"];
  const C = ["name_expr", "C"];
  const D = ["name_expr", "D"];

  it("ignores comments", function() {
    const v = parse("$.M() = a  // a comment");
    const ev = ["rule_decl", "$", ".", "M", "(", [], ")", "=", a];
    expect(v).toEqual(ev);
  });
  it("parses a prop_decl", function() {
    const v = parse("$[b] = a");
    const ev = ["prop_decl", "$", "[", b, "]", "=", a];
    expect(v).toEqual(ev);
  });
  it("parses a rule_decl with 0 params", function() {
    const v = parse("$.M() = a");
    const ev = ["rule_decl", "$", ".", "M", "(", [], ")", "=", a];
    expect(v).toEqual(ev);
  });
  it("parses a rule_decl with 1 param", function() {
    const v = parse("$.M(x) = a");
    const ev = ["rule_decl", "$", ".", "M", "(", [x], ")", "=", a];
    expect(v).toEqual(ev);
  });
  it("parses a rule_decl with 2 params", function() {
    const v = parse("$.M(x, y) = a");
    const ev = ["rule_decl", "$", ".", "M", "(", [x, y], ")", "=", a];
    expect(v).toEqual(ev);
  });
  it("throws a syntax error on a bad token", function() {
    expect(function() {
      parse("}.M() = a");
    }).toThrow("syntax");
    expect(function() {
      parse("$}M() = a");
    }).toThrow("syntax");
    expect(function() {
      parse("$.}() = a");
    }).toThrow("syntax");
    expect(function() {
      parse("$.M}) = a");
    }).toThrow("syntax");
    expect(function() {
      parse("$.M(} = a");
    }).toThrow("syntax");
  });
  it("parses an unmatched param", function() {
    const v = parse("$.M(x) = a");
    const param = ["unmatched_param", "x"];
    const ev = ["rule_decl", "$", ".", "M", "(", [param], ")", "=", a];
    expect(v).toEqual(ev);
  });
  it("parses a number param", function() {
    const v = parse("$.M(x: 3) = a");
    const expr = ["num_expr", "3"];
    const param = ["matched_param", "x", ":", expr];
    const ev = ["rule_decl", "$", ".", "M", "(", [param], ")", "=", a];
    expect(v).toEqual(ev);
  });
  it("parses a negative number param", function() {
    const v = parse("$.M(x: -3) = a");
    const expr = ["negnum_expr", "-3"];
    const param = ["matched_param", "x", ":", expr];
    const ev = ["rule_decl", "$", ".", "M", "(", [param], ")", "=", a];
    expect(v).toEqual(ev);
  });
  it("parses a string param", function() {
    const v = parse('$.M(x: "abc") = a');
    const expr = ["str_expr", '"abc"'];
    const param = ["matched_param", "x", ":", expr];
    const ev = ["rule_decl", "$", ".", "M", "(", [param], ")", "=", a];
    expect(v).toEqual(ev);
  });
  it("parses a const param", function() {
    const v = parse("$.M(x: true) = a");
    const expr = ["const_expr", "true"];
    const param = ["matched_param", "x", ":", expr];
    const ev = ["rule_decl", "$", ".", "M", "(", [param], ")", "=", a];
    expect(v).toEqual(ev);
  });
  it("parses a list param with 0 elements", function() {
    const v = parse("$.M(x: []) = a");
    const expr = ["list_expr", "[", [], "]"];
    const param = ["matched_param", "x", ":", expr];
    const ev = ["rule_decl", "$", ".", "M", "(", [param], ")", "=", a];
    expect(v).toEqual(ev);
  });
  it("parses a list param with 1 element", function() {
    const v = parse("$.M(x: [A]) = a");
    const expr = ["list_expr", "[", [A], "]"];
    const param = ["matched_param", "x", ":", expr];
    const ev = ["rule_decl", "$", ".", "M", "(", [param], ")", "=", a];
    expect(v).toEqual(ev);
  });
  it("parses a list param with 2 elements", function() {
    const v = parse("$.M(x: [A, B]) = a");
    const expr = ["list_expr", "[", [A, B], "]"];
    const param = ["matched_param", "x", ":", expr];
    const ev = ["rule_decl", "$", ".", "M", "(", [param], ")", "=", a];
    expect(v).toEqual(ev);
  });
  it("parses a map param with 0 pairs", function() {
    const v = parse("$.M(x: {}) = a");
    const expr = ["map_expr", "{", [], "}"];
    const param = ["matched_param", "x", ":", expr];
    const ev = ["rule_decl", "$", ".", "M", "(", [param], ")", "=", a];
    expect(v).toEqual(ev);
  });
  it("parses a map param with 1 entry", function() {
    const v = parse("$.M(x: {A: B}) = a");
    const pairAB = ["pair", A, ":", B];
    const expr = ["map_expr", "{", [pairAB], "}"];
    const param = ["matched_param", "x", ":", expr];
    const ev = ["rule_decl", "$", ".", "M", "(", [param], ")", "=", a];
    expect(v).toEqual(ev);
  });
  it("parses a map param with 2 entries", function() {
    const v = parse("$.M(x: {A: B, C: D}) = a");
    const pairAB = ["pair", A, ":", B];
    const pairCD = ["pair", C, ":", D];
    const expr = ["map_expr", "{", [pairAB, pairCD], "}"];
    const param = ["matched_param", "x", ":", expr];
    const ev = ["rule_decl", "$", ".", "M", "(", [param], ")", "=", a];
    expect(v).toEqual(ev);
  });
  it("parses a set param with 0 members", function() {
    const v = parse("$.M(x: #{}) = a");
    const expr = ["set_expr", "#{", [], "}"];
    const param = ["matched_param", "x", ":", expr];
    const ev = ["rule_decl", "$", ".", "M", "(", [param], ")", "=", a];
    expect(v).toEqual(ev);
  });
  it("parses a set param with 1 members", function() {
    const v = parse("$.M(x: #{A}) = a");
    const expr = ["set_expr", "#{", [A], "}"];
    const param = ["matched_param", "x", ":", expr];
    const ev = ["rule_decl", "$", ".", "M", "(", [param], ")", "=", a];
    expect(v).toEqual(ev);
  });
  it("parses a set param with 2 members", function() {
    const v = parse("$.M(x: #{A, B}) = a");
    const expr = ["set_expr", "#{", [A, B], "}"];
    const param = ["matched_param", "x", ":", expr];
    const ev = ["rule_decl", "$", ".", "M", "(", [param], ")", "=", a];
    expect(v).toEqual(ev);
  });
});

describe("parseExpr()", function() {
  const parse = function(line) {
    return parseExpr(new Scanner(line));
  };
  const a = ["param_expr", "a"];
  const b = ["param_expr", "b"];
  const c = ["param_expr", "c"];
  const d = ["param_expr", "d"];
  it("parses a level-1 binary expression", function() {
    const v = parse("a && b || c && d");
    const ab = ["binary_expr", a, "&&", b];
    const cd = ["binary_expr", c, "&&", d];
    const ev = ["binary_expr", ab, "||", cd];
    expect(v).toEqual(ev);
  });
  it("parses a level-2 binary expression", function() {
    const v = parse("a == b && c == d");
    const ab = ["binary_expr", a, "==", b];
    const cd = ["binary_expr", c, "==", d];
    const ev = ["binary_expr", ab, "&&", cd];
    expect(v).toEqual(ev);
  });
  it("parses a level-3 binary expression", function() {
    for (var op of ["==", "!=", "<", "<=", ">", ">="]) {
      const v = parse("a + b " + op + " c + d");
      const ab = ["binary_expr", a, "+", b];
      const cd = ["binary_expr", c, "+", d];
      const ev = ["binary_expr", ab, op, cd];
      expect(v).toEqual(ev);
    }
  });
  it("parses a level-4 binary expression", function() {
    for (var op of ["+", "-", "|", "^"]) {
      const v = parse("a * b " + op + " c * d");
      const ab = ["binary_expr", a, "*", b];
      const cd = ["binary_expr", c, "*", d];
      const ev = ["binary_expr", ab, op, cd];
      expect(v).toEqual(ev);
    }
  });
  it("parses a level-5 binary expression", function() {
    for (var op of ["*", "/", "%", "**", "++", "<<", ">>", ">>>", "&"]) {
      const v = parse("!a " + op + " !b");
      const notA = ["unary_expr", "!", a];
      const notB = ["unary_expr", "!", b];
      const ev = ["binary_expr", notA, op, notB];
      expect(v).toEqual(ev);
    }
  });
  it("parses a unary expression", function() {
    for (var op of ["!", "-", "~"]) {
      const v1 = parse(op + "a[b]");
      const ev1 = ["unary_expr", op, ["get_expr", a, "[", b, "]"]];
      expect(v1).toEqual(ev1);
      const v2 = parse(op + op + "a");
      const ev2 = ["unary_expr", op, ["unary_expr", op, a]];
      expect(v2).toEqual(ev2);
    }
  });
  it("parses a get expression", function() {
    const v = parse("a[b]");
    const ev = ["get_expr", a, "[", b, "]"];
    expect(v).toEqual(ev);
    // chain
    const v2 = parse("a[b]#");
    const ev2 = ["load_expr", ["get_expr", a, "[", b, "]"], "#"];
    expect(v2).toEqual(ev2);
  });
  it("parses a load expression", function() {
    const v = parse("a#");
    const ev = ["load_expr", a, "#"];
    expect(v).toEqual(ev);
    // chain
    const v2 = parse("a##");
    const ev2 = ["load_expr", ["load_expr", a, "#"], "#"];
    expect(v2).toEqual(ev2);
  });
  it("parses a constructor expression", function() {
    const v0 = parse("a()");
    const ev0 = ["constructor_expr", a, "(", [], ")"];
    expect(v0).toEqual(ev0);
    const v1 = parse("a(b)");
    const ev1 = ["constructor_expr", a, "(", [b], ")"];
    expect(v1).toEqual(ev1);
    const v2 = parse("a(b, c)");
    const ev2 = ["constructor_expr", a, "(", [b, c], ")"];
    expect(v2).toEqual(ev2);
    // chain
    const v3 = parse("a()#");
    const ev3 = ["load_expr", ["constructor_expr", a, "(", [], ")"], "#"];
    expect(v3).toEqual(ev3);
  });
  it("parses a call expression", function() {
    const v0 = parse("a.b()");
    const ev0 = ["call_expr", a, ".", b, "(", [], ")"];
    expect(v0).toEqual(ev0);
    const v1 = parse("a.b(c)");
    const ev1 = ["call_expr", a, ".", b, "(", [c], ")"];
    expect(v1).toEqual(ev1);
    const v2 = parse("a.b(c, d)");
    const ev2 = ["call_expr", a, ".", b, "(", [c, d], ")"];
    expect(v2).toEqual(ev2);
    // chain
    const v3 = parse("a.b()#");
    const ev3 = ["load_expr", ["call_expr", a, ".", b, "(", [], ")"], "#"];
    expect(v3).toEqual(ev3);
  });
  it("parses a parenthesized expression", function() {
    const v = parse("(a)");
    const ev = a;
    expect(v).toEqual(ev);
  });
  it("parses a positive number expression", function() {
    const v = parse("3");
    const ev = ["num_expr", "3"];
    expect(v).toEqual(ev);
  });
  it("parses a negative number expression", function() {
    const v = parse("-3");
    const ev = ["negnum_expr", "-3"];
    expect(v).toEqual(ev);
  });
  it("parses a string expression", function() {
    const v = parse('"abc"');
    const ev = ["str_expr", '"abc"'];
    expect(v).toEqual(ev);
  });
  it("parses a const expression", function() {
    const v = parse("true");
    const ev = ["const_expr", "true"];
    expect(v).toEqual(ev);
  });
  it("parses a path expression", function() {
    const v = parse("A");
    const ev = ["name_expr", "A"];
    expect(v).toEqual(ev);
  });
  it("parses a function expression", function() {
    const v = parse("#!/a");
    const ev = ["func_expr", "#!/", "a"];
    expect(v).toEqual(ev);
  });
  it("parses a parameter expression", function() {
    const v = parse("a");
    const ev = ["param_expr", "a"];
    expect(v).toEqual(ev);
  });
  it("parses a $ expression", function() {
    const v = parse("$");
    const ev = ["this_expr", "$"];
    expect(v).toEqual(ev);
  });
  it("parses a list expression", function() {
    const v0 = parse("[]");
    const ev0 = ["list_expr", "[", [], "]"];
    expect(v0).toEqual(ev0);
    const v1 = parse("[a]");
    const ev1 = ["list_expr", "[", [a], "]"];
    expect(v1).toEqual(ev1);
    const v2 = parse("[a, b]");
    const ev2 = ["list_expr", "[", [a, b], "]"];
    expect(v2).toEqual(ev2);
  });
  it("parses a map expression", function() {
    const v0 = parse("{}");
    const ev0 = ["map_expr", "{", [], "}"];
    expect(v0).toEqual(ev0);
    const v1 = parse("{a: b}");
    const pairAB = ["pair", a, ":", b];
    const ev1 = ["map_expr", "{", [pairAB], "}"];
    expect(v1).toEqual(ev1);
    const v2 = parse("{a: b, c: d}");
    const pairCD = ["pair", c, ":", d];
    const ev2 = ["map_expr", "{", [pairAB, pairCD], "}"];
    expect(v2).toEqual(ev2);
  });
  it("parses a set expression", function() {
    const v0 = parse("#{}");
    const ev0 = ["set_expr", "#{", [], "}"];
    expect(v0).toEqual(ev0);
    const v1 = parse("#{a}");
    const ev1 = ["set_expr", "#{", [a], "}"];
    expect(v1).toEqual(ev1);
    const v2 = parse("#{a, b}");
    const ev2 = ["set_expr", "#{", [a, b], "}"];
    expect(v2).toEqual(ev2);
  });
  it("ignores comments", function() {
    const v = parse("3 // a comment");
    const ev = ["num_expr", "3"];
    expect(v).toEqual(ev);
  });
  it("throws a syntax error on a bad token", function() {
    expect(function() {
      parse("a]");
    }).toThrow("syntax");
    expect(function() {
      parse("]");
    }).toThrow("syntax");
    expect(function() {
      parse("(]");
    }).toThrow("syntax");
    expect(function() {
      parse("m(]");
    }).toThrow("syntax");
    expect(function() {
      parse("a[b}");
    }).toThrow("syntax");
    expect(function() {
      parse("[}");
    }).toThrow("syntax");
    expect(function() {
      parse("{]");
    }).toThrow("syntax");
    expect(function() {
      parse("#{]");
    }).toThrow("syntax");
  });
});
