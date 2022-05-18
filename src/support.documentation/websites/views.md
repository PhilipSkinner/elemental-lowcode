[Back to Websites](/documentation/websites)

# Views

A view is a template in the form of a JSON document:

```
{
	"tag" : "html",
	"children" : [
		{
			"tag" : "body",
			"children" : [
				{
					"tag" : "h1",
					"text" : "Hello world!"
				}
			]
		}
	]
}
```

Each view is a single parent **tag objects** which then defines its child tag object. Custom tags can be defined and can be used to construct re-usable partial templates or wrapper templates.

## Controller Variables

Variables are held within the `bag` of a controller, and can be accessed anywhere within your views using the `$.bag` variable:

```
module.exports = function() {
	bag : {
		hello : "world"
	}
};
```
; with view:

```
{
	"tag" : "b",
	"text" : "$.bag.hello"
}
```

You can use multiple variables in a property:

```
module.exports = function() {
	bag : {
		first : "first",
		second : "second"
	}
};
```

; and view:

```
{
	"tag" : "span",
	"text" : "The value of $.bag.first is not $.bag.second"
}
```

Variables that are passed into custom tags are accessed via the `$.` path instead of `$.bag`:

```
{
	"tag" : "myCustomTag",
	"isVisible" : true
}
```

; with `myCustomTag` defined as:

```
{
	"tag" : "div",
	"if" : [
		{
			"statement" : "$.isVisible",
			"logicalOperator" : "and"
		}
	]
}
```

Any user input that appears to look like a variable is automatically escaped by the system.

## Environmental Variables

In the same way you can access values via `$.bag`, you can access environmental variables via `$.env`:

```
{
	"tag" : "span",
	"text" : "The language of the system is $.env.LANG"
}
```

## Functions

You can evaluate functions within a view property by using `$(...)` to wrap your function:

```
{
	"tag" : "body",
	"class" : "website-body $('$.bag.page' === 'home' ? 'website-body--home' : '')"
}
```

If a function references a variable and that variable is a string, it must be wrapped in quotes - or it will be directly interpretted:

```
module.exports = function() {
	bag : {
		value : "true ? 'its true' : 'false'"
	}
};
```

; and value is referenced as:

```
{
	"tag" : "body",
	"text" : "$($.bag.value)"
}
```

Any user input that appears to look like a function (wrapped in `$(...)`) is automatically escaped by the system.

## String formatting

Functions can access the [elemental-string-format](https://github.com/PhilipSkinner/string-format) string formatter:

```
{
	"tag" : "span",
	"class" : "current-date",
	"text" : "$('Welcome back {0}! You have {1} new messages.', '$.bag.name', $.bag.newMessages)"
}
```

; or:

```
{
	"tag" : "span",
	"class" : "current-date",
	"text" : "$('{0:D}', new Date())"
}
```

All available formats can be found on the [number formats](/documentation/websites/numberFormats) and [date formats](/documentation/websites/dateFormats) documentation pages.

## Standard Tag Object Properties

The following properties are special - any other properties are used to render attributes on the DOM element (e.g. class can be used to specify css classes, id for the id of an element).

### tag - *required*

This is the tag that is to be used to render the element within the DOM. This can be any valid HTML tag or [custom tag](/documentation/websites/tags).

This property is required.

### children

An array of child tag objects - each of these will be rendered within the parent tag, for example:

```
{
	"tag" : "div",
	"class" : "block",
	"children" : [
		{
			"tag" : "p",
			"text" : "This is my first paragraph."
		},
		{
			"tag" : "p",
			"text" : "This is my second paragraph."
		}
	]
}
```

; would output the following HTML:

```
<div class="block">
	<p>
		This is my first paragraph.
	</p>
	<p>
		This is my second paragraph.
	</p>
</div>
```

### text

This is the textual content to be added into the tag. Simple strings or arrays of strings are supported:

```
{
	"tag" : "div",
	"class" : "block",
	"children" : [
		{
			"tag" : "p",
			"text" : "This is my first paragraph."
		},
		{
			"tag" : "p",
			"text" : [
				"This is my second paragraph.",
				"With a second sentence."
			]
		}
	]
}
```

; would output the following HTML:

```
<div class="block">
	<p>
		This is my first paragraph.
	</p>
	<p>
		This is my second paragraph. With a second sentence.
	</p>
</div>
```

### repeat

Allows you to define a loop for repeating a tag - including its children:

```
{
	"tag" : "select",
	"children" : [
		{
			"tag" : "option",
			"repeat" : "$.option in $.bag.options",
			"value" : "$.option.value",
			"text" : "$.option.name"
		}
	]
}
```

### if

Allows for a series of conditionals to be combined to determine if this tag (and its children) are included in the rendered output:

```
{
	"tag" : "p",
	"text" : "An error occurred",
	"if" : [
		{
			"statement" : "$.bag.validationError",
			"logicalOperator" : "and"
		},
		{
			"statement" : "$.bag.insertionError",
			"logicalOperator" : "or"
		}
	]
}
```

; will include the tag object in the output if either `$.bag.validationError` or `$.bag.insertionError` evaluate to a truthy value.

### onclick

Configures an event which is fired and handled by the relevant controller:

```
{
	"tag" : "span",
	"text" : "Increment value : $.bag.value",
	"onclick" : {
		"eventName" : "increment",
		"params" : {
			"currentValue" : "$.bag.value",
			"an" : {
				"object" : {
					"with" : "a scalar",
					"and" : [
						"an",
						"array",
						"of",
						{
							"lots_of" : "stuff"
						}
					]
				}
			}
		}
	}
}
```

; would output:

```
<a href="?event=increment&currentValue=1"><span>Increment value</span></a>
```

; which can then be handled within the controller:

```
module.exports = {
	bag : {
		value : 0
	},
	events : {
		load : function(event) {
			var state = this.sessionState.retrieveSession();

			if (state) {
				this.bag.value = state.value;
			}
		},
		increment : function(event) {
			this.bag.value = event.currentValue + 1;

			this.sessionState.saveSession(this.bag);
		}
	}
};
```

The parameters collection within the event can contain hard coded values or values passed into the template from repeating groups, template includes or bag values.

### submit

Can be attached to form tag objects and allows for events to be triggered back to the controller on submission. See the bind section below for more information on how to use this to retrieve values. Submission events can be turned into pollers - see the polling section below.

### bind

Binds an input field to a particular bag value:

```
{
    "tag": "html",
    "children": [
        {
            "tag": "head",
            "children": []
        },
        {
            "tag": "body",
            "children": [
                {
                    "tag": "span",
                    "text": "Increment value : $.bag.value",
                    "onclick": {
                        "eventName": "increment"
                    }
                },
                {
                    "tag": "form",
                    "submit": {
                        "eventName": "submit"
                    },
                    "children": [
                        {
                            "tag": "input",
                            "bind": "$.bag.value"
                        },
                        {
                            "tag" : "button",
                            "type" : "submit",
                            "text" : "set value"
                        }
                    ]
                }
            ]
        }
    ]
}
```

; and the following controller:

```
module.exports = {
	bag : {
		value : 0
	},
	events : {
		load : function(event) {
			var state = this.sessionState.retrieveSession();

			if (state && state.value) {
				this.bag.value = state.value;
			} else {
			    this.bag.value = 0;
			}
		},
		submit : function(event) {
		    Object.assign(this.bag, event.bag);
		    this.sessionState.saveSession(this.bag);
		},
		increment : function(event) {
			this.bag.value++;

			this.sessionState.saveSession(this.bag);
		}
	}
};
```

; shows a combination of using both a click based event and a form based submission to modify shared data - aswell as persisting this data within the users session.

## Polling

If you need to update your interface to reflect new state from your controller you can create a poller.

You can create pollers from any event by adding polling configuration onto the event:

```
{
    "tag": "html",
    "children": [
        {
            "tag": "head",
            "children": []
        },
        {
            "tag": "body",
            "children": [
                {
                    "tag": "div",
                    "text": "$.bag.counter"
                },
                {
                    "tag": "form",
                    "submit": {
                        "eventName": "poll",
                        "poll": {
                            "every": 500
                        }
                    },
                    "children": [
                        {
                            "tag": "input",
                            "type": "hidden",
                            "bind": "$.bag.counter"
                        }
                    ]
                }
            ]
        }
    ]
}
```

; and controller:

```
module.exports = {
    bag : {
        counter : 0
    },
	events : {
		load : function(event) {},
		poll : function(event) {
		    this.bag.counter = event.bag.counter;
		    this.bag.counter++;
		}
	}
}
```

[Continue to Controllers](/documentation/websites/controllers)