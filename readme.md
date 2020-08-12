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

- **Joi Example:**
```js
// store.js
import Joi from 'joi';
import VuexStoreValidator from 'vuex-store-validator';

export default new Vuex.Store({
    rules: {
        SET_USER: Joi.object({
            name: Joi.string().required(),
            email: Joi.email().required(),
        }).required(),
    },
    state: {user: null},
    mutations: {
        SET_USER(state, user) {
            state.user = user;
        }
    },
    plugins: [new VuexStoreValidator()],
});
```

- **Ajv Example:**
```js
// store.js
import VuexStoreValidator, { ENGINE } from 'vuex-store-validator';

export default new Vuex.Store({
    rules: {
        SET_USER: {
            type: 'object',
            properties: {
                name: {type: 'string'},
                email: {type: 'email'},
            },
            required: ['name', 'email'],
        },
    },
    state: {user: null},
    mutations: {
        SET_USER(state, user) {
            state.user = user;
        }
    },
    // You can specify the engine here.
    plugins: [new VuexStoreValidator({engine: ENGINE.AJV})],
});
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

### Strict

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