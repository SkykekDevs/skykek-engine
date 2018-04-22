"use strict";
// build.js assembles multiple objects into a tree structure.

// A program is a tree of classes. A tree is loaded from a DANK file.
// This type of file is not meant to be written by hand, but rather with
// the help of a software development environment like the one on Skykek.

const immutable = require("../src/immutable2.js");
const Map = immutable.Map;

const compile = require("../src/compile.js");
const compileObject = compile.compileObject;

// A tree.
function Tree(pathname, id, lines, count, err, obj, subs) {
  this.pathname = pathname;
  this.id = id;
  this.lines = lines; // source lines
  this.count = count; // number of lines in this class and the subtrees combined
  this.err = err; // the compilation error in this class or a subtree
  this.obj = obj; // the object compiled from this class
  this.subs = subs; // map of subtrees by name
}

Tree.prototype.get = function(path, default_) {
  var tree = this;
  const size = path.size;
  for (var i = 0; i < size; i++) {
    const name = path.get(i);
    if (!tree.subs.hasOwnProperty(name)) return default_;
    tree = tree.subs[name];
  }
  return tree.obj;
};

// Builds a tree from the content of a .dank file.
// path is the desired path to the root class.
function loadTree(pathname, content) {
  const treeLines = content.match(/.*\n/g);
  return readDankLines(pathname, treeLines, 0);
}

// Builds a tree from the lines of a .dank file, starting at line i.
// path is the desired path to the root class.
function readDankLines(pathname, treeLines, i) {
  const id = treeLines[i].match(/^DANK\/1 ([0-9a-f]+) \d+\n/)[1];
  const num_lines = parseInt(
    treeLines[i].match(/^DANK\/1 [0-9a-f]+ (\d+)\n/)[1]
  );
  i++; // header line
  var lines = treeLines.slice(i, i + num_lines);
  i += num_lines;
  var subLines = lines.filter(function(line) {
    return line.match(/^\.\/[a-z][a-z0-9_]*\/[0-9a-f]+/);
  });
  var subs = {};
  for (var j = 0; j < subLines.length; j++) {
    var name = subLines[j].match(/^\.\/([a-z][a-z0-9_]*)/)[1];
    const subPathname = pathname + name + "/";
    subs[name] = readDankLines(subPathname, treeLines, i);
    i += subs[name].count;
  }
  return buildTree(pathname, id, lines, subs);
}

// Builds a tree from the lines of content of its root class and
// a map of its subtrees.
function buildTree(pathname, id, lines, subs) {
  var count = 1 + lines.length; // one header line
  var err = undefined;
  var obj = Map({});
  try {
    obj = compileObject(pathname, lines);
  } catch (e) {
    err = e;
  }
  for (var name in subs) {
    const sub = subs[name];
    count += sub.count;
    if (sub.err && !err) err = sub.err;
  }
  return new Tree(pathname, id, lines, count, err, obj, subs);
}

// Merges a tree into the base tree.
function mergeTree(base, tree) {
  if (tree.pathname == base.pathname) return tree;
  const pathname = base.pathname;
  const lines = base.lines;
  const obj = base.obj;
  var count = 1 + lines.length; // one header line
  var err =
    base.err && base.err.pathname == base.pathname ? base.err : undefined;
  var subs = {};
  for (var name in base.subs) {
    subs[name] = base.subs[name];
  }
  const rest = tree.pathname.slice(pathname.length);
  const next = rest.slice(0, rest.indexOf("/"));
  const nextPathname = pathname + next + "/";
  const nextBase = base.subs.hasOwnProperty(next)
    ? base.subs[next]
    : new Tree(nextPathname, null, ["\n"], 2, undefined, Map({}), {});
  subs[next] = mergeTree(nextBase, tree);
  for (var name in subs) {
    const sub = subs[name];
    count += sub.count;
    if (sub.err && !err) err = sub.err;
  }
  return new Tree(pathname, null, lines, count, err, obj, subs);
}

exports.loadTree = loadTree;
exports.buildTree = buildTree;
exports.mergeTree = mergeTree;
