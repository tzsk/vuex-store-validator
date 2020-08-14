import Ajv from 'ajv';

const getErrorMessages = (errors) => errors.map((item) => item.message).join(', ');

export default (schema, data) => {
  const ajv = new Ajv({ jsonPointers: true, $data: true });
  const validate = ajv.compile(schema || {});
  validate(data);

  const { errors } = validate;

  return errors && getErrorMessages(errors);
};
