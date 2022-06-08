const locationService = function(geoip) {
    this.geoip = geoip;
};

locationService.prototype.geographicDetails = function(ip) {
    return Promise.resolve(this.geoip.lookup(ip));
};

locationService.prototype.determineCountry = function(ip) {
    return this.geographicDetails(ip).then((details) => {
        return Promise.resolve(details && details.country ? details.country : null);
    });
};

locationService.prototype.determineRegion = function(ip) {
    return this.geographicDetails(ip).then((details) => {
        return Promise.resolve(details && details.region ? details.region : null);
    });
};

locationService.prototype.determineCity = function(ip) {
    return this.geographicDetails(ip).then((details) => {
        return Promise.resolve(details && details.city ? details.city : null);
    });
};

locationService.prototype.determineLatLon = function(ip) {
    return this.geographicDetails(ip).then((details) => {
        return Promise.resolve(details && details.ll ? {
            lat : details.ll[0],
            lon : details.ll[1]
        } : null);
    });
};

locationService.prototype.isFromEU = function(ip) {
    return this.geographicDetails(ip).then((details) => {
        return Promise.resolve(details && details.eu ? details.eu === "1" : null);
    });
};

locationService.prototype.determineTimezone = function(ip) {
    return this.geographicDetails(ip).then((details) => {
        return Promise.resolve(details && details.timezone ? details.timezone : null);
    });
};

module.exports = function(geoip) {
    if (!geoip) {
        geoip = require("geoip-lite");
    }

    return new locationService(geoip);
};