"use strict";
// compile.js compiles objects and expressions from source by performing
// all the necessary steps (i.e. scan, parse, check, rename, make).

const immutable = require("../src/immutable2.js");
const List = immutable.List;
const Map = immutable.Map;

const scan = require("./scan.js");
const Scanner = scan.Scanner;

const parse = require("./parse.js");
const parseDecl = parse.parseDecl;
const parseExpr = parse.parseExpr;

const check = require("./check.js");
const checkDecl = check.checkDecl;
const checkExpr = check.checkExpr;

const rename = require("./rename.js");
const renameDecl = rename.renameDecl;
const renameExpr = rename.renameExpr;

const make = require("./make.js");
const makeObject = make.makeObject;
const makeExpr = make.makeExpr;

// Compiles an object from its source code.
function compileObject(namespace, localname, source) {
  source = source.replace(/([[{(,])[ \t]*\n/g, "$1"); // line continuation
  const lines = source.split("\n");
  const objLines = lines.filter(function(line) {
    return line.startsWith("$");
  });
  var decls = [];
  for (var i = 0; i < objLines.length; i++) {
    var scanner = new Scanner(objLines[i]);
    try {
      var decl = parseDecl(scanner);
      checkDecl(decl);
      renameDecl(decl, namespace);
      decls.push(decl);
    } catch (err) {
      err.name = namespace + localname;
      err.line = scanner.show();
      throw err;
    }
  }
  return makeObject(decls);
}

// Compiles an expression from a source string (e.g. '2 + 2').
function compileExpr(namespace, line) {
  var expr = parseExpr(new Scanner(line));
  checkExpr(expr, {});
  renameExpr(expr, namespace);
  return makeExpr(expr, {});
}

exports.compileObject = compileObject;
exports.compileExpr = compileExpr;
exports.EMPTY_MAP = Map({});
