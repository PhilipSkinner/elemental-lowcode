[Back to Index](/src/support.documentation)

# Rulesets

Rulesets allow you to define a series of rules, which are evaluated upon your given input value - defined using JSON schema.

Each rule contains zero of more comparitors and a single output value. Each rule is evaluated in turn until all of the comparitors within a rule return true, at which point it returns that rules output value.

If no rule is triggered then a null value is returned.

### Fact Schema

The facts input into a ruleset are defined using JSON schema. The schema is defined within the *facts* property of the ruleset:

```
{
    "facts": {
        "type": "object",
        "properties": {
            "value": {
                "type": "string"
            }
        }
    }
}
```

To read more about JSON schema and how to define object structures with it, refer to the [JSON schema documentation](https://json-schema.org/).

### Rules

Each rule contains:

*   Zero or more comparitors
*   An output value

Rules are defined:

```
{
	"rules": [
        {
            "comparitors": [
                {
                    "input": "$.value",
                    "operator": "eq",
                    "value": "hello"
                }
            ],
            "output": true
        },
        {
            "comparitors": [],
            "output": false
        }
    ]
}
```

A rule with zero comparitors will always evaluate to true and return its output value.

The following comparitor operators are supported.

*   Equal - eq
*   Not Equal - ne
*   Contains - contains
*   Does not contain - does not contain
*   Greater than - gt
*   Greater than or equal to - gte
*   Less than - lt
*   Less than or equal to - lte
*   Is null - is null
*   Is not null - is not null

### Security

The `roles` section of the ruleset configuration allows you to define how authorization to execute the ruleset should be applied to incoming requests.

By default, each ruleset will only allow execution if an incoming token contains the following role claims:

*   `system_admin`
*   `system_exec`
*   `rules_exec`
*   `[ruleset_name]_exec`

Each ruleset can have its security configured to:

* Replace the existing roles with a new set of roles
* Append roles to the default set of roles
* Remove the need for any roles, accept any valid access token as authorization

Here is an example `roles` section:

```
{
    "roles" : {
        "replace" : {
            "exec" : true
        },
        "exec" : [
            "custom_role",
            "another_role"
        ],
        "needsRole" : {
            "exec" : true
        }
    }
}
```

#### Disabling security

It is possible to disable all security on a ruleset by setting the security mechanism to `none`:

```
{
    "security" : {
        "mechanism" : "none"
    }
}
```

If this value is anything other than `none` then the system will enforce the default RBAC authentication mechanism.