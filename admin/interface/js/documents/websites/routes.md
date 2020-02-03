[Back to Websites](#/documentation/websites.md)

# Routes

Each route has:

* A path
* A view
* A controller

## Paths

Paths are used to match incoming HTTP requests and can be used to match dynamic values. Examples of valid paths are:

* `/`
* `/posts`
* `/posts/:id`
* `/posts/:id/comments`

If a / path is not defined then your website will not host a page on its default route.