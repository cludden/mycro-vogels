'use strict';

var vogels = require('vogels');
var joi = require('joi');
var _ = require('lodash');

module.exports = {
    /**
     * Configure vogels
     *
     * @param  {Object} config
     * @param  {String} config.region
     * @param  {Function} cb
     */
    registerConnection(config, cb) {
        let _config = _.merge({}, {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: config.region
        });

        if (config.driver) {
            vogels.dynamoDriver(config.driver);
        } else {
            if (!_config.region) {
                return process.nextTick(function() {
                    cb(new Error('missing required connection property: region'));
                });
            }
            // configure vogels and return
            vogels.AWS.config.update(config);
        }

        cb(null, vogels);
    },


    /**
     * Register vogel model
     *
     * @param  {Object} vogels
     * @param  {Function} factory
     * @param  {Function} cb
     */
    registerModel: function(vogels, factory, name, mycro, cb) {
        if (!_.isFunction(factory)) {
            return cb(new Error(`Invalid model definition provided for
                model '${name}'. Model modules should export a factory
                function that accepts a configured vogels instance, a
                joi instance, and the name of the model.`
            ));
        }
        try {
            let model = factory(vogels, joi, name, mycro);
            return cb(null, model);
        } catch (e) {
            cb(e);
        }
    }
};
