import ajv from './engines/ajv';
import joi from './engines/joi';

const factory = (key, extend) => {
  const available = { ajv, joi, ...extend };

  if (Object.keys(available).includes(key)) {
    return available[key];
  }

  throw new Error(`Validation Engine for "${key}" not found.`);
};

export default factory;
