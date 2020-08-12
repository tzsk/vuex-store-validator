export default (schema, data) => {
  const format = schema || { validate: () => ({}) };
  const { error } = format.validate(data);

  return error || false;
};
