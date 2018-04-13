"use strict";
// check.js checks for errors in the parse tree of a declaration or an expression.

// The maximum number of parameters in a method (including this).
const MAX_PARAMS = 32;

// Returns the set of parameter names from a list of parameter nodes.
function ruleParams(paramsN) {
  var params = {};
  for (var i = 0; i < paramsN.length; i++) {
    params[paramsN[i][1]] = true;
  }
  return params;
}

// Checks a declaration for errors.
function checkDecl(n) {
  const t = n[0];
  if (t == "prop_decl") {
    if (n[1] != "$") throw new Error("only properties of $ can be declared");
    checkLiteral(n[5]);
  } else if (t == "entry_decl") {
    if (n[1] != "$") throw new Error("only properties of $ can be declared");
    checkLiteral(n[3]);
    checkLiteral(n[6]);
  } else if (t == "rule_decl") {
    if (n[1] != "$") {
      throw new Error("only rules of $ can be declared");
    }
    checkParams(n[5]);
    checkExpr(n[8], ruleParams(n[5]));
  }
}

// Checks an array of parameters for errors.
function checkParams(n) {
  if (1 + n.length > MAX_PARAMS) throw new Error("too many parameters");
  var names = {};
  for (var i = 0; i < n.length; i++) {
    const ni = n[i];
    if (i < n.length - 1 && ni[0] != "unmatched_param") {
      throw new Error("a value can be required only for the last parameter");
    }
    const name = ni[1];
    if (names.hasOwnProperty(name)) {
      throw new Error("parameter name " + name + " is used twice");
    }
    names[name] = true;
    checkParam(ni);
  }
}

// Checks a parameter for errors.
function checkParam(n) {
  const t = n[0];
  // nothing to do for 'unmatched_param'
  if (t == "matched_param") {
    checkLiteral(n[3]);
  }
}

// Checks an expression for errors.
// n is the expression node.
function checkExpr(n, params) {
  const t = n[0];
  // nothing to do for 'num_expr', 'negnum_expr', 'this_expr',
  // 'const_expr', 'path_expr', 'func_expr'.
  if (t == "binary_expr") {
    checkExpr(n[1], params);
    checkExpr(n[3], params);
  } else if (t == "unary_expr") {
    checkExpr(n[2], params);
  } else if (t == "dot_expr") {
    checkExpr(n[1], params);
    const sub = n[3][0];
    if (sub != "param_expr" && sub != "call_expr") {
      throw new Error("a dot must be followed by a property name or a call");
    }
    if (sub == "call_expr") checkExpr(n[3], params);
  } else if (t == "get_expr") {
    checkExpr(n[1], params);
    checkExpr(n[3], params);
  } else if (t == "str_expr") {
    try {
      JSON.parse(n[1]);
    } catch (err) {
      throw new Error("unknown character escape in string");
    }
  } else if (t == "make_expr") {
    if (1 + n[3].length > MAX_PARAMS) {
      throw new Error("too many arguments in constructor");
    }
    const args = n[3];
    for (var i = 0; i < args.length; i++) {
      checkExpr(args[i], params);
    }
  } else if (t == "call_expr") {
    if (1 + n[3].length > MAX_PARAMS) {
      throw new Error("too many arguments in method call");
    }
    const args = n[3];
    for (var i = 0; i < args.length; i++) {
      checkExpr(args[i], params);
    }
  } else if (t == "param_expr") {
    const p = n[1];
    if (!params.hasOwnProperty(p)) {
      throw new Error("undefined parameter " + p);
    }
  } else if (t == "list_expr") {
    const exprs = n[2];
    for (var i = 0; i < exprs.length; i++) {
      checkExpr(exprs[i], params);
    }
  } else if (t == "map_expr") {
    const pairs = n[2];
    for (var i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      checkExpr(pair[1], params);
      checkExpr(pair[3], params);
    }
  } else if (t == "set_expr") {
    const exprs = n[2];
    for (var i = 0; i < exprs.length; i++) {
      checkExpr(exprs[i], params);
    }
  }
}

// Checks a literal for errors.
// n is an expression node.
function checkLiteral(n) {
  const t = n[0];
  // nothing to do for 'num_expr', 'negnum_expr', 'const_expr'.
  if (t == "binary_expr") {
    throw new Error("expected a literal");
  } else if (t == "unary_expr") {
    throw new Error("expected a literal");
  } else if (t == "dot_expr") {
    throw new Error("expected a literal");
  } else if (t == "get_expr") {
    throw new Error("expected a literal");
  } else if (t == "str_expr") {
    try {
      JSON.parse(n[1]);
    } catch (err) {
      throw new Error("unknown character escape in string");
    }
  } else if (t == "make_expr") {
    throw new Error("expected a literal");
  } else if (t == "call_expr") {
    throw new Error("expected a literal");
  } else if (t == "param_expr") {
    throw new Error("expected a literal");
  } else if (t == "this_expr") {
    throw new Error("expected a literal");
  } else if (t == "path_expr") {
    throw new Error("expected a literal");
  } else if (t == "func_expr") {
    throw new Error("expected a literal");
  } else if (t == "list_expr") {
    const exprs = n[2];
    for (var i = 0; i < exprs.length; i++) {
      checkLiteral(exprs[i]);
    }
  } else if (t == "map_expr") {
    const pairs = n[2];
    for (var i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      checkLiteral(pair[1]);
      checkLiteral(pair[3]);
    }
  } else if (t == "set_expr") {
    const exprs = n[2];
    for (var i = 0; i < exprs.length; i++) {
      checkLiteral(exprs[i]);
    }
  }
}

exports.checkDecl = checkDecl;
exports.checkExpr = checkExpr;
