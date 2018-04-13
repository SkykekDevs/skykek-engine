"use strict";
// make.js makes objects and expressions using an error-free parse tree
// as input.

const immutable = require("../src/immutable2.js");
const List = immutable.List;
const Map = immutable.Map;
const Set = immutable.Set;

// Returns the path list of the object with the given name.
function makePath(name) {
  var m = name.match(/[A-Z][^A-Z]*/g);
  if (!m) m = [];
  var p = List(
    m.map(function(s) {
      return s.toLowerCase();
    })
  );
  return Map({ path: p });
}

// expression for the Global object
const Global = makePath("Global");

// method names of unary operators
const UNARY = { "!": "lnot", "-": "neg", "~": "not" };
// method names of binary operators
const BINARY = {
  "||": "lor",
  "&&": "land",
  "==": "eq",
  "!=": "ne",
  "<": "lt",
  "<=": "le",
  ">": "gt",
  ">=": "ge",
  "+": "add",
  "-": "sub",
  "|": "or",
  "^": "xor",
  "*": "mul",
  "/": "div",
  "%": "rem",
  "**": "pow",
  "<<": "lsh",
  ">>": "rsh",
  ">>>": "zrsh",
  "&": "and"
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
      obj = obj.set(n[3], makeValue(n[5]));
    } else if (t == "entry_decl") {
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
        call: "has",
        args: List([makeExpr(n[3], p), makeExpr(n[1], p)])
      });
    }
    return Map({
      call: BINARY[n[2]],
      args: List([makeExpr(n[1], p), makeExpr(n[3], p)])
    });
  } else if (t == "unary_expr") {
    return Map({
      call: UNARY[n[1]],
      args: List([makeExpr(n[2], p)])
    });
  } else if (t == "dot_expr") {
    const sub = n[3];
    if (sub[0] == "param_expr") {
      return Map({
        call: "get",
        args: List([makeExpr(n[1], p), Map({ val: sub[1] })])
      });
    } else {
      // sub[0] == 'call_expr'
      var args = [makeExpr(n[1], p)];
      const others = sub[3];
      for (var i = 0; i < others.length; i++) {
        args.push(makeExpr(others[i], p));
      }
      return Map({ call: sub[1], args: List(args) });
    }
  } else if (t == "get_expr") {
    return Map({
      call: "get",
      args: List([makeExpr(n[1], p), makeExpr(n[3], p)])
    });
  } else if (t == "num_expr") {
    return Map({ val: parseFloat(n[1]) });
  } else if (t == "negnum_expr") {
    return Map({ val: parseFloat(n[1]) });
  } else if (t == "const_expr") {
    return Map({ val: CONST[n[1]] });
  } else if (t == "str_expr") {
    return Map({ val: JSON.parse(n[1]) });
  } else if (t == "path_expr") {
    return makePath(n[1]);
  } else if (t == "make_expr") {
    var args = [makePath(n[1])];
    const others = n[3];
    for (var i = 0; i < others.length; i++) {
      args.push(makeExpr(others[i], p));
    }
    return Map({ call: "make", args: List(args) });
  } else if (t == "func_expr") {
    return Map({ func: n[2] });
  } else if (t == "call_expr") {
    var args = [Global];
    const others = n[3];
    for (var i = 0; i < others.length; i++) {
      args.push(makeExpr(others[i], p));
    }
    return Map({ call: n[1], args: List(args) });
  } else if (t == "param_expr") {
    return Map({ param: p[n[1]] });
  } else if (t == "this_expr") {
    return Map({ param: 0 });
  } else if (t == "list_expr") {
    const elemNodes = n[2];
    var expr = Map({ val: List([]) });
    for (var i = 0; i < elemNodes.length; i++) {
      const elem = elemNodes[i];
      const args = [expr, makeExpr(elem, p)];
      expr = Map({ call: "push", args: List(args) });
    }
    return expr;
  } else if (t == "map_expr") {
    const pairNodes = n[2];
    var expr = Map({ val: Map({}) });
    for (var i = 0; i < pairNodes.length; i++) {
      const pair = pairNodes[i];
      const args = [expr, makeExpr(pair[1], p), makeExpr(pair[3], p)];
      expr = Map({ call: "set", args: List(args) });
    }
    return expr;
  } else if (t == "set_expr") {
    const elemNodes = n[2];
    var expr = Map({ val: Set([]) });
    for (var i = 0; i < elemNodes.length; i++) {
      const elem = elemNodes[i];
      const args = [expr, makeExpr(elem, p)];
      expr = Map({ call: "add", args: List(args) });
    }
    return expr;
  } else {
    throw "bad expr";
  }
}

exports.makeObject = makeObject;
exports.makeExpr = makeExpr;
