
var VogelsAdapter = require('../index'),
    vogels = require('vogels'),
    Joi = require('joi'),
    sinon = require('sinon'),
    expect = require('chai').expect;

describe('restify-microservice-vogels', function() {
    var connectionInfo,
        connectionCb;

    beforeEach(function() {
        connectionInfo = {
            region: 'us-west-2'
        };
        connectionCb = sinon.stub();
    });

    describe('registerConnection', function() {

        beforeEach(function() {
            sinon.stub(vogels.AWS.config, 'update');
        });

        afterEach(function() {
            vogels.AWS.config.update.restore();
        });

        it('throws an error of "missing required connection property: region" when connectionInfo.region is not provided', function() {
            connectionInfo = {};
            VogelsAdapter.registerConnection(connectionInfo, connectionCb);
            expect(connectionCb.withArgs(new Error('missing required connection property: region')).calledOnce).to.be.true;
        });

        it('calls vogels.AWS.config.update with all passed config info', function() {
            VogelsAdapter.registerConnection(connectionInfo, connectionCb);
            expect(vogels.AWS.config.update.withArgs(connectionInfo).calledOnce).to.be.true;
            expect(connectionCb.withArgs(null, vogels).calledOnce).to.be.true;
        });

        it('adds "accessKeyId" and "secretAccessKey" to the config object if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY env vars are available', function() {
            process.env = {
                AWS_ACCESS_KEY_ID: 'ACCESS_KEY',
                AWS_SECRET_ACCESS_KEY: 'SECRET'
            };
            VogelsAdapter.registerConnection(connectionInfo, connectionCb);
            expect(connectionInfo.accessKeyId).to.equal(process.env.AWS_ACCESS_KEY_ID);
            expect(connectionInfo.secretAccessKey).to.equal(process.env.AWS_SECRET_ACCESS_KEY);
        });
    });

    describe('registerModel', function() {
        var connection,
            modelDefinition,
            modelCb;

        beforeEach(function() {
            connection = VogelsAdapter.registerConnection(connectionInfo, connectionCb);
            modelDefinition = {
                name: 'My Model',
                hashKey: 'id',
                schema: {
                    id: Joi.number(),
                    name: Joi.string()
                }
            };
            modelCb = sinon.stub();
        });

        it('throws an error of "hashKey missing from schema" when a hashKey is provided but it does not exist in the schema definition', function() {
            delete modelDefinition.schema.id;
            VogelsAdapter.registerModel(connection, modelDefinition, modelCb);
            expect(modelCb.withArgs(
                new Error('hashKey missing from schema')
            ).calledOnce).to.be.true;
        });

        describe('throws an error of "missing at least one required model property: name, hashKey, or schema"', function() {

            it('when name is missing', function() {
                delete modelDefinition.name;
                VogelsAdapter.registerModel(connection, modelDefinition, modelCb);
                expect(modelCb.withArgs(
                    new Error('missing at least one required model property: name, hashKey, or schema')
                ).calledOnce).to.be.true;
            });

            it('when hashKey is missing', function() {
                delete modelDefinition.hashKey;
                VogelsAdapter.registerModel(connection, modelDefinition, modelCb);
                expect(modelCb.withArgs(
                    new Error('missing at least one required model property: name, hashKey, or schema')
                ).calledOnce).to.be.true;
            });

            it('when schema is missing', function() {
                delete modelDefinition.schema;
                VogelsAdapter.registerModel(connection, modelDefinition, modelCb);
                expect(modelCb.withArgs(
                    new Error('missing at least one required model property: name, hashKey, or schema')
                ).calledOnce).to.be.true;
            });
        });
    });
});