[Back to Views](/src/support.documentation/websites/views)

# Date Formats

The built in string formatting library supports the numerous date formatting options. Each of these is covered below.

**Short Date**

Displays the date in a short format:

```
{
	"text" : "$(stringFormat('{0:d}', new Date()))" // 20/01/2020 UK, 1/20/2020 USA
}
```

**Long Date**

Displays the date in a longer format:

```
{
	"text" : "$(stringFormat('{0:D}', new Date()))" // Wednesday, January 1, 2020
}
```

**Full Date - Short Time**

Displays the full date with a short time:

```
{
	"text" : "$(stringFormat('{0:f}', new Date()))" // Wednesday, January 1, 2020 1:34 PM
}
```

**Full Date - Long Time**

Displays the full date with a long time;

```
{
	"text" : "$(stringFormat('{0:F}', new Date()))" // Wednesday, January 1, 2020 1:34:45 PM
}
```

**Year/Month**

Displays the dates month and year:

```
{
	"text" : "$(stringFormat('{0:Y}', new Date()))" // January 2020
}
```

**Day/Month**

Displays the dates day and month:

```
{
	"text" : "$(stringFormat('{0:M}', new Date()))" // January 1
}
```

**Universal Sortable**

Displays the date in a universally sortable format:

```
{
	"text" : "$(stringFormat('{0:u}', new Date()))" // 01-01-2020 13:34:45Z
}
```

**Short Time**

Displays the time in a short format:

```
{
	"text" : "$(stringFormat('{0:t}', new Date()))" // 1:34 PM
}
```

**Long Time**

Displays the time in a long format:

```
{
	"text" : "$(stringFormat('{0:T}', new Date()))" // 1:34:45 PM
}
```

**RFC1123**

Displays the date/time in the RFC1123 format:

```
{
	"text" : "$(stringFormat('{0:R}', new Date()))" // Wed, 1 Jan 2020 13:34:45
}
```

**General - short time**

Displays the date in a general format with the time in a short format:

```
{
	"text" : "$(stringFormat('{0:g}', new Date()))" // 20/01/2020 1:34 PM
}
```

**General - long time**

Displays the date in a general format with the time in a long format:

```
{
	"text" : "$(stringFormat('{0:G}', new Date()))" // 20/01/2020 1:34:45 PM
}
```