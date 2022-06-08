[Back to Services](/src/support.documentation/services)

# Location Service

The location service provides methods that allow you to determine geographic information about a user. It supports the following methods:

* geographicDetails
* determineCountry
* determineRegion
* determineCity
* determineLatLon
* determineTimezone
* isFromEU

These methods are covered in more detail below.

### geographicDetails

Parameters:

*   `ip` - the ipv4/ipv6 to query for geographic details

Looks up the geographic details for the given IP address. This method is async.

If no details can be found for the IP then this method will resolve a null value.

This can be called from your controllers like so:

```
module.exports = {
    events : {
        load : async function(event) {
            this.bag.details = await this.locationService.geographicDetails(this.context.client.ip);
        }
    }
};
```

### determineCountry

Parameters:

*   `ip` - the ipv4/ipv6 to determine the country for

Looks up the country for the given IP address. This method is async.

If a country cannot be found for the IP then this method will resolve a null value.

This can be called from your controllers like so:

```
module.exports = {
    events : {
        load : async function(event) {
            this.bag.country = await this.locationService.determineCountry(this.context.client.ip);
        }
    }
};
```

### determineRegion

Parameters:

*   `ip` - the ipv4/ipv6 to determine the region for

Looks up the region for the given IP address. This method is async.

If a region cannot be found for the IP then this method will resolve a null value.

This can be called from your controllers like so:

```
module.exports = {
    events : {
        load : async function(event) {
            this.bag.region = await this.locationService.determineRegion(this.context.client.ip);
        }
    }
};
```

### determineCity

Parameters:

*   `ip` - the ipv4/ipv6 to determine the city for

Looks up the city for the given IP address. This method is async.

If a city cannot be found for the IP then this method will resolve a null value.

This can be called from your controllers like so:

```
module.exports = {
    events : {
        load : async function(event) {
            this.bag.city = await this.locationService.determineCity(this.context.client.ip);
        }
    }
};
```

### determineLatLon

Parameters:

*   `ip` - the ipv4/ipv6 to determine the latitude/longitude for

Looks up the lat/lon for the given IP address. This method is async.

If a lat/lon cannot be determined the IP then this method will resolve a null value.

This can be called from your controllers like so:

```
module.exports = {
    events : {
        load : async function(event) {
            this.bag.latlon = await this.locationService.determineLatLon(this.context.client.ip);

            console.log(this.bag.latlon) // outputs : { "lat" : 12.345, "lon" : 12.234 }
        }
    }
};
```

### determineTimezone

Parameters:

*   `ip` - the ipv4/ipv6 to determine the timezone for

Looks up the timezone for the given IP address. This method is async.

If a timezone cannot be determined the IP then this method will resolve a null value.

This can be called from your controllers like so:

```
module.exports = {
    events : {
        load : async function(event) {
            this.bag.timezone = await this.locationService.determineTimezone(this.context.client.ip);
        }
    }
};
```

### isFromEU

Parameters:

*   `ip` - the ipv4/ipv6 to check

Determines if the IP address is within the EU (or another GDPR compliant country). This method is async.

If this cannot be determined for the IP address then this method will resolve a null value.

This can be called from your controllers like so:

```
module.exports = {
    events : {
        load : async function(event) {
            this.bag.fromEU = await this.locationService.isFromEU(this.context.client.ip);
        }
    }
};
```