'use strict';

module.exports = function(vogels, joi, name) {
    let model = vogels.define(name, {
        hashKey: 'email',
        timestamps: true,
        schema: {
            email: joi.string().email(),
            name: joi.string(),
            age: joi.number(),
            roles: vogels.types.stringSet(),
            settings: {
                nickname: joi.string(),
                acceptedTerms: joi.boolean().default(false)
            }
        }
    });

    return model;
};
