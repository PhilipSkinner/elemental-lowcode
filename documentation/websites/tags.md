[Back to Websites](/documentation/websites)

# Custom Tags

Custom tags allow you to define re-usable partial templates & wrappers for use within your applications.

Variables can be passed into these custom tags allowing you to define standard sections or to wrap your tag objects in a standard structure.

## Examples

The easiest way to understand how to use custom tags is to look at some examples.

### Menu

We can construct a menu using two custom tags, a `menu` tag and a `menuItem` tag.

**menuItem**

This is the definition for our `menuItem` tag:

```
{
	"tag" : "div",
	"class" : "menu-item",
	"children" : [
		{
			"tag" : "a",
			"href" : "$.link",
			"text" : "$.linkText"
		}
	]
}
```

**menu**

This is the definition for our `menu` tag:

```
{
	"tag" : "div",
	"class" : "menu",
	"children" : "$.menuItems"
}
```

**using the menu**

We can now use these tags to quickly and easily create a menu:

```
{
	"tag" : "menu",
	"menuItems" : [
		{
			"tag" : "menuItem",
			"link" : "/page1",
			"linkText" : "Page 1"
		},
		{
			"tag" : "menuItem",
			"link" : "/page2",
			"linkText" : "Page 2"
		}
	]
}
```

### Wrapper with header & footer

We can construct a standard `wrapper` tag for all of our pages, using our previously configured `menu` and `menuItem` tags:

```
{
	"tag" : "html",
	"children" : [
		{
			"tag" : "head",
			"children" : [
				{
					"tag" : "title",
					"text" : "$.pageTitle"
				}
			]
		},
		{
			"tag" : "body",
			"children" : [
				{
					"tag" : "header",
					"children" : [
						{
							"tag" : "menu",
							"menuItems" : [
								{
									"tag" : "menuItem",
									"link" : "/page1",
									"linkText" : "Page 1"
								},
								{
									"tag" : "menuItem",
									"link" : "/page2",
									"linkText" : "Page 2"
								}
							]
						}
					]
				},
				{
					"tag" : "div",
					"class" : "main-content",
					"children" : "$.pageContent"
				},
				{
					"tag" : "footer",
					"children" : [
						{
							"tag" : "small",
							"text" : "Copyright &copy; Elemental"
						}
					]
				}
			]
		}
	]
}
```

We can then use this wrapper to define all of our pages:

```
{
	"tag" : "wrapper",
	"pageTitle" : "Page 1",
	"pageContent" : [
		{
			"tag" : "h1",
			"text" : "Welcome to Page 1"
		}
	]
}
```