import { assert, any } from 'superstruct';

export default async (schema, data) => {
  assert(data, schema || any());

  await Promise.resolve();
};
