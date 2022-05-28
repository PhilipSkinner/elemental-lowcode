const
    sinon           = require('sinon'),
    blobInstance    = require('../../../src/service.blob/lib/blobInstance');

const filesystemProvider = {
    init            : () => {},
    getDetails      : () => {},
    get             : () => {},
    createFolder    : () => {},
    put             : () => {},
    delete          : () => {},
};

const tokenHandler = {
    passcodeCheck   : () => {},
    tokenCheck      : () => {}
};

const hostnameResolver = {
    resolveBlob : () => {},
};

const constructorTest = (done) => {
    const instance = blobInstance('config');

    expect(instance.filesystemProvider).not.toBe(undefined);
    expect(instance.filesystemProvider).not.toBe(null);
    expect(instance.tokenHandler).not.toBe(undefined);
    expect(instance.tokenHandler).not.toBe(null);
    expect(instance.hostnameResolver).not.toBe(undefined);
    expect(instance.hostnameResolver).not.toBe(null);

    done();
};

const initFilesystem = (done) => {
    const fsProviderMock = sinon.mock(filesystemProvider);
    fsProviderMock.expects('init').once().withArgs({
        mechanism : {
            type : 'filesystem'
        }
    }).returns(Promise.resolve());

    const instance = blobInstance({
        mechanism : {
            type : 'filesystem'
        }
    }, filesystemProvider, tokenHandler, hostnameResolver);

    instance.init().then(() => {
        fsProviderMock.verify();

        done();
    });
};

const initUnknown = (done) => {
    const instance = blobInstance({
        mechanism : {
            type : 'what?'
        }
    }, filesystemProvider, tokenHandler, hostnameResolver);

    instance.init().catch((err) => {
        expect(err).toEqual(new Error('Unknown storage mechanism configured'));

        done();
    });
};

const invalidPasscodeTest = (done) => {
    const tokenHandlerMock = sinon.mock(tokenHandler);
    tokenHandlerMock.expects('passcodeCheck').once().withArgs('http://blob.service/my-store/my-path', 'invalid-code').returns(Promise.resolve(false));

    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.service');

    const instance = blobInstance({
        name : 'my-store',
        mechanism : {
            type : 'filesystem'
        },
        security : {
            GET : {
                support_passcode : true
            }
        }
    }, filesystemProvider, tokenHandler, hostnameResolver);

    instance.handleRequest({
        method : 'GET',
        query : {
            code : 'invalid-code'
        },
        path : '/my-path'
    }, {
        status : (code) => {
            expect(code).toEqual(401);
        },
        end : () => {
            tokenHandlerMock.verify();
            hostnameMock.verify();

            done();
        }
    });
};

const validPasscodeTest = (done) => {
    const tokenHandlerMock = sinon.mock(tokenHandler);
    tokenHandlerMock.expects('passcodeCheck').once().withArgs('http://blob.service/my-store/my-path', 'invalid-code').returns(Promise.resolve(true));

    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').once().returns('http://blob.service');

    const instance = blobInstance({
        name : 'my-store',
        mechanism : {
            type : 'filesystem'
        },
        security : {
            WHAT : {
                support_passcode : true
            }
        }
    }, filesystemProvider, tokenHandler, hostnameResolver);

    instance.handleRequest({
        method : 'WHAT',
        query : {
            code : 'invalid-code'
        },
        path : '/my-path'
    }, {
        status : (code) => {
            expect(code).toEqual(400);
        },
        end : () => {
            tokenHandlerMock.verify();
            hostnameMock.verify();

            done();
        }
    });
};

const invalidTokenTest = (done) => {
    const tokenHandlerMock = sinon.mock(tokenHandler);
    tokenHandlerMock.expects('tokenCheck').once().callsArgWith(2, new Error('bad times'));

    const instance = blobInstance({
        name : 'my-store',
        mechanism : {
            type : 'filesystem'
        },
        security : {
            GET : {
                support_passcode : false,
                require_token : true
            }
        }
    }, filesystemProvider, tokenHandler, hostnameResolver);

    instance.handleRequest({
        method : 'GET',
        query : {
            code : 'invalid-code'
        },
        path : '/my-path'
    });

    setTimeout(() => {
        tokenHandlerMock.verify();

        done();
    }, 1);
};

const validTokenTest = (done) => {
    const tokenHandlerMock = sinon.mock(tokenHandler);
    tokenHandlerMock.expects('tokenCheck').once().callsArgWith(2, null);

    const instance = blobInstance({
        name : 'my-store',
        mechanism : {
            type : 'filesystem'
        },
        security : {
            WHAT : {
                support_passcode : false,
                require_token : true
            }
        }
    }, filesystemProvider, tokenHandler, hostnameResolver);

    instance.handleRequest({
        method : 'WHAT',
        query : {
            code : 'invalid-code'
        },
        path : '/my-path'
    }, {
        status : (code) => {
            expect(code).toEqual(400);
        },
        end : () => {
            tokenHandlerMock.verify();

            done();
        }
    });
};

const noAuthTest = (done) => {
    const instance = blobInstance({
        name : 'my-store',
        mechanism : {
            type : 'filesystem'
        },
        security : {
            WHAT : {
                support_passcode : false,
                require_token : false
            }
        }
    }, filesystemProvider, tokenHandler, hostnameResolver);

    instance.handleRequest({
        method : 'WHAT',
        query : {
            code : 'invalid-code'
        },
        path : '/my-path'
    }, {
        status : (code) => {
            expect(code).toEqual(400);
        },
        end : () => {
            done();
        }
    });
};

const exceptionTest = (done) => {
    const hostnameMock = sinon.mock(hostnameResolver);
    hostnameMock.expects('resolveBlob').throws(new Error('bad times'));

    const instance = blobInstance({
        name : 'my-store',
        mechanism : {
            type : 'filesystem'
        },
        security : {
            WHAT : {
                support_passcode : true,
                require_token : false
            }
        }
    }, filesystemProvider, tokenHandler, hostnameResolver);

    instance.handleRequest({
        method : 'WHAT',
        query : {
            code : 'invalid-code'
        },
        path : '/my-path'
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: bad times'
                ]
            })
        },
        end : () => {
            hostnameMock.verify();

            done();
        }
    });
};

const getDetails = (done) => {
    const fsProviderMock = sinon.mock(filesystemProvider);
    fsProviderMock.expects('getDetails').once().withArgs(sinon.match.any, '/my-path').returns(Promise.resolve({
        type : 'file'
    }));

    const instance = blobInstance({
        name : 'my-store',
        mechanism : {
            type : 'filesystem'
        },
        security : {
            GET : {
                support_passcode : false,
                require_token : false
            }
        }
    }, filesystemProvider, tokenHandler, hostnameResolver);
    instance.provider = filesystemProvider;

    instance.handleRequest({
        method : 'GET',
        query : {
            code : 'invalid-code'
        },
        path : '/my-path',
        headers : {
            accept : 'application/json'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        send : (data) => {
            expect(data).toEqual({
                type : 'file'
            });
        },
        end : () => {
            fsProviderMock.verify();

            done();
        }
    });
};

const getData = (done) => {
    const fsProviderMock = sinon.mock(filesystemProvider);
    fsProviderMock.expects('getDetails').once().withArgs(sinon.match.any, '/my-path').returns(Promise.resolve({
        type : 'file',
        mime_type : 'mime-type'
    }));
    fsProviderMock.expects('get').once().withArgs(sinon.match.any, '/my-path').returns(Promise.resolve('some-data'));

    const instance = blobInstance({
        name : 'my-store',
        mechanism : {
            type : 'filesystem'
        },
        security : {
            GET : {
                support_passcode : false,
                require_token : false
            }
        }
    }, filesystemProvider, tokenHandler, hostnameResolver);
    instance.provider = filesystemProvider;

    instance.handleRequest({
        method : 'GET',
        query : {
            code : 'invalid-code'
        },
        path : '/my-path',
        headers : {
            accept : 'application/octet-stream'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        header : (name, value) => {
            if (name === 'Content-type') {
                expect(value).toEqual('mime-type');
            }
        },
        send : (data) => {
            expect(data).toEqual('some-data');
        },
        end : () => {
            fsProviderMock.verify();

            done();
        }
    });
};

const getInlineData = (done) => {
    const fsProviderMock = sinon.mock(filesystemProvider);
    fsProviderMock.expects('getDetails').once().withArgs(sinon.match.any, '/my-path').returns(Promise.resolve({
        type : 'file',
        mime_type : 'mime-type'
    }));
    fsProviderMock.expects('get').once().withArgs(sinon.match.any, '/my-path').returns(Promise.resolve('some-data'));

    const instance = blobInstance({
        name : 'my-store',
        mechanism : {
            type : 'filesystem'
        },
        security : {
            GET : {
                support_passcode : false,
                require_token : false
            }
        }
    }, filesystemProvider, tokenHandler, hostnameResolver);
    instance.provider = filesystemProvider;

    instance.handleRequest({
        method : 'GET',
        query : {
            code : 'invalid-code',
            disposition : 'inline'
        },
        path : '/my-path',
        headers : {
            accept : 'application/octet-stream'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        header : (name, value) => {
            if (name === 'Content-type') {
                expect(value).toEqual('mime-type');
            }

            if (name === 'Content-Disposition') {
                expect(value).toEqual('inline');
            }
        },
        send : (data) => {
            expect(data).toEqual('some-data');
        },
        end : () => {
            fsProviderMock.verify();

            done();
        }
    });
};

const getAttachmentData = (done) => {
    const fsProviderMock = sinon.mock(filesystemProvider);
    fsProviderMock.expects('getDetails').once().withArgs(sinon.match.any, '/my-path').returns(Promise.resolve({
        type : 'file',
        mime_type : 'mime-type',
        name : 'my-name'
    }));
    fsProviderMock.expects('get').once().withArgs(sinon.match.any, '/my-path').returns(Promise.resolve('some-data'));

    const instance = blobInstance({
        name : 'my-store',
        mechanism : {
            type : 'filesystem'
        },
        security : {
            GET : {
                support_passcode : false,
                require_token : false
            }
        }
    }, filesystemProvider, tokenHandler, hostnameResolver);
    instance.provider = filesystemProvider;

    instance.handleRequest({
        method : 'GET',
        query : {
            code : 'invalid-code',
            disposition : 'attachment'
        },
        path : '/my-path',
        headers : {
            accept : 'application/octet-stream'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        header : (name, value) => {
            if (name === 'Content-type') {
                expect(value).toEqual('mime-type');
            }

            if (name === 'Content-Disposition') {
                expect(value).toEqual('attachment; filename=my-name');
            }
        },
        send : (data) => {
            expect(data).toEqual('some-data');
        },
        end : () => {
            fsProviderMock.verify();

            done();
        }
    });
};

const createFolderTest = (done) => {
    const fsProviderMock = sinon.mock(filesystemProvider);
    fsProviderMock.expects('createFolder').once().withArgs(sinon.match.any, '/my-path').returns(Promise.resolve());

    const instance = blobInstance({
        name : 'my-store',
        mechanism : {
            type : 'filesystem'
        },
        security : {
            POST : {
                support_passcode : false,
                require_token : false
            }
        }
    }, filesystemProvider, tokenHandler, hostnameResolver);
    instance.provider = filesystemProvider;

    instance.handleRequest({
        method : 'POST',
        query : {
            code : 'invalid-code',
            disposition : 'attachment'
        },
        path : '/my-path',
    }, {
        status : (code) => {
            expect(code).toEqual(201);
        },
        end : () => {
            fsProviderMock.verify();

            done();
        }
    });
};

const createFileTest = (done) => {
    const fsProviderMock = sinon.mock(filesystemProvider);
    fsProviderMock.expects('put').once().withArgs(sinon.match.any, '/my-path', 'some-data').returns(Promise.resolve());

    const instance = blobInstance({
        name : 'my-store',
        mechanism : {
            type : 'filesystem'
        },
        security : {
            POST : {
                support_passcode : false,
                require_token : false
            }
        }
    }, filesystemProvider, tokenHandler, hostnameResolver);
    instance.provider = filesystemProvider;

    instance.handleRequest({
        method : 'POST',
        query : {
            code : 'invalid-code',
            disposition : 'attachment'
        },
        path : '/my-path',
        files : {
            file : {
                data : 'some-data'
            }
        }
    }, {
        status : (code) => {
            expect(code).toEqual(201);
        },
        end : () => {
            fsProviderMock.verify();

            done();
        }
    });
};

const updateFileTest = (done) => {
    const fsProviderMock = sinon.mock(filesystemProvider);
    fsProviderMock.expects('put').once().withArgs(sinon.match.any, '/my-path', 'some-data').returns(Promise.resolve());

    const instance = blobInstance({
        name : 'my-store',
        mechanism : {
            type : 'filesystem'
        },
        security : {
            PUT : {
                support_passcode : false,
                require_token : false
            }
        }
    }, filesystemProvider, tokenHandler, hostnameResolver);
    instance.provider = filesystemProvider;

    instance.handleRequest({
        method : 'PUT',
        query : {
            code : 'invalid-code',
            disposition : 'attachment'
        },
        path : '/my-path',
        files : {
            file : {
                data : 'some-data'
            }
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            fsProviderMock.verify();

            done();
        }
    });
};

const deleteTest = (done) => {
    const fsProviderMock = sinon.mock(filesystemProvider);
    fsProviderMock.expects('delete').once().withArgs(sinon.match.any, '/my-path').returns(Promise.resolve());

    const instance = blobInstance({
        name : 'my-store',
        mechanism : {
            type : 'filesystem'
        },
        security : {
            DELETE : {
                support_passcode : false,
                require_token : false
            }
        }
    }, filesystemProvider, tokenHandler, hostnameResolver);
    instance.provider = filesystemProvider;

    instance.handleRequest({
        method : 'DELETE',
        query : {
            code : 'invalid-code',
            disposition : 'attachment'
        },
        path : '/my-path',
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            fsProviderMock.verify();

            done();
        }
    });
};

describe('A blob instance', () => {
    it('supports constructor defaulting', constructorTest);

    describe('init', () => {
        it('supports the filesystem provider', initFilesystem);
        it('detects unknown providers', initUnknown);
    });

    describe('handleRequest', () => {
        it('detects invalid passcodes', invalidPasscodeTest);
        it('detects valid passcodes', validPasscodeTest);
        it('detects invalid tokens', invalidTokenTest);
        it('detects valid tokens', validTokenTest);
        it('can skip all auth checks', noAuthTest);
        it('handles unknown exceptions', exceptionTest);

        it('handles get details requests', getDetails);
        it('handles get data requests', getData);
        it('handles inline content disposition', getInlineData);
        it('handles attachment content disposition', getAttachmentData);

        it('handles post requests for folders', createFolderTest);
        it('handles post requests for files', createFileTest);
        it('handles put requests for files', updateFileTest);

        it('handles delete requests', deleteTest);
    });
});