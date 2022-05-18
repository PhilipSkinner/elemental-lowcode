[Back to APIs](/src/support.documentation/apis)

# Routes

Each route consists of:

*   a path
*   a GET controller
*   a POST controller
*   security configuration

## Paths

Paths are used to match incoming HTTP requests and can use dynamic values. The following are all examples of valid paths:

*   `/`
*   `/books`
*   `/books/:id`
*   `/books/:id/reviews`

## Controllers

You can select a controller to use for each method (GET, POST) on a path - and you can use a controller for multiple paths/methods.

## Security

You can configure the following options for each path method:

*   Is a valid role required?
*   Replace the system generated roles
*   Extra roles to secure the endpoint with

The system will generate a standard list of roles based upon if the operation is a read or a write operation. These standard roles are defined below.

The `system_admin` role always allows access on any method endpoint.

**Read roles**

*   `system_admin`
*   `system_reader`
*   `api_reader`
*   `[api_name]_reader`

**Write roles**

*   `system_admin`
*   `system_writer`,
*   `api_writer`,
*   `[api_name]_writer`

Where the value `[api_name]` will be replaced with the name of your API.

[Continue to Controllers](/src/support.documentation/apis/controllers)