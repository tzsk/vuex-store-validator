import { mixed } from 'yup';

export default async (schema, data) => {
  const types = schema || mixed();
  try {
    await types.validate(data);
  } catch ({ errors }) {
    throw new Error(errors.join(', '));
  }
};
