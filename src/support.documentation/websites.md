[Back to Index](/src/support.documentation)

# Websites

Websites allows you to build simple web applications.

Each website is constructed of:

*   [Routes](/src/support.documentation/websites/routes)
*   [Views](/src/support.documentation/websites/views)
*   [Controllers](/src/support.documentation/websites/controllers)
*   [Tags](/src/support.documentation/websites/tags)
*   [Session Storage](/src/support.documentation/websites/sessionStorage)

The websites (or interface) runtime hosts each website on a path that equals the websites name.

Eg. if your website is called "blog" then it will be hosted on the interface runtime on:

`http://interface.elementalsystem.org/blog`

The websites service is designed to allow for maximum template re-use and is designed to be server side first - allowing for progressive enhancement of your interface should you require it.