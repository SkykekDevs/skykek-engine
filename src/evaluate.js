"use strict";
// evaluate.js evaluates expressions.

const immutable = require("../src/immutable2.js");
const iList = immutable.List;
const iMap = immutable.Map;
const iSet = immutable.Set;
const is = immutable.is;

// built-in methods.
// a[0] is the object being called
// a[1] is the method name
// a[2] is the first argument in parentheses, a[3] is the second, etc.
const BUILTIN = {
  number: {
    Neg: {
      0: function(a) {
        return -a[0];
      }
    },
    Not: {
      0: function(a) {
        return ~a[0];
      }
    },
    Mul: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0] * a[2];
      }
    },
    Div: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0] / a[2];
      }
    },
    Rem: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0] % a[2];
      }
    },
    Pow: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return Math.pow(a[0], a[2]);
      }
    },
    Lsh: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0] << a[2];
      }
    },
    Rsh: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0] >> a[2];
      }
    },
    Zrsh: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0] >>> a[2];
      }
    },
    And: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0] & a[2];
      }
    },
    Add: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0] + a[2];
      }
    },
    Sub: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0] - a[2];
      }
    },
    Or: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0] | a[2];
      }
    },
    Xor: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0] ^ a[2];
      }
    },
    Eq: {
      1: function(a) {
        return is(a[0], a[2]);
      }
    },
    Ne: {
      1: function(a) {
        return !is(a[0], a[2]);
      }
    },
    Lt: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0] < a[2];
      }
    },
    Le: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0] <= a[2];
      }
    },
    Gt: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0] > a[2];
      }
    },
    Ge: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0] >= a[2];
      }
    },
    IsFinite: {
      0: function(a) {
        return Number.isFinite(a[0]);
      }
    },
    IsInteger: {
      0: function(a) {
        return Number.isInteger(a[0]);
      }
    },
    IsNaN: {
      0: function(a) {
        return Number.isNaN(a[0]);
      }
    },
    IsSafeInteger: {
      0: function(a) {
        return Number.isSafeInteger(a[0]);
      }
    },
    ToExponential: {
      0: function(a) {
        return a[0].toExponential();
      },
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        if (!(a[2] >= 0 && a[2] <= 20)) return undefined;
        return a[0].toExponential(a[2]);
      }
    },
    ToFixed: {
      0: function(a) {
        return a[0].toFixed();
      },
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        if (!(a[2] >= 0 && a[2] <= 20)) return undefined;
        return a[0].toFixed(a[2]);
      }
    },
    ToPrecision: {
      0: function(a) {
        return a[0].toPrecision();
      },
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        if (!(a[2] >= 1 && a[2] <= 21)) return undefined;
        return a[0].toPrecision(a[2]);
      }
    },
    ToBoolean: {
      0: function(a) {
        return Boolean(a[0]);
      }
    },
    ToString: {
      0: function(a) {
        return a[0].toString();
      },
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        if (!(a[2] >= 2 && a[2] <= 36)) return undefined;
        return a[0].toString(a[2]);
      }
    },
    ToNumber: {
      0: function(a) {
        return a[0];
      }
    },
    Type: {
      0: function(a) {
        return "number";
      }
    }
  },
  boolean: {
    Eq: {
      1: function(a) {
        return is(a[0], a[2]);
      }
    },
    Ne: {
      1: function(a) {
        return !is(a[0], a[2]);
      }
    },
    Land: {
      1: function(a) {
        if (typeof a[2] != "boolean") return undefined;
        return a[0] && a[2];
      }
    },
    Lor: {
      1: function(a) {
        if (typeof a[2] != "boolean") return undefined;
        return a[0] || a[2];
      }
    },
    Lnot: {
      0: function(a) {
        return !a[0];
      }
    },
    ToNumber: {
      0: function(a) {
        return Number(a[0]);
      }
    },
    ToString: {
      0: function(a) {
        return a[0].toString();
      }
    },
    Type: {
      0: function(a) {
        return "boolean";
      }
    }
  },
  string: {
    Eq: {
      1: function(a) {
        return is(a[0], a[2]);
      }
    },
    Ne: {
      1: function(a) {
        return !is(a[0], a[2]);
      }
    },
    Lt: {
      1: function(a) {
        if (typeof a[2] != "string") return undefined;
        return a[0] < a[2];
      }
    },
    Le: {
      1: function(a) {
        if (typeof a[2] != "string") return undefined;
        return a[0] <= a[2];
      }
    },
    Gt: {
      1: function(a) {
        if (typeof a[2] != "string") return undefined;
        return a[0] > a[2];
      }
    },
    Ge: {
      1: function(a) {
        if (typeof a[2] != "string") return undefined;
        return a[0] >= a[2];
      }
    },
    Get: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0].charAt(a[2]);
      }
    },
    CharCodeAt: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0].charCodeAt(a[2]);
      }
    },
    Concat: {
      1: function(a) {
        if (typeof a[2] != "string") return undefined;
        return a[0].concat(a[2]);
      }
    },
    EndsWith: {
      1: function(a) {
        if (typeof a[2] != "string") return undefined;
        return a[0].endsWith(a[2]);
      },
      2: function(a) {
        if (typeof a[2] != "string") return undefined;
        if (typeof a[3] != "number") return undefined;
        return a[0].endsWith(a[2], a[3]);
      }
    },
    Includes: {
      1: function(a) {
        if (typeof a[2] != "string") return undefined;
        return a[0].includes(a[2]);
      },
      2: function(a) {
        if (typeof a[2] != "string") return undefined;
        if (typeof a[3] != "number") return undefined;
        return a[0].includes(a[2], a[3]);
      }
    },
    IndexOf: {
      1: function(a) {
        if (typeof a[2] != "string") return undefined;
        return a[0].indexOf(a[2]);
      },
      2: function(a) {
        if (typeof a[2] != "string") return undefined;
        if (typeof a[3] != "number") return undefined;
        return a[0].indexOf(a[2], a[3]);
      }
    },
    LastIndexOf: {
      1: function(a) {
        if (typeof a[2] != "string") return undefined;
        return a[0].lastIndexOf(a[2]);
      },
      2: function(a) {
        if (typeof a[2] != "string") return undefined;
        if (typeof a[3] != "number") return undefined;
        return a[0].lastIndexOf(a[2], a[3]);
      }
    },
    Length: {
      0: function(a) {
        return a[0].length;
      }
    },
    Match: {
      1: function(a) {
        if (typeof a[2] != "string") return undefined;
        var r = null;
        try {
          r = new RegExp(a[2]);
        } catch (e) {
          return undefined;
        }
        return iList(a[0].match(r));
      },
      2: function(a) {
        if (typeof a[2] != "string") return undefined;
        if (typeof a[3] != "string") return undefined;
        var r = null;
        try {
          r = new RegExp(a[2], a[3]);
        } catch (e) {
          return undefined;
        }
        return iList(a[0].match(r));
      }
    },
    Repeat: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        try {
          return a[0].repeat(a[2]);
        } catch (e) {
          return undefined;
        }
      }
    },
    Replace: {
      2: function(a) {
        if (typeof a[2] != "string") return undefined;
        if (typeof a[3] != "string") return undefined;
        var r = null;
        try {
          r = new RegExp(a[2]);
        } catch (e) {
          return undefined;
        }
        return a[0].replace(r, a[3]);
      },
      3: function(a) {
        if (typeof a[2] != "string") return undefined;
        if (typeof a[3] != "string") return undefined;
        if (typeof a[4] != "string") return undefined;
        var r = null;
        try {
          r = new RegExp(a[2], a[4]);
        } catch (e) {
          return undefined;
        }
        return a[0].replace(r, a[3]);
      }
    },
    Search: {
      1: function(a) {
        if (typeof a[2] != "string") return undefined;
        var r = null;
        try {
          r = new RegExp(a[2]);
        } catch (e) {
          return undefined;
        }
        return a[0].search(r);
      },
      2: function(a) {
        if (typeof a[2] != "string") return undefined;
        if (typeof a[3] != "string") return undefined;
        var r = null;
        try {
          r = new RegExp(a[2], a[3]);
        } catch (e) {
          return undefined;
        }
        return a[0].search(r);
      }
    },
    Slice: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0].slice(a[2]);
      },
      2: function(a) {
        if (typeof a[2] != "number") return undefined;
        if (typeof a[3] != "number") return undefined;
        return a[0].slice(a[2], a[3]);
      }
    },
    Split: {
      0: function(a) {
        return iList(a[0].split());
      },
      1: function(a) {
        if (typeof a[2] != "string") return undefined;
        return iList(a[0].split(a[2]));
      },
      2: function(a) {
        if (typeof a[2] != "string") return undefined;
        if (typeof a[3] != "number") return undefined;
        return iList(a[0].split(a[2], a[3]));
      }
    },
    StartsWith: {
      1: function(a) {
        if (typeof a[2] != "string") return undefined;
        return a[0].startsWith(a[2]);
      },
      2: function(a) {
        if (typeof a[2] != "string") return undefined;
        if (typeof a[3] != "number") return undefined;
        return a[0].startsWith(a[2], a[3]);
      }
    },
    Substr: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0].substr(a[2]);
      },
      2: function(a) {
        if (typeof a[2] != "number") return undefined;
        if (typeof a[3] != "number") return undefined;
        return a[0].substr(a[2], a[3]);
      }
    },
    Substring: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0].substring(a[2]);
      },
      2: function(a) {
        if (typeof a[2] != "number") return undefined;
        if (typeof a[3] != "number") return undefined;
        return a[0].substring(a[2], a[3]);
      }
    },
    Test: {
      1: function(a) {
        if (typeof a[2] != "string") return undefined;
        var r = null;
        try {
          r = new RegExp(a[2]);
        } catch (e) {
          return undefined;
        }
        return r.test(a[0]);
      },
      2: function(a) {
        if (typeof a[2] != "string") return undefined;
        if (typeof a[3] != "string") return undefined;
        var r = null;
        try {
          r = new RegExp(a[2], a[3]);
        } catch (e) {
          return undefined;
        }
        return r.test(a[0]);
      }
    },
    ToLowerCase: {
      0: function(a) {
        return a[0].toLowerCase();
      }
    },
    ToUpperCase: {
      0: function(a) {
        return a[0].toUpperCase();
      }
    },
    Trim: {
      0: function(a) {
        return a[0].trim();
      }
    },
    ToString: {
      0: function(a) {
        return JSON.stringify(a[0]);
      }
    },
    Type: {
      0: function(a) {
        return "string";
      }
    }
  },
  list: {
    Eq: {
      1: function(a) {
        return is(a[0], a[2]);
      }
    },
    Ne: {
      1: function(a) {
        return !is(a[0], a[2]);
      }
    },
    Size: {
      0: function(a) {
        return a[0].size;
      }
    },
    Set: {
      2: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0].set(a[2], a[3]);
      }
    },
    Delete: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0].delete(a[2]);
      }
    },
    Insert: {
      2: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0].insert(a[2], a[3]);
      }
    },
    Clear: {
      0: function(a) {
        return a[0].clear();
      }
    },
    Push: {
      1: function(a) {
        return a[0].push(a[2]);
      }
    },
    Pop: {
      0: function(a) {
        return a[0].pop();
      }
    },
    Unshift: {
      1: function(a) {
        return a[0].unshift(a[2]);
      }
    },
    Shift: {
      0: function(a) {
        return a[0].shift();
      }
    },
    SetSize: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0].setSize(a[2]);
      }
    },
    Get: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0].get(a[2]);
      },
      2: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0].get(a[2], a[3]);
      }
    },
    Has: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0].has(a[2]);
      }
    },
    Includes: {
      1: function(a) {
        return a[0].includes(a[2]);
      }
    },
    First: {
      0: function(a) {
        return a[0].first();
      }
    },
    Last: {
      0: function(a) {
        return a[0].last();
      }
    },
    Keys: {
      0: function(a) {
        return a[0].keySeq().toList();
      }
    },
    Reverse: {
      0: function(a) {
        return a[0].reverse();
      }
    },
    Sort: {
      0: function(a) {
        return a[0].sort();
      }
    },
    Slice: {
      0: function(a) {
        return a[0].slice();
      },
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0].slice(a[2]);
      },
      2: function(a) {
        if (typeof a[2] != "number") return undefined;
        if (typeof a[3] != "number") return undefined;
        return a[0].slice(a[2], a[3]);
      }
    },
    Rest: {
      0: function(a) {
        return a[0].rest();
      }
    },
    ButLast: {
      0: function(a) {
        return a[0].butLast();
      }
    },
    Skip: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0].skip(a[2]);
      }
    },
    SkipLast: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0].skipLast(a[2]);
      }
    },
    Take: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0].take(a[2]);
      }
    },
    TakeLast: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0].takeLast(a[2]);
      }
    },
    Concat: {
      1: function(a) {
        if (!iList.isList(a[2])) return undefined;
        return a[0].concat(a[2]);
      }
    },
    Flatten: {
      0: function(a) {
        return a[0].flatten();
      }
    },
    Interpose: {
      1: function(a) {
        return a[0].interpose(a[2]);
      }
    },
    Splice: {
      1: function(a) {
        if (typeof a[2] != "number") return undefined;
        return a[0].splice(a[2]);
      },
      2: function(a) {
        if (typeof a[2] != "number") return undefined;
        if (typeof a[3] != "number") return undefined;
        return a[0].splice(a[2], a[3]);
      }
    },
    Join: {
      0: function(a) {
        return a[0].join();
      },
      1: function(a) {
        return a[0].join(a[2]);
      }
    },
    IsEmpty: {
      0: function(a) {
        return a[0].isEmpty();
      }
    },
    KeyOf: {
      1: function(a) {
        return a[0].keyOf(a[2]);
      }
    },
    LastKeyOf: {
      1: function(a) {
        return a[0].lastKeyOf(a[2]);
      }
    },
    Max: {
      0: function(a) {
        return a[0].max();
      }
    },
    Min: {
      0: function(a) {
        return a[0].min();
      }
    },
    IndexOf: {
      1: function(a) {
        return a[0].indexOf(a[2]);
      }
    },
    LastIndexOf: {
      1: function(a) {
        return a[0].lastIndexOf(a[2]);
      }
    },
    ToMap: {
      0: function(a) {
        return a[0].toMap();
      }
    },
    ToSet: {
      0: function(a) {
        return a[0].toSet();
      }
    },
    ToString: {
      0: function(a) {
        return a[0].toString();
      }
    },
    Type: {
      0: function(a) {
        return "list";
      }
    }
  },
  map: {
    Eq: {
      1: function(a) {
        return is(a[0], a[2]);
      }
    },
    Ne: {
      1: function(a) {
        return !is(a[0], a[2]);
      }
    },
    Size: {
      0: function(a) {
        return a[0].size;
      }
    },
    Set: {
      2: function(a) {
        return a[0].set(a[2], a[3]);
      }
    },
    Delete: {
      1: function(a) {
        return a[0].delete(a[2]);
      }
    },
    Clear: {
      0: function(a) {
        return a[0].clear();
      }
    },
    Get: {
      1: function(a) {
        return a[0].get(a[2]);
      },
      2: function(a) {
        return a[0].get(a[2], a[3]);
      }
    },
    Has: {
      1: function(a) {
        return a[0].has(a[2]);
      }
    },
    First: {
      0: function(a) {
        return a[0].first();
      }
    },
    Rest: {
      0: function(a) {
        return a[0].rest();
      }
    },
    Keys: {
      0: function(a) {
        return a[0].keySeq().toList();
      }
    },
    ToList: {
      0: function(a) {
        return a[0].toList();
      }
    },
    ToSet: {
      0: function(a) {
        return a[0].toSet();
      }
    },
    ToString: {
      0: function(a) {
        return a[0].toString();
      }
    },
    Type: {
      0: function(a) {
        return "map";
      }
    }
  },
  set: {
    Eq: {
      1: function(a) {
        return is(a[0], a[2]);
      }
    },
    Ne: {
      1: function(a) {
        return !is(a[0], a[2]);
      }
    },
    Size: {
      0: function(a) {
        return a[0].size;
      }
    },
    Add: {
      1: function(a) {
        return a[0].add(a[2]);
      }
    },
    Delete: {
      1: function(a) {
        return a[0].delete(a[2]);
      }
    },
    Clear: {
      0: function(a) {
        return a[0].clear();
      }
    },
    Union: {
      1: function(a) {
        if (!iSet.isSet(a[2])) return undefined;
        return a[0].union(a[2]);
      }
    },
    Intersect: {
      1: function(a) {
        if (!iSet.isSet(a[2])) return undefined;
        return a[0].intersect(a[2]);
      }
    },
    Subtract: {
      1: function(a) {
        if (!iSet.isSet(a[2])) return undefined;
        return a[0].subtract(a[2]);
      }
    },
    Has: {
      1: function(a) {
        return a[0].has(a[2]);
      }
    },
    First: {
      0: function(a) {
        return a[0].first();
      }
    },
    Rest: {
      0: function(a) {
        return a[0].rest();
      }
    },
    Flatten: {
      0: function(a) {
        return a[0].flatten();
      }
    },
    Join: {
      0: function(a) {
        return a[0].join();
      },
      1: function(a) {
        if (typeof a[2] != "string") return undefined;
        return a[0].join(a[2]);
      }
    },
    IsEmpty: {
      0: function(a) {
        return a[0].isEmpty();
      }
    },
    Max: {
      0: function(a) {
        return a[0].max();
      }
    },
    Min: {
      0: function(a) {
        return a[0].min();
      }
    },
    IsSubset: {
      1: function(a) {
        if (!iSet.isSet(a[2])) return undefined;
        return a[0].isSubset(a[2]);
      }
    },
    IsSuperset: {
      1: function(a) {
        if (!iSet.isSet(a[2])) return undefined;
        return a[0].isSuperset(a[2]);
      }
    },
    ToList: {
      0: function(a) {
        return a[0].toList();
      }
    },
    ToString: {
      0: function(a) {
        return a[0].toString();
      }
    },
    Type: {
      0: function(a) {
        return "set";
      }
    }
  },
  undefined: {
    Eq: {
      1: function(a) {
        return is(a[0], a[2]);
      }
    },
    Ne: {
      1: function(a) {
        return !is(a[0], a[2]);
      }
    },
    ToString: {
      0: function(a) {
        return "undefined";
      }
    },
    Type: {
      0: function(a) {
        return "undefined";
      }
    }
  }
};

// built-in functions.
var funcs = {};

funcs.abs = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[2] != "number") return undefined;
  return Math.abs(a[2]);
};

funcs.acos = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[2] != "number") return undefined;
  return Math.acos(a[2]);
};

funcs.asin = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[2] != "number") return undefined;
  return Math.asin(a[2]);
};

funcs.atan = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[2] != "number") return undefined;
  return Math.atan(a[2]);
};

funcs.atan2 = function(a) {
  if (a.length != 4) return undefined;
  if (typeof a[2] != "number") return undefined;
  if (typeof a[3] != "number") return undefined;
  return Math.atan2(a[2], a[3]);
};

funcs.ceil = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[2] != "number") return undefined;
  return Math.ceil(a[2]);
};

funcs.cos = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[2] != "number") return undefined;
  return Math.cos(a[2]);
};

funcs.exp = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[2] != "number") return undefined;
  return Math.exp(a[2]);
};

funcs.floor = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[2] != "number") return undefined;
  return Math.floor(a[2]);
};

funcs.chr = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[2] != "number") return undefined;
  return String.fromCharCode(a[2]);
};

funcs.log = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[2] != "number") return undefined;
  return Math.log(a[2]);
};

funcs.max = function(a) {
  if (a.length != 4) return undefined;
  if (typeof a[2] != "number") return undefined;
  if (typeof a[3] != "number") return undefined;
  return Math.max(a[2], a[3]);
};

funcs.min = function(a) {
  if (a.length != 4) return undefined;
  if (typeof a[2] != "number") return undefined;
  if (typeof a[3] != "number") return undefined;
  return Math.min(a[2], a[3]);
};

funcs.parsefloat = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[2] != "string") return undefined;
  return parseFloat(a[2]);
};

funcs.parseint = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[2] != "string") return undefined;
  return parseInt(a[2]);
};

funcs.parseint2 = function(a) {
  if (a.length != 4) return undefined;
  if (typeof a[2] != "string") return undefined;
  if (typeof a[3] != "number") return undefined;
  return parseInt(a[2], a[3]);
};

funcs.pow = function(a) {
  if (a.length != 4) return undefined;
  if (typeof a[2] != "number") return undefined;
  if (typeof a[3] != "number") return undefined;
  return Math.pow(a[2], a[3]);
};

funcs.round = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[2] != "number") return undefined;
  return Math.round(a[2]);
};

funcs.sin = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[2] != "number") return undefined;
  return Math.sin(a[2]);
};

funcs.sqrt = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[2] != "number") return undefined;
  return Math.sqrt(a[2]);
};

funcs.tan = function(a) {
  if (a.length != 3) return undefined;
  if (typeof a[2] != "number") return undefined;
  return Math.tan(a[2]);
};

// Returns the type of a value.
function typeOfValue(v) {
  var t = typeof v;
  if (t != "object") return t; // number, string, boolean, undefined
  if (iMap.isMap(v)) return "map";
  if (iSet.isSet(v)) return "set";
  return "list";
}

// A method call on the stack during evaluation.
function Call(args, caller, index) {
  this.args = args; // the arguments
  this.caller = caller;
  this.index = index;
}

// Evaluates an expression using the given classes.
function evaluate(expr, classes) {
  var stack = [new Call([undefined, "<root-call>"], -1, 0)];
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
    const args = call.args;
    var this_ = args[0];
    var type = typeOfValue(this_);
    const mName = args[1];
    if (typeof mName !== "string" || !/^[A-Z]\w*$/.test(mName)) {
      throw evalError(call, "invalid method name");
    }
    const size = args.length - 2;
    // Try to find a user-defined rule matching this call.
    if (type == "map") {
      if (this_.has(mName)) {
        const bySize = this_.get(mName);
        if (bySize.has(size)) {
          const byParam = bySize.get(size);
          const lastArg = args[size + 1];
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
    if (type == "string" && mName === "Load") {
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
  if (!iMap.isMap(expr)) {
    stack[caller].args[index] = undefined;
    return;
  } else if (expr.has("Call")) {
    const args = expr.get("Call");
    if (!iList.isList(args) || args.size < 2) {
      stack[caller].args[index] = undefined;
      return;
    }
    stack.push(new Call(args.toArray(), caller, index));
    const thisCall = stack.length - 1;
    for (var i = 0; i < args.size; i++) {
      alloc(classes, args.get(i), params, stack, thisCall, i);
    }
    return;
  } else if (expr.has("Param")) {
    const i = expr.get("Param");
    if (Number.isInteger(i) && i >= 0 && i < params.length) {
      stack[caller].args[index] = params[i];
      return;
    } else {
      stack[caller].args[index] = undefined;
      return;
    }
  } else if (expr.has("Func")) {
    const func = expr.get("Func");
    if (!funcs.hasOwnProperty(func)) {
      stack[caller].args[index] = undefined;
      return;
    }
    stack[caller].args[index] = funcs[func](params);
    return;
  } else {
    // val, or undefined if no val
    stack[caller].args[index] = expr.get("Val");
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
