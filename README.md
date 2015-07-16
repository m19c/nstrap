nstrap
======
`nstrap` is a bootstrap library which allows you to start your application with less overhead and an unified interface. You are welcome to contribute to this repository or create some third-party modules like `nstrap-mongoose`.

## Table of Contents
1. [API Reference](#api)
2. [Quick start](#quick-start)
3. [Contribute](#contribute)
4. [License](#license)

## Quick start
```javascript
var bootstrap = require('nstrap')(),
    mongoose  = require('mongoose');

bootstrap.add('config', function (done) {
  done(require('path/to/your/config'));
});

bootstrap.add('database', ['config'], function (config) {
  return new Promise(function () {
    var connection = mongoose.connection;

    mongoose.model('Cat', { name: String });

    connection.once('error', reject);
    connection.once('open', resolve);

    mongoose.connect(config.database);
  });
});

bootstrap.add(require('nstrap-mysql')({
  name: 'database2'
}));

bootstrap.run()
  .then(function (globals) {
    return mongoose.model('Cat').find({});
  })
  .then(function (cats) {
    cats.forEach(function (cat) {
      console.log('Hi', cat.name);
    });
  })
;
```

## License
The MIT License (MIT)

Copyright (c) 2015 Marc Binder <marcandrebinder@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.