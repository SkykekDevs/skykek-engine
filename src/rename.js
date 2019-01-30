"use strict";
// rename.js turns relatives names (that start with @) into absolute names
// in the parse tree of declarations and expressions.

// In a declaration, removes the starting "@" in every relative
// class name and replaces it with namespace ns.
function renameDecl(n, ns) {
  const t = n[0];
  if (t == "prop_decl") {
    renameExpr(n[3], ns);
    renameExpr(n[6], ns);
  } else if (t == "rule_decl") {
    renameParams(n[5], ns);
    renameExpr(n[8], ns);
  }
}

// In an array of parameters, removes the starting "@" in every relative
// class name and replaces it with prefix r.
function renameParams(n, ns) {
  for (var i = 0; i < n.length; i++) {
    const ni = n[i];
    if (ni[0] == "matched_param") {
      renameExpr(ni[3], ns);
    }
  }
}

// In an expression, removes the starting "@" in every relative
// class name and replaces it with namespace ns.
function renameExpr(n, ns) {
  const t = n[0];
  // nothing to do for 'num_expr', 'negnum_expr', 'str_expr',
  // 'const_expr', 'func_expr', 'param_expr', 'this_expr'.
  if (t == "binary_expr") {
    renameExpr(n[1], ns);
    renameExpr(n[3], ns);
  } else if (t == "unary_expr") {
    renameExpr(n[2], ns);
  } else if (t == "get_expr") {
    renameExpr(n[1], ns);
    renameExpr(n[3], ns);
  } else if (t == "load_expr") {
    renameExpr(n[1], ns);
  } else if (t == "constructor_expr") {
    renameExpr(n[1], ns);
    const args = n[3];
    for (var i = 0; i < args.length; i++) {
      renameExpr(args[i], ns);
    }
  } else if (t == "call_expr") {
    renameExpr(n[1], ns);
    const args = n[5];
    for (var i = 0; i < args.length; i++) {
      renameExpr(args[i], ns);
    }
  } else if (t == "name_expr") {
    n[1] = n[1].replace("@", ns);
  } else if (t == "list_expr") {
    const exprs = n[2];
    for (var i = 0; i < exprs.length; i++) {
      renameExpr(exprs[i], ns);
    }
  } else if (t == "map_expr") {
    const pairs = n[2];
    for (var i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      renameExpr(pair[1], ns);
      renameExpr(pair[3], ns);
    }
  } else if (t == "set_expr") {
    const exprs = n[2];
    for (var i = 0; i < exprs.length; i++) {
      renameExpr(exprs[i], ns);
    }
  }
}

exports.renameDecl = renameDecl;
exports.renameExpr = renameExpr;
