import { assert } from 'superstruct';

export default async (schema, data) => {
  if (schema) {
    assert(data, schema);

    await Promise.resolve();
  }
};
