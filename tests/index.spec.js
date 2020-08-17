import {
  store, superStructStore, customStore, customValidator, strictStore, yupStore,
} from './helpers';
import validator from '../src/validator';

jest.mock('../src/validator', () => jest.fn());

describe('Plugin', () => {
  test('it should should pass the proper type and payload with default', () => {
    const validate = jest.fn();
    validator.mockReturnValue({ validate });
    store.commit('SET_USER', { foo: 'bar' });

    expect(validator).toHaveBeenCalledWith(store, { engine: 'joi', strict: false, extend: {} });
    expect(validate).toHaveBeenCalledWith({ type: 'SET_USER', payload: { foo: 'bar' } });
  });

  test('it should should pass the proper type and payload for strict mode', () => {
    const validate = jest.fn();
    validator.mockReturnValue({ validate });
    strictStore.commit('SET_USER', { foo: 'bar' });

    expect(validator).toHaveBeenCalledWith(strictStore, { engine: 'joi', strict: true, extend: {} });
    expect(validate).toHaveBeenCalledWith({ type: 'SET_USER', payload: { foo: 'bar' } });
  });

  test('it should should pass the proper type and payload with superstruct', () => {
    const validate = jest.fn();
    validator.mockReturnValue({ validate });
    superStructStore.commit('SET_USER', { foo: 'bar' });

    expect(validator).toHaveBeenCalledWith(superStructStore, { engine: 'superstruct', strict: false, extend: {} });
    expect(validate).toHaveBeenCalledWith({ type: 'SET_USER', payload: { foo: 'bar' } });
  });

  test('it should should pass the proper type and payload with yup', () => {
    const validate = jest.fn();
    validator.mockReturnValue({ validate });
    yupStore.commit('SET_USER', { foo: 'bar' });

    expect(validator).toHaveBeenCalledWith(yupStore, { engine: 'yup', strict: false, extend: {} });
    expect(validate).toHaveBeenCalledWith({ type: 'SET_USER', payload: { foo: 'bar' } });
  });

  test('it should should pass the proper type and payload with custom', () => {
    const validate = jest.fn();
    validator.mockReturnValue({ validate });
    customStore.commit('SET_USER', { foo: 'bar' });

    expect(validator).toHaveBeenCalledWith(customStore, {
      engine: 'custom',
      strict: false,
      extend: {
        custom: customValidator,
      },
    });
    expect(validate).toHaveBeenCalledWith({ type: 'SET_USER', payload: { foo: 'bar' } });
  });
});
