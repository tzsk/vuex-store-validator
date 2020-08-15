import Joi from 'joi';
import {
  store, ajvStore, customStore, superStructStore, SET_POST_AUTHOR, customValidator,
} from './helpers';
import validator from '../src/validator';
import { ENGINE } from '../src';

const executeValidaton = async (storeObject, type, payload, params = { }) => {
  await validator(storeObject, { engine: ENGINE.JOI, ...params }).validate({ type, payload });
};

describe('Validator', () => {
  test('it should validate root level mutators', async () => {
    await expect(executeValidaton(store, 'SET_USER', { name: 'foo' }))
      .rejects
      .toThrowError(/"age" is required for mutation: SET_USER/);

    await expect(executeValidaton(store, 'SET_USER', { name: 'foo', age: 25 })).resolves.not.toThrowError();
    await expect(executeValidaton(store, 'SET_HOME', null)).resolves.not.toThrowError();
  });

  test('it should validate nested level mutators', async () => {
    await expect(executeValidaton(store, 'post/SET_POST', { title: 'bar' }))
      .rejects
      .toThrowError(/"body" is required for mutation: post\/SET_POST/);

    await expect(executeValidaton(store, 'post/SET_POST', { title: 'bar', body: 'baz' })).resolves.not.toThrowError();
  });

  test('it should validate closure schema', async () => {
    SET_POST_AUTHOR.mockReturnValue(Joi.string().required());
    await expect(executeValidaton(store, 'post/SET_POST_AUTHOR', 1))
      .rejects
      .toThrowError(/"value" must be a string for mutation: post\/SET_POST_AUTHOR/);
    expect(SET_POST_AUTHOR).toHaveBeenCalledWith(store, 1);

    await expect(executeValidaton(store, 'post/SET_POST_AUTHOR', 'John')).resolves.not.toThrowError();
    expect(SET_POST_AUTHOR).toHaveBeenCalledWith(store, 'John');
  });

  test('it should ignore if rules are not defined', async () => {
    await expect(executeValidaton(store, 'comment/SET_COMMENT', { title: 'bar' })).resolves.not.toThrowError();

    await expect(executeValidaton(store, 'comment/SET_COMMENT', undefined)).resolves.not.toThrowError();
  });

  test('it can operate on strict mode', async () => {
    await expect(executeValidaton(store, 'SET_HOME', { name: 'foo', age: 25 }, { strict: true }))
      .rejects
      .toThrowError(/\[Strict Mode\] Rules are not defined for: SET_HOME/);
  });

  test('it will throw if invalid engine provided', async () => {
    await expect(executeValidaton(store, 'SET_USER', { name: 'foo', age: 25 }, { engine: 'foo' }))
      .rejects
      .toThrowError(/Validation Engine for "foo" not found./);
  });

  test('it can also validate with ajv engine', async () => {
    await expect(executeValidaton(ajvStore, 'SET_USER', { name: 'foo' }, { engine: ENGINE.AJV }))
      .rejects
      .toThrowError(/should have required property 'age' for mutation: SET_USER/);

    await expect(executeValidaton(ajvStore, 'SET_USER', { name: 'foo', age: 25 }, { engine: ENGINE.AJV }))
      .resolves.not.toThrowError();
  });
  test('it can also validate ajv without any schema defined', async () => {
    await expect(executeValidaton(ajvStore, 'SET_AUTHOR', { name: 'foo' }, { engine: ENGINE.AJV })).resolves.not.toThrowError();
  });

  test('it can also validate with superstruct engine', async () => {
    await expect(executeValidaton(superStructStore, 'SET_USER', { name: 'foo' }, { engine: ENGINE.SUPERSTRUCT }))
      .rejects
      .toThrowError(/Expected a value of type `number` for `age` but received `undefined`. for mutation: SET_USER/);

    await expect(executeValidaton(superStructStore, 'SET_USER', { name: 'foo', age: 25 }, { engine: ENGINE.SUPERSTRUCT }))
      .resolves.not.toThrowError();
  });
  test('it can also validate superstruct without any schema defined', async () => {
    await expect(executeValidaton(superStructStore, 'SET_AUTHOR', { name: 'foo' }, { engine: ENGINE.SUPERSTRUCT }))
      .resolves.not.toThrowError();
  });

  test('it can also validate with custom engine', async () => {
    const options = { engine: 'custom', extend: { custom: customValidator } };
    await expect(executeValidaton(customStore, 'SET_USER', { name: 'foo' }, options))
      .rejects
      .toThrowError(/"age" is required for mutation: SET_USER/);

    await expect(executeValidaton(customStore, 'SET_USER', { name: 'foo', age: 25 }, options))
      .resolves.not.toThrowError();
  });
});
