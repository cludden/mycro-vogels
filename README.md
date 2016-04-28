# mycro-vogels
a [dynamodb](https://aws.amazon.com/dynamodb) adapter (using [vogels](https://github.com/ryanfitz/vogels)) for [mycro](https://github.com/cludden/mycro)

## Install
```javascript
npm install --save vogels mycro-vogels
```

## Getting Started
1. Make sure your aws credentials are available (environment variables, ec2 instance profile, or set manually)
2. Define a connection

```javascript
// in config/connections.js

const vogelsAdapter = require('mycro-vogels');

module.exports = {
    vogels: {
        adapter: vogelsAdapter,
        config: {
            region: 'us-west-2'
        }
    }
}
```
3. Define a model

```javascript
// in app/models/post.js

module.exports = function(vogels, joi, name, mycro) { // name = 'post'
    const model = vogels.define(name, {
        hashKey: 'email',
        rangeKey: 'title',
        tableName: 'blogPosts',
        schema: {
            email: joi.string().email(),
            title: joi.string(),
            content: joi.binary(),
            tags: vogels.types.stringSet()
        }
    });

    return model;
};
```
4. Use it

```javascript
// in app/controllers/posts.js

module.exports = function(mycro) {
    const Posts = mycro.models.post;

    return {
        create(req, res) {
            Posts.create({
                email: req.body.email,
                title: req.body.title,
                content: req.body.content
            }, function (err, post) {
                if (err) {
                    return res.json(500, {error: err});
                }
                res.json(200, {data: post.toJSON()});
            });
        }
    }
};
```

## Configuration
All items (except for a 'driver' attribute) in the config object will be passed to vogels as is:
```javascript
// in config/connections.js
const AWS = require('aws-sdk');
const vogelsAdapter = require('mycro-vogels');

module.exports = {
    // ..
    dynamo: {
        adapter: vogelsAdapter,
        config: function() {
            if (process.env.NODE_ENV === 'test') {
                return {
                    driver: new AWS.DynamoDB({
                        endpoint: 'http://localhost:8000',
                        region: 'us-west-2'
                    })
                };
            } else {
                return {
                    region: 'us-west-2'
                }
            }
        }
    }
    // ..
}
```

## Testing
run the tests
```
npm test
```

run coverage
```
grunt coverage
```

## Contributing
1. [Fork it](https://github.com/cludden/mycro-vogels/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## License
Copyright (c) 201 Ben Schnelle & Chris Ludden.
Licensed under the [MIT license](LICENSE.md).
