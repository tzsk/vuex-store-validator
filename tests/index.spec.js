import {
  validStore, strictStore, invalidStore, ajvStore, customStore,
} from './helpers';

describe('Validator', () => {
  test('it should validate root level mutators', async () => {
    expect(() => validStore.commit('SET_USER', { name: 'foo' }))
      .toThrowError(/ValidationError: "age" is required for mutation: SET_USER/);

    expect(() => validStore.commit('SET_USER', { name: 'foo', age: 25 })).not.toThrowError();
    expect(() => validStore.commit('SET_HOME', null)).not.toThrowError();
  });

  test('it should validate nested level mutators', async () => {
    expect(() => validStore.commit('post/SET_POST', { title: 'bar' }))
      .toThrowError(/ValidationError: "body" is required for mutation: post\/SET_POST/);

    expect(() => validStore.commit('post/SET_POST', { title: 'bar', body: 'baz' })).not.toThrowError();
  });

  test('it should ignore if rules are not defined', async () => {
    expect(() => validStore.commit('comment/SET_COMMENT', { title: 'bar' })).not.toThrowError();

    expect(() => validStore.commit('comment/SET_COMMENT', undefined)).not.toThrowError();
  });

  test('it can operate on strict mode', () => {
    expect(() => strictStore.commit('SET_USER', { name: 'foo', age: 25 })).toThrowError();
  });

  test('it will throw if invalid engine provided', () => {
    expect(() => invalidStore.commit('SET_USER', { name: 'foo', age: 25 }))
      .toThrowError(/Validation Engine for "foo" not found./);
  });

  test('it can also validate with ajv engine', () => {
    expect(() => ajvStore.commit('SET_USER', { name: 'foo' }))
      .toThrowError(/ValidationError: should have required property 'age' for mutation: SET_USER/);

    expect(() => ajvStore.commit('SET_USER', { name: 'foo', age: 25 })).not.toThrowError();
  });

  test('it can also validate with custom engine', () => {
    expect(() => customStore.commit('SET_USER', { name: 'foo' }))
      .toThrowError(/ValidationError: "age" is required for mutation: SET_USER/);

    expect(() => customStore.commit('SET_USER', { name: 'foo', age: 25 })).not.toThrowError();
  });
});
