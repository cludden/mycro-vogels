'use strict';

var vogels = require('vogels');

module.exports = {

    registerConnection: function(connectionInfo, cb) {

        // for dev, otherwise IAM roles should be used
        if(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
            connectionInfo.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
            connectionInfo.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        }

        // configure vogels
        if(!connectionInfo.region) {
            cb(new Error('missing required connection property: region'));
        } else {
            vogels.AWS.config.update(connectionInfo);
            cb(null, vogels);
        }
    },

    registerModel: function(connection, modelDefinition, cb) {

        var name = modelDefinition.name,
            model;
        delete modelDefinition.name;

        // create model
        if(!name || !modelDefinition.hashKey || !modelDefinition.schema) {
            cb(new Error('missing at least one required model property: name, hashKey, or schema'));
        } else if(!modelDefinition.schema[modelDefinition.hashKey]) {
            cb(new Error('hashKey missing from schema'));
        } else {
            model = connection.define(name, modelDefinition);
            cb(null, model);
        }

    }

};