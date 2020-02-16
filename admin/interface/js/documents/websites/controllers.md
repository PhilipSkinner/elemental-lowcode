[Back to Websites](#/documentation/websites.md)

# Controllers

Controllers allow you to define the data behind your view and allows you to handle click & form submission events.

## View Bag

Your view data is held within your view bag:

```
module.exports = {
	bag : {
		text : 'Hello world'
	}
};
```

Variables can then be accessed within your views by using the following notation:

```
$.bag.text
```

To use this to inject some text into a span in your view:

```
{
	"tag" : "span",
	"text" : "This is the value : $.bag.text"
}
```

## Events

Events allow you to handle click & form submission events to update your view state:

```
module.exports = {
	bag : {},
	events : {
		load : (event) => {
			this.bag.text = 'Hello world';
		}
	}
}
```

There are a number of standard events that can be listened to:

* `load`
* `postback`

The `load` event is triggered whenever an instance of your controller is loaded and should be used to bootstrap your pages initial state. If you want your page to maintain a persistent state then the `sessionState` injectable should be used.

The `postback` event is triggered whenever a form submission is sent. At the moment, named form submission events are not supported.

Click based events are named within your views and so you simply need to create an event with the same name:

```
{
	"tag" : "span",
	"text" : "click me",
	"onclick" : {
		"eventName" : "mycustomevent"
	}
}
``` 

; would trigger an event named `mycustomevent` on your controller:

```
module.exports = {
	events : {
		mycustomevent : (event) => {
			console.log("Custom event fired!");
		}
	}
}
```

## Injectable Services

TBC once security is completed across the system, this doesn't work correctly until that is completed.

[Continue to Tags](#/documentation/websites--tags.md)