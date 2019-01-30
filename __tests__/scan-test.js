"use strict";
// Tests for ../src/scan.js

const scan = require("../src/scan.js");
const Scanner = scan.Scanner;

describe("Scanner", function() {
  describe("next", function() {
    it("advances to the next non-space token in the stream", function() {
      const scanner = new Scanner("abc 3 ]");
      expect(scanner.tk("lc")).toEqual("abc");
      scanner.next();
      expect(scanner.tk("]")).toEqual("]");
    });
  });
  describe("tk", function() {
    it("returns useful tokens one by one and then returns eof", function() {
      const scanner = new Scanner("abc U 3 // comment");
      expect(scanner.tk("lc")).toEqual("abc");
      expect(scanner.tk("uc")).toEqual("U");
      expect(scanner.tk("num")).toEqual("3");
      expect(scanner.tk("eof")).toEqual(null);
      expect(scanner.tk("eof")).toEqual(null);
    });
    it("returns the next token if it has the expected type", function() {
      for (var token of ["abc", "_abc"]) {
        expect(new Scanner(token).tk("lc")).toEqual(token);
      }
      for (var token of ["Abc2_", "AbcDef2_"]) {
        expect(new Scanner(token).tk("uc")).toEqual(token);
      }
      for (var token of ["@Abc2_", "@AbcDef2_"]) {
        expect(new Scanner(token).tk("uc")).toEqual(token);
      }
      for (var token of ["98", "0", "2.3", "0x09afAF", "Infinity"]) {
        expect(new Scanner(token).tk("num")).toEqual(token);
      }
      for (var token of ["true", "false", "NaN", "undefined"]) {
        expect(new Scanner(token).tk("const")).toEqual(token);
      }
      for (var token of ["==", "!=", "<", ">", "<=", ">="]) {
        expect(new Scanner(token).tk(token)).toEqual(token);
      }
      for (var token of [
        "#{",
        "#!/",
        "&&",
        "||",
        "<<",
        ">>",
        ">>>",
        "**",
        "in"
      ]) {
        expect(new Scanner(token).tk(token)).toEqual(token);
      }
      for (var token of ['"abc"']) {
        expect(new Scanner(token).tk("str")).toEqual(token);
      }
      for (var token of ["(", ")", "[", "]", "{", "}"]) {
        expect(new Scanner(token).tk(token)).toEqual(token);
      }
      for (var token of [":", ".", ",", "!", "$", "#"]) {
        expect(new Scanner(token).tk(token)).toEqual(token);
      }
      for (var token of ["+", "-", "*", "/", "%", "&", "^", "~", "|", "="]) {
        expect(new Scanner(token).tk(token)).toEqual(token);
      }
    });
    it("throws an Error if the next token has an unexpected type", function() {
      const scanner = new Scanner("abc");
      expect(function() {
        scanner.tk("num");
      }).toThrow("syntax");
    });
  });
  describe("tt", function() {
    it("holds the type of the next token", function() {
      const scanner = new Scanner("abc 3 ]");
      expect(scanner.tt).toEqual("lc");
      scanner.tk("lc");
      expect(scanner.tt).toEqual("num");
      scanner.next();
      expect(scanner.tt).toEqual("]");
      scanner.next();
      expect(scanner.tt).toEqual("eof");
    });
  });
});
