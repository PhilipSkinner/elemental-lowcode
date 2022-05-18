const
    sinon 			= require('sinon'),
    controller 		= require('../../../src/service.kernel/controllers/websitesController');

const app = {
    get : () => {},
    post : () => {},
    put : () => {},
    delete : () => {},
    patch : () => {}
};

const fileLister = {
    executeGlob : () => {},
    readJSONFile : () => {},
    readFile : () => {},
    writeFile : () => {},
    deleteFile : () => {},
};

const roleCheckHandler = {
    enforceRoles : () => {}
};

const path = {
    join : () => {}
};

const constructorTest = (done) => {
    const instance = controller();
    expect(instance.fileLister).not.toBe(null);
    expect(instance.path).not.toBe(null);
    expect(instance.roleCheckHandler).not.toBe(null);
    done();
};

const getWebsitesGlobExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', '*.website.json').returns('search-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-path').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.get({}, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oops'
                ]
            });
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const getWebsitesTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', '*.website.json').returns('search-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-path').returns(Promise.resolve([{
        name : 'this is my name.website'
    }]));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.get({}, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual([{
                name : 'this is my name'
            }]);
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const getWebsiteSingularReadErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'my-name.website.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.getWebsite({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oops'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const getWebsiteSingularTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'my-name.website.json').returns(Promise.resolve('some-content'));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.getWebsite({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual('some-content');
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const updateWebsiteFileWriteErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.website.json').returns(Promise.reject(new Error('really not good')));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.updateWebsite({
        body : {
            payload : 'the-body'
        },
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: really not good'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const updateWebsiteTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-name.website.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.updateWebsite({
        body : {
            payload : 'the-body'
        },
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const deleteWebsiteErrorTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('my-dir', 'my-name.website.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.deleteWebsite({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oops'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const deleteWebsiteTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('my-dir', 'my-name.website.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.deleteWebsite({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

/* RESOURCES */

const getResourceExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readFile').once().withArgs('my-dir', 'my-resource').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.getResource({
        query : {
            path : 'my-resource'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oops'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const getResourceTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readFile').once().withArgs('my-dir', 'my-resource').returns(Promise.resolve('some-content'));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.getResource({
        query : {
            path : 'my-resource'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        send : (data) => {
            expect(data).toEqual('some-content');
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const createOrUpdateResourceExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-resource', 'the-body').returns(Promise.reject(new Error('really not good')));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.createOrUpdateResource({
        body : {
            resource : 'the-body'
        },
        query : {
            path : 'my-resource'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: really not good'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const createOrUpdateTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'my-resource', 'the-body').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.createOrUpdateResource({
        body : {
            resource : 'the-body'
        },
        query : {
            path : 'my-resource'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

/* STATIC RESOURCES */

const uploadStaticResourceExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'my-site-static').returns('my-new-dir');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-new-dir', 'my-image.png', Buffer.from('the-body', 'base64')).returns(Promise.reject(new Error('really not good')));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.uploadStaticFile({
        params : {
            name : 'my-site'
        },
        body : {
            name : 'my-image.png',
            file : 'the-body'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: really not good'
                ]
            });
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const uploadStaticResourceTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'my-site-static').returns('my-new-dir');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-new-dir', 'my-image.png', Buffer.from('the-body', 'base64')).returns(Promise.resolve());

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.uploadStaticFile({
        params : {
            name : 'my-site'
        },
        body : {
            name : 'my-image.png',
            file : 'the-body'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const getStaticResourcesGlobExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'my-site-static/**/*').returns('search-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-path').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.getStaticFiles({
        params : {
            name : 'my-site'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oops'
                ]
            });
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const getStaticResourcesTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'my-site-static/**/*').returns('search-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-path').returns(Promise.resolve([{
        basename : 'my-resource.png'
    }]));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.getStaticFiles({
        params : {
            name : 'my-site'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual([{
                basename : 'my-resource.png',
                absolutePath : '/my-site/static/my-resource.png'
            }]);
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const deleteStaticResourceExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-site-static', 'my-image.png').returns('the-resource');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('my-dir', 'the-resource').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.deleteStaticFile({
        params : {
            name : 'my-site',
            filename : 'my-image.png'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oops'
                ]
            });
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const deleteStaticResourceTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-site-static', 'my-image.png').returns('the-resource');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('my-dir', 'the-resource').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.deleteStaticFile({
        params : {
            name : 'my-site',
            filename : 'my-image.png'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

/* TAGSETS */

const getTagsetsExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'tagsets/**/*.json').returns('search-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-path').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.getTagsets({}, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oops'
                ]
            });
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const getTagsetsTest = (done) => {
        const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'tagsets/**/*.json').returns('search-path');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('executeGlob').once().withArgs('search-path').returns(Promise.resolve(['something']));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.getTagsets({}, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual(['something']);
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const getPossibleExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readFile').twice().returns(Promise.reject(new Error('oh noes')));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.getPossibleTags({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oh noes'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const getPossibleFallbackTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, '../resources/tagsets').returns('the-dir');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readFile').once().withArgs('the-dir', 'my-name.json').returns(Promise.reject(new Error('oh noes')));
    fileMock.expects('readFile').once().withArgs('my-dir', 'tagsets/my-name.json').returns(Promise.resolve('some-data'));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.getPossibleTags({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        send : (data) => {
            expect(data).toEqual('some-data');
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const getPossibleTest = (done) => {
        const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, '../resources/tagsets').returns('the-dir');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readFile').once().withArgs('the-dir', 'my-name.json').returns(Promise.resolve('some-data'));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.getPossibleTags({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        send : (data) => {
            expect(data).toEqual('some-data');
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const saveTagsetExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'tagsets').returns('my-new-dir');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-new-dir', 'my-tagset.json', '"the-body"').returns(Promise.reject(new Error('really not good')));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.saveTagset({
        body : 'the-body',
        params : {
            name : 'my-tagset'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: really not good'
                ]
            });
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const saveTagsetTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'tagsets').returns('my-new-dir');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-new-dir', 'my-tagset.json', '"the-body"').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.saveTagset({
        body : 'the-body',
        params : {
            name : 'my-tagset'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const deleteTagsetExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'tagsets').returns('my-new-dir');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('my-new-dir', 'my-tagset.json').returns(Promise.reject(new Error('oops')));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.deleteTagset({
        params : {
            name : 'my-tagset',
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oops'
                ]
            });
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const deleteTagsetTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs('my-dir', 'tagsets').returns('my-new-dir');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('deleteFile').once().withArgs('my-new-dir', 'my-tagset.json').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.deleteTagset({
        params : {
            name : 'my-tagset',
        }
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const getPropertiesExceptionTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, '../resources/properties').returns('the-dir');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readFile').once().withArgs('the-dir', 'my-name.json').returns(Promise.reject(new Error('oh noes')));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.getProperties({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: oh noes'
                ]
            });
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

const getPropertiesTest = (done) => {
    const pathMock = sinon.mock(path);
    pathMock.expects('join').once().withArgs(sinon.match.any, '../resources/properties').returns('the-dir');

    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readFile').once().withArgs('the-dir', 'my-name.json').returns(Promise.resolve('some-data'));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.getProperties({
        params : {
            name : 'my-name'
        }
    }, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        send : (data) => {
            expect(data).toEqual('some-data');
        },
        end : () => {
            pathMock.verify();
            fileMock.verify();

            done();
        }
    });
};

/* CONFIG */

const getConfigExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'main.json').returns(Promise.reject(new Error('oh noes')));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.getConfig({}, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual({});
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const getConfigTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('readJSONFile').once().withArgs('my-dir', 'main.json').returns(Promise.resolve('some-config'));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.getConfig({}, {
        status : (code) => {
            expect(code).toEqual(200);
        },
        json : (data) => {
            expect(data).toEqual('some-config');
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const saveConfigExceptionTest = (done) => {
    const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'main.json', '"the-body"').returns(Promise.reject(new Error('bad times')));

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.saveConfig({
        body : 'the-body'
    }, {
        status : (code) => {
            expect(code).toEqual(500);
        },
        json : (data) => {
            expect(data).toEqual({
                errors : [
                    'Error: bad times'
                ]
            });
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};

const saveConfigTest = (done) => {
        const fileMock = sinon.mock(fileLister);
    fileMock.expects('writeFile').once().withArgs('my-dir', 'main.json', '"the-body"').returns(Promise.resolve());

    const instance = controller(app, 'my-dir', path, fileLister, roleCheckHandler);

    instance.saveConfig({
        body : 'the-body'
    }, {
        status : (code) => {
            expect(code).toEqual(204);
        },
        end : () => {
            fileMock.verify();

            done();
        }
    });
};


describe('A websites controller', () => {
    it('defaults its constructor arguments', constructorTest);

    describe('websites', () => {
        describe('get', () => {
            it('handles glob exceptions', getWebsitesGlobExceptionTest);
            it('works', getWebsitesTest);
        });

        describe('get singular', () => {
            it('handles read errors', getWebsiteSingularReadErrorTest);
            it('works', getWebsiteSingularTest);
        });

        describe('update', () => {
            it('handles file write errors', updateWebsiteFileWriteErrorTest);
            it('works', updateWebsiteTest);
        });

        describe('delete', () => {
            it('handles deletion errors', deleteWebsiteErrorTest);
            it('works', deleteWebsiteTest);
        });

        describe('resources', () => {
            describe('get', () => {
                it('handles read exceptions', getResourceExceptionTest);
                it('works', getResourceTest);
            });

            describe('create or update', () => {
                it('handles write exceptions', createOrUpdateResourceExceptionTest);
                it('works', createOrUpdateTest);
            });
        });

        describe('static resources', () => {
            describe('upload', () => {
                it('handles write exceptions', uploadStaticResourceExceptionTest);
                it('works', uploadStaticResourceTest);
            });

            describe('get', () => {
                it('handles glob exceptions', getStaticResourcesGlobExceptionTest);
                it('works', getStaticResourcesTest);
            });

            describe('delete', () => {
                it('handles deletion exceptions', deleteStaticResourceExceptionTest);
                it('works', deleteStaticResourceTest);
            });
        });
    });

    describe('tag sets', () => {
        describe('get', () => {
            it('handles exceptions', getTagsetsExceptionTest);
            it('works', getTagsetsTest);
        });

        describe('get possible', () => {
            it('handles exceptions', getPossibleExceptionTest);
            it('handles fallbacks', getPossibleFallbackTest);
            it('works', getPossibleTest);
        });

        describe('save', () => {
            it('handles write exceptions', saveTagsetExceptionTest);
            it('works', saveTagsetTest);
        });

        describe('delete', () => {
            it('handles delete exceptions', deleteTagsetExceptionTest);
            it('works', deleteTagsetTest);
        });

        describe('get properties', () => {
            it('handles read exceptions', getPropertiesExceptionTest);
            it('works', getPropertiesTest);
        });
    });

    describe('main config', () => {
        describe('get', () => {
            it('handles exceptions', getConfigExceptionTest);
            it('works', getConfigTest);
        });

        describe('save', () => {
            it('handles exceptions', saveConfigExceptionTest);
            it('works', saveConfigTest);
        });
    });
});