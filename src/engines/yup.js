export default async (schema, data) => {
  if (schema) {
    try {
      await schema.validate(data);
    } catch ({ errors }) {
      throw new Error(errors.join(', '));
    }
  }
};
