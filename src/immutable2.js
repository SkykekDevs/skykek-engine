"use strict";
// immutable2.js is a modified version of Immutable.

const immutable = require("immutable");

const List = immutable.List;
const Map = immutable.Map;
const Set = immutable.Set;
const is = immutable.is;

List.prototype.toString = function() {
  return this.__toString("[", "]");
};

Map.prototype.toString = function() {
  return this.__toString("{", "}");
};

Set.prototype.toString = function() {
  return this.__toString("#{", "}");
};

exports.List = List;
exports.Map = Map;
exports.Set = Set;
exports.is = is;
