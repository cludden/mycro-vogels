'use strict';

module.exports = {
    'v1.0.0': {
        '/healthy': {
            get(req, res) {
                res.json(200, {status: 'healthy'});
            }
        }
    }
};
