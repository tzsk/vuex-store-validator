# :gift: Vuex Store Validator
![Vuex Store Validator](./assets/main.png)

![Build](https://img.shields.io/github/workflow/status/tzsk/vuex-store-validator/Tests/master?logo=github&style=for-the-badge)
![Coveralls](https://img.shields.io/coveralls/github/tzsk/vuex-store-validator/master?logo=coveralls&style=for-the-badge)
[![npm](https://img.shields.io/npm/v/vuex-store-validator?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/vuex-store-validator)
[![npm](https://img.shields.io/npm/dt/vuex-store-validator?logo=npm&style=for-the-badge)](https://www.npmjs.com/package/vuex-store-validator)

This package helps you to validate how you mutate your Vuex store. You can say that it is a Validator for the mutations. You can easily validate the payload for each of your mutations, so that you can be sure of the integrity of your Store Data.

This package also has support for any custom schema validator you may choose. You can create your own implementation and extend this package to use that shcema.

Though Vuex allows you to set the store state directly without calling any mutation. This package won't validate anything outside the mutations.

## :package: Installation

```bash
// NPM:
$ npm install --save vuex-store-validator

// Yarn:
$ yarn add vuex-store-validator
```

By default it comes with `Joi` validator. It also has support for `AJV` and `Superstruct` validation engine. Read their respective docs to find out which one is best for you.
- [Joi Documentation](https://github.com/sideway/joi/blob/master/API.md)
- [Ajv Documentation](https://github.com/ajv-validator/ajv/blob/master/README.md)
- [Superstruct Documentation](https://github.com/ianstormtaylor/superstruct/blob/master/Readme.md)

#### Setup Joi
If you want to use joi then you'll have to install it as your project dependency.

```bash
// NPM:
$ npm install --save joi

// Yarn:
$ yarn add joi
```

#### Setup Superstruct
If you want to use superstruct then you'll have to install it as your project dependency.

```bash
// NPM:
$ npm install --save superstruct

// Yarn:
$ yarn add superstruct
```

#### Setup Ajv
If you think that ajv is best for you then you won't have to install anything as the schema builder is plain javascript object.

## :fire: Usage

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
import VuexStoreValidator, { ENGINE } from 'vuex-store-validator';

export default new Vuex.Store({
    rules: {
        SET_USER: ...SCHEMA HERE...
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
import Joi from 'joi';
SET_USER: Joi.object({
    name: Joi.string().required(),
    age: Joi.number().required(),
}).required(),

// Ajv Schema...
SET_USER: {
    type: 'object',
    properties: {
        name: {type: 'string'},
        age: {type: 'number'},
    },
    required: ['name', 'age'],
},

// Superstruct Schema...
import {object, string, number} from 'superstruct';
SET_USER: object({
    name: string(),
    age: number(),
}),
```

**NOTE:** If you want to use anything other than Joi then, you will have to add the engine option in the plugin registration
```js
// Ajv...
plugins: [new VuexStoreValidator({engine: ENGINE.AJV})],

// Superstruct...
plugins: [new VuexStoreValidator({engine: ENGINE.SUPERSTRUCT})],
```

### :tada: Congratulations! You're all done.

Now whenever you call the mutation from anywhere be it inside an action or from any component. The payload you pass will be validated against the schema you've defined.

For the above piece of code if you try and call the `SET_USER` mutation without valid data:
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

This will work for all the nested modules as well. Just remember to add a new `rules` option to your module definition with state, action etc.

### :star: Closure Support

Let's face it, the real world projects are complex. It's not as straight forward as defining a schema. Sometimes you need to have conditional schema which depends on some other state property or the mutation payload itself.

But don't worry, you can even define the schema in a closure. You have 2 parameters available in that clsoure. The store and the mutation payload itself.

**Example:**
```js
rules: {
    SET_USER(store, data) {
        // Store -> Global Store instance
        // Data -> {name: 'John'}

        return Joi.object({
            ...
        });
    }
}
```

### :muscle: Strict Mode

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

### :boom: Custom Validatior Usage

```js
// Define a validator...
/**
 * It accepts the schema and the data payload
 * The return value should be the error string or null
 */
const myCustomValidator = (schema, data) => {
    const schemaArray = Object.keys(schema);

    let error = null;
    for (let index = 0; index < schemaArray.length; index++) {
        const key = schemaArray[index];

        if (schema[key](data[key]) !== data[key]) {
        error = `"${key}" is required`;
        break;
        }
    }

    return error;
};

// Now extend with the custom validator...
plugins: [
    new VuexStoreValidator({
        engine: 'custom',
        extend: {
            custom: myCustomValidator,
        },
    })
]

// Make sure that the engine name and the extend key are the same

// Now your schema would look something like this:
rules: {
    MUTATION_NAME: {
        name: String,
        email: String,
        age: Number,
    },
}
```

You can also leverage Vue PropType Validator and make your own implementation of that. Maybe even React PropType validator. Or anything you like.

### :eyes: Caution

This package won't prevent you from setting invalid data to your store. But it will throw appropriate exception everytime you set invalid data, so that you can be aware of where bad data might be coming from.

You can see and debug your code based on the Production Logs related to any bad data. If you are using Ignition or Sentry.

## :microscope: Testing

After Cloning the repository, install all npm dependecies by running: `npm install`.

Then Run Tests:

```bash
$ npm run test
```

## :date: Change log

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## :heart: Contributing

Please feel free to contribute ideas and PRs are most welcome.

## :crown: Credits

- [Kazi Mainuddin Ahmed][link-author]
- [All Contributors][link-contributors]

## :policeman: License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

[link-author]: https://github.com/tzsk
[link-contributors]: ../../contributors
