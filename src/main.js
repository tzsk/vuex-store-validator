import validator from './validator';
import Constants from './constants';

export default class VuexStoreValidator {
  constructor({ engine = Constants.JOI, strict = false, extend = {} } = {}) {
    Object.assign(this, { engine, strict, extend });

    return this.handle.bind(this);
  }

  handle(store) {
    store.subscribe(async ({ type, payload }) => {
      await validator(store, this).validate({ type, payload });
    });
  }
}

/* istanbul ignore next */
if (window.Vue) {
  window.VuexStoreValidator = VuexStoreValidator;
}

export const ENGINE = Constants;
