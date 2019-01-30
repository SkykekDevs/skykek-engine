"use strict";
// Tests for ../src/check.js

const scan = require("../src/scan.js");
const Scanner = scan.Scanner;

const parse = require("../src/parse.js");
const parseDecl = parse.parseDecl;
const parseExpr = parse.parseExpr;

const check = require("../src/check.js");
const checkDecl = check.checkDecl;
const checkExpr = check.checkExpr;

function range(n) {
  return Array.apply(null, Array(n)).map((x, i) => i);
}

describe("checkDecl", function() {
  const check = function(line) {
    const decl = parseDecl(new Scanner(line));
    checkDecl(decl);
  };
  it("checks a prop_decl", function() {
    expect(function() {
      check("$[!2] = 5");
    }).toThrow("expected a value");
    expect(function() {
      check("$[2] = !5");
    }).toThrow("expected a value");
    expect(function() {
      check("$[2] = 5");
    }).not.toThrow();
  });
  it("checks a rule_decl", function() {
    expect(function() {
      check("$.m() = 5");
    }).not.toThrow();
    const args32 = range(32).map(x => "a" + x.toString());
    expect(function() {
      check("$.m(" + args32.join(", ") + ") = 5");
    }).toThrow("too many parameters");
    const args31 = range(31).map(x => "a" + x.toString());
    expect(function() {
      check("$.m(" + args31.join(", ") + ") = 5");
    }).not.toThrow();
    expect(function() {
      check("$.m(a: 3, b) = 5");
    }).toThrow("a value can be required only for the last parameter");
    expect(function() {
      check("$.m(a, b: 3) = 5");
    }).not.toThrow();
    expect(function() {
      check("$.m(a, b, a) = 5");
    }).toThrow("parameter name a is used twice");
    expect(function() {
      check("$.m(a, b, c) = 5");
    }).not.toThrow();
    expect(function() {
      check("$.m(a: $.n()) = 5");
    }).toThrow("expected a value");
    expect(function() {
      check("$.m(a: 3) = 5");
    }).not.toThrow();
    expect(function() {
      check("$.m(a) = b");
    }).toThrow("undefined parameter b");
    expect(function() {
      check("$.m(a) = a");
    }).not.toThrow();
  });
});

describe("checkValue", function() {
  const check = function(line) {
    const decl = parseDecl(new Scanner(line));
    checkDecl(decl);
  };
  it("checks a binary_expr as a value", function() {
    expect(function() {
      check("$[0] = 3 && 3");
    }).toThrow("expected a value");
  });
  it("checks a unary_expr as a value", function() {
    expect(function() {
      check("$[0] = !3");
    }).toThrow("expected a value");
  });
  it("checks a get_expr as a value", function() {
    expect(function() {
      check("$[0] = 3[4]");
    }).toThrow("expected a value");
  });
  it("checks a load_expr as a value", function() {
    expect(function() {
      check("$[0] = ABC#");
    }).toThrow("expected a value");
  });
  it("checks a constructor_expr as a value", function() {
    expect(function() {
      check("$[0] = ABC()");
    }).toThrow("expected a value");
  });
  it("checks a call_expr as a value", function() {
    expect(function() {
      check("$[0] = A.m()");
    }).toThrow("expected a value");
  });
  it("checks a func_expr as a value", function() {
    expect(function() {
      check("$[0] = #!/a");
    }).toThrow("expected a value");
  });
  it("checks a param_expr as a value", function() {
    expect(function() {
      check("$[0] = a");
    }).toThrow("expected a value");
  });
  it("checks a this_expr as a value", function() {
    expect(function() {
      check("$[0] = $");
    }).toThrow("expected a value");
  });
  it("checks a num_expr as a value", function() {
    expect(function() {
      check("$[0] = 3");
    }).not.toThrow();
  });
  it("checks a negnum_expr as a value", function() {
    expect(function() {
      check("$[0] = -3");
    }).not.toThrow();
  });
  it("checks a const_expr as a value", function() {
    expect(function() {
      check("$[0] = true");
    }).not.toThrow();
  });
  it("checks a name_expr as a value", function() {
    expect(function() {
      check("$[0] = ABC");
    }).not.toThrow();
  });
  it("checks a str_expr as a value", function() {
    expect(function() {
      check('$[0] = "\\m"');
    }).toThrow("unknown character escape in string");
    expect(function() {
      check('$[0] = "\\u123"');
    }).toThrow("unknown character escape in string");
    expect(function() {
      check('$[0] = "abc\\"\\n\\t\\u1234"');
    }).not.toThrow();
  });
  it("checks a list_expr as a value", function() {
    expect(function() {
      check("$[0] = [$.m()]");
    }).toThrow("expected a value");
    expect(function() {
      check("$[0] = [3]");
    }).not.toThrow();
  });
  it("checks a map_expr as a value", function() {
    expect(function() {
      check("$[0] = {3: $.m()}");
    }).toThrow("expected a value");
    expect(function() {
      check("$[0] = {$.m(): 33}");
    }).toThrow("expected a value");
    expect(function() {
      check("$[0] = {3: 33}");
    }).not.toThrow();
  });
  it("checks a set_expr as a value", function() {
    expect(function() {
      check("$[0] = #{$.m()}");
    }).toThrow("expected a value");
    expect(function() {
      check("$[0] = #{3}");
    }).not.toThrow();
  });
});

describe("checkExpr", function() {
  const check = function(line) {
    const expr = parseExpr(new Scanner(line));
    checkExpr(expr, { x: true });
  };
  it("checks a binary_expr", function() {
    expect(function() {
      check("a && 3");
    }).toThrow("undefined parameter a");
    expect(function() {
      check("3 && a");
    }).toThrow("undefined parameter a");
    expect(function() {
      check("2 && 3");
    }).not.toThrow();
  });
  it("checks a unary_expr", function() {
    expect(function() {
      check("!a");
    }).toThrow("undefined parameter a");
    expect(function() {
      check("!3");
    }).not.toThrow();
  });
  it("checks a get_expr", function() {
    expect(function() {
      check("a[3]");
    }).toThrow("undefined parameter a");
    expect(function() {
      check("3[a]");
    }).toThrow("undefined parameter a");
    expect(function() {
      check("3[4]");
    }).not.toThrow();
  });
  it("checks a load_expr", function() {
    expect(function() {
      check("w#");
    }).toThrow("undefined parameter w");
    expect(function() {
      check("x#");
    }).not.toThrow();
  });
  it("checks a constructor_expr", function() {
    expect(function() {
      check("a()");
    }).toThrow("undefined parameter a");
    const expr32 = range(32).map(x => x.toString());
    expect(function() {
      check("A(" + expr32.join(", ") + ")");
    }).toThrow("too many arguments");
    const expr31 = range(31).map(x => x.toString());
    expect(function() {
      check("A(" + expr31.join(", ") + ")");
    }).not.toThrow();
    expect(function() {
      check("A(4, a)");
    }).toThrow("undefined parameter a");
    expect(function() {
      check("A(4, 5)");
    }).not.toThrow();
  });
  it("checks a call_expr", function() {
    expect(function() {
      check("a.m()");
    }).toThrow("undefined parameter a");
    const expr32 = range(32).map(x => x.toString());
    expect(function() {
      check("A.m(" + expr32.join(", ") + ")");
    }).toThrow("too many arguments");
    const expr31 = range(31).map(x => x.toString());
    expect(function() {
      check("A.m(" + expr31.join(", ") + ")");
    }).not.toThrow();
    expect(function() {
      check("A.m(4, a)");
    }).toThrow("undefined parameter a");
    expect(function() {
      check("A.m(4, 5)");
    }).not.toThrow();
  });
  it("checks a num_expr", function() {
    expect(function() {
      check("3");
    }).not.toThrow();
  });
  it("checks a negnum_expr", function() {
    expect(function() {
      check("-3");
    }).not.toThrow();
  });
  it("checks a str_expr", function() {
    expect(function() {
      check('"\\m"');
    }).toThrow("unknown character escape in string");
    expect(function() {
      check('"\\u123"');
    }).toThrow("unknown character escape in string");
    expect(function() {
      check('"abc\\"\\n\\t\\u1234"');
    }).not.toThrow();
  });
  it("checks a const_expr", function() {
    expect(function() {
      check("NaN");
    }).not.toThrow();
  });
  it("checks a name_expr", function() {
    expect(function() {
      check("ABC");
    }).not.toThrow();
  });
  it("checks a func_expr", function() {
    expect(function() {
      check("#!/abs");
    }).not.toThrow();
  });
  it("checks a param_expr", function() {
    expect(function() {
      check("w");
    }).toThrow("undefined parameter w");
    expect(function() {
      check("x");
    }).not.toThrow();
  });
  it("checks a this_expr", function() {
    expect(function() {
      check("$");
    }).not.toThrow();
  });
  it("checks a list_expr", function() {
    expect(function() {
      check("[a]");
    }).toThrow("undefined parameter a");
    expect(function() {
      check("[3]");
    }).not.toThrow();
  });
  it("checks a map_expr", function() {
    expect(function() {
      check("{a: 33}");
    }).toThrow("undefined parameter a");
    expect(function() {
      check("{3: a}");
    }).toThrow("undefined parameter a");
    expect(function() {
      check("{3: 33}");
    }).not.toThrow();
  });
  it("checks a set_expr", function() {
    expect(function() {
      check("#{a}");
    }).toThrow("undefined parameter a");
    expect(function() {
      check("#{3}");
    }).not.toThrow();
  });
});
