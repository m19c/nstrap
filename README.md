nstrap
======
`nstrap` is a bootstrap library which allows you to start your application with less overhead and an unified interface. You are welcome to contribute to this repository or create some third-party modules like `nstrap-mongoose`.

[![Build Status](https://travis-ci.org/MrBoolean/nstrap.svg?branch=master)](https://travis-ci.org/MrBoolean/nstrap) [![npm version](https://badge.fury.io/js/nstrap.svg)](http://badge.fury.io/js/nstrap) [![Dependencies](https://david-dm.org/MrBoolean/nstrap.svg)](https://travis-ci.org/MrBoolean/nstrap) [![Code Climate](https://codeclimate.com/github/MrBoolean/nstrap/badges/gpa.svg)](https://codeclimate.com/github/MrBoolean/nstrap) [![Test Coverage](https://codeclimate.com/github/MrBoolean/nstrap/badges/coverage.svg)](https://codeclimate.com/github/MrBoolean/nstrap/coverage)

## Table of Contents
1. [Install](#install)
2. [API Reference](#api)
3. [Quick start](#quick-start)
4. [Create your own NStrap module](#create-your-own-nstrap-module)
5. [License](#license)

## Install
```
npm i --save nstrap
```

## API
### `add(name[, deps[, task]])`
- `name`: The name of the task as a `string`.
- `deps`: An optional array passed as the second argument which defines the dependencies for this task. The task gets called once all dependencies are fulfilled.
- `task`: The task as a function. The function takes an argument called `done` which should be called by the task once it is completed. The argument passed to `done` can be anything - it will be appended to the `nstrap` registry to access the data. If you pass an `Error` the task is marked as invalid. Note that you can also use a `Promise` library (preferred: `bluebird`).

#### Example
```javascript
var bootstrap = require('nstrap')();

bootstrap.add('config', function (done) {
  done(require('path/to/my/config'));
});

bootstrap.add('database', function () {
  return new Promise(function (resovle) {
    resolve({ connected: true });
  });
});

bootstrap.add({
  name:     'mysql',
  provider: function (instance) {
    instance.add('mysql:config', function () {
      return {
        host: '',
        user: '',
        pass: '',
        db:   ''
      };
    });
  },
  deps: ['mysql:config'],
  task: function (config, done) {
    done({
      connectedTo: config
    });
  }
});

bootstrap.run()
  .then(function (kernel) {
    kernel.database.connected; // true
    kernel.config; // the configuration `path/to/my/config`
  })
;
```

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

## Create your own NStrap module
`nstrap` comes with a simple interface called `NStrapInterface` to provide own modules.

```javascript
var NStrapInterface = require('nstrap').NStrapInterface;

module.exports = function example() {
  var example = new NStrapInterface();

  example
    .setName('example')
    .addSupplier(function (instance) {
      instance.add('example:config', function () {
        return { name: 'Jon Doe' };
      });
    })
    .addDependency('example:config')
    .setTask(function (config) {
      return new Promise(function (resolve, reject) {
        resolve('Hi ' + config.name);
      });
    })
  ;

  return example;
};
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