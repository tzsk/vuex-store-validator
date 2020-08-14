import Joi from 'joi';
import {
  validStore, strictStore, invalidStore, ajvStore,
  customStore, superStructStore, SET_POST_AUTHOR,
} from './helpers';

describe('Validator', () => {
  test('it should validate root level mutators', async () => {
    expect(() => validStore.commit('SET_USER', { name: 'foo' }))
      .toThrowError(/"age" is required for mutation: SET_USER/);

    expect(() => validStore.commit('SET_USER', { name: 'foo', age: 25 })).not.toThrowError();
    expect(() => validStore.commit('SET_HOME', null)).not.toThrowError();
  });

  test('it should validate nested level mutators', async () => {
    expect(() => validStore.commit('post/SET_POST', { title: 'bar' }))
      .toThrowError(/"body" is required for mutation: post\/SET_POST/);

    expect(() => validStore.commit('post/SET_POST', { title: 'bar', body: 'baz' })).not.toThrowError();
  });

  test('it should validate closure schema', async () => {
    SET_POST_AUTHOR.mockReturnValue(Joi.string().required());
    expect(() => validStore.commit('post/SET_POST_AUTHOR', 1))
      .toThrowError(/"value" must be a string for mutation: post\/SET_POST_AUTHOR/);
    expect(SET_POST_AUTHOR).toHaveBeenCalledWith(validStore, 1);

    expect(() => validStore.commit('post/SET_POST_AUTHOR', 'John')).not.toThrowError();
    expect(SET_POST_AUTHOR).toHaveBeenCalledWith(validStore, 'John');
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
      .toThrowError(/should have required property 'age' for mutation: SET_USER/);

    expect(() => ajvStore.commit('SET_USER', { name: 'foo', age: 25 })).not.toThrowError();
  });
  test('it can also validate ajv without any schema defined', () => {
    expect(() => ajvStore.commit('SET_AUTHOR', { name: 'foo' })).not.toThrowError();
  });

  test('it can also validate with superstruct engine', () => {
    expect(() => superStructStore.commit('SET_USER', { name: 'foo' }))
      .toThrowError(/Expected a value of type `number` for `age` but received `undefined`. for mutation: SET_USER/);

    expect(() => superStructStore.commit('SET_USER', { name: 'foo', age: 25 })).not.toThrowError();
  });
  test('it can also validate superstruct without any schema defined', () => {
    expect(() => superStructStore.commit('SET_AUTHOR', { name: 'foo' })).not.toThrowError();
  });

  test('it can also validate with custom engine', () => {
    expect(() => customStore.commit('SET_USER', { name: 'foo' }))
      .toThrowError(/"age" is required for mutation: SET_USER/);

    expect(() => customStore.commit('SET_USER', { name: 'foo', age: 25 })).not.toThrowError();
  });
});
