# List

 A list is an ordered collection of elements.

## Operators

| Expression | Description
| --- | ---
| `s1 == s2` | Equality
| `s1 != s2` | Inequality

## `t.size()`

 Returns the number of elements in `t`.

## `t.set(index, value)`

 Returns a list which includes `value` at `index`.

## `t.delete(index)`

 Returns a list which excludes this `index` and with a size 1 less than `t`. Values at indices above `index` are shifted down by 1.

## `t.insert(index, value)`

 Returns a list with `value` at `index` with a size 1 more than `t`. Values at indices above `index` are shifted over by 1.

## `t.clear()`

 Returns a list with no elements.

## `t.push(value)`

 Returns a list with the given `value` appended.

## `t.pop()`

 Returns a list excluding the last index in `t`.

## `t.unshift(value)`

 Returns a list with the given `value` prepended, shifting other values ahead to higher indices.

## `t.shift()`

 Returns a list excluding the first index in `t`, shifting all other values to a lower index.

## `t.setSize(size)`

 Returns a list with size `size`. If `size` is less than `t`'s size, the list will exclude values at the higher indices. If `size` is greater than `t`'s size, the list will have undefined values for the newly available indices.

## `t.get(index[, notSetValue])`

 Returns the value associated with the provided `index`, or `notSetValue` if `index` is beyond the bounds of `t`. If `notSetValue` is omitted, it defaults to `undefined`.

 The expression `t[index]` is equivalent to `t.get(index)`.

## `t.has(index)`

 Returns true if `t` has an element at `index`.

## `t.includes(value)`

 Returns true if `value` exists within `t`.

## `t.first()`

 Returns the first value in `t`.

## `t.last()`

 Returns the last value in `t`.

## `t.keys()`

 Returns a list of indices.

## `t.reverse()`

 Returns a list with the elements of `t` in reverse order.

## `t.sort()`

 Returns a list which includes the same elements as `t`, stably sorted.

## `t.slice([begin[, end]])`

 Returns a list representing a portion of this list from `begin` up to but not including `end`. If `begin` is negative, it is offset from the end of `t`. If `begin` is omitted, the list will begin at the beginning of `t`. If `end` is negative, it is offset from the end of `t`. If `end` is omitted, the list will continue through the end of `t`.

## `t.rest()`

 Returns a list containing all elements except the first.

## `t.butLast()`

 Returns a list containing all elements except the last.

## `t.skip(amount)`

 Returns a list which excludes the first `amount` elements from `t`.

## `t.skipLast(amount)`

 Returns a list which excludes the last `amount` elements from `t`.

## `t.take(amount)`

 Returns a list which includes the first `amount` elements from `t`.

## `t.takeLast(amount)`

 Returns a list which includes the last `amount` elements from `t`.

## `t.concat(other)`

 Returns a list with the `other` list concatenated to `t`.

## `t.flatten()`

 Returns a list that flattens `t`.

## `t.interpose(separator)`

 Returns a list with `separator` between each element in `t`.

## `t.splice(index[, removeNum])`

 Returns a list that skips a region of `t`. `index` is the index at which to start removing elements. If `index` is negative, will begin that many elements from the end of `t`. `removeNum` is the number of elements to remove. If `removeNum` is omitted, the rest of the list will be removed.

## `t.join([separator])`

 Joins values together as a string, inserting a separator between each. The default separator is `","`.

## `t.isEmpty()`

 Returns true if `t` includes no elements.

## `t.keyOf(searchValue)`

 Returns the key associated with the search value, or `undefined`.

## `t.lastKeyOf(searchValue)`

 Returns the last key associated with the search value, or `undefined`.

## `t.max()`

 Returns the maximum value in `t`.

## `t.min()`

 Returns the minimum value in `t`.

## `t.indexOf(searchValue)`

 Returns the first index at which a given value can be found in `t`, or -1 if it is not present.

## `t.lastIndexOf(searchValue)`

 Returns the last index at which a given value can be found in `t`, or -1 if it is not present.

## `t.toMap()`

 Returns a map that contains the elements of `t`. The key for each key-value pair is the index of the element.

## `t.toSet()`

 Returns a set that contains the elements of `t`.

## `t.toString()`

 Returns a string representing `t`.

## `t.type()`

 Returns `"list"`.

