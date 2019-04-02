"use strict";
// make.js makes objects and expressions using an error-free parse tree
// as input.

const immutable = require("../src/immutable2.js");
const List = immutable.List;
const Map = immutable.Map;
const Set = immutable.Set;

// method names of unary operators
const UNARY = { "!": "Lnot", "-": "Neg", "~": "Not" };
// method names of binary operators
const BINARY = {
  "||": "Lor",
  "&&": "Land",
  "==": "Eq",
  "!=": "Ne",
  "<": "Lt",
  "<=": "Le",
  ">": "Gt",
  ">=": "Ge",
  "+": "Add",
  "-": "Sub",
  "|": "Or",
  "^": "Xor",
  "*": "Mul",
  "/": "Div",
  "%": "Rem",
  "**": "Pow",
  "++": "Concat",
  "<<": "Lsh",
  ">>": "Rsh",
  ">>>": "Zrsh",
  "&": "And"
};

// the constants
const CONST = {
  true: true,
  false: false,
  NaN: NaN,
  undefined: undefined
};

// Makes an object from an array of declarations.
function makeObject(decls) {
  var obj = Map({});
  for (var i = 0; i < decls.length; i++) {
    const n = decls[i];
    const t = n[0];
    if (t == "prop_decl") {
      obj = obj.set(makeValue(n[3]), makeValue(n[6]));
    } else if (t == "rule_decl") {
      const nameKey = getNameKey(n);
      const sizeKey = getSizeKey(n);
      const paramKey = getParamKey(n);
      var bySize = obj.get(nameKey, Map());
      var byParam = bySize.get(sizeKey, Map());
      byParam = byParam.set(paramKey, makeRHS(n));
      bySize = bySize.set(sizeKey, byParam);
      obj = obj.set(nameKey, bySize);
    }
  }
  return obj;
}

// Returns the name key for the given rule_decl node.
function getNameKey(n) {
  return n[3];
}

// Returns the size key for the given rule_decl node.
function getSizeKey(n) {
  return 1 + n[5].length;
}

// Returns the param key for the given rule_decl node.
function getParamKey(n) {
  const pNodes = n[5];
  if (pNodes.length > 0) {
    const pNode = pNodes[pNodes.length - 1];
    if (pNode[0] == "matched_param") {
      return makeValue(pNode[3]);
    }
  }
  return undefined;
}

// Makes a value. n is the expression node.
function makeValue(n) {
  const t = n[0];
  if (t == "num_expr") {
    return parseFloat(n[1]);
  } else if (t == "negnum_expr") {
    return parseFloat(n[1]);
  } else if (t == "const_expr") {
    return CONST[n[1]];
  } else if (t == "name_expr") {
    return n[1];
  } else if (t == "str_expr") {
    return JSON.parse(n[1]);
  } else if (t == "list_expr") {
    const elemNodes = n[2];
    var elems = [];
    for (var i = 0; i < elemNodes.length; i++) {
      elems.push(makeValue(elemNodes[i]));
    }
    return List(elems);
  } else if (t == "map_expr") {
    const pairNodes = n[2];
    var elems = [];
    for (var i = 0; i < pairNodes.length; i++) {
      const pairNode = pairNodes[i];
      elems.push(makeValue(pairNode[1]));
      elems.push(makeValue(pairNode[3]));
    }
    return Map.of.apply(Map, elems);
  } else if (t == "set_expr") {
    const elemNodes = n[2];
    var elems = [];
    for (var i = 0; i < elemNodes.length; i++) {
      elems.push(makeValue(elemNodes[i]));
    }
    return Set(elems);
  } else {
    throw "bad value";
  }
}

// Makes the expression on the right-hand side. n is the rule_decl node.
function makeRHS(n) {
  const pNodes = n[5];
  var p = {};
  for (var i = 0; i < pNodes.length; i++) {
    p[pNodes[i][1]] = i + 1;
  }
  return makeExpr(n[8], p);
}

// Makes an expression. n is the expression node, p is the parameter map.
function makeExpr(n, p) {
  const t = n[0];
  if (t == "binary_expr") {
    if (n[2] == "in") {
      return Map({
        Call: "Has",
        Args: List([makeExpr(n[3], p), makeExpr(n[1], p)])
      });
    }
    return Map({
      Call: BINARY[n[2]],
      Args: List([makeExpr(n[1], p), makeExpr(n[3], p)])
    });
  } else if (t == "unary_expr") {
    return Map({
      Call: UNARY[n[1]],
      Args: List([makeExpr(n[2], p)])
    });
  } else if (t == "get_expr") {
    return Map({
      Call: "Get",
      Args: List([makeExpr(n[1], p), makeExpr(n[3], p)])
    });
  } else if (t == "load_expr") {
    return Map({
      Call: "Load",
      Args: List([makeExpr(n[1], p)])
    });
  } else if (t == "constructor_expr") {
    var args = [
      Map({
        Call: "Load",
        Args: List([makeExpr(n[1], p)])
      })
    ];
    const others = n[3];
    for (var i = 0; i < others.length; i++) {
      args.push(makeExpr(others[i], p));
    }
    return Map({ Call: "Init", Args: List(args) });
  } else if (t == "call_expr") {
    var args = [makeExpr(n[1], p)];
    const others = n[5];
    for (var i = 0; i < others.length; i++) {
      args.push(makeExpr(others[i], p));
    }
    return Map({ Call: n[3], Args: List(args) });
  } else if (t == "num_expr") {
    return Map({ Val: parseFloat(n[1]) });
  } else if (t == "negnum_expr") {
    return Map({ Val: parseFloat(n[1]) });
  } else if (t == "const_expr") {
    return Map({ Val: CONST[n[1]] });
  } else if (t == "str_expr") {
    return Map({ Val: JSON.parse(n[1]) });
  } else if (t == "name_expr") {
    return Map({ Val: n[1] });
  } else if (t == "func_expr") {
    return Map({ Func: n[2] });
  } else if (t == "param_expr") {
    return Map({ Param: p[n[1]] });
  } else if (t == "this_expr") {
    return Map({ Param: 0 });
  } else if (t == "list_expr") {
    const elemNodes = n[2];
    var expr = Map({ Val: List([]) });
    for (var i = 0; i < elemNodes.length; i++) {
      const elem = elemNodes[i];
      const args = [expr, makeExpr(elem, p)];
      expr = Map({ Call: "Push", Args: List(args) });
    }
    return expr;
  } else if (t == "map_expr") {
    const pairNodes = n[2];
    var expr = Map({ Val: Map({}) });
    for (var i = 0; i < pairNodes.length; i++) {
      const pair = pairNodes[i];
      const args = [expr, makeExpr(pair[1], p), makeExpr(pair[3], p)];
      expr = Map({ Call: "Set", Args: List(args) });
    }
    return expr;
  } else if (t == "set_expr") {
    const elemNodes = n[2];
    var expr = Map({ Val: Set([]) });
    for (var i = 0; i < elemNodes.length; i++) {
      const elem = elemNodes[i];
      const args = [expr, makeExpr(elem, p)];
      expr = Map({ Call: "Add", Args: List(args) });
    }
    return expr;
  } else {
    throw "bad expr";
  }
}

exports.makeObject = makeObject;
exports.makeExpr = makeExpr;
