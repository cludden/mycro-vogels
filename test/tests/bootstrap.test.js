/* jshint expr:true */
'use strict';

var adapter = require('../../index'),
    chai = require('chai'),
    expect = chai.expect,
    joi = require('joi'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    supertest = require('supertest'),
    vogels = require('vogels'),
    _ = require('lodash');

chai.use(sinonChai);

let originalCwd = process.cwd();
process.chdir(__dirname + '/../dummy');

before(function(done) {
    var mycro = require('../dummy/app');
    global.mycro = mycro;
    mycro.start(function(err) {
        done(err);
    });
});

after(function() {
    process.chdir(originalCwd);
});

describe('mycro-vogels', function() {
    it('should start successfully', function(done) {
        let request = supertest.agent(mycro.server);
        request.get('/healthy')
            .expect(200)
            .end(done);
    });

    ['account', 'post'].forEach(function(model) {
        it('should load the `' + model + '` model', function() {
            expect(mycro.models[model]).to.exist;
        });
    });
});
