export default async (schema, data) => {
  const format = schema || { validateAsync: async () => ({}) };

  await format.validateAsync(data);
};
