# Map

 A map is a collection of key-value pairs.

 When iterating a map, for example with `First()` and `Rest()`, the iteration order is undefined but stable.

## Operators

| Expression | Description
| --- | ---
| `s1 == s2` | Equality
| `s1 != s2` | Inequality

## `m.Size()`

 Returns the number of key-value pairs in `m`.

## `m.Set(key, value)`

 Returns a map containing the given key-value pair.

## `m.Delete(key)`

 Returns a map which excludes the specified `key`.

## `m.Clear()`

 Returns a map containing no key-value pairs.

## `m.Get(key[, notSetValue])`

 Returns the value associated with the given `key`, or `notSetValue` if `m` does not contain the key. If `notSetValue` is omitted, it defaults to `undefined`.

 The expression `m[key]` is equivalent to `m.Get(key)`.

## `m.Has(key)`

 Returns true if the given `key` exists in `m`.

## `m.First()`
 Returns the first value in `m`.

## `m.Rest()`

 Returns a map containing all key-value pairs except the first.

## `m.Keys()`

 Returns a list of the keys of `m`.

## `m.ToList()`

 Returns a list of the values of `m`.

## `m.ToSet()`

 Returns a set of the values of `m`.

## `m.ToString()`

 Returns a string representing `m`.

## `m.Type()`

 Returns `"map"`.

