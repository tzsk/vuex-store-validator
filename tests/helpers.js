/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import Joi from 'joi';
import { object, string, number } from 'superstruct';
import VuexStoreValidator, { ENGINE } from '../src';

Vue.use(Vuex);

export const SET_POST_AUTHOR = jest.fn();

export const validStore = new Vuex.Store({
  modules: {
    post: {
      namespaced: true,
      rules: {
        SET_POST: Joi.object({
          title: Joi.string().required(),
          body: Joi.string().required(),
        }).unknown().required(),
        SET_POST_AUTHOR,
      },
      state: {
        post: null,
      },
      mutations: {
        SET_POST(state, post) {
          state.post = post;
        },
        SET_POST_AUTHOR(state, author) {
          state.author = author;
        },
      },
    },
    comment: {
      namespaced: true,
      state: {
        comment: null,
      },
      mutations: {
        SET_COMMENT(state, comment) {
          state.comment = comment;
        },
      },
    },
  },
  rules: {
    SET_USER: Joi.object({
      name: Joi.string().required(),
      age: Joi.number().required(),
    }).unknown().required(),
  },
  state: {
    user: null,
    home: null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_HOME(state, home) {
      state.home = home;
    },
  },
  plugins: [new VuexStoreValidator()],
});

export const strictStore = new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {
    SET_USER(state, data) {
      state.user = data;
    },
  },
  plugins: [new VuexStoreValidator({ strict: true })],
});

export const invalidStore = new Vuex.Store({
  state: {
    user: null,
  },
  mutations: {
    SET_USER(state, data) {
      state.user = data;
    },
  },
  plugins: [new VuexStoreValidator({ engine: 'foo', strict: true })],
});

export const ajvStore = new Vuex.Store({
  rules: {
    SET_USER: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'number',
        },
      },
      required: ['name', 'age'],
    },
  },
  state: {
    user: null,
  },
  mutations: {
    SET_USER(state, data) {
      state.user = data;
    },
    SET_AUTHOR(state, data) {
      state.user = data;
    },
  },
  plugins: [new VuexStoreValidator({ engine: ENGINE.AJV })],
});

export const superStructStore = new Vuex.Store({
  rules: {
    SET_USER: object({
      name: string(),
      age: number(),
    }),
  },
  state: {
    user: null,
  },
  mutations: {
    SET_USER(state, data) {
      state.user = data;
    },
    SET_AUTHOR(state, data) {
      state.user = data;
    },
  },
  plugins: [new VuexStoreValidator({ engine: ENGINE.SUPERSTRUCT })],
});

export const customStore = new Vuex.Store({
  rules: {
    SET_USER: {
      name: String,
      age: Number,
    },
  },
  state: {
    user: null,
  },
  mutations: {
    SET_USER(state, data) {
      state.user = data;
    },
  },
  plugins: [new VuexStoreValidator({
    engine: 'custom',
    extend: {
      custom: (schema, data) => {
        const schemaArray = Object.keys(schema);

        let error = null;
        // eslint-disable-next-line no-plusplus
        for (let index = 0; index < schemaArray.length; index++) {
          const key = schemaArray[index];

          if (schema[key](data[key]) !== data[key]) {
            error = `"${key}" is required`;
            break;
          }
        }

        return error;
      },
    },
  })],
});
