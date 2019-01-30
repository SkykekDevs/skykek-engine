"use strict";
// parse.js reads tokens from the scanner and produces a parse tree.

// Binary operators, grouped by precedence.
const EXPR1 = { "||": 1 };
const EXPR2 = { "&&": 1 };
const EXPR3 = { "==": 1, "!=": 1, "<": 1, "<=": 1, ">": 1, ">=": 1, in: 1 };
const EXPR4 = { "+": 1, "-": 1, "|": 1, "^": 1 };
const EXPR5 = {
  "*": 1,
  "/": 1,
  "%": 1,
  "**": 1,
  "<<": 1,
  ">>": 1,
  ">>>": 1,
  "&": 1
};
// Unary operators.
const UEXPR = { "!": 1, "-": 1, "~": 1 };

// Parses a declaration. s is a scanner.
function parseDecl(s) {
  const ds = s.tk("$");
  if (s.tt == "[") {
    const decl = [
      "prop_decl",
      ds,
      s.tk("["),
      parseExpr1(s),
      s.tk("]"),
      s.tk("="),
      parseExpr1(s)
    ];
    s.tk("eof");
    return decl;
  }
  const decl = [
    "rule_decl",
    ds,
    s.tk("."),
    s.tk("lc"),
    s.tk("("),
    parseParams(s),
    s.tk(")"),
    s.tk("="),
    parseExpr1(s)
  ];
  s.tk("eof");
  return decl;
}

// Parses a comma-separated list of method parameters.
function parseParams(s) {
  var vars = [];
  if (s.tt != ")" && s.tt != "eof") {
    // first param
    vars.push(parseParam(s));
    while (s.tt == ",") {
      // other params
      s.tk(",");
      vars.push(parseParam(s));
    }
  }
  return vars;
}

// Parses a method parameter.
function parseParam(s) {
  const name = s.tk("lc");
  if (s.tt == ":") {
    return ["matched_param", name, s.tk(":"), parseExpr1(s)];
  }
  return ["unmatched_param", name];
}

// Parses an expression on its own.
function parseExpr(s) {
  const expr = parseExpr1(s);
  s.tk("eof");
  return expr;
}

// Parses an expression.
function parseExpr1(s) {
  var expr = parseExpr2(s);
  while (EXPR1.hasOwnProperty(s.tt)) {
    expr = ["binary_expr", expr, s.tk(s.tt), parseExpr2(s)];
  }
  return expr;
}

// Parses a level-2 binary expression.
function parseExpr2(s) {
  var expr = parseExpr3(s);
  while (EXPR2.hasOwnProperty(s.tt)) {
    expr = ["binary_expr", expr, s.tk(s.tt), parseExpr3(s)];
  }
  return expr;
}

// Parses a level-3 binary expression.
function parseExpr3(s) {
  var expr = parseExpr4(s);
  while (EXPR3.hasOwnProperty(s.tt)) {
    expr = ["binary_expr", expr, s.tk(s.tt), parseExpr4(s)];
  }
  return expr;
}

// Parses a level-4 binary expression.
function parseExpr4(s) {
  var expr = parseExpr5(s);
  while (EXPR4.hasOwnProperty(s.tt)) {
    expr = ["binary_expr", expr, s.tk(s.tt), parseExpr5(s)];
  }
  return expr;
}

// Parses a level-5 binary expression.
function parseExpr5(s) {
  var expr = parseUExpr(s);
  while (EXPR5.hasOwnProperty(s.tt)) {
    expr = ["binary_expr", expr, s.tk(s.tt), parseUExpr(s)];
  }
  return expr;
}

// Parses a unary expression.
function parseUExpr(s) {
  if (UEXPR.hasOwnProperty(s.tt)) {
    const e = ["unary_expr", s.tk(s.tt), parseUExpr(s)];
    if (e[1] == "-" && e[2][0] == "num_expr") {
      return ["negnum_expr", "-" + e[2][1]];
    }
    return e;
  }
  return parseCExpr(s);
}

// Parses an expression chain.
function parseCExpr(s) {
  var expr = parseAExpr(s);
  while (true) {
    if (s.tt == "[") {
      expr = ["get_expr", expr, s.tk("["), parseExpr1(s), s.tk("]")];
    } else if (s.tt == "#") {
      expr = ["load_expr", expr, s.tk("#")];
    } else if (s.tt == "(") {
      expr = ["constructor_expr", expr, s.tk("("), parseArgs(s), s.tk(")")];
    } else if (s.tt == ".") {
      expr = [
        "call_expr",
        expr,
        s.tk("."),
        s.tk("lc"),
        s.tk("("),
        parseArgs(s),
        s.tk(")")
      ];
    } else {
      break;
    }
  }
  return expr;
}

// Parses an atomic expression.
function parseAExpr(s) {
  if (s.tt == "(") {
    s.tk("(");
    const expr = parseExpr1(s);
    s.tk(")");
    return expr;
  } else if (s.tt == "num") {
    return ["num_expr", s.tk("num")];
  } else if (s.tt == "str") {
    return ["str_expr", s.tk("str")];
  } else if (s.tt == "const") {
    return ["const_expr", s.tk("const")];
  } else if (s.tt == "uc") {
    return ["name_expr", s.tk("uc")];
  } else if (s.tt == "#!/") {
    return ["func_expr", s.tk("#!/"), s.tk("lc")];
  } else if (s.tt == "lc") {
    return ["param_expr", s.tk("lc")];
  } else if (s.tt == "$") {
    return ["this_expr", s.tk("$")];
  } else if (s.tt == "[") {
    return ["list_expr", s.tk("["), parseListElements(s), s.tk("]")];
  } else if (s.tt == "{") {
    return ["map_expr", s.tk("{"), parseMapEntries(s), s.tk("}")];
  } else if (s.tt == "#{") {
    return ["set_expr", s.tk("#{"), parseSetMembers(s), s.tk("}")];
  } else {
    throw new Error("syntax");
  }
}

// Parses a comma-separated list of method call arguments.
function parseArgs(s) {
  var args = [];
  if (s.tt != ")" && s.tt != "eof") {
    args.push(parseExpr1(s));
  }
  while (s.tt == ",") {
    s.next(s);
    args.push(parseExpr1(s));
  }
  return args;
}

// Parses the comma-separated expressions in a list.
function parseListElements(s) {
  var exprs = [];
  while (s.tt != "]" && s.tt != "eof") {
    exprs.push(parseExpr1(s));
    if (s.tt != ",") {
      break;
    }
    s.next();
  }
  return exprs;
}

// Parses the comma-separated pairs of expressions in a map.
function parseMapEntries(s) {
  var pairs = [];
  while (s.tt != "}" && s.tt != "eof") {
    pairs.push(["pair", parseExpr1(s), s.tk(":"), parseExpr1(s)]);
    if (s.tt != ",") {
      break;
    }
    s.next();
  }
  return pairs;
}

// Parses the comma-separated expressions in a set.
function parseSetMembers(s) {
  var exprs = [];
  while (s.tt != "}" && s.tt != "eof") {
    exprs.push(parseExpr1(s));
    if (s.tt != ",") {
      break;
    }
    s.next();
  }
  return exprs;
}

exports.parseDecl = parseDecl;
exports.parseExpr = parseExpr;
