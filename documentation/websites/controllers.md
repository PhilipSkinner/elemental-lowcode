[Back to Websites](/documentation/websites)

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

The `load` event is triggered whenever an instance of your controller is loaded and should be used to bootstrap your pages initial state. If you want your page to maintain a persistent state then the `sessionState` injectable should be used.

**Form submissions**

Form submission events are named within your views, and you create an event of that name in your controller:

```
{
	"tag" : "form",
	"submit" : {
		"eventName" : "addPet"
	}
}
```

; would trigger an event named `addPet` on your controller:

```
module.exports = {
	events : {
		addPet : (event) => {
			console.log("Form submission fired!");
		}
	}
};
```

If a submission does not specify an event name, the a default event named `postback` will be fired.

**Click events**

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

Events can either be synchronous, or if they are async they must return a promise. Once this promise has been resolved successfully the website will render the result:

```
module.exports = {
	events : {
		load : (event) => {
			return new Promise((resolve, reject) => {
				return resolve();
			});
		}
	}
}
```

## Services

The following services are automatically added into each controller:

* [authClientProvider](/documentation/services/authClientProvider)
* [idmService](/documentation/services/idmService)
* [integrationService](/documentation/services/integrationService)
* [navigationService](/documentation/websites/navigationService)
* [rulesetService](/documentation/services/rulesetService)
* [serviceProvider](/documentation/services/serviceProvider)
* [sessionState](/documentation/websites/sessionState)
* [storageService](/documentation/services/storageService)

Each of these are defined upon the controller instance as a property that can be access, for example:

```
module.exports = {
	events : {
		load : (event) => {
			let sessionData = this.sessionState.retrieveSession();
		}
	}
}
```

[Continue to Tags](/documentation/websites/tags)