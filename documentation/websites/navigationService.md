[Back to Controllers](/documentation/websites/controllers)

# Navigation Service

The navigation service allows you to redirect users to other routes/urls within your website controllers. This service provides the following methods:

*   navigateTo

These methods are covered in more detail below.

### navigateTo

Parameters:

*   `url` - string, the URL or path that you want to redirect the user to

Redirects the users client to the given URL.

This can be called from your controllers like so:

```
module.exports = {
	events : {
		load : (event) => {
			this.navigationService.navigateTo("/my/path");
		}
	}
};
```