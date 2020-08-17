export default async (schema, data) => {
  if (schema) {
    await schema.validateAsync(data);
  }
};
