[Back to Index](/src/support.documentation)

# Node Modules

You can use the Node Module manager to install node modules into your services directory.

Only services should use these node modules.

To use one of the installed node modules use the require or import mechanism built into nodejs:

```
const leftpad = require("leftpad-sdk")

const myService = function() {

};

myService.prototype.hello = function() {
	return new Promise((resolve, reject) => {
	    leftpad("indeed", 20, "#", function(ret) {
	        return resolve(ret.body.str);
	    })
	})
};

module.exports = myService;
```

Once you have configured your list of dependencies you need to press the Install (green disk circle bottom right) button to get the system to install all of the dependencies.

The result of the installation will appear on your screen once it has completed.