# Number

 A number is a double-precision 64-bit IEEE 754 floating-point number (i.e. a number between -(2<sup>53</sup> - 1) and 2<sup>53</sup> - 1).

## Operators

| Expression | Description
| --- | ---
| `-x` | Negation
| `~x` | Bitwise NOT 
| `x1 * x2` | Multiplication
| `x1 / x2` | Division
| `x1 % x2` | Remainder
| `x1 ** x2` | Exponentiation
| `x1 << x2` | Left shift
| `x1 >> x2` | Sign-propagating right shift
| `x1 >>> x2` | Zero-fill right shift
| `x1 & x2` | Bitwise AND
| `x1 + x2` | Addition
| `x1 - x2` | Subtraction
| `x1 \| x2` | Bitwise OR
| `x1 ^ x2` | Bitwise XOR
| `x1 == x2` | Equality
| `x1 != x2` | Inequality
| `x1 < x2` |  Less than
| `x1 <= x2` | Less than or equal
| `x1 > x2` |  Greater than
| `x1 >= x2` | Greater than or equal

## `x.toExponential([fractionDigits])`

 Returns a string representing `x` in exponential notation. **fractionDigits** is the number of digits after the decimal point. If the argument is omitted, defaults to as many digits as necessary to specify `x`.

## `x.toFixed([digits])`

 Formats `x` using fixed-point notation. **digits** is the number of digits to appear after the decimal point (between 0 and 20 inclusively). If the argument is omitted, defaults to 0.

## `x.toPrecision([precision])`

 Returns a string representing `x`. **precision** is the number of significant digits. If the argument is omitted, behaves as `toString()`.

## `x.toBoolean()`

 Returns `false` if `x` is 0 or NaN. Returns `true` otherwise.

## `x.toString([radix])`

 Returns a string representing `x`. **radix** is an integer between 2 and 36 specifying the base to use. If the argument is omitted, defaults to 10.

## `x.type()`

 Returns `"number"`.

