# String

 A string is a sequence of characters.

## Operators

| Expression | Description
| --- | ---
| `s1 ++ s2` | Concatenation
| `s1 == s2` | Equality
| `s1 != s2` | Inequality
| `s1 < s2` |  Less than
| `s1 <= s2` | Less than or equal
| `s1 > s2` |  Greater than
| `s1 >= s2` | Greater than or equal

## Regular expression pattern syntax

 When writing a regular expression in a string, the normal string escape rules still apply. In particular, you need to escape every backslash with another backslash.

| Character | Meaning
| --- | ---
| . | Matches any single character except line terminators.
| \\d | Matches any digit.
| \\D | Matches any character that is not a digit.
| \\w | Matches any alphanumeric character.
| \\W | Matches any character that is not a word character.
| \\s | Matches a single white space character.
| \\S | Matches a single character other than white space.
| \\t | Matches a horizontal tab.
| \\r | Matches a carriage return.
| \\n | Matches a linefeed.
| \\v | Matches a vertical tab.
| \\f | Matches a form-feed.
| [\\b] | Matches a backspace.
| \\0 | Matches a NUL character.
| \\cA | Matches control character A (a letter from A to Z).
| \\x65 | Matches the character with the code 65 (two hexadecimal digits).
| \\u0065| Matches a UTF-16 code-unit with the value 0065 (four hexadecimal digits).
| \\ | Indicates that the next character is not special.
| [xyz] | A character set.
| [a-c] | A character range.
| [^xyz] | A negated or complemented character set.
| [^a-c] | A negated or complemented character range.
| _x_\|_y_ | Matches either _x_ or _y_.
| ^ | Matches beginning of input.
| $ | Matches end of input.
| \\b | Matches a word boundary.
| \\B | Matches a non-word boundary.
| (_x_) | Matches _x_ and remembers the match.
| \\_n_ | An integer back reference to the last substring matching the _n_ parenthetical.
| (?:_x_) | Matches _x_ but does not capture the match.
| _x_\* | Matches _x_ zero or more times.
| _x_+ | Matches _x_ one or more times.
| _x_? | Matches _x_ zero or one time.
| _x_{_n_} | Matches exactly _n_ occurrences of _x_.
| _x_{_n_,} | Matches at least _n_ occurrences of _x_.
| _x_{_n_,_m_} | Matches at least _n_ and at most _m_ occurrences of _x_.
| _x_\*? | Like _x_\*, but matches the smallest possible match.
| _x_+? | Like _x_+, but matches the smallest possible match.
| _x_?? | Like _x_?, but matches the smallest possible match.
| _x_{_n_,}? | Like _x_{_n_,}, but matches the smallest possible match.
| _x_{_n_,_m_}? | Like _x_{_n_,_m_}, but matches the smallest possible match.
| _x_(?=_y_) | Matches _x_ only if _x_ is followed by _y_.
| _x_(?!_y_) | Matches _x_ only if _x_ is not followed by _y_.

## Regular expression flags

 A flag string can contain zero or more of the following flags:

    Flag  Definition
     g       global match (find all matches)
     i       ignore case
     m       multiline matching

## `s.Get(index)`

 Returns the character from `s` at the specified index.

## `s.CharCodeAt(index)`

 Returns an integer between 0 and 65535 representing the UTF-16 code unit at the specified index.

## `s.Concat(s2)`

 Concatenates `s` with `s2`.

## `s.EndsWith(searchString[, length])`

 Determines whether `s` ends with the characters of `searchString`. `length` overwrites the length of `s` to search in. If `length` is omitted, it defaults to the length of `s`.

## `s.Includes(searchString[, position])`

 Determines whether a search string may be found within `s`. `searchString` is the string to be searched for. `position` is the position within `s` to begin searching for `searchString`. If `position` is omitted, it defaults to 0.

## `s.IndexOf(searchValue[, fromIndex])`

 Returns the index of the first occurrence of `searchValue` within `s`, starting the search at `fromIndex`. Returns -1 if the value is not found. If `fromIndex` is omitted, it defaults to 0.

## `s.LastIndexOf(searchValue[, fromIndex])`

 Returns the index of the last occurrence of `searchValue` within `s`, searching backwards from `fromIndex`. Returns -1 if the value is not found. If `fromIndex` is omitted, it defaults to Infinity.
 
## `s.Length()`

 Returns the length of `s`.

## `s.Match(pattern[, flags])`

 Retrieves the matches when matching `s` against a regular expression. `pattern` and `flags` are strings describing the regular expression.

## `s.Repeat(count)`

 Returns a string containing the specified number of copies of `s`. `count` is the number of times to repeat `s`.

## `s.Replace(pattern, newSubstr[, flags])`

 Returns a string with the occurrences of a regular expression in `s` replaced by a new string. `newSubstr` is the string that replaces the matched substrings of `s`. `pattern` and `flags` are strings describing the regular expression.

 `newSubstr` can include the following special replacement patterns:

| Pattern | Effect
| --- | ---
| $$ | Inserts a "$".
| $& | Inserts the matched substring.
| $\` | Inserts the portion of the string that precedes the matched substring.
| $' | Inserts the portion of the string that follows the matched substring.

## `s.Search(pattern[, flags])`

 Returns the index of the first match of a regular expression in `s`. Returns -1 if no match is found. `pattern` and `flags` are strings describing the regular expression.

## `s.Slice(beginIndex[, endIndex])`

 Extracts a section of `s`. `beginIndex` is the zero-based index at which to start extraction. `endIndex` is the zero-based index at which to end extraction. If `endIndex` is omitted, characters are extracted to the end of `s`.

## `s.Split([separator[, limit]])`

 Splits `s` into a list of strings. `separator` is the string to use for separating `s`. If `separator` is omitted, the returned list contains only `s`. If `separator` is an empty string, `s` is converted into a list of characters. `limit` is an optional limit on the number of splits to be found.

## `s.StartsWith(searchString[, position])`

 Determines whether `s` begins with the characters of a specified string. `searchString` is the string to be searched for at the start of `s`. `position` is the position in `s` at which to begin searching for `searchString`. If `position` is omitted, the search starts at 0.

## `s.Substr(start[, length])`

 Returns the characters in n beginning at the specified location through the specified number of characters. If `length` is omitted, characters are included to the end of `s`.

## `s.Substring(indexStart[, indexEnd])`

 Returns a subset of `s` between one index and another, or through the end of `s`. `indexStart` is the offset (between 0 and the end of `s`) into `s` of the first character to include. `indexEnd` is the offset (between 0 and the end of `s`) into `s` of the first character **not** to include. If `indexEnd` is omitted, characters are included to the end of `s`.

## `s.Test(pattern[, flags])`

  Returns `true` if a given regular expression matches `s`. `pattern` and `flags` are strings describing the regular expression.

## `s.ToLowerCase()`

  Returns `s` converted to lower case.

## `s.ToUpperCase()`

  Returns `s` converted to upper case.

## `s.Trim()`

 Removes whitespace from both ends of `s`. Whitespace means the whitespace characters (space, tab, no-break space, etc.) and line terminators (LF, CR, etc.).

## `s.ToString()`

 Returns a string representing `s`. For example, `"abc".toString()` is equal to `"\"abc\""`.

## `s.Load()`

 Returns the object of the class named `s`.

## `s.Type()`

 Returns `"string"`.

