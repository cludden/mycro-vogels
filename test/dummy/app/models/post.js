'use strict';

module.exports = function(vogels, joi, name) {
    let model = vogels.define(name, {
        hashKey: 'email',
        rangeKey: 'title',
        schema: {
            email: joi.string().email(),
            title: joi.string(),
            content: joi.binary(),
            tags: vogels.types.stringSet()
        }
    });

    return model;
};
