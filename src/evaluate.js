"use strict";
// evaluate.js evaluates expressions.

const immutable = require("../src/immutable2.js");
const iList = immutable.List;
const iMap = immutable.Map;
const iSet = immutable.Set;
const is = immutable.is;

// built-in objects.
const BUILTIN = {
  number: {
    Neg: {
      1: function(a) {
        return -a[0];
      }
    },
    Not: {
      1: function(a) {
        return ~a[0];
      }
    },
    Mul: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] * a[1];
      }
    },
    Div: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] / a[1];
      }
    },
    Rem: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] % a[1];
      }
    },
    Pow: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return Math.pow(a[0], a[1]);
      }
    },
    Lsh: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] << a[1];
      }
    },
    Rsh: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] >> a[1];
      }
    },
    Zrsh: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] >>> a[1];
      }
    },
    And: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] & a[1];
      }
    },
    Add: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] + a[1];
      }
    },
    Sub: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] - a[1];
      }
    },
    Or: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] | a[1];
      }
    },
    Xor: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] ^ a[1];
      }
    },
    Eq: {
      2: function(a) {
        return is(a[0], a[1]);
      }
    },
    Ne: {
      2: function(a) {
        return !is(a[0], a[1]);
      }
    },
    Lt: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] < a[1];
      }
    },
    Le: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] <= a[1];
      }
    },
    Gt: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] > a[1];
      }
    },
    Ge: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0] >= a[1];
      }
    },
    IsFinite: {
      1: function(a) {
        return Number.isFinite(a[0]);
      }
    },
    IsInteger: {
      1: function(a) {
        return Number.isInteger(a[0]);
      }
    },
    IsNaN: {
      1: function(a) {
        return Number.isNaN(a[0]);
      }
    },
    IsSafeInteger: {
      1: function(a) {
        return Number.isSafeInteger(a[0]);
      }
    },
    ToExponential: {
      1: function(a) {
        return a[0].toExponential();
      },
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        if (!(a[1] >= 0 && a[1] <= 20)) return undefined;
        return a[0].toExponential(a[1]);
      }
    },
    ToFixed: {
      1: function(a) {
        return a[0].toFixed();
      },
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        if (!(a[1] >= 0 && a[1] <= 20)) return undefined;
        return a[0].toFixed(a[1]);
      }
    },
    ToPrecision: {
      1: function(a) {
        return a[0].toPrecision();
      },
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        if (!(a[1] >= 1 && a[1] <= 21)) return undefined;
        return a[0].toPrecision(a[1]);
      }
    },
    ToBoolean: {
      1: function(a) {
        return Boolean(a[0]);
      }
    },
    ToString: {
      1: function(a) {
        return a[0].toString();
      },
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        if (!(a[1] >= 2 && a[1] <= 36)) return undefined;
        return a[0].toString(a[1]);
      }
    },
    ToNumber: {
      1: function(a) {
        return a[0];
      }
    },
    Type: {
      1: function(a) {
        return "number";
      }
    }
  },
  boolean: {
    Eq: {
      2: function(a) {
        return is(a[0], a[1]);
      }
    },
    Ne: {
      2: function(a) {
        return !is(a[0], a[1]);
      }
    },
    Land: {
      2: function(a) {
        if (typeof a[1] != "boolean") return undefined;
        return a[0] && a[1];
      }
    },
    Lor: {
      2: function(a) {
        if (typeof a[1] != "boolean") return undefined;
        return a[0] || a[1];
      }
    },
    Lnot: {
      1: function(a) {
        return !a[0];
      }
    },
    ToNumber: {
      1: function(a) {
        return Number(a[0]);
      }
    },
    ToString: {
      1: function(a) {
        return a[0].toString();
      }
    },
    Type: {
      1: function(a) {
        return "boolean";
      }
    }
  },
  string: {
    Eq: {
      2: function(a) {
        return is(a[0], a[1]);
      }
    },
    Ne: {
      2: function(a) {
        return !is(a[0], a[1]);
      }
    },
    Lt: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return a[0] < a[1];
      }
    },
    Le: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return a[0] <= a[1];
      }
    },
    Gt: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return a[0] > a[1];
      }
    },
    Ge: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return a[0] >= a[1];
      }
    },
    Get: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].charAt(a[1]);
      }
    },
    CharCodeAt: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].charCodeAt(a[1]);
      }
    },
    Concat: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return a[0].concat(a[1]);
      }
    },
    EndsWith: {
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
    Includes: {
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
    IndexOf: {
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
    LastIndexOf: {
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
    Length: {
      1: function(a) {
        return a[0].length;
      }
    },
    Match: {
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        var r = null;
        try {
          r = new RegExp(a[1]);
        } catch (e) {
          return undefined;
        }
        return iList(a[0].match(r));
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
        return iList(a[0].match(r));
      }
    },
    Repeat: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        try {
          return a[0].repeat(a[1]);
        } catch (e) {
          return undefined;
        }
      }
    },
    Replace: {
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
    Search: {
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
    Slice: {
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
    Split: {
      1: function(a) {
        return iList(a[0].split());
      },
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return iList(a[0].split(a[1]));
      },
      3: function(a) {
        if (typeof a[1] != "string") return undefined;
        if (typeof a[2] != "number") return undefined;
        return iList(a[0].split(a[1], a[2]));
      }
    },
    StartsWith: {
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
    Substr: {
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
    Substring: {
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
    Test: {
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
    ToLowerCase: {
      1: function(a) {
        return a[0].toLowerCase();
      }
    },
    ToUpperCase: {
      1: function(a) {
        return a[0].toUpperCase();
      }
    },
    Trim: {
      1: function(a) {
        return a[0].trim();
      }
    },
    ToString: {
      1: function(a) {
        return JSON.stringify(a[0]);
      }
    },
    Type: {
      1: function(a) {
        return "string";
      }
    }
  },
  list: {
    Eq: {
      2: function(a) {
        return is(a[0], a[1]);
      }
    },
    Ne: {
      2: function(a) {
        return !is(a[0], a[1]);
      }
    },
    Size: {
      1: function(a) {
        return a[0].size;
      }
    },
    Set: {
      3: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].set(a[1], a[2]);
      }
    },
    Delete: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].delete(a[1]);
      }
    },
    Insert: {
      3: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].insert(a[1], a[2]);
      }
    },
    Clear: {
      1: function(a) {
        return a[0].clear();
      }
    },
    Push: {
      2: function(a) {
        return a[0].push(a[1]);
      }
    },
    Pop: {
      1: function(a) {
        return a[0].pop();
      }
    },
    Unshift: {
      2: function(a) {
        return a[0].unshift(a[1]);
      }
    },
    Shift: {
      1: function(a) {
        return a[0].shift();
      }
    },
    SetSize: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].setSize(a[1]);
      }
    },
    Get: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].get(a[1]);
      },
      3: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].get(a[1], a[2]);
      }
    },
    Has: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].has(a[1]);
      }
    },
    Includes: {
      2: function(a) {
        return a[0].includes(a[1]);
      }
    },
    First: {
      1: function(a) {
        return a[0].first();
      }
    },
    Last: {
      1: function(a) {
        return a[0].last();
      }
    },
    Keys: {
      1: function(a) {
        return a[0].keySeq().toList();
      }
    },
    Reverse: {
      1: function(a) {
        return a[0].reverse();
      }
    },
    Sort: {
      1: function(a) {
        return a[0].sort();
      }
    },
    Slice: {
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
    Rest: {
      1: function(a) {
        return a[0].rest();
      }
    },
    ButLast: {
      1: function(a) {
        return a[0].butLast();
      }
    },
    Skip: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].skip(a[1]);
      }
    },
    SkipLast: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].skipLast(a[1]);
      }
    },
    Take: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].take(a[1]);
      }
    },
    TakeLast: {
      2: function(a) {
        if (typeof a[1] != "number") return undefined;
        return a[0].takeLast(a[1]);
      }
    },
    Concat: {
      2: function(a) {
        if (!iList.isList(a[1])) return undefined;
        return a[0].concat(a[1]);
      }
    },
    Flatten: {
      1: function(a) {
        return a[0].flatten();
      }
    },
    Interpose: {
      2: function(a) {
        return a[0].interpose(a[1]);
      }
    },
    Splice: {
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
    Join: {
      1: function(a) {
        return a[0].join();
      },
      2: function(a) {
        return a[0].join(a[1]);
      }
    },
    IsEmpty: {
      1: function(a) {
        return a[0].isEmpty();
      }
    },
    KeyOf: {
      2: function(a) {
        return a[0].keyOf(a[1]);
      }
    },
    LastKeyOf: {
      2: function(a) {
        return a[0].lastKeyOf(a[1]);
      }
    },
    Max: {
      1: function(a) {
        return a[0].max();
      }
    },
    Min: {
      1: function(a) {
        return a[0].min();
      }
    },
    IndexOf: {
      2: function(a) {
        return a[0].indexOf(a[1]);
      }
    },
    LastIndexOf: {
      2: function(a) {
        return a[0].lastIndexOf(a[1]);
      }
    },
    ToMap: {
      1: function(a) {
        return a[0].toMap();
      }
    },
    ToSet: {
      1: function(a) {
        return a[0].toSet();
      }
    },
    ToString: {
      1: function(a) {
        return a[0].toString();
      }
    },
    Type: {
      1: function(a) {
        return "list";
      }
    }
  },
  map: {
    Eq: {
      2: function(a) {
        return is(a[0], a[1]);
      }
    },
    Ne: {
      2: function(a) {
        return !is(a[0], a[1]);
      }
    },
    Size: {
      1: function(a) {
        return a[0].size;
      }
    },
    Set: {
      3: function(a) {
        return a[0].set(a[1], a[2]);
      }
    },
    Delete: {
      2: function(a) {
        return a[0].delete(a[1]);
      }
    },
    Clear: {
      1: function(a) {
        return a[0].clear();
      }
    },
    Get: {
      2: function(a) {
        return a[0].get(a[1]);
      },
      3: function(a) {
        return a[0].get(a[1], a[2]);
      }
    },
    Has: {
      2: function(a) {
        return a[0].has(a[1]);
      }
    },
    First: {
      1: function(a) {
        return a[0].first();
      }
    },
    Rest: {
      1: function(a) {
        return a[0].rest();
      }
    },
    Keys: {
      1: function(a) {
        return a[0].keySeq().toList();
      }
    },
    ToList: {
      1: function(a) {
        return a[0].toList();
      }
    },
    ToSet: {
      1: function(a) {
        return a[0].toSet();
      }
    },
    ToString: {
      1: function(a) {
        return a[0].toString();
      }
    },
    Type: {
      1: function(a) {
        return "map";
      }
    }
  },
  set: {
    Eq: {
      2: function(a) {
        return is(a[0], a[1]);
      }
    },
    Ne: {
      2: function(a) {
        return !is(a[0], a[1]);
      }
    },
    Size: {
      1: function(a) {
        return a[0].size;
      }
    },
    Add: {
      2: function(a) {
        return a[0].add(a[1]);
      }
    },
    Delete: {
      2: function(a) {
        return a[0].delete(a[1]);
      }
    },
    Clear: {
      1: function(a) {
        return a[0].clear();
      }
    },
    Union: {
      2: function(a) {
        if (!iSet.isSet(a[1])) return undefined;
        return a[0].union(a[1]);
      }
    },
    Intersect: {
      2: function(a) {
        if (!iSet.isSet(a[1])) return undefined;
        return a[0].intersect(a[1]);
      }
    },
    Subtract: {
      2: function(a) {
        if (!iSet.isSet(a[1])) return undefined;
        return a[0].subtract(a[1]);
      }
    },
    Has: {
      2: function(a) {
        return a[0].has(a[1]);
      }
    },
    First: {
      1: function(a) {
        return a[0].first();
      }
    },
    Rest: {
      1: function(a) {
        return a[0].rest();
      }
    },
    Flatten: {
      1: function(a) {
        return a[0].flatten();
      }
    },
    Join: {
      1: function(a) {
        return a[0].join();
      },
      2: function(a) {
        if (typeof a[1] != "string") return undefined;
        return a[0].join(a[1]);
      }
    },
    IsEmpty: {
      1: function(a) {
        return a[0].isEmpty();
      }
    },
    Max: {
      1: function(a) {
        return a[0].max();
      }
    },
    Min: {
      1: function(a) {
        return a[0].min();
      }
    },
    IsSubset: {
      2: function(a) {
        if (!iSet.isSet(a[1])) return undefined;
        return a[0].isSubset(a[1]);
      }
    },
    IsSuperset: {
      2: function(a) {
        if (!iSet.isSet(a[1])) return undefined;
        return a[0].isSuperset(a[1]);
      }
    },
    ToList: {
      1: function(a) {
        return a[0].toList();
      }
    },
    ToString: {
      1: function(a) {
        return a[0].toString();
      }
    },
    Type: {
      1: function(a) {
        return "set";
      }
    }
  },
  undefined: {
    Eq: {
      2: function(a) {
        return is(a[0], a[1]);
      }
    },
    Ne: {
      2: function(a) {
        return !is(a[0], a[1]);
      }
    },
    ToString: {
      1: function(a) {
        return "undefined";
      }
    },
    Type: {
      1: function(a) {
        return "undefined";
      }
    }
  }
};

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
  if (iMap.isMap(v)) return "map";
  if (iSet.isSet(v)) return "set";
  return "list";
}

// A method call on the stack during evaluation.
function Call(mName, args, caller, index) {
  this.mName = mName; // the method name
  this.args = args; // the arguments
  this.caller = caller;
  this.index = index;
}

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
    if (type == "map") {
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
    const mName = expr.get("Call");
    if (typeof mName !== "string" || !/^[A-Z]\w*$/.test(mName)) {
      stack[caller].args[index] = undefined;
      return;
    }
    const args = expr.get("Args");
    if (!iList.isList(args) || args.size < 1) {
      stack[caller].args[index] = undefined;
      return;
    }
    stack.push(new Call(expr.get("Call"), args.toArray(), caller, index));
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
