const
    chakram = require('chakram'),
    expect  = chakram.expect,
    helpers = require('../../helpers/systemHelpers');

let id = null;
let childId = null;

/* parent level tests */

const noResultsTest = () => {
    return chakram.get('http://localhost:8006/sqlrecordings', {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(200);
        expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(response).to.comprise.of.json([]);
    });
};

const addRecordingTest = () => {
    return chakram.post('http://localhost:8006/sqlrecordings', {
        name : 'Test recording',
        length : 1234
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(201);
        expect(response).to.have.header('location');
        id = response.response.headers.location.split('/').slice(-1)[0];
    });
};

const getResultsTest = () => {
    return chakram.get('http://localhost:8006/sqlrecordings', {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(200);
        expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(response.body[0].id).to.equal(id);
        expect(response.body[0].name).to.equal('Test recording');
        expect(response.body[0].length).to.equal(1234);
    });
};

const getCountTest = () => {
    return chakram.get('http://localhost:8006/sqlrecordings/.details', {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(200);
        expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(response.body.count).to.equal(1);
    });
};

const getRecordingTest = () => {
    return chakram.get(`http://localhost:8006/sqlrecordings/${id}`, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(200);
        expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(response.body.id).to.equal(id);
        expect(response.body.name).to.equal('Test recording');
        expect(response.body.length).to.equal(1234);
    });
};

const getNotFound = () => {
    return chakram.get('http://localhost:8006/sqlrecordings/dfkjsdfksdf', {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};

const updateRecordingTest = () => {
    return chakram.put(`http://localhost:8006/sqlrecordings/${id}`, {
        name : 'Updated test recording',
        length : 2345
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(204);
        return chakram.get(`http://localhost:8006/sqlrecordings/${id}`, {
            headers : {
                Authorization : `Bearer ${helpers.getToken()}`
            }
        });
    }).then((response) => {
        expect(response).to.have.status(200);
        expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(response.body.id).to.equal(id);
        expect(response.body.name).to.equal('Updated test recording');
        expect(response.body.length).to.equal(2345);
    });
};

const updateNotFoundTest = () => {
    return chakram.put('http://localhost:8006/sqlrecordings/sadadasd', {
        name : 'Updated test recording',
        length : 2345
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};

const patchRecordingTest = () => {
    return chakram.patch(`http://localhost:8006/sqlrecordings/${id}`, {
        length : 3456
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(204);
        return chakram.get(`http://localhost:8006/sqlrecordings/${id}`, {
            headers : {
                Authorization : `Bearer ${helpers.getToken()}`
            }
        });
    }).then((response) => {
        expect(response).to.have.status(200);
        expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(response.body.id).to.equal(id);
        expect(response.body.name).to.equal('Updated test recording');
        expect(response.body.length).to.equal(3456);
    });
};

const patchNotFoundTest = () => {
    return chakram.patch('http://localhost:8006/sqlrecordings/sdfsfdds', {
        length : 3456
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};

const deleteRecordingTest = () => {
    return chakram.delete(`http://localhost:8006/sqlrecordings/${id}`, {}, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(204);
        return chakram.get(`http://localhost:8006/sqlrecordings/${id}`, {
            headers : {
                Authorization : `Bearer ${helpers.getToken()}`
            }
        });
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};

const deleteNotFoundTest = () => {
    return chakram.delete('http://localhost:8006/fsrecordings/sdfsfsdf', {}, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};


/* single layer stacked objects */

const singleObjectNotDefinedTest = () => {
    return chakram.get(`http://localhost:8006/sqlrecordings/${id}/work`, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(200);
        expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(response).to.comprise.of.json({});
    });
};

const notFoundSingleObject = () => {
    return chakram.get('http://localhost:8006/sqlrecordings/asdad/work', {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};

const updateSingleObject = () => {
    return chakram.put(`http://localhost:8006/sqlrecordings/${id}/work`, {
        name : 'work object name'
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(204);
        return chakram.get(`http://localhost:8006/sqlrecordings/${id}/work`, {
            headers : {
                Authorization : `Bearer ${helpers.getToken()}`
            }
        }).then((response) => {
            expect(response).to.have.status(200);
            expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
            expect(response).to.comprise.of.json({
                name : 'work object name'
            });
        });
    });
};

const updateSingleNotFound = () => {
    return chakram.put('http://localhost:8006/sqlrecordings/asdadsad/work', {
        name : 'work object name'
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};

const patchSingleObject = () => {
    return chakram.patch(`http://localhost:8006/sqlrecordings/${id}/work`, {
        name : 'patched work object name'
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(204);
        return chakram.get(`http://localhost:8006/sqlrecordings/${id}/work`, {
            headers : {
                Authorization : `Bearer ${helpers.getToken()}`
            }
        }).then((response) => {
            expect(response).to.have.status(200);
            expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
            expect(response).to.comprise.of.json({
                name : 'patched work object name'
            });
        });
    });
};

const patchSingleNotFoundTest = () => {
    return chakram.patch('http://localhost:8006/sqlrecordings/sdfsfdsf/work', {
        name : 'patched work object name'
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};

/* dual layer stacked objects */

const dualSingleObjectNotDefinedTest = () => {
    return chakram.get(`http://localhost:8006/sqlrecordings/${id}/work/composer`, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(200);
        expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(response).to.comprise.of.json({});
    });
};

const notFoundDualObject = () => {
    return chakram.get('http://localhost:8006/sqlrecordings/eefsfsef/work/composer', {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};

const updateDualSingleObject = () => {
    return chakram.put(`http://localhost:8006/sqlrecordings/${id}/work/composer`, {
        name : 'test composer',
        functions : [
            'one',
            'two'
        ]
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(204);
        return chakram.get(`http://localhost:8006/sqlrecordings/${id}/work/composer`, {
            headers : {
                Authorization : `Bearer ${helpers.getToken()}`
            }
        }).then((response) => {
            expect(response).to.have.status(200);
            expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
            expect(response.body.name).to.equal('test composer');
            expect(response.body.functions[0]).to.equal('one');
            expect(response.body.functions[1]).to.equal('two');
        });
    });
};

const updateDualNotFound = () => {
    return chakram.put('http://localhost:8006/sqlrecordings/sdfsdfsfd/work/composer', {
        name : 'test composer',
        functions : [
            'one',
            'two'
        ]
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};

const patchDualSingleObject = () => {
    return chakram.patch(`http://localhost:8006/sqlrecordings/${id}/work/composer`, {
        functions : [
            'one'
        ]
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(204);
        return chakram.get(`http://localhost:8006/sqlrecordings/${id}/work/composer`, {
            headers : {
                Authorization : `Bearer ${helpers.getToken()}`
            }
        }).then((response) => {
            expect(response).to.have.status(200);
            expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
            expect(response.body.name).to.equal('test composer');
            expect(response.body.functions[0]).to.equal('one');
        });
    });
};

const patchDualNotFound = () => {
    return chakram.patch('http://localhost:8006/sqlrecordings/ssdfsdf/work/composer', {
        functions : [
            'one'
        ]
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};

/* multi-child objects */

const multiObjectListNoResults = () => {
    return chakram.get(`http://localhost:8006/sqlrecordings/${id}/recording_artists`, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(200);
        expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(response).to.comprise.of.json([]);
    });
};

const multiObjectListAdd = () => {
    return chakram.post(`http://localhost:8006/sqlrecordings/${id}/recording_artists`, {
        name : 'test artist',
        functions : [
            'one',
            'two'
        ]
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(201);
        expect(response).to.have.header('location');
        childId = response.response.headers.location.split('/').slice(-1)[0];
    });
};

const multiObjectListAddNotFound = () => {
    return chakram.post('http://localhost:8006/sqlrecordings/sdfsfd/recording_artists', {
        name : 'test artist',
        functions : [
            'one',
            'two'
        ]
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};

const multiObjectList = () => {
    return chakram.get(`http://localhost:8006/sqlrecordings/${id}/recording_artists`, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(200);
        expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(response.body[0].id).to.equal(childId);
        expect(response.body[0].parent).to.equal(id);
        expect(response.body[0].name).to.equal('test artist');
        expect(response.body[0].functions[0]).to.equal('one');
        expect(response.body[0].functions[1]).to.equal('two');
    });
};

const multiObjectListNotFound = () => {
    return chakram.get('http://localhost:8006/sqlrecordings/asdsad/recording_artists', {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};

const multiObjectCount = () => {
    return chakram.get(`http://localhost:8006/sqlrecordings/${id}/recording_artists/.details`, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(200);
        expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(response.body.count).to.equal(1);
    });
};

const multiObjectCountNotFound = () => {
    return chakram.get('http://localhost:8006/sqlrecordings/asdadasd/recording_artists/.details', {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};

const multiObjectListGet = () => {
    return chakram.get(`http://localhost:8006/sqlrecordings/${id}/recording_artists/${childId}`, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(200);
        expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(response.body.id).to.equal(childId);
        expect(response.body.parent).to.equal(id);
        expect(response.body.name).to.equal('test artist');
        expect(response.body.functions[0]).to.equal('one');
        expect(response.body.functions[1]).to.equal('two');
    });
};

const multiObjectCountRestricts = () => {
    return chakram.post('http://localhost:8006/sqlrecordings', {
        name : 'Test recording',
        length : 1234
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(201);
        expect(response).to.have.header('location');
        const newId = response.response.headers.location.split('/').slice(-1)[0];
        return chakram.post(`http://localhost:8006/sqlrecordings/${newId}/recording_artists`, {
            name : 'test artist',
            functions : [
                'one',
                'two'
            ]
        }, {
            headers : {
                Authorization : `Bearer ${helpers.getToken()}`
            }
        });
    }).then(() => {
        return chakram.get(`http://localhost:8006/sqlrecordings/${id}/recording_artists/.details`, {
            headers : {
                Authorization : `Bearer ${helpers.getToken()}`
            }
        });
    }).then((response) => {
        expect(response).to.have.status(200);
        expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(response.body.count).to.equal(1);
    });
};

const multiObjectNotFound = () => {
    return chakram.get(`http://localhost:8006/sqlrecordings/${id}/recording_artists/asdadsa`, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};

const multiObjectListUpdate = () => {
    return chakram.put(`http://localhost:8006/sqlrecordings/${id}/recording_artists/${childId}`, {
        name : 'updated test artist',
        functions : [
            'one',
            'two',
            'three'
        ]
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(204);
        return chakram.get(`http://localhost:8006/sqlrecordings/${id}/recording_artists/${childId}`, {
            headers : {
                Authorization : `Bearer ${helpers.getToken()}`
            }
        });
    }).then((response) => {
        expect(response).to.have.status(200);
        expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(response.body.id).to.equal(childId);
        expect(response.body.parent).to.equal(id);
        expect(response.body.name).to.equal('updated test artist');
        expect(response.body.functions[0]).to.equal('one');
        expect(response.body.functions[1]).to.equal('two');
        expect(response.body.functions[2]).to.equal('three');
    });
};

const multiObjectListUpdateNotFound = () => {
    return chakram.put(`http://localhost:8006/sqlrecordings/${id}/recording_artists/asdadad`, {
        name : 'updated test artist',
        functions : [
            'one',
            'two',
            'three'
        ]
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};

const multiObjectListPatch = () => {
    return chakram.patch(`http://localhost:8006/sqlrecordings/${id}/recording_artists/${childId}`, {
        functions : [
            'one'
        ]
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(204);
        return chakram.get(`http://localhost:8006/sqlrecordings/${id}/recording_artists/${childId}`, {
            headers : {
                Authorization : `Bearer ${helpers.getToken()}`
            }
        });
    }).then((response) => {
        expect(response).to.have.status(200);
        expect(response).to.have.header('content-type', 'application/json; charset=utf-8');
        expect(response.body.id).to.equal(childId);
        expect(response.body.parent).to.equal(id);
        expect(response.body.name).to.equal('updated test artist');
        expect(response.body.functions[0]).to.equal('one');
    });
};

const multiObjectListPatchNotFound = () => {
    return chakram.patch(`http://localhost:8006/sqlrecordings/${id}/recording_artists/sdfsfds`, {
        functions : [
            'one'
        ]
    }, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};

const multiObjectListDelete = () => {
    return chakram.delete(`http://localhost:8006/sqlrecordings/${id}/recording_artists/${childId}`, {}, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(204);
        return chakram.get(`http://localhost:8006/sqlrecordings/${id}/recording_artists/${childId}`, {
            headers : {
                Authorization : `Bearer ${helpers.getToken()}`
            }
        });
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};

const multiObjectListDeleteNotFound = () => {
    return chakram.delete(`http://localhost:8006/sqlrecordings/${id}/recording_artists/sdfsdf`, {}, {
        headers : {
            Authorization : `Bearer ${helpers.getToken()}`
        }
    }).then((response) => {
        expect(response).to.have.status(404);
    });
};

/* test cases */
describe('A sql backed storage API', function () {
    describe('root layer', () => {
        it('handles no results when searching', noResultsTest);
        it('can add a recording', addRecordingTest);
        it('can get the recording results', getResultsTest);
        it('can get the count', getCountTest);
        it('can get a single recording', getRecordingTest);
        it('handles 404 when not found', getNotFound);
        it('can update a recording', updateRecordingTest);
        it('404 on update none-existing', updateNotFoundTest);
        it('can patch a recording', patchRecordingTest);
        it('404 on patch none-existing', patchNotFoundTest);
        it('can delete a recording', deleteRecordingTest);
        it('404 on deleting none-existing', deleteNotFoundTest);

        it('can add a recording for subsequent tests', addRecordingTest);
    });

    describe('single object layer', () => {
        it('can get the single object when it hasn\'t been defined before', singleObjectNotDefinedTest);
        it('can update the single object', updateSingleObject);
        it('can patch the single object', patchSingleObject);
        it('returns 404 on parent not existing', notFoundSingleObject);
        it('returns 404 on update on parent not existing', updateSingleNotFound);
        it('returns 404 on patch on parent not existing', patchSingleNotFoundTest);
    });

    describe('dual single object layers', () => {
        it('can get the single object when it hasn\'t been defined before', dualSingleObjectNotDefinedTest);
        it('can update the single object', updateDualSingleObject);
        it('can patch the single object', patchDualSingleObject);
        it('returns 404 on parent not existing', notFoundDualObject);
        it('returns 404 on update on parent not existing', updateDualNotFound);
        it('returns 404 on patch on parent not existing', patchDualNotFound);
    });

    describe('multi object layer', () => {
        it('can get a list of the objects when there are none', multiObjectListNoResults);
        it('can add a child', multiObjectListAdd);
        it('404 when adding a child to a parent that doesn\'t exist', multiObjectListAddNotFound);
        it('can get a list of the objects', multiObjectList);
        it('404 when fetching list when parent does not exist', multiObjectListNotFound);
        it('can get the count', multiObjectCount);
        it('the count is restricted to the parent object', multiObjectCountRestricts);
        it('404 when parent doesn\'t exist on details', multiObjectCountNotFound);
        it('can get the child', multiObjectListGet);
        it('404 on child not existing', multiObjectNotFound);
        it('can update the child', multiObjectListUpdate);
        it('404 on updating a child that doesnt exist', multiObjectListUpdateNotFound);
        it('can patch the child', multiObjectListPatch);
        it('404 on patch on child that doesnt exist', multiObjectListPatchNotFound);
        it('can delete the child', multiObjectListDelete);
        it('404 on delete on child that doesnt exist', multiObjectListDeleteNotFound);
    });
});