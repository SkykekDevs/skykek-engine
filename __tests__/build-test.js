"use strict";
// Tests for ../src/build.js

const immutable = require("../src/immutable2.js");
const Map = immutable.Map;

const build = require("../src/build.js");
const loadTree = build.loadTree;
const buildTree = build.buildTree;
const mergeTree = build.mergeTree;

describe("loadTree", function() {
  it("parses the tree correctly", function() {
    const treeLines = [
      "DANK/1 2017 4\n",
      "inside ~\n",
      "$.m1() = 3\n",
      "./s0/2016\n",
      "./s1/2015\n",
      "DANK/1 2016 3\n",
      "inside ~/s0\n",
      "$.m2() = 3\n",
      "./t/2014\n",
      "DANK/1 2014 2\n",
      "inside ~/s0/t\n",
      "$.m3() = 3\n",
      "DANK/1 2015 2\n",
      "inside ~/s1\n",
      "$.m4() = 3\n"
    ];
    const root = loadTree("~/", treeLines.join(""));
    expect(root.id).toEqual("2017");
    expect(root.lines).toEqual([
      "inside ~\n",
      "$.m1() = 3\n",
      "./s0/2016\n",
      "./s1/2015\n"
    ]);
    expect(root.obj.has("m1")).toEqual(true);
    const s0 = root.subs["s0"];
    expect(s0.id).toEqual("2016");
    expect(s0.lines).toEqual(["inside ~/s0\n", "$.m2() = 3\n", "./t/2014\n"]);
    expect(s0.obj.has("m2")).toEqual(true);
    const t = root.subs["s0"].subs["t"];
    expect(t.id).toEqual("2014");
    expect(t.lines).toEqual(["inside ~/s0/t\n", "$.m3() = 3\n"]);
    expect(t.obj.has("m3")).toEqual(true);
    const s1 = root.subs["s1"];
    expect(s1.id).toEqual("2015");
    expect(s1.lines).toEqual(["inside ~/s1\n", "$.m4() = 3\n"]);
    expect(s1.obj.has("m4")).toEqual(true);
  });
});

describe("mergeTree", function() {
  it("replaces the base tree with the new tree", function() {
    const base = buildTree("~/", "id_base", ["base ~"], {});
    const tree = buildTree("~/", "id_tree", ["new ~"], {});
    const v = mergeTree(base, tree).lines[0];
    expect(v).toEqual("new ~");
  });
  it("replaces a base sub", function() {
    const baseA = buildTree("~/a/", "id_baseA", ["base ~/a"], {});
    const base = buildTree("~/", "id_base", ["base ~"], { a: baseA });
    const treeA = buildTree("~/a/", "id_treeA", ["new ~/a"], {});
    const v = mergeTree(base, treeA).subs["a"].lines[0];
    expect(v).toEqual("new ~/a");
  });
  it("creates a new sub", function() {
    const base = buildTree("~/", "id_base", ["base ~"], {});
    const treeA = buildTree("~/a/", "id_treeA", ["new ~/a"], {});
    const v = mergeTree(base, treeA).subs["a"].lines[0];
    expect(v).toEqual("new ~/a");
  });
  it("preserves other subs", function() {
    const baseA = buildTree("~/a/", "id_baseA", ["base ~/a"], {});
    const baseB = buildTree("~/b/", "id_baseB", ["base ~/b"], {});
    const base = buildTree("~/", "id_base", ["base ~"], {
      a: baseA,
      b: baseB
    });
    const treeA = buildTree("~/a/", "id_treeA", ["new ~/a"], {});
    const v = mergeTree(base, treeA).subs["b"].lines[0];
    expect(v).toEqual("base ~/b");
  });
  it("preserves pathname", function() {
    const base = buildTree("~/a/", "id_base", ["base ~"], {});
    const tree = buildTree("~/a/b/", "id_tree", ["new ~/a/b"], {});
    const v = mergeTree(base, tree).pathname;
    expect(v).toEqual("~/a/");
  });
  it("preserves lines", function() {
    const base = buildTree("~/a/", "id_base", ["base ~"], {});
    const tree = buildTree("~/a/b/", "id_tree", ["new ~/a/b"], {});
    const v = mergeTree(base, tree).lines[0];
    expect(v).toEqual("base ~");
  });
  it("recomputes count", function() {
    const baseA = buildTree("~/a/", "id_baseA", ["1", "2", "3"], {});
    const baseB = buildTree("~/b/", "id_baseB", ["1", "2", "3"], {});
    const base = buildTree("~/", "id_base", ["1", "2"], {
      a: baseA,
      b: baseB
    });
    const tree = buildTree("~/a/", "id_tree", ["1", "2", "3", "4"], {});
    const newBase = mergeTree(base, tree);
    const v = newBase.count;
    expect(v).toEqual(1 + 2 + (1 + 4) + (1 + 3));
  });
  it("stores error from base in err", function() {
    const base = buildTree("~/", "id_base", ["$.m)) = 1"], {});
    const tree = buildTree("~/a/", "id_tree", ["$.m)) = 1"], {});
    const v = mergeTree(base, tree).err.pathname;
    expect(v).toEqual("~/");
  });
  it("stores error from new sub in err", function() {
    const base = buildTree("~/", "id_base", ["$.m() = 1"], {});
    const tree = buildTree("~/a/", "id_tree", ["$.m)) = 1"], {});
    const v = mergeTree(base, tree).err.pathname;
    expect(v).toEqual("~/a/");
  });
  it("stores error from other sub in err", function() {
    const baseB = buildTree("~/b/", "id_baseB", ["$.m)) = 1"], {});
    const base = buildTree("~/", "id_base", ["$.m() = 1"], {
      b: baseB
    });
    const tree = buildTree("~/a/", "id_tree", ["$.m() = 1"], {});
    const v = mergeTree(base, tree).err.pathname;
    expect(v).toEqual("~/b/");
  });
});

describe("buildTree", function() {
  it("has the path", function() {
    const tree = buildTree("~/a/b/", "id_tree", ["abc", "def"], {});
    expect(tree.pathname).toEqual("~/a/b/");
  });
  it("has the id", function() {
    const tree = buildTree("~/", "id_tree", ["abc", "def"], {});
    expect(tree.id).toEqual("id_tree");
  });
  it("has the lines", function() {
    const tree = buildTree("~/", "id_tree", ["abc", "def"], {});
    expect(tree.lines).toEqual(["abc", "def"]);
  });
  it("the count includes the count from the subtrees", function() {
    const subs = {
      s0: buildTree("~/s0/", "id_s0", ["ghi", "klm", "nop"], {})
    };
    const tree = buildTree("~/", "id_tree", ["abc", "def"], subs);
    expect(tree.count).toEqual(1 + 3 + (1 + 2));
  });
  it("with no code, has an empty object and undefined err", function() {
    const tree = buildTree("~/p0/", "id_p0", ["abc", "def"], {});
    expect(tree.obj).toEqual(Map({}));
    expect(tree.err).toEqual(undefined);
  });
  it("with good code, has the compiled object and an undefined err", function() {
    const tree = buildTree("~/p0/", "id_p0", ["$.m() = 3"], {});
    expect(tree.obj.has("m")).toEqual(true);
    expect(tree.err).toEqual(undefined);
  });
  it("with bad code, has an empty object and a defined err", function() {
    const tree = buildTree("~/p0/", "id_p0", ["$.m) = 3"], {});
    expect(tree.obj).toEqual(Map({}));
    expect(tree.err.pathname).toEqual("~/p0/");
  });
  it("with bad code in a subtree, has the compiled object and a defined err", function() {
    const subs = {
      s0: buildTree("~/s0/", "id_s0", ["$.n) = 4"], {})
    };
    const tree = buildTree("~/", "id_tree", ["$.m() = 3"], subs);
    expect(tree.obj.has("m")).toEqual(true);
    expect(tree.err.pathname).toEqual("~/s0/");
  });
  it("has the subtrees", function() {
    const subs = {
      s0: buildTree("~/s0/", "id_s0", ["ghi", "klm", "nop"], {})
    };
    const tree = buildTree("~/", "id_tree", ["abc", "def"], subs);
    expect(tree.subs).toEqual(subs);
  });
});
