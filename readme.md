# Vuex Store Validator
![Vuex Store Validator](./assets/main.png)

[![Build Status](https://github.com/tzsk/vuex-store-validator/workflows/Tests/badge.svg)](https://github.com/tzsk/vuex-store-validator/actions?workflow=Tests)
[![NPM Version](https://img.shields.io/npm/v/vuex-store-validator.svg)](https://www.npmjs.com/package/vuex-store-validator)
[![NPM Downloads](https://img.shields.io/npm/dm/vuex-store-validator.svg)](https://www.npmjs.com/package/vuex-store-validator)
[![Coverage Status](https://coveralls.io/repos/github/tzsk/vuex-store-validator/badge.svg?branch=master)](https://coveralls.io/github/vuex-store-validator-validator/vuex-store-validator?branch=master)

This package helps you to validate how you mutate your Vuex store. You can say that it is a Validator for the mutations. You can easily validate the payload for each of your mutations, so that you can be sure of the integrity of your Store Data.

Though Vuex allowes you to set the store state directly without calling any mutation. This package won't validate anything outside the mutations mutations.

## Installation

```bash
// NPM:
$ npm install --save vuex-store-validator

// Yarn:
$ yarn add vuex-store-validator
```

By default it comes with `Joi` validator. It also has support for `AJV` validation engine. Read their respective docs to find out which one is best for you.
- [Joi Documentation](https://github.com/sideway/joi/blob/master/API.md)
- [Ajv Documentation](https://github.com/ajv-validator/ajv/blob/master/README.md)

#### Install Joi
If you want to use joi then you'll have to install it as your project dependency.

```bash
// NPM:
$ npm install --save joi

// Yarn:
$ yarn add joi
```

#### Setup Ajv
If you think that ajv is best for you then you won't have to install anything as the schema builder is plain javascript object.

## Usage

1. Add the validator to the plugins section of your Root Store.

```js
// store.js
import VuexStoreValidator from 'vuex-store-validator';

export default new Vuex.Store({
    ...
    plugins: [new VuexStoreValidator()],
});
```

2. Add Rules to your store and respective modules

```js
// store.js
import Joi from 'joi';
import VuexStoreValidator from 'vuex-store-validator';

export default new Vuex.Store({
    rules: {
        SET_USER: **[SCHEMA HERE]**
    },
    state: {user: null},
    mutations: {
        SET_USER(state, user) {
            state.user = user;
        }
    },
    plugins: [new VuexStoreValidator()],
});

// Joi Schema...
Joi.object({
    name: Joi.string().required(),
    email: Joi.email().required(),
}).required(),

// Ajv Schema...
{
    type: 'object',
    properties: {
        name: {type: 'string'},
        email: {type: 'email'},
    },
    required: ['name', 'email'],
}
```

**NOTE:** For Ajv you will have to add the engine option in the plugin registration
```js
plugins: [new VuexStoreValidator({engine: ENGINE.AJV})],
```

**NOTE:** You can also add rules in your modules as well. It will only apply to that module only.

### Congratulations! You're all done.

Now whenever you call the mutation from anywhere be it inside an action or from any comonent. The payload you pass will be validated against the schema you've defined.

For the piece of code if you try and call the `SET_USER` mutation without valid data:
```js
// From a Component
this.$store.commit('SET_USER', {name: 'John'});
// Or from an action
login({commit}, user) {
    commit('SET_USER', {name: 'John'});
}

// Result: 
// ValidationError: "email" field is required for mutation: SET_USER
```

### Strict Mode

#### What if you don't specify any schema for your Legacy Store?

That's not a problem at all. Your project will work as is. This package will only validate the ones for which you have specified a schema. Unless you are using this package in `Strict Mode`.

```js
// store.js
import VuexStoreValidator from 'vuex-store-validator';

export default new Vuex.Store({
    ...
    plugins: [new VuexStoreValidator({strict: true})],
});
```

If you set strict mode to `true`, then if you don't have a schema defined for any of your mutation, it will throw an exception.

### Caution

This package won't prevent you from setting invalid data to your store. But it will throw appropriate exception everytime you set invalid data, so that you can be aware where bad data might be coming from.


## Testing

After Cloning the repository, install all npm dependecies by running: `npm install`.

Then Run Tests:

```bash
$ npm run test
```

## Change log

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please feel free to contribute ideas and PRs are most welcome.

## Security

If you discover any security related issues, please email mailtokmahmed@gmail.com instead of using the issue tracker.

## Credits

- [Kazi Mainuddin Ahmed][link-author]
- [All Contributors][link-contributors]

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

[link-author]: https://github.com/tzsk
[link-contributors]: ../../contributors
