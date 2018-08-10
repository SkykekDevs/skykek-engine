"use strict";
// compile.js compiles objects and expressions from source by performing
// all the necessary steps (i.e. scan, parse, check, rename, make).

const immutable = require("../src/immutable2.js");
const List = immutable.List;

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
function compileObject(path, source) {
  const name = nameFromPath(path);
  source = source.replace(/\\\s*\n/g, ""); // line continuation
  const lines = source.split("\n");
  const objLines = lines.filter(function(line) {
    return line.startsWith("$");
  });
  var decls = [];
  for (var i = 0; i < objLines.length; i++) {
    try {
      var decl = parseDecl(new Scanner(objLines[i]));
      checkDecl(decl);
      renameDecl(decl, name);
      decls.push(decl);
    } catch (err) {
      err.classname = name;
      err.line = objLines[i];
      throw err;
    }
  }
  return makeObject(decls);
}

// Compiles an expression from a source string (e.g. '2 + 2').
function compileExpr(path, line) {
  const name = nameFromPath(path);
  var expr = parseExpr(new Scanner(line));
  checkExpr(expr, {});
  renameExpr(expr, name);
  return makeExpr(expr, {});
}

// Returns the name of a class from its path.
// e.g. nameFromPath(["abc", "def"]) == "AbcDef"
function nameFromPath(path) {
  return path
    .map(function(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    })
    .join("");
}

exports.compileObject = compileObject;
exports.compileExpr = compileExpr;
