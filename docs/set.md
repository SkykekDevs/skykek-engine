# Set

 A set is an unordered collection of elements.

 When iterating a set, for example with `first()` and `rest()`, the iteration order is undefined but stable.

## Operators

| Expression | Description
| --- | ---
| `s1 == s2` | Equality
| `s1 != s2` | Inequality

## `s.size()`

 Returns the number of elements in `s`.

## `s.add(element)`

 Returns a set which includes `element`.

## `s.delete(element)`

 Returns a set which excludes `element`.

## `s.clear()`

 Returns a set with no elements.

## `s.union(other)`

 Returns a set that is the union of `s` and `other`.

## `s.intersect(other)`

 Returns a set that is the intersection of `s` and `other`.

## `s.subtract(other)`

 Returns a set excluding any elements contained in `other`.

## `s.has(element)`

 Returns true if `element` exists in `s`.

## `s.first()`

 Returns the first element of `s`.

## `s.rest()`

 Returns a set containing all elements of `s` except the first.

## `s.flatten()`

 Returns a set that flattens `s`.

## `s.join([separator])`

 Joins elements of `s` together as a string, inserting a separator between each. The default separator is `","`.

## `s.isEmpty()`

 Returns true if `s` includes no elements.

## `s.max()`

 Returns the maximum element in `s`.

## `s.min()`

 Returns the minimum element in `s`.

## `s.isSubset(other)`

 Returns `true` if `other` includes every element of `s`.

## `s.isSuperset(other)`

 Returns `true` if `s` includes every element of `other`.

## `s.toList()`

 Returns a list that contains the elements of `s`.

## `s.toString()`

 Returns a string representing `s`.

## `s.type()`

 Returns `"set"`.

