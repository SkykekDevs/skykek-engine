"use strict";
// Tests for ../src/rename.js

const scan = require("../src/scan.js");
const Scanner = scan.Scanner;

const parse = require("../src/parse.js");
const parseDecl = parse.parseDecl;
const parseExpr = parse.parseExpr;

const rename = require("../src/rename.js");
const renameDecl = rename.renameDecl;
const renameExpr = rename.renameExpr;

describe("renameDecl()", function() {
  const rename = function(line) {
    const decl = parseDecl(new Scanner(line));
    renameDecl(decl, "M");
    return decl;
  };
  const MA = ["path_expr", "MA"];
  const MB = ["path_expr", "MB"];

  it("renames a prop_decl", function() {
    const v = rename("$[@A] = @B");
    const ev = ["prop_decl", "$", "[", MA, "]", "=", MB];
    expect(v).toEqual(ev);
  });
  it("renames a rule_decl", function() {
    const v = rename("$.m(a: @A) = @B");
    const param = ["matched_param", "a", ":", MA];
    const ev = ["rule_decl", "$", ".", "m", "(", [param], ")", "=", MB];
    expect(v).toEqual(ev);
  });
});

describe("renameExpr()", function() {
  const rename = function(line) {
    const expr = parseExpr(new Scanner(line));
    renameExpr(expr, "M");
    return expr;
  };
  const MA = ["path_expr", "MA"];
  const MB = ["path_expr", "MB"];
  it("renames a binary_expr", function() {
    const v = rename("@A && @B");
    const ev = ["binary_expr", MA, "&&", MB];
    expect(v).toEqual(ev);
  });
  it("renames a unary_expr", function() {
    const v = rename("~@A");
    const ev = ["unary_expr", "~", MA];
    expect(v).toEqual(ev);
  });
  it("renames a get_expr", function() {
    const v = rename("@A[@B]");
    const ev = ["get_expr", MA, "[", MB, "]"];
    expect(v).toEqual(ev);
  });
  it("renames a load_expr", function() {
    const vA = rename("@A#");
    const evA = ["load_expr", MA, "#"];
    expect(vA).toEqual(evA);
  });
  it("renames a constructor_expr", function() {
    const v = rename("@A(@B)");
    const ev = ["constructor_expr", MA, "(", [MB], ")"];
    expect(v).toEqual(ev);
  });
  it("renames a call_expr", function() {
    const v = rename("@A.m(@B)");
    const ev = ["call_expr", MA, ".", "m", "(", [MB], ")"];
    expect(v).toEqual(ev);
  });
  it("renames a path_expr", function() {
    const vA = rename("A");
    const evA = ["path_expr", "A"];
    expect(vA).toEqual(evA);
    const vM = rename("@");
    const evM = ["path_expr", "M"];
    expect(vM).toEqual(evM);
    const vMA = rename("@A");
    const evMA = ["path_expr", "MA"];
    expect(vMA).toEqual(evMA);
  });
  it("renames a list_expr", function() {
    const v = rename("[@A, @B]");
    const ev = ["list_expr", "[", [MA, MB], "]"];
    expect(v).toEqual(ev);
  });
  it("renames a map_expr", function() {
    const v = rename("{@A: @B}");
    const ev = ["map_expr", "{", [["pair", MA, ":", MB]], "}"];
    expect(v).toEqual(ev);
  });
  it("renames a set_expr", function() {
    const v = rename("#{@A, @B}");
    const ev = ["set_expr", "#{", [MA, MB], "}"];
    expect(v).toEqual(ev);
  });
});
