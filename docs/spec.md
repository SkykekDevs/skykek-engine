# Keklang

 This is a reference manual for Keklang, the programming language used on Skykek.


## Lexical considerations

### Names

 Names for properties, methods, parameters, and classes can contain lowercase letters (a-z), uppercase letters (A-Z), digits (0-9), and underscores (\_).

 The first character of a property name, a method name, or a parameter name must be a lowercase letter or an underscore.

    i
    infoAboutMe
    askQuestion
    _a

 The first character of a class name must be an uppercase letter.

    SomeClassName

 Relative class names are supported through the `$` prefix. For example, in a class named `Sports`, `$` is equivalent to `Sports` and `$Team` is equivalent to `SportsTeam`.


### Keywords

 The following keywords are reserved. They cannot be used as names.

    true
    false
    undefined
    Infinity
    NaN
    this
    in


### Comments

 Comments serve to document lines of code. A comment starts with the character sequence `//` and stops at the end of the line.

    $.status = "alive" // Rumors of my demise have been greatly exaggerated.


## Values

 A value is an entity that can be manipulated by the program.

 The language supports the following types of values, each with its own built-in methods: [number][./number/], [boolean][./boolean/], [string][./string/], [list][./list/], [map][./map/], [set][./set/], [undefined][./undefined/]. All values are immutable.


## Expressions

 An expression specifies the computation of a value.
 

### Numbers

 _number_ := _decimal_ | _hexadecimal_ | `Infinity` | `-Infinity` | `NaN`

 A number in this language is a double-precision 64-bit IEEE 754 floating-point number (i.e. a number between -(2<sup>53</sup> - 1) and 2<sup>53</sup> - 1).

 A number represented in decimal form has an integer part, an optional fraction part and an optional exponent part.

 The integer part can be 0 or it can be a non-zero digit (1-9) followed by zero or more digits. Here is a regular expression for the integer part:

    0|[1-9][0-9]*

 The fraction part is a dot (.) followed by one or more digits. Here is a regular expression for the fraction part:

    \.[0-9]+

 The exponent part is e or E followed by an optional + or - sign and one or more digits. Here is a regular expression for the exponent part:

    [eE][-+]?[0-9]+

 Here is the entire regular expression for decimal numbers:

    (0|[1-9][0-9]*)(\.[0-9]+)?([eE][-+]?[0-9]+)?

 `Infinity` represents positive infinity. `-Infinity` represents negative infinity. `NaN` represents Not-A-Number.

 A number is represented in hexadecimal form as `0x` followed by one or more hexadecimal digits. Here is a regular expression for hexadecimal numbers:

    0x[0-9a-fA-F]+

 Here are some examples of number expressions:

    0
    234
    6.25
    2e4
    92.3e4
    Infinity
    -Infinity
    NaN
    0x0ab


### Booleans

 A boolean is `true` or `false`.


### Strings

 A string is a sequence of characters.

 A string expression is a sequence of zero or more characters and escape sequences between double quotes. A character can be any Unicode character other than double quote ("), backslash (\\), and control characters.

 The following single character escape sequences are supported:

    \"   U+0022 double quote
    \\   U+005c backslash
    \b   U+0008 backspace
    \f   U+000C form feed
    \n   U+000A line feed or newline
    \r   U+000D carriage return
    \t   U+0009 horizontal tab

 Also supported are four-digit hexadecimal Unicode escape sequences like `\u0061`.

 Here are some examples of string expressions:

    ""
    "door"
    "Hello.\n"
    "ab\u0063"


### Lists

 A list is an ordered collection of elements.

 _list_ := `[` [ _list-elements_ ] `]`

 _list-elements_ := _expr_ | _list-elements_ `,` _expr_

 Here are some examples of list expressions:

    []
    [1, 1, 2, 3, 5]
    ["a", "b", "C".toLowerCase()]
    [2, {"a": 4}, [4, 5, 6]]


### Maps

 A map is a collection of key-value pairs (_entries_).

 _map_ := `{` [ _map-entries_ ] `}`

 _map-entries_ := _map-entry_ | _map-entries_ `,` _map-entry_

 _map-entry_ := _expr_ `:` _expr_

 Here are some examples of map expressions:

    {}
    {"x": 3, "y": 4}
    {"a": 1, "b": 2, "C".toLowerCase(): 10 - 7}
    {2: "a", {"a": 4}: "b", [4, 5, 6]: "c"}


### Sets

 A set is an unordered collection of elements (_members_).

 _set_ := `#{` [ _set-members_ ] `}`

 _set-members_ := _expr_ | _set-members_ `,` _expr_

 Here are some examples of set expressions:

    #{}
    #{5, 7, 11, 13}
    #{"a", "b", "C".toLowerCase()}
    #{2, {"a": 4}, [4, 5, 6]}


### Undefined

 `undefined` stands for an undefined value.


### Parameters

 _param-expr_ := _param-name_ | `this`

 A parameter expression refers to a parameter from the left-hand side of the rule. For example, the following rule returns parameter `b`:

    $.m(a, b, c) = b

  With the `this` keyword, you can refer to the object whose method was called.


### Properties

 _prop_ := _primary_ `.` _prop-name_

 A property expression accesses a property of an object. It's a shorthand for a call to the `get` method using the property name as a string key. For example, the expression `a.foo` is equivalent to `a.get("foo")`.


### Indexes

 _get_ := _primary_ `[` _expr_ `]`

 An index or "get" expression is a shorthand for a call to the `get` method. For example, `a[b]` is equivalent to `a.get(b)`.


### Calls

 _call_ := [ _primary_ `.` ] _method-name_ `(` [ _args_ ] `)`

 _args_ := _expr_ | _args_ `,` _expr_

 A call expression calls the receiver's given method with the given arguments. Here are some examples of calls:

    "0123456789".split()
    {}.set("sky", "blue")
    myList.push(5)

 A call without a receiver (i.e. not preceded by a primary expression and a dot) is interpreted as a call to the `Global` object. For example, `parse("234")` is equivalent to `Global.parse("234")`.


### Constructors

 _constructor_ := _classname_ | _classname_ `(` [ _args_ ] `)`

 The short-form constructor (only a class name) returns the object with the given name. For example, `Math` returns the object described in the `Math` class.

 The long-form constructor calls the `make` method of the object with the given name. The arguments in parentheses are given to `make`. In other words, the expression `Point(x, y)` is equivalent to `Point.make(x, y)`.


### Operators

 _expr_ := _e2_ | _expr_ `||` _e2_

 _e2_ := _e3_ | _e2_ `&&` _e3_

 _e3_ := _e4_ | _e3_ `==` _e4_ | _e3_ `!=` _e4_ | _e3_ `<` _e4_ | _e3_ `<=` _e4_ | _e3_ `>` _e4_ | _e3_ `>=` _e4_

 _e4_ := _e5_ | _e4_ `+` _e5_ | _e4_ `-` _e5_ | _e4_ `|` _e5_ | _e4_ `^` _e5_

 _e5_ := _eu_ | _e5_ `*` _eu_ | _e5_ `/` _eu_ | _e5_ `%` _eu_ | _e5_ `**` _eu_ | _e5_ `<<` _eu_ | _e5_ `>>` _eu_ | _e5_ `>>>` _eu_ | _e5_ `&` _eu_

 _eu_ := _primary_ | `!` _eu_ | `-` _eu_ | `~` _eu_

 _primary_ := _number_ | _boolean_ | _string_ | _list_ | _map_ | _set_ | `undefined` | _param-expr_ | _get_ | _call_ | _constructor_ | `(` _expr_ `)`

 Operators are a shorthand for certain commonly-used calls. They allow expressions to be easier to read. You can support an operator in your class by implementing the corresponding method.

| Expression | Call | Description
| --- | --- | ---
| !a | a.lnot() | Logical NOT
| -a | a.neg() | Negation
| ~a | a.not() | Bitwise NOT
| a * b | a.mul(b) | Multiplication
| a / b | a.div(b) | Division
| a % b | a.rem(b) | Remainder
| a ** b | a.pow(b) | Exponentiation
| a << b | a.lsh(b) | Left shift
| a >> b | a.rsh(b) | Sign-propagating right shift
| a >>> b | a.zrsh(b) | Zero-fill right shift
| a & b | a.and(b) | Bitwise AND
| a + b | a.add(b) | Addition
| a - b | a.sub(b) | Subtraction
| a \| b | a.or(b) | Bitwise OR
| a ^ b | a.xor(b) | Bitwise XOR
| a == b | a.eq(b) | Equality
| a != b | a.ne(b) | Inequality
| a < b | a.lt(b) | Less than
| a <= b | a.le(b) | Less than or equal
| a > b | a.gt(b) | Greater than
| a >= b | a.ge(b) | Greater than or equal
| a && b | a.land(b) | Logical AND
| a \|\| b | a.lor(b) | Logical OR

 Unary operators (logical NOT, negation and bitwise NOT) have a higher precedence than binary operators. Within binary operators, multiplication operators have the highest precedence, followed by addition operators, comparison operators, logical AND, and logical OR:

    Precedence    Binary operator
       5             *  /  %  **  <<  >>  >>>  &
       4             +  -  |  ^
       3             ==  !=  <  <=  >  >=
       2             &&
       1             ||


## Classes

 As explained above, the language provides multiple types of values like numbers, lists, and maps. As a programmer, you don't create new types of values. Instead, you write _classes_.

 A class is essentially a description of a map. In the context of object-oriented programming, we refer to the map as an _object_. From the point of view of the interpreter, however, there's nothing special about an object. It really is just a map.

 A class declares _properties_ and _methods_ for the object. Properties provide state while methods implement behavior. Both properties and methods are entries in the map.

 At run-time, the object described by a class is accessible globally by name. For example, if you write a class named `C`, then the expression `C` anywhere else in the program will return the `C` object.

 The source code for a class is a series of declarations (one per line). There are property declarations, entry declarations, and rule declarations. They all start with a dollar sign ($).

 A declaration sometimes requires an expression to be a _literal_. An expression is a literal if it doesn't contain any calls (including operators, properties and indexes), constructors, or parameters.

 Here are examples of expressions that are also literals:

    -345
    true
    "abc"
    [3, 4, 5]
    {"x": 3, "y": 4}
    #{3, 4, 5}
    {"odd": [1, 3, 5], "even": [2, 4, 6]}
    undefined

 Here are examples of expressions that are not literals:

    "wow".toUpperCase()
    a
    !true
    2 + 3
    [3, 4, 20 - 15]
    "abcde"[2]
    Math
    Rectangle(10, 10, 20, 20)


### Property declarations

 _prop-decl_ := `$` `.` _prop-name_ `=` _expr_

 A property provides state to the object. It's a simple entry in the map using the property name as a string key.

 For example, if the program contains a class named `C` with the declarations

    $.foo = 118
    $.bar = true

 then the expression `C` is equivalent to the expression `{"foo": 118, "bar": true}`.

 The expression in a property declaration must be a literal.


### Entry declarations

 _entry-decl_ := `$` `[` _expr_ `]` `=` _expr_

 With an entry declaration, you can add a raw map entry with any type of key:

    $[28] = "Ni"

 Both of the expressions in an entry declaration must be literals.


### Rule declarations

 _rule-decl_ := `$` `.` _method-name_ `(` [ _params_ ] `)` `=` _expr_

 _params_ := _param_ | _params_ `,` _param_

 _param_ := _param-name_ | _param-name_ `:` _expr_

 A rule is the basic building block of the object's behavior. It tells the interpreter how to evaluate a call that matches a certain pattern. It has a left-hand side and right-hand side separated by an equal sign (=). The left-hand side is the pattern to match, and the right-hand side is the expression to return if a call matches the pattern.

 The pattern on the left-hand side consists of a method name, a parameter count, and (optionally) a literal value for the last parameter.

 Take the following rule:

    $.m(a, b: true) = 3

 It says that if the method `m` is called on this object with 2 other parameters, and if the last parameter is equal to `true`, then we return `3`.


### Methods

 A set of rules with the same name in the same class form a _method_. Each method is an entry in the map with the method name as the key.

 Say, for example, that the source code of a class contains the following method with three rules:

    $.color(fruit: "apple") = "red"
    $.color(fruit: "banana") = "yellow"
    $.color(fruit) = "green"

 The code says that if a call is made to the `color` method with 2 parameters (`this` and `fruit`) and if the value of the last parameter (i.e. `fruit`) is equal to `"apple"`, then we return the value `"red"`. If instead the last parameter is `"banana"`, we return `"yellow"`. Finally, if the last parameter doesn't match either of those two choices, we return "green".

 In the map generated from the source code, this method is an entry with key `"color"` and value

    {
      2: {
        "apple": {"val": "red"},
        "banana": {"val": "yellow"},
        undefined: {"val": "green"}
      }
    }

 Here are some examples illustrating how expressions are stored in the map:

| Example | Meaning
| --- | ---
| `{"val": "red"}` | the literal value`"red"`
| `{"param": 3}` | the parameter at index 3
| `{"call": "m", "args": list}` | a call to the method named `m` with a list of arguments
| `{"path": ["chem", "elem"]}` | the `ChemElem` object

 As a programmer you typically don't have to worry about the internal representation of methods. After all, the interpreter takes care of compiling your source code into objects. However, it's good to remember that methods are just map entries, and therefore can be created and called at run-time:

    {"agree": {2: {true: {"val": "Yes!"}, false: {"val": "No!"}}}}.agree(true)

 The expression above evaluates to `"Yes!"`.

 Built-in map methods have priority over regular methods, so the latter shouldn't be named `eq`, `ne`, `size`, `set`, `delete`, `clear`, `get`, `has`, `first`, `rest`, `keys`, `toList`, `toSet`, `toString`, or `type`. Even if you do implement for example a `get` method, any call to `get` will still be interpreted as a call to the built-in `get` method.

### An example: `$.sum(list)` 

 The method in the previous example merely associates a fruit name to a color. But even though graph rewriting is the only form of computation we have access to, we can still implement non-trivial methods. The main trick in Keklang is for a method to call itself with a different pattern. Here is a method that adds the elements of a list:

    $.sum(list) = $.sum(list, 0)
    $.sum(list, s) = $.sum(list, s, list.isEmpty())
    $.sum(list, s, isEmpty: true) = s
    $.sum(list, s, isEmpty: false) = $.sum(list.rest(), s + list.first())

 The method initializes the sum `s` to 0, and then adds the elements to it one by one until the list is empty. Notice how the number of parameters varies during the computation.

### The `make` method

 A constructor is the standard way for a class to enable its users to make a range of different objects. Implementing a constructor in your class simply means implementing a `make` method that returns an object. If you were to write a `Point` class to represent points on a 2D plane, the `make` method might look like this:

    $.make(x, y) = this.set("x", x).set("y", y)

 A user of the class could then create a new point with a constructor expression like `Point(3, 4)`.


### Functions

 _func_ := `#!` _func-name_

 A function allows a rule to delegate its work to the interpreter for performance. One of them is `#!sqrt`, which computes the square root of its argument. If your `Math` class contains the rule

    $.squareRoot(x) = #!sqrt

 then the expression `Math.squareRoot(9)` will return `3`.

 A function cannot be part of a larger expression.

 Here is the list of supported functions:

| Function | Output
| --- | ---
| `abs(x)` | the absolute value of `x`
| `acos(x)` | the arccosine (in radians) of `x`
| `asin(x)` | the arcsine (in radians) of `x`
| `atan(x)` | the arctangent (in radians) of `x`
| `atan2(y, x)` | the arctangent of the quotient of `y` and `x`
| `ceil(x)` | the smallest integer greater than or equal to `x`
| `cos(x)` | the cosine of `x`
| `exp(x)` | e to the power `x`
| `floor(x)` | the largest integer less than or equal to `x`
| `chr(x)` | the character with the character code `x`
| `log(x)` | the natural logarithm (base e) of `x`
| `max(x, y)` | the largest of `x` and `y`
| `min(x, y)` | the smallest of `x` and `y`
| `parseFloat(s)` | the number represented by `s`
| `parseInt(s)` | the integer represented by `s`
| `parseInt2(s, r)` | the integer represented by `s` with radix `r`
| `pow(x, y)` | `x` to the power `y`
| `round(x)` | `x` rounded to the nearest integer
| `sin(x)` | the sine of `x`
| `sqrt(x)` | the square root of `x`
| `tan(x)` | the tangent of `x`

[./number/]: number.md
[./boolean/]: boolean.md
[./string/]: string.md
[./list/]: list.md
[./map/]: map.md
[./set/]: set.md
[./undefined/]: undefined.md

