/* jshint expr:true */
'use strict';

var adapter = require('../../../index'),
    expect = require('chai').expect,
    sinon = require('sinon'),
    _ = require('lodash');

describe('registerModel()', function() {
    it('should error if the model definition is not a factory function', function(done) {
        adapter.registerModel({}, {}, 'test', {}, function(err) {
            expect(err).to.exist;
            done();
        });
    });

    it('should error if the factory function throws an error', function(done) {
        var factory = sinon.stub().throws(new Error('something unexpected'));
        adapter.registerModel({}, factory, 'test', {}, function(err) {
            expect(err).to.exist;
            done();
        });
    });
});
