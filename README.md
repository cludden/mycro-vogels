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

var adapter = require('mycro-vogels');

module.exports = {
    vogels: {
        adapter: adapter,
        config: {
            region: 'us-west-2'
        }
    }
}
```
3. Define a model

```javascript
// in app/models/post.js

module.exports = function(vogels, joi, name) { // name = 'post'
    let model = vogels.define(name, {
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

module.exports = {
    create(req, res) {
        let Posts = req.mycro.models.post;
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
};
```
