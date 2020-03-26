[Back to Websites](#/documentation/websites.md)

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

## Standard Tag Object Properties

The following properties are special - any other properties are used to render attributes on the DOM element (e.g. class can be used to specify css classes, id for the id of an element).

**tag** - *required*

This is the tag that is to be used to render the element within the DOM. This can be any valid HTML tag or [custom tag](#/documentation/websites--tags.md).

This property is required.

**children**

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

**text**

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

**repeat**

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

**if**

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

**onclick**

Configures an event which is fired and handled by the relevant controller:

```
{
	"tag" : "span",
	"text" : "Increment value : $.bag.value",
	"onclick" : {
		"eventName" : "increment",
		"params" : {
			"currentValue" : "$.bag.value"
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

**submit**

Can be attached to form tag objects and allows for events to be triggered back to the controller on submission. See the bind section below for more information on how to use this to retrieve values.

**bind**

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

[Continue to Controllers](#/documentation/websites--controllers.md)