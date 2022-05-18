const
    jasmine 			= require('jasmine'),
    hostnameResolver 	= require('../../src/support.lib/hostnameResolver');

const kernelDefaultTest = () => {
    const instance = hostnameResolver();

    process.env['KERNEL_HOST'] = null;

    expect(instance.resolveKernel()).toEqual('http://localhost:8001');
};

const kernelEnvTest = () => {
    const instance = hostnameResolver();

    process.env['KERNEL_HOST'] = 'kernel.com';

    expect(instance.resolveKernel()).toEqual('http://kernel.com');
};

const adminDefaultTest = () => {
    const instance = hostnameResolver();

    process.env['ADMIN_HOST'] = null;

    expect(instance.resolveAdmin()).toEqual('http://localhost:8002');
};

const adminEnvTest = () => {
    const instance = hostnameResolver();

    process.env['ADMIN_HOST'] = 'admin.com';

    expect(instance.resolveAdmin()).toEqual('http://admin.com');
};

const apiDefaultTest = () => {
    const instance = hostnameResolver();

    process.env['API_HOST'] = null;

    expect(instance.resolveAPI()).toEqual('http://localhost:8003');
};

const apiEnvTest = () => {
    const instance = hostnameResolver();

    process.env['API_HOST'] = 'api.com';

    expect(instance.resolveAPI()).toEqual('http://api.com');
};

const integrationDefaultTest = () => {
    const instance = hostnameResolver();

    process.env['INTEGRATION_HOST'] = null;

    expect(instance.resolveIntegration()).toEqual('http://localhost:8004');
};

const integrationEnvTest = () => {
    const instance = hostnameResolver();

    process.env['INTEGRATION_HOST'] = 'integration.com';

    expect(instance.resolveIntegration()).toEqual('http://integration.com');
};

const interfaceDefaultTest = () => {
    const instance = hostnameResolver();

    process.env['INTERFACE_HOST'] = null;

    expect(instance.resolveInterface()).toEqual('http://localhost:8005');
};

const interfaceEnvTest = () => {
    const instance = hostnameResolver();

    process.env['INTERFACE_HOST'] = 'interface.com';

    expect(instance.resolveInterface()).toEqual('http://interface.com');
};

const storageDefaultTest = () => {
    const instance = hostnameResolver();

    process.env['STORAGE_HOST'] = null;

    expect(instance.resolveStorage()).toEqual('http://localhost:8006');
};

const storageEnvTest = () => {
    const instance = hostnameResolver();

    process.env['STORAGE_HOST'] = 'storage.com';

    expect(instance.resolveStorage()).toEqual('http://storage.com');
};

const rulesDefaultTest = () => {
    const instance = hostnameResolver();

    process.env['RULES_HOST'] = null;

    expect(instance.resolveRules()).toEqual('http://localhost:8007');
};

const rulesEnvTest = () => {
    const instance = hostnameResolver();

    process.env['RULES_HOST'] = 'rules.com';

    expect(instance.resolveRules()).toEqual('http://rules.com');
};

const identityDefaultTest = () => {
    const instance = hostnameResolver();

    process.env['IDENTITY_HOST'] = null;

    expect(instance.resolveIdentity()).toEqual('http://localhost:8008');
};

const identityEnvTest = () => {
    const instance = hostnameResolver();

    process.env['IDENTITY_HOST'] = 'identity.com';

    expect(instance.resolveIdentity()).toEqual('http://identity.com');
};

const queueDefaultTest = () => {
    const instance = hostnameResolver();

    process.env['QUEUE_HOST'] = null;

    expect(instance.resolveQueue()).toEqual('http://localhost:8009');
};

const queueEnvTest = () => {
    const instance = hostnameResolver();

    process.env['QUEUE_HOST'] = 'queue.com';

    expect(instance.resolveQueue()).toEqual('http://queue.com');
};

describe('A hostname resolver', () => {
    describe('can resolve the kernel', () => {
        it('using defaults', kernelDefaultTest);
        it('using env vars', kernelEnvTest);
    });

    describe('can resolve the admin', () => {
        it('using defaults', adminDefaultTest);
        it('using env vars', adminEnvTest);
    });

    describe('can resolve the API service', () => {
        it('using defaults', apiDefaultTest);
        it('using env vars', apiEnvTest);
    });

    describe('can resolve the integration service', () => {
        it('using defaults', integrationDefaultTest);
        it('using env vars', integrationEnvTest);
    });

    describe('can resolve the interface service', () => {
        it('using defaults', interfaceDefaultTest);
        it('using env vars', interfaceEnvTest);
    });

    describe('can resolve the storage engine', () => {
        it('using defaults', storageDefaultTest);
        it('using env vars', storageEnvTest);
    });

    describe('can resolve the rules engine', () => {
        it('using defaults', rulesDefaultTest);
        it('using env vars', rulesEnvTest);
    });

    describe('can resolve the identity service', () => {
        it('using defaults', identityDefaultTest);
        it('using env vars', identityEnvTest);
    });

    describe('can resolve the queue service', () => {
        it('using defaults', queueDefaultTest);
        it('using env vars', queueEnvTest);
    });
});