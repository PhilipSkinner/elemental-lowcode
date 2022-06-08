const
    sinon           = require('sinon'),
    locationService = require('../../src/support.lib/locationService');

const geoip = {
    lookup : () => {}
};

const geographicDetailsTest = (done) => {
    const geoipMock = sinon.mock(geoip);
    geoipMock.expects('lookup').once().withArgs('my-ip').returns({
        hello : 'world'
    });

    const instance = locationService(geoip);

    instance.geographicDetails('my-ip').then((details) => {
        expect(details).toEqual({
            hello : 'world'
        });

        geoipMock.verify();

        done();
    });
};

const determineCountryNullTest = (done) => {
    const geoipMock = sinon.mock(geoip);
    geoipMock.expects('lookup').once().withArgs('my-ip').returns({});

    const instance = locationService(geoip);

    instance.determineCountry('my-ip').then((res) => {
        expect(res).toEqual(null);

        geoipMock.verify();

        done();
    });
};

const determineCountryTest = (done) => {
    const geoipMock = sinon.mock(geoip);
    geoipMock.expects('lookup').once().withArgs('my-ip').returns({
        country : 'my-result'
    });

    const instance = locationService(geoip);

    instance.determineCountry('my-ip').then((res) => {
        expect(res).toEqual('my-result');

        geoipMock.verify();

        done();
    });
};

const determineRegionNullTest = (done) => {
    const geoipMock = sinon.mock(geoip);
    geoipMock.expects('lookup').once().withArgs('my-ip').returns({});

    const instance = locationService(geoip);

    instance.determineRegion('my-ip').then((res) => {
        expect(res).toEqual(null);

        geoipMock.verify();

        done();
    });
};

const determineRegionTest = (done) => {
    const geoipMock = sinon.mock(geoip);
    geoipMock.expects('lookup').once().withArgs('my-ip').returns({
        region : 'my-result'
    });

    const instance = locationService(geoip);

    instance.determineRegion('my-ip').then((res) => {
        expect(res).toEqual('my-result');

        geoipMock.verify();

        done();
    });
};

const determineCityNullTest = (done) => {
    const geoipMock = sinon.mock(geoip);
    geoipMock.expects('lookup').once().withArgs('my-ip').returns({});

    const instance = locationService(geoip);

    instance.determineCity('my-ip').then((res) => {
        expect(res).toEqual(null);

        geoipMock.verify();

        done();
    });
};

const determineCityTest = (done) => {
    const geoipMock = sinon.mock(geoip);
    geoipMock.expects('lookup').once().withArgs('my-ip').returns({
        city : 'my-result'
    });

    const instance = locationService(geoip);

    instance.determineCity('my-ip').then((res) => {
        expect(res).toEqual('my-result');

        geoipMock.verify();

        done();
    });
};

const determineLatLonNullTest = (done) => {
    const geoipMock = sinon.mock(geoip);
    geoipMock.expects('lookup').once().withArgs('my-ip').returns({});

    const instance = locationService(geoip);

    instance.determineLatLon('my-ip').then((res) => {
        expect(res).toEqual(null);

        geoipMock.verify();

        done();
    });
};

const determineLatLonTest = (done) => {
    const geoipMock = sinon.mock(geoip);
    geoipMock.expects('lookup').once().withArgs('my-ip').returns({
        ll : ['lat', 'lon']
    });

    const instance = locationService(geoip);

    instance.determineLatLon('my-ip').then((res) => {
        expect(res).toEqual({
            lat : 'lat',
            lon : 'lon'
        });

        geoipMock.verify();

        done();
    });
};

const determineIsFromEUNullTest = (done) => {
    const geoipMock = sinon.mock(geoip);
    geoipMock.expects('lookup').once().withArgs('my-ip').returns({});

    const instance = locationService(geoip);

    instance.isFromEU('my-ip').then((res) => {
        expect(res).toEqual(null);

        geoipMock.verify();

        done();
    });
};

const determineIsFromEUFalseTest = (done) => {
    const geoipMock = sinon.mock(geoip);
    geoipMock.expects('lookup').once().withArgs('my-ip').returns({
        eu : '0'
    });

    const instance = locationService(geoip);

    instance.isFromEU('my-ip').then((res) => {
        expect(res).toEqual(false);

        geoipMock.verify();

        done();
    });
};

const determineEUTest = (done) => {
    const geoipMock = sinon.mock(geoip);
    geoipMock.expects('lookup').once().withArgs('my-ip').returns({
        eu : '1'
    });

    const instance = locationService(geoip);

    instance.isFromEU('my-ip').then((res) => {
        expect(res).toEqual(true);

        geoipMock.verify();

        done();
    });
};

const determineTimezoneNullTest = (done) => {
    const geoipMock = sinon.mock(geoip);
    geoipMock.expects('lookup').once().withArgs('my-ip').returns({});

    const instance = locationService(geoip);

    instance.determineTimezone('my-ip').then((res) => {
        expect(res).toEqual(null);

        geoipMock.verify();

        done();
    });
};

const determineTimezoneTest = (done) => {
    const geoipMock = sinon.mock(geoip);
    geoipMock.expects('lookup').once().withArgs('my-ip').returns({
        timezone : 'my-result'
    });

    const instance = locationService(geoip);

    instance.determineTimezone('my-ip').then((res) => {
        expect(res).toEqual('my-result');

        geoipMock.verify();

        done();
    });
};

describe('Location service', () => {
    describe('geographicDetails', () => {
        it('works', geographicDetailsTest);
    });

    describe('determineCountry', () => {
        it('handles null responses', determineCountryNullTest);
        it('works', determineCountryTest);
    });

    describe('determineRegion', () => {
        it('handles null responses', determineRegionNullTest);
        it('works', determineRegionTest);
    });

    describe('determineCity', () => {
        it('handles null responses', determineCityNullTest);
        it('works', determineCityTest);
    });

    describe('determineLatLon', () => {
        it('handles null responses', determineLatLonNullTest);
        it('works', determineLatLonTest);
    });

    describe('isFromEU', () => {
        it('handles null responses', determineIsFromEUNullTest);
        it('handles 0 responses', determineIsFromEUFalseTest);
        it('works', determineEUTest);
    });

    describe('determineTimezone', () => {
        it('handles null responses', determineTimezoneNullTest);
        it('works', determineTimezoneTest);
    });
});