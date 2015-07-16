# nstrap

# Use nstrap
## Custom
```javascript
nstrap.add('database:custom', ['config'], function (config) {
  // use the last argument passed to this function or return a promise. the
  // data passed to the function or to the promise becomes stored by nstrap
  // to access it later.
});
```

## Predefined
```javascript
nstrap.add('database:mongodb', NStrap.predefined('mongoose'));
// or
nstrap.add('database:mongodb', require('nstrap/predefined/mongoose'));
```