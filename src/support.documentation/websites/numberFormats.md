[Back to Views](/src/support.documentation/websites/views)

# Number Formats

The built in string formatting library supports the numerous number formatting options. Each of these is covered below.

**Currency**

Displays currency in the users locale (process.env.LANG):

```
{
	"text" : "$(stringFormat('{0:c}', 3.14))" // £3.14
}
```

You can specify the number of decimal places by postfixing the `c` character with a number:

```
{
	"text" : "$(stringFormat('{0:c4}', 3.14))" // £3.1400
}
```

**Fixed point**

Displays a number with a set number of decimal places:

```
{
	"text" : "$(stringFormat('{0:f4}', 1.23456))" // 1.2346
}
```

**Zero padded number**

Given a number, pad it with zeros so its a set length:

```
{
	"text" : "$(stringFormat('{0:d4}', 12))" // 0012
}
```

**Exponential**

Display the number as an exponential with a specified accuracy:

```
{
	"text" : "$(stringFormat('{0:e2}', -1052.0329112756))" // -1.05e+003
}
```

**General format**

Displays a number with a specified total length:


```
{
	"text" : "$(stringFormat('{0:G4}', 123.4546))" // 123.5
}
```

**Human natural**

Display a number with a thousands separator:

```
{
	"text" : "$(stringFormat('{0:N}', 1234567890))" // 1,234,567,890.00
}
```

**Percentage**

Display a number as a percentage:

```
{
	"text" : "$(stringFormat('{0:P}', 0.12))" // 12%
}
```

**Hexadecimal**

Display the number as a hexadecimal with a minimum length:

```
{
	"text" : "$(stringFormat('{0:x4}', 255))" // 00ff
}
```