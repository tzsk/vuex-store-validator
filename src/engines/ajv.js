import Ajv from 'ajv';

const getErrorMessages = (errors) => errors.map((item) => item.message).join(', ');

export default async (schema, data) => {
  const ajv = new Ajv({ jsonPointers: true, $data: true });
  const validate = ajv.compile(schema || {});

  await validate(data);
  if (validate.errors) {
    throw new Error(getErrorMessages(validate.errors));
  }
};
