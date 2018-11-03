"use strict";
// scan.js implements a scanner of tokens.

const re_ = /[a-zA-Z_]\w*|@(?:[A-Z]\w*)?|0x[0-9a-fA-F]+|(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][-+]?\d+)?|"(?:[^"\\]|\\.)*"|#{|#!\/|&&|\|\||==|!=|<=|>=|<<|>>>|>>|\*\*|\/\/.*|\s+|./g;

// Splits a line into a list of tokens.
function tokenize(line) {
  if (line.length == 0) return [];
  return line.match(re_);
}

// Returns the type of a token.
function tokenType(token) {
  if (/^\s/.test(token)) {
    return " ";
  } else if (/^\/\//.test(token)) {
    return "//";
  } else if (/^[0-9]/.test(token)) {
    return "num";
  } else if (/^(?:Infinity)$/.test(token)) {
    return "num";
  } else if (/^(?:true|false|NaN|undefined)$/.test(token)) {
    return "const";
  } else if (/^in$/.test(token)) {
    return "in";
  } else if (/^".*"$/.test(token)) {
    return "str";
  } else if (/^[A-Z@]/.test(token)) {
    return "uc";
  } else if (/^[a-z_]/.test(token)) {
    return "lc";
  } else {
    return token;
  }
}

// A scanner of tokens (for parsing).
// Spaces and comments are ignored.
function Scanner(line) {
  this.tokens_ = tokenize(line);
  this.i_ = -1;
  this.token_ = null;
  this.tt = null; // tt holds the type of the next token
  this.next();
}

// Advances to the next token in the stream.
Scanner.prototype.next = function() {
  const last = this.token_;
  while (true) {
    this.i_++;
    this.token_ = this.i_ < this.tokens_.length ? this.tokens_[this.i_] : null;
    this.tt = this.token_ ? tokenType(this.token_) : "eof";
    if (this.tt != " " && this.tt != "//") break;
  }
  return last;
};

// Returns the next token if it has expected type.
// Throws an Error if the next token does not have the expected type.
Scanner.prototype.tk = function(tt) {
  const token = this.token_;
  if (this.tt != tt) throw new Error("syntax");
  this.next();
  return token;
};

// Returns the part of the line up to and including the current token (for error reporting).
Scanner.prototype.show = function(tt) {
  var i = Math.min(this.i_ + 1, this.tokens_.length);
  return this.tokens_.slice(0, i).join("");
};

exports.Scanner = Scanner;
