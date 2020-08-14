import { assert, any } from 'superstruct';

export default (schema, data) => {
  let error = null;
  try {
    assert(data, schema || any());
  } catch ({ message }) {
    error = message;
  }

  return error;
};
