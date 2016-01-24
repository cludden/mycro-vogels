'use strict';

var vogels = require('vogels'),
    joi = require('joi'),
    _ = require('lodash');

module.exports = {
    /**
     * Configure vogels
     *
     * @param  {Object} config
     * @param  {String} config.region
     * @param  {Function} cb
     */
    registerConnection(config, cb) {
        // for dev, otherwise IAM roles should be used
        if(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
            config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
            config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        }

        // ensure that `region` is defined
        if(!config.region) {
            return cb(new Error('missing required connection property: region'));
        }

        // configure vogels and return
        vogels.AWS.config.update(config);
        cb(null, vogels);
    },


    /**
     * Register vogel model
     *
     * @param  {Object} vogels
     * @param  {Function} factory
     * @param  {Function} cb
     */
    registerModel: function(vogels, factory, name, cb) {
        if (!_.isFunction(factory)) {
            return cb(new Error(`Invalid model definition provided for
                model '${name}'. Model modules should export a factory
                function that accepts a configured vogels instance, a
                joi instance, and the name of the model.`
            ));
        }
        try {
            let model = factory(vogels, joi, name);
            return cb(null, model);
        } catch (e) {
            cb(e);
        }
    }
};
