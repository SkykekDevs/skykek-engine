"use strict";
// rename.js turns relatives names (that start with $) into absolute names
// in the parse tree of declarations and expressions.

// In a declaration, removes the starting "$" in every relative
// class name and replaces it with prefix r.
function renameDecl(n, r) {
  const t = n[0];
  if (t == "prop_decl") {
    renameExpr(n[5], r);
  } else if (t == "entry_decl") {
    renameExpr(n[3], r);
    renameExpr(n[6], r);
  } else if (t == "rule_decl") {
    renameParams(n[5], r);
    renameExpr(n[8], r);
  }
}

// In an array of parameters, removes the starting "$" in every relative
// class name and replaces it with prefix r.
function renameParams(n, r) {
  for (var i = 0; i < n.length; i++) {
    const ni = n[i];
    if (ni[0] == "matched_param") {
      renameExpr(ni[3], r);
    }
  }
}

// In an expression, removes the starting "$" in every relative
// class name and replaces it with prefix r.
function renameExpr(n, r) {
  const t = n[0];
  // nothing to do for 'num_expr', 'negnum_expr', 'str_expr',
  // 'const_expr', 'param_expr', 'this_expr', and 'func_expr'.
  if (t == "path_expr") {
    n[1] = n[1].replace("$", r);
  } else if (t == "make_expr") {
    n[1] = n[1].replace("$", r);
    const args = n[3];
    for (var i = 0; i < args.length; i++) {
      renameExpr(args[i], r);
    }
  } else if (t == "binary_expr") {
    renameExpr(n[1], r);
    renameExpr(n[3], r);
  } else if (t == "unary_expr") {
    renameExpr(n[2], r);
  } else if (t == "dot_expr") {
    renameExpr(n[1], r);
    renameExpr(n[3], r);
  } else if (t == "get_expr") {
    renameExpr(n[1], r);
    renameExpr(n[3], r);
  } else if (t == "call_expr") {
    const args = n[3];
    for (var i = 0; i < args.length; i++) {
      renameExpr(args[i], r);
    }
  } else if (t == "list_expr") {
    const exprs = n[2];
    for (var i = 0; i < exprs.length; i++) {
      renameExpr(exprs[i], r);
    }
  } else if (t == "map_expr") {
    const pairs = n[2];
    for (var i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      renameExpr(pair[1], r);
      renameExpr(pair[3], r);
    }
  } else if (t == "set_expr") {
    const exprs = n[2];
    for (var i = 0; i < exprs.length; i++) {
      renameExpr(exprs[i], r);
    }
  }
}

exports.renameDecl = renameDecl;
exports.renameExpr = renameExpr;
