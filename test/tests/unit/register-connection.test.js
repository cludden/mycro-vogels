/* jshint expr:true */
'use strict';

const adapter = require('../../../index');
const AWS = require('aws-sdk');
const expect = require('chai').expect;
const sinon = require('sinon');
const vogels = require('vogels');
const _ = require('lodash');

describe('registerConnection()', function() {
    it('should not set aws credentials if no environment variables are found', function(done) {
        var keys = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'],
            credentials = _.pick(process.env, keys);
        keys.forEach(function(key) {
            delete process.env[key];
        });
        var config = {region: 'us-west-2'};
        adapter.registerConnection(config, function(err, connection) {
            expect(err).to.not.exist;
            expect(config.accessKeyId).to.not.exist;
            expect(config.secretAccessKey).to.not.exist;
            _.extend(process.env, credentials);
            done(err);
        });
    });

    it('should error if no `region` is defined in the connection config', function(done) {
        adapter.registerConnection({}, function(err) {
            expect(err).to.exist;
            done();
        });
    });

    it('should allow a custom driver to be provided', function(done) {
        sinon.spy(vogels, 'dynamoDriver');
        adapter.registerConnection({
            driver: new AWS.DynamoDB({
                endpoint: 'http://localhost:8000',
                region: 'us-west-2'
            })
        }, function(err) {
            expect(err).to.not.exist;
            expect(vogels.dynamoDriver).to.have.been.called;
            done(err);
        });
    });
});
