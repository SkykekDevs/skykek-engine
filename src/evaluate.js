"use strict";
// evaluate.js evaluates expressions.

const immutable = require("../src/immutable2.js");
const List = immutable.List;
const Map = immutable.Map;
const Set = immutable.Set;
const is = immutable.is;

// built-in objects.
const BUILTIN = {
  number: {
    neg: {
      1: function(a) {
        return -a[0];
      }
    },
    not: {
      1: function(a) {
        return ~a[0];
      }
    },
    mul: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] * a[1];
      }
    },
    div: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] / a[1];
      }
    },
    rem: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] % a[1];
      }
    },
    pow: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return Math.pow(a[0], a[1]);
      }
    },
    lsh: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] << a[1];
      }
    },
    rsh: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] >> a[1];
      }
    },
    zrsh: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] >>> a[1];
      }
    },
    and: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] & a[1];
      }
    },
    add: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] + a[1];
      }
    },
    sub: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] - a[1];
      }
    },
    or: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] | a[1];
      }
    },
    xor: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] ^ a[1];
      }
    },
    eq: {
      2: function(a) {
        return is(a[0], a[1]);
      }
    },
    ne: {
      2: function(a) {
        return !is(a[0], a[1]);
      }
    },
    lt: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] < a[1];
      }
    },
    le: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] <= a[1];
      }
    },
    gt: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] > a[1];
      }
    },
    ge: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] >= a[1];
      }
    },
    isFinite: {
      1: function(a) {
        return Number.isFinite(a[0]);
      }
    },
    isInteger: {
      1: function(a) {
        return Number.isInteger(a[0]);
      }
    },
    isNaN: {
      1: function(a) {
        return Number.isNaN(a[0]);
      }
    },
    isSafeInteger: {
      1: function(a) {
        return Number.isSafeInteger(a[0]);
      }
    },
    toExponential: {
      1: function(a) {
        return a[0].toExponential();
      },
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        if (!(a[1] >= 0 && a[1] <= 20)) return undefined;
        return a[0].toExponential(a[1]);
      }
    },
    toFixed: {
      1: function(a) {
        return a[0].toFixed();
      },
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        if (!(a[1] >= 0 && a[1] <= 20)) return undefined;
        return a[0].toFixed(a[1]);
      }
    },
    toPrecision: {
      1: function(a) {
        return a[0].toPrecision();
      },
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        if (!(a[1] >= 1 && a[1] <= 21)) return undefined;
        return a[0].toPrecision(a[1]);
      }
    },
    toBoolean: {
      1: function(a) {
        return Boolean(a[0]);
      }
    },
    toString: {
      1: function(a) {
        return a[0].toString();
      },
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        if (!(a[1] >= 2 && a[1] <= 36)) return undefined;
        return a[0].toString(a[1]);
      }
    },
    type: {
      1: function(a) {
        return "number";
      }
    }
  },
  boolean: {
    eq: {
      2: function(a) {
        return is(a[0], a[1]);
      }
    },
    ne: {
      2: function(a) {
        return !is(a[0], a[1]);
      }
    },
    land: {
      2: function(a) {
        if (typeof a[1] != "boolean") return undefined;
        return a[0] && a[1];
      }
    },
    lor: {
      2: function(a) {
        if (typeof a[1] != "boolean") return undefined;
        return a[0] || a[1];
      }
    },
    lnot: {
      1: function(a) {
        return !a[0];
      }
    },
    toNumber: {
      1: function(a) {
        return Number(a[0]);
      }
    },
    toString: {
      1: function(a) {
        return a[0].toString();
      }
    },
    type: {
      1: function(a) {
        return "boolean";
      }
    }
  },
  string: {
    add: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return a[0] + a[1];
      }
    },
    eq: {
      2: function(a) {
        return is(a[0], a[1]);
      }
    },
    ne: {
      2: function(a) {
        return !is(a[0], a[1]);
      }
    },
    lt: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return a[0] < a[1];
      }
    },
    le: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return a[0] <= a[1];
      }
    },
    gt: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return a[0] > a[1];
      }
    },
    ge: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return a[0] >= a[1];
      }
    },
    get: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].charAt(a[1]);
      }
    },
    charCodeAt: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].charCodeAt(a[1]);
      }
    },
    concat: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return a[0].concat(a[1]);
      }
    },
    endsWith: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return a[0].endsWith(a[1]);
      },
      3: function(a) {
        if (typeof a[1] != "string") return undefined;
        if (typeof a[2] != "number") return undefined;
        return a[0].endsWith(a[1], a[2]);
      }
    },
    includes: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return a[0].includes(a[1]);
      },
      3: function(a) {
        if (typeof a[1] != "string") return undefined;
        if (typeof a[2] != "number") return undefined;
        return a[0].includes(a[1], a[2]);
      }
    },
    indexOf: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return a[0].indexOf(a[1]);
      },
      3: function(a) {
        if (typeof a[1] != "string") return undefined;
        if (typeof a[2] != "number") return undefined;
        return a[0].indexOf(a[1], a[2]);
      }
    },
    lastIndexOf: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return a[0].lastIndexOf(a[1]);
      },
      3: function(a) {
        if (typeof a[1] != "string") return undefined;
        if (typeof a[2] != "number") return undefined;
        return a[0].lastIndexOf(a[1], a[2]);
      }
    },
    length: {
      1: function(a) {
        return a[0].length;
      }
    },
    match: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        var r = null;
        try {
          r = new RegExp(a[1]);
        } catch (e) {
          return undefined;
        }
        return List(a[0].match(r));
      },
      3: function(a) {
        if (typeof a[1] != "string") return undefined;
        if (typeof a[2] != "string") return undefined;
        var r = null;
        try {
          r = new RegExp(a[1], a[2]);
        } catch (e) {
          return undefined;
        }
        return List(a[0].match(r));
      }
    },
    repeat: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        try {
          return a[0].repeat(a[1]);
        } catch (e) {
          return undefined;
        }
      }
    },
    replace: {
      3: function(a) {
        if (typeof a[1] != "string") return undefined;
        if (typeof a[2] != "string") return undefined;
        var r = null;
        try {
          r = new RegExp(a[1]);
        } catch (e) {
          return undefined;
        }
        return a[0].replace(r, a[2]);
      },
      4: function(a) {
        if (typeof a[1] != "string") return undefined;
        if (typeof a[2] != "string") return undefined;
        if (typeof a[3] != "string") return undefined;
        var r = null;
        try {
          r = new RegExp(a[1], a[3]);
        } catch (e) {
          return undefined;
        }
        return a[0].replace(r, a[2]);
      }
    },
    search: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        var r = null;
        try {
          r = new RegExp(a[1]);
        } catch (e) {
          return undefined;
        }
        return a[0].search(r);
      },
      3: function(a) {
        if (typeof a[1] != "string") return undefined;
        if (typeof a[2] != "string") return undefined;
        var r = null;
        try {
          r = new RegExp(a[1], a[2]);
        } catch (e) {
          return undefined;
        }
        return a[0].search(r);
      }
    },
    slice: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].slice(a[1]);
      },
      3: function(a) {
        if (typeof a[1] != "number") return undefined;
        if (typeof a[2] != "number") return undefined;
        return a[0].slice(a[1], a[2]);
      }
    },
    split: {
      1: function(a) {
        return List(a[0].split());
      },
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return List(a[0].split(a[1]));
      },
      3: function(a) {
        if (typeof a[1] != "string") return undefined;
        if (typeof a[2] != "number") return undefined;
        return List(a[0].split(a[1], a[2]));
      }
    },
    startsWith: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return a[0].startsWith(a[1]);
      },
      3: function(a) {
        if (typeof a[1] != "string") return undefined;
        if (typeof a[2] != "number") return undefined;
        return a[0].startsWith(a[1], a[2]);
      }
    },
    substr: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].substr(a[1]);
      },
      3: function(a) {
        if (typeof a[1] != "number") return undefined;
        if (typeof a[2] != "number") return undefined;
        return a[0].substr(a[1], a[2]);
      }
    },
    substring: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].substring(a[1]);
      },
      3: function(a) {
        if (typeof a[1] != "number") return undefined;
        if (typeof a[2] != "number") return undefined;
        return a[0].substring(a[1], a[2]);
      }
    },
    test: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        var r = null;
        try {
          r = new RegExp(a[1]);
        } catch (e) {
          return undefined;
        }
        return r.test(a[0]);
      },
      3: function(a) {
        if (typeof a[1] != "string") return undefined;
        if (typeof a[2] != "string") return undefined;
        var r = null;
        try {
          r = new RegExp(a[1], a[2]);
        } catch (e) {
          return undefined;
        }
        return r.test(a[0]);
      }
    },
    toLowerCase: {
      1: function(a) {
        return a[0].toLowerCase();
      }
    },
    toUpperCase: {
      1: function(a) {
        return a[0].toUpperCase();
      }
    },
    trim: {
      1: function(a) {
        return a[0].trim();
      }
    },
    toString: {
      1: function(a) {
        return JSON.stringify(a[0]);
      }
    },
    type: {
      1: function(a) {
        return "string";
      }
    }
  },
  list: {
    eq: {
      2: function(a) {
        return is(a[0], a[1]);
      }
    },
    ne: {
      2: function(a) {
        return !is(a[0], a[1]);
      }
    },
    size: {
      1: function(a) {
        return a[0].size;
      }
    },
    set: {
      3: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].set(a[1], a[2]);
      }
    },
    delete: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].delete(a[1]);
      }
    },
    insert: {
      3: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].insert(a[1], a[2]);
      }
    },
    clear: {
      1: function(a) {
        return a[0].clear();
      }
    },
    push: {
      2: function(a) {
        return a[0].push(a[1]);
      }
    },
    pop: {
      1: function(a) {
        return a[0].pop();
      }
    },
    unshift: {
      2: function(a) {
        return a[0].unshift(a[1]);
      }
    },
    shift: {
      1: function(a) {
        return a[0].shift();
      }
    },
    setSize: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].setSize(a[1]);
      }
    },
    get: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].get(a[1]);
      },
      3: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].get(a[1], a[2]);
      }
    },
    has: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].has(a[1]);
      }
    },
    includes: {
      2: function(a) {
        return a[0].includes(a[1]);
      }
    },
    first: {
      1: function(a) {
        return a[0].first();
      }
    },
    last: {
      1: function(a) {
        return a[0].last();
      }
    },
    keys: {
      1: function(a) {
        return a[0].keySeq().toList();
      }
    },
    reverse: {
      1: function(a) {
        return a[0].reverse();
      }
    },
    sort: {
      1: function(a) {
        return a[0].sort();
      }
    },
    slice: {
      1: function(a) {
        return a[0].slice();
      },
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].slice(a[1]);
      },
      3: function(a) {
        if (typeof a[1] != "number") return undefined;
        if (typeof a[2] != "number") return undefined;
        return a[0].slice(a[1], a[2]);
      }
    },
    rest: {
      1: function(a) {
        return a[0].rest();
      }
    },
    butLast: {
      1: function(a) {
        return a[0].butLast();
      }
    },
    skip: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].skip(a[1]);
      }
    },
    skipLast: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].skipLast(a[1]);
      }
    },
    take: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].take(a[1]);
      }
    },
    takeLast: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].takeLast(a[1]);
      }
    },
    concat: {
      2: function(a) {
        if (!List.isList(a[1])) return undefined;
        return a[0].concat(a[1]);
      }
    },
    flatten: {
      1: function(a) {
        return a[0].flatten();
      }
    },
    interpose: {
      2: function(a) {
        return a[0].interpose(a[1]);
      }
    },
    splice: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].splice(a[1]);
      },
      3: function(a) {
        if (typeof a[1] != "number") return undefined;
        if (typeof a[2] != "number") return undefined;
        return a[0].splice(a[1], a[2]);
      }
    },
    join: {
      1: function(a) {
        return a[0].join();
      },
      2: function(a) {
        return a[0].join(a[1]);
      }
    },
    isEmpty: {
      1: function(a) {
        return a[0].isEmpty();
      }
    },
    keyOf: {
      2: function(a) {
        return a[0].keyOf(a[1]);
      }
    },
    lastKeyOf: {
      2: function(a) {
        return a[0].lastKeyOf(a[1]);
      }
    },
    max: {
      1: function(a) {
        return a[0].max();
      }
    },
    min: {
      1: function(a) {
        return a[0].min();
      }
    },
    indexOf: {
      2: function(a) {
        return a[0].indexOf(a[1]);
      }
    },
    lastIndexOf: {
      2: function(a) {
        return a[0].lastIndexOf(a[1]);
      }
    },
    toMap: {
      1: function(a) {
        return a[0].toMap();
      }
    },
    toSet: {
      1: function(a) {
        return a[0].toSet();
      }
    },
    toString: {
      1: function(a) {
        return a[0].toString();
      }
    },
    type: {
      1: function(a) {
        return "list";
      }
    }
  },
  map: {
    eq: {
      2: function(a) {
        return is(a[0], a[1]);
      }
    },
    ne: {
      2: function(a) {
        return !is(a[0], a[1]);
      }
    },
    size: {
      1: function(a) {
        return a[0].size;
      }
    },
    set: {
      3: function(a) {
        return a[0].set(a[1], a[2]);
      }
    },
    delete: {
      2: function(a) {
        return a[0].delete(a[1]);
      }
    },
    clear: {
      1: function(a) {
        return a[0].clear();
      }
    },
    get: {
      2: function(a) {
        return a[0].get(a[1]);
      },
      3: function(a) {
        return a[0].get(a[1], a[2]);
      }
    },
    has: {
      2: function(a) {
        return a[0].has(a[1]);
      }
    },
    first: {
      1: function(a) {
        return a[0].first();
      }
    },
    rest: {
      1: function(a) {
        return a[0].rest();
      }
    },
    keys: {
      1: function(a) {
        return a[0].keySeq().toList();
      }
    },
    toList: {
      1: function(a) {
        return a[0].toList();
      }
    },
    toSet: {
      1: function(a) {
        return a[0].toSet();
      }
    },
    toString: {
      1: function(a) {
        return a[0].toString();
      }
    },
    type: {
      1: function(a) {
        return "map";
      }
    }
  },
  set: {
    eq: {
      2: function(a) {
        return is(a[0], a[1]);
      }
    },
    ne: {
      2: function(a) {
        return !is(a[0], a[1]);
      }
    },
    size: {
      1: function(a) {
        return a[0].size;
      }
    },
    add: {
      2: function(a) {
        return a[0].add(a[1]);
      }
    },
    delete: {
      2: function(a) {
        return a[0].delete(a[1]);
      }
    },
    clear: {
      1: function(a) {
        return a[0].clear();
      }
    },
    union: {
      2: function(a) {
        if (!Set.isSet(a[1])) return undefined;
        return a[0].union(a[1]);
      }
    },
    intersect: {
      2: function(a) {
        if (!Set.isSet(a[1])) return undefined;
        return a[0].intersect(a[1]);
      }
    },
    subtract: {
      2: function(a) {
        if (!Set.isSet(a[1])) return undefined;
        return a[0].subtract(a[1]);
      }
    },
    has: {
      2: function(a) {
        return a[0].has(a[1]);
      }
    },
    first: {
      1: function(a) {
        return a[0].first();
      }
    },
    rest: {
      1: function(a) {
        return a[0].rest();
      }
    },
    flatten: {
      1: function(a) {
        return a[0].flatten();
      }
    },
    join: {
      1: function(a) {
        return a[0].join();
      },
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return a[0].join(a[1]);
      }
    },
    isEmpty: {
      1: function(a) {
        return a[0].isEmpty();
      }
    },
    max: {
      1: function(a) {
        return a[0].max();
      }
    },
    min: {
      1: function(a) {
        return a[0].min();
      }
    },
    isSubset: {
      2: function(a) {
        if (!Set.isSet(a[1])) return undefined;
        return a[0].isSubset(a[1]);
      }
    },
    isSuperset: {
      2: function(a) {
        if (!Set.isSet(a[1])) return undefined;
        return a[0].isSuperset(a[1]);
      }
    },
    toList: {
      1: function(a) {
        return a[0].toList();
      }
    },
    toString: {
      1: function(a) {
        return a[0].toString();
      }
    },
    type: {
      1: function(a) {
        return "set";
      }
    }
  },
  undefined: {
    eq: {
      2: function(a) {
        return is(a[0], a[1]);
      }
    },
    ne: {
      2: function(a) {
        return !is(a[0], a[1]);
      }
    },
    toString: {
      1: function(a) {
        return "undefined";
      }
    },
    type: {
      1: function(a) {
        return "undefined";
      }
    }
  }
};

const MAP_BUILTIN = BUILTIN["map"];

// built-in functions.
var funcs = {};

funcs.abs = function(a) {
  if (a.length != 2) return undefined;
  if (typeof a[1] != "number") return undefined;
  return Math.abs(a[1]);
};

funcs.acos = function(a) {
  if (a.length != 2) return undefined;
  if (typeof a[1] != "number") return undefined;
  return Math.acos(a[1]);
};

funcs.asin = function(a) {
  if (a.length != 2) return undefined;
  if (typeof a[1] != "number") return undefined;
  return Math.asin(a[1]);
};

funcs.atan = function(a) {
  if (a.length != 2) return undefined;
  if (typeof a[1] != "number") return undefined;
  return Math.atan(a[1]);
};

funcs.atan2 = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[1] != "number") return undefined;
  if (typeof a[2] != "number") return undefined;
  return Math.atan2(a[1], a[2]);
};

funcs.ceil = function(a) {
  if (a.length != 2) return undefined;
  if (typeof a[1] != "number") return undefined;
  return Math.ceil(a[1]);
};

funcs.cos = function(a) {
  if (a.length != 2) return undefined;
  if (typeof a[1] != "number") return undefined;
  return Math.cos(a[1]);
};

funcs.exp = function(a) {
  if (a.length != 2) return undefined;
  if (typeof a[1] != "number") return undefined;
  return Math.exp(a[1]);
};

funcs.floor = function(a) {
  if (a.length != 2) return undefined;
  if (typeof a[1] != "number") return undefined;
  return Math.floor(a[1]);
};

funcs.chr = function(a) {
  if (a.length != 2) return undefined;
  if (typeof a[1] != "number") return undefined;
  return String.fromCharCode(a[1]);
};

funcs.log = function(a) {
  if (a.length != 2) return undefined;
  if (typeof a[1] != "number") return undefined;
  return Math.log(a[1]);
};

funcs.max = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[1] != "number") return undefined;
  if (typeof a[2] != "number") return undefined;
  return Math.max(a[1], a[2]);
};

funcs.min = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[1] != "number") return undefined;
  if (typeof a[2] != "number") return undefined;
  return Math.min(a[1], a[2]);
};

funcs.parsefloat = function(a) {
  if (a.length != 2) return undefined;
  if (typeof a[1] != "string") return undefined;
  return parseFloat(a[1]);
};

funcs.parseint = function(a) {
  if (a.length != 2) return undefined;
  if (typeof a[1] != "string") return undefined;
  return parseInt(a[1]);
};

funcs.parseint2 = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[1] != "string") return undefined;
  if (typeof a[2] != "number") return undefined;
  return parseInt(a[1], a[2]);
};

funcs.pow = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[1] != "number") return undefined;
  if (typeof a[2] != "number") return undefined;
  return Math.pow(a[1], a[2]);
};

funcs.round = function(a) {
  if (a.length != 2) return undefined;
  if (typeof a[1] != "number") return undefined;
  return Math.round(a[1]);
};

funcs.sin = function(a) {
  if (a.length != 2) return undefined;
  if (typeof a[1] != "number") return undefined;
  return Math.sin(a[1]);
};

funcs.sqrt = function(a) {
  if (a.length != 2) return undefined;
  if (typeof a[1] != "number") return undefined;
  return Math.sqrt(a[1]);
};

funcs.tan = function(a) {
  if (a.length != 2) return undefined;
  if (typeof a[1] != "number") return undefined;
  return Math.tan(a[1]);
};

// Returns the type of a value.
function typeOfValue(v) {
  var t = typeof v;
  if (t != "object") return t; // number, string, boolean, undefined
  if (Map.isMap(v)) return "map";
  if (Set.isSet(v)) return "set";
  return "list";
}

// A method call on the stack during evaluation.
function Call(mName, args, caller, index) {
  this.mName = mName; // the method name
  this.args = args; // the arguments
  this.caller = caller;
  this.index = index;
}

const EMPTY_OBJECT = Map({});

// Evaluates an expression using the given classes.
function evaluate(expr, classes) {
  var stack = [new Call("<root-call>", [undefined], -1, 0)];
  alloc(classes, expr, [], stack, 0, 0);
  var stepcount = 0;
  var startTime = Date.now();
  while (stack.length > 1) {
    const call = stack.pop();
    stepcount++;
    if (stepcount > 1000) {
      stepcount = 0;
      if (Date.now() > startTime + 1000) {
        throw evalError(call, "too many evaluation steps");
      }
    }
    const mName = call.mName;
    const args = call.args;
    const size = args.length;
    var this_ = args[0];
    var type = typeOfValue(this_);
    // Try to find a user-defined rule matching this call.
    if (type == "map" && !MAP_BUILTIN.hasOwnProperty(mName)) {
      if (this_.has(mName)) {
        const bySize = this_.get(mName);
        if (bySize.has(size)) {
          const byParam = bySize.get(size);
          const lastArg = args[size - 1];
          if (byParam.has(lastArg)) {
            const e = byParam.get(lastArg);
            alloc(classes, e, args, stack, call.caller, call.index);
            continue;
          } else if (byParam.has(undefined)) {
            const e = byParam.get(undefined);
            alloc(classes, e, args, stack, call.caller, call.index);
            continue;
          }
        }
      }
    }
    // If this is a call to string.load, execute the call right here.
    if (type == "string" && mName === "load") {
      stack[call.caller].args[call.index] = classes.get(this_, undefined);
      continue;
    }
    // Try to find a built-in rule matching this call.
    const byMName = BUILTIN[type];
    if (!byMName.hasOwnProperty(mName)) {
      throw evalError(call, "no matching rule found");
    }
    const bySize = byMName[mName];
    if (!bySize.hasOwnProperty(size)) {
      throw evalError(call, "no matching rule found");
    }
    stack[call.caller].args[call.index] = bySize[size](args);
  }
  return stack[0].args[0];
}

// For a call expression, allocates the call onto the stack.
// For other expressions, assigns the value to its destination.
function alloc(classes, expr, params, stack, caller, index) {
  if (!Map.isMap(expr)) {
    stack[caller].args[index] = undefined;
    return;
  } else if (expr.has("call")) {
    const mName = expr.get("call");
    if (typeof mName !== "string" || !/^[a-z_]\w*$/.test(mName)) {
      stack[caller].args[index] = undefined;
      return;
    }
    const args = expr.get("args");
    if (!List.isList(args) || args.size < 1) {
      stack[caller].args[index] = undefined;
      return;
    }
    stack.push(new Call(expr.get("call"), args.toArray(), caller, index));
    const thisCall = stack.length - 1;
    for (var i = 0; i < args.size; i++) {
      alloc(classes, args.get(i), params, stack, thisCall, i);
    }
    return;
  } else if (expr.has("param")) {
    const i = expr.get("param");
    if (Number.isInteger(i) && i >= 0 && i < params.length) {
      stack[caller].args[index] = params[i];
      return;
    } else {
      stack[caller].args[index] = undefined;
      return;
    }
  } else if (expr.has("func")) {
    const func = expr.get("func");
    if (!funcs.hasOwnProperty(func)) {
      stack[caller].args[index] = undefined;
      return;
    }
    stack[caller].args[index] = funcs[func](params);
    return;
  } else {
    // val, or undefined if no val
    stack[caller].args[index] = expr.get("val");
    return;
  }
}

// Returns an evaluation error with the given call and message.
function evalError(call, message) {
  var e = new Error(message);
  e.call = call;
  return e;
}

exports.evaluate = evaluate;
