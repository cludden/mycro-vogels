'use strict';

const AWS = require('aws-sdk');

let adapter = require('../../../index');

module.exports = {
    vogels: {
        adapter: adapter,
        config: {
            region: 'us-west-2'
        },
        default: true
    },

    vogels2: {
        adapter: adapter,
        config: function() {
            return {
                driver: new AWS.DynamoDB({
                    endpoint: 'http://dynamodb-local:8000',
                    region: 'us-west-2'
                })
            };
        }
    }
};
