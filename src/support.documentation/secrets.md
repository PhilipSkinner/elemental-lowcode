[Back to Index](/documentation)

# Secrets

Elemental supports the ability to define secrets outside of your applications, then to reference then within them.

These secrets are stored within each elemental instance - and are stored outside of your applications configuration directory - which allows you
to keep them separate from version control.

Secrets can be globally scoped, or can be scoped for a specific application:

*   Identity
*   Integrations
*   APIs
*   Messaging
*   Data
*   Websites
*   Rulesets

Secrets are automatically resolved within the system wherever the config requires a confidental value:

*   Data type connection strings
*   Identity storage connection strings
*   Message queue connection strings

In each of these places you can use the `$.secret.name` syntax to resolve the secrets value at runtime.

The [environment service](/src/support.documentation/services/environmentService) provides a mechanism for accessing these values from within your code.

*Note:* When a secret is updated all systems are restarted to refresh it within them.