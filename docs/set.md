# Set

 A set is an unordered collection of elements.

 When iterating a set, for example with `First()` and `Rest()`, the iteration order is undefined but stable.

## Operators

| Expression | Description
| --- | ---
| `s1 == s2` | Equality
| `s1 != s2` | Inequality

## `s.Size()`

 Returns the number of elements in `s`.

## `s.Add(element)`

 Returns a set which includes `element`.

## `s.Delete(element)`

 Returns a set which excludes `element`.

## `s.Clear()`

 Returns a set with no elements.

## `s.Union(other)`

 Returns a set that is the union of `s` and `other`.

## `s.Intersect(other)`

 Returns a set that is the intersection of `s` and `other`.

## `s.Subtract(other)`

 Returns a set excluding any elements contained in `other`.

## `s.Has(element)`

 Returns true if `element` exists in `s`.

## `s.First()`

 Returns the first element of `s`.

## `s.Rest()`

 Returns a set containing all elements of `s` except the first.

## `s.Flatten()`

 Returns a set that flattens `s`.

## `s.Join([separator])`

 Joins elements of `s` together as a string, inserting a separator between each. The default separator is `","`.

## `s.IsEmpty()`

 Returns true if `s` includes no elements.

## `s.Max()`

 Returns the maximum element in `s`.

## `s.Min()`

 Returns the minimum element in `s`.

## `s.IsSubset(other)`

 Returns `true` if `other` includes every element of `s`.

## `s.IsSuperset(other)`

 Returns `true` if `s` includes every element of `other`.

## `s.ToList()`

 Returns a list that contains the elements of `s`.

## `s.ToString()`

 Returns a string representing `s`.

## `s.Type()`

 Returns `"set"`.

