# Map

 A map is a collection of key-value pairs.

 When iterating a map, for example with `first()` and `rest()`, the iteration order is undefined but stable.

## Operators

| Expression | Description
| --- | ---
| `s1 == s2` | Equality
| `s1 != s2` | Inequality

## `m.size()`

 Returns the number of key-value pairs in `m`.

## `m.set(key, value)`

 Returns a map containing the given key-value pair.

## `m.delete(key)`

 Returns a map which excludes the specified `key`.

## `m.clear()`

 Returns a map containing no key-value pairs.

## `m.get(key[, notSetValue])`

 Returns the value associated with the given `key`, or `notSetValue` if `m` does not contain the key. If `notSetValue` is omitted, it defaults to `undefined`.

 The expression `m[key]` is equivalent to `m.get(key)`.

## `m.has(key)`

 Returns true if the given `key` exists in `m`.

## `m.first()`
 Returns the first value in `m`.

## `m.rest()`

 Returns a map containing all key-value pairs except the first.

## `m.keys()`

 Returns a list of the keys of `m`.

## `m.toList()`

 Returns a list of the values of `m`.

## `m.toSet()`

 Returns a set of the values of `m`.

## `m.toString()`

 Returns a string representing `m`.

## `m.type()`

 Returns `"map"`.

