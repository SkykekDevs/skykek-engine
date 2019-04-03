# Keklang

 This is a reference manual for Keklang, the programming language used on Skykek.


## Lexical considerations

### Names

 Names can contain lowercase letters (a-z), uppercase letters (A-Z), digits (0-9), and underscores (\_).

 A _lowercase_ name is a name whose first character is a lowercase letter or an underscore.

    someParameter
    i
    _a

 An _uppercase_ name is a name whose first character is an uppercase letter.

    SomeClass
    SomeMethod
    THIS


### Keywords

 The following keywords are reserved. They cannot be used as names.

    true
    false
    undefined
    Infinity
    NaN
    in


### Comments

 Comments serve to document lines of code. A comment starts with the character sequence `//` and stops at the end of the line.

    $.Status() = "fooled" // can't get fooled again


## Values and expressions

 A _value_ is an entity that can be manipulated by the program.

 The language supports the following types of values, each with its own built-in methods: [number][./number], [boolean][./boolean], [string][./string], [list][./list], [map][./map], [set][./set], [undefined][./undefined]. All values are immutable.

 An _expression_ specifies the computation of a value. An expression is a value if it doesn't require any further evaluation.

 Here are examples of expressions that are also values:

    2.5
    -345
    true
    "abc"
    [3, 4, 5]
    {"x": 3, "y": 4}
    #{3, 4, 5}
    {Odd: [1, 3, 5], Even: [2, 4, 6]}
    BioFemale
    undefined

 Here are examples of expressions that are not values:

    "wow".ToUpperCase()
    !true
    2 + 3
    [3, 4, 20 - 15]
    "abcde"[2]
    Math#
    Rectangle(10, 10, 20, 20)


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
    ["a", "b", "C".ToLowerCase()]
    [2, {"a": 4}, [4, 5, 6]]


### Maps

 A map is a collection of key-value pairs (_entries_).

 _map_ := `{` [ _map-entries_ ] `}`

 _map-entries_ := _map-entry_ | _map-entries_ `,` _map-entry_

 _map-entry_ := _expr_ `:` _expr_

 Here are some examples of map expressions:

    {}
    {"x": 3, "y": 4}
    {"a": 1, "b": 2, "C".ToLowerCase(): 10 - 7}
    {2: "a", {"a": 4}: "b", [4, 5, 6]: "c"}


### Sets

 A set is an unordered collection of elements (_members_).

 _set_ := `#{` [ _set-members_ ] `}`

 _set-members_ := _expr_ | _set-members_ `,` _expr_

 Here are some examples of set expressions:

    #{}
    #{5, 7, 11, 13}
    #{"a", "b", "C".ToLowerCase()}
    #{2, {"a": 4}, [4, 5, 6]}


### Undefined

 `undefined` stands for an undefined value.


### Parameter references

 _ref_ := _lowercase_ | `$`

 You can refer to a parameter from the left-hand side of the rule. For example, the following rule returns parameter `b`:

    $.M(a, b, c) = b

 The `$` parameter is the receiver, i.e. the object whose method was called. This parameter is sometimes called `this` or `self` in other programming languages.


### Class names

 _name_ := _uppercase_

 A class name expression is a string with the name as its content. For example, `BioSpecies` is equivalent to `"BioSpecies"`.

 Relative names are supported through the `@` prefix. For example, in the `Sports` namespace, `@Team` is equivalent to `SportsTeam`.


### Load

 _load_ := _chain_ `#`

 A _load_ expression loads the object of the class with the given name. It's a shorthand for a call the `Load` method of the string. For example, `PolCountry#` is equivalent to `PolCountry.Load()`.


### Constructors

 _constructor_ := _chain_ `(` [ _args_ ] `)`

 A _constructor_ expression loads the object of the class with the given name, and then calls its `New` method. The arguments in parentheses are given to `New`. For example, the expression `Point(x, y)` is equivalent to `Point.Load().New(x, y)`.


### Calls

 _call_ := _chain_ `.` _uppercase_ `(` [ _args_ ] `)`

 _args_ := _expr_ | _args_ `,` _expr_

 A _call_ expression calls the receiver's given method with the given arguments. Here are some examples of calls:

    "0123456789".Split()
    {}.Set("sky", "blue")
    myList.Push(5)


### Get

 _get_ := _chain_ `[` _expr_ `]`

 A _get_ expression accesses a property of an object. It's a shorthand for a call to the `Get` method of the map. For example, `a[b]` is equivalent to `a.Get(b)`.


### Operators

 _expr_ := _e2_ | _expr_ `||` _e2_

 _e2_ := _e3_ | _e2_ `&&` _e3_

 _e3_ := _e4_ | _e3_ `==` _e4_ | _e3_ `!=` _e4_ | _e3_ `<` _e4_ | _e3_ `<=` _e4_ | _e3_ `>` _e4_ | _e3_ `>=` _e4_ | _e3_ `in` _e4_

 _e4_ := _e5_ | _e4_ `+` _e5_ | _e4_ `-` _e5_ | _e4_ `|` _e5_ | _e4_ `^` _e5_

 _e5_ := _eu_ | _e5_ `*` _eu_ | _e5_ `/` _eu_ | _e5_ `%` _eu_ | _e5_ `**` _eu_ | _e5_ `<<` _eu_ | _e5_ `>>` _eu_ | _e5_ `>>>` _eu_ | _e5_ `&` _eu_

 _eu_ := _chain_ | `!` _eu_ | `-` _eu_ | `~` _eu_

 _chain_ := _primary_ | _get_ | _load_ | _constructor_ | _call_

 _primary_ := _number_ | _boolean_ | _string_ | _list_ | _map_ | _set_ | `undefined` | _ref_ | _path_ | `(` _expr_ `)`

 Operators are a shorthand for certain commonly-used calls. They allow expressions to be easier to read. You can support an operator in your class by implementing the corresponding method.

| Expression | Call | Description
| --- | --- | ---
| !a | a.Lnot() | Logical NOT
| -a | a.Neg() | Negation
| ~a | a.Not() | Bitwise NOT
| a * b | a.Mul(b) | Multiplication
| a / b | a.Div(b) | Division
| a % b | a.Rem(b) | Remainder
| a ** b | a.Pow(b) | Exponentiation
| a ++ b | a.Concat(b) | String concatenation
| a << b | a.Lsh(b) | Left shift
| a >> b | a.Rsh(b) | Sign-propagating right shift
| a >>> b | a.Zrsh(b) | Zero-fill right shift
| a & b | a.And(b) | Bitwise AND
| a + b | a.Add(b) | Addition
| a - b | a.Sub(b) | Subtraction
| a \| b | a.Or(b) | Bitwise OR
| a ^ b | a.Xor(b) | Bitwise XOR
| a == b | a.Eq(b) | Equality
| a != b | a.Ne(b) | Inequality
| a < b | a.Lt(b) | Less than
| a <= b | a.Le(b) | Less than or equal
| a > b | a.Gt(b) | Greater than
| a >= b | a.Ge(b) | Greater than or equal
| a in b | b.Has(a) | Membership
| a && b | a.Land(b) | Logical AND
| a \|\| b | a.Lor(b) | Logical OR

 Unary operators (logical NOT, negation and bitwise NOT) have a higher precedence than binary operators. Within binary operators, multiplication operators have the highest precedence, followed by addition operators, comparison operators, logical AND, and logical OR:

    Precedence    Binary operator
       5             *  /  %  **  <<  >>  >>>  &
       4             +  -  |  ^
       3             ==  !=  <  <=  >  >= in
       2             &&
       1             ||


## Classes

 As explained above, the language provides multiple types of values like numbers, lists, and maps. As a programmer, you don't create new types of values. Instead, you write _classes_.

 A class is essentially a description of a map. In the context of object-oriented programming, we refer to the map as an _object_. From the point of view of the interpreter, however, there's nothing special about an object. It really is just a map.

 A class declares _properties_ and _methods_ for the object. Properties provide state while methods implement behavior. Both properties and methods are entries in the map.

 At run-time, the object described by a class is accessible globally by name. For example, if you write a class named `C`, the expression `C#` anywhere else in the program will return the `C` object.

 The source code for a class is a series of declarations (one per line). There are two kinds of declarations: property declarations and rule declarations. They both start with a dollar sign ($).


### Property declarations

 _prop-decl_ := `$` `[` _expr_ `]` `=` _expr_

 A property provides state to the object. It's a simple entry in the map.

 For example, if the program contains a class named `C` with the declarations

    $["foo"] = 118
    $["bar"] = true

 then the expression `C#` evaluates to `{"foo": 118, "bar": true}`.

 Both expressions in a property declaration must be values (i.e. fully-evaluated expressions). Any value can be used as a key, including lists, maps, and sets. Since a class name is a string, it can be used as a key:

    $[DemoPopulation] = 300


### Rule declarations

 _rule-decl_ := `$` `.` _uppercase_ `(` [ _params_ ] `)` `=` _expr_

 _params_ := _param_ | _params_ `,` _param_

 _param_ := _lowercase_ | _lowercase_ `:` _expr_

 A rule is the basic building block of the object's behavior. It tells the interpreter how to evaluate a call that matches a certain pattern. It has a left-hand side and right-hand side separated by an equal sign (=). The left-hand side is the pattern to match, and the right-hand side is the expression to return if a call matches the pattern.

 The pattern on the left-hand side consists of a method name, a parameter count, and (optionally) the value of the last parameter.

 Take the following rule:

    $.M(a, b: true) = 300

 It says that if the method named `M` is called on this object with 2 other parameters, and if the last parameter is equal to `true`, then we return `300`.


### Methods

 A set of rules with the same method name form a _method_. Each method is an entry in the map with the method name as the key.

 Say, for example, that the source code of a class contains the following method with three rules:

    $.Color(fruit: "apple") = "red"
    $.Color(fruit: "banana") = "yellow"
    $.Color(fruit) = "green"

 The code says that if a call is made to the `Color` method with 1 parameter (`fruit`) and if the last parameter (i.e. `fruit`) is equal to `"apple"`, then we return the value `"red"`. If instead the last parameter is equal to `"banana"`, we return `"yellow"`. Finally, if the last parameter doesn't match either of those two choices, we return "green".

 In the map generated from the source code, this method is an entry with key `"Color"` and value

    {
      1: {
        "apple": {Val: "red"},
        "banana": {Val: "yellow"},
        undefined: {Val: "green"}
      }
    }

 Here are some examples illustrating how expressions are stored in the map:

| Example | Meaning
| --- | ---
| `{Val: "red"}` | the value `"red"`
| `{Param: 0}` | `$`
| `{Param: 2}` | the first parameter (parameter 1 is the method name)
| `{Call: [{Val: "abc"}, {Val: Concat}, {Val: "def"}]}` | `"abc".Concat("def")`

 As a programmer you typically don't have to worry about the internal representation of methods. After all, the interpreter takes care of compiling your source code into objects. However, it's good to remember that methods are just map entries, and therefore can be created at run-time:

    {Agree: {1: {true: {Val: "Yes!"}, false: {Val: "No!"}}}}.Agree(true)

 The expression above evaluates to `"Yes!"`.

 Your methods override any built-in map methods with the same name. For example, if you implement a `Get` method in your class, you will no longer be able to call the built-in `Get` method of the map. The built-in methods for maps are `Eq`, `Ne`, `Size`, `Set`, `Delete`, `Clear`, `Get`, `Has`, `First`, `Rest`, `Keys`, `ToList`, `ToSet`, `ToString`, or `Type`.

### An example: `$.Sum(list)` 

 The method in the previous example merely associates a fruit name to a color. But we can implement less trivial methods. The main trick in Keklang is for a method to call itself again with a different pattern, usually with more parameters. Here is a method that adds the elements of a list:

    $.Sum(list) = $.Sum(list, list.isEmpty())
    $.Sum(list, isEmpty: true) = 0
    $.Sum(list, isEmpty: false) = list.First() + $.Sum(list.Rest())

 Notice how the number of parameters varies during the computation.


### The `New` method

 A constructor enables the users of a class to make a range of different objects. Implementing a constructor in your class means implementing an `New` method that returns an object. If you were to write a `Point` class to represent points on a 2D plane, the `New` method might look like this:

    $.New(x, y) = $.Set(GeomX, x).Set(GeomY, y)

 A user of the class could then easily create a new point with a constructor expression like `Point(3, 4)`.


### Functions

 _func_ := `#!/` _lowercase_

 A function allows a rule to delegate its work to the interpreter for performance. For example, `#!/sqrt` computes the square root of its argument. If your `Math` class contains the rule

    $.SquareRoot(x) = #!/sqrt

 then the expression `Math.SquareRoot(9)` will return `3`.

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
| `parsefloat(s)` | the number represented by `s`
| `parseint(s)` | the integer represented by `s`
| `parseint2(s, r)` | the integer represented by `s` with radix `r`
| `pow(x, y)` | `x` to the power `y`
| `round(x)` | `x` rounded to the nearest integer
| `sin(x)` | the sine of `x`
| `sqrt(x)` | the square root of `x`
| `tan(x)` | the tangent of `x`

[./number]: number.md
[./boolean]: boolean.md
[./string]: string.md
[./list]: list.md
[./map]: map.md
[./set]: set.md
[./undefined]: undefined.md

