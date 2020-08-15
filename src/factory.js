import ajv from './engines/ajv';
import joi from './engines/joi';
import superstruct from './engines/superstruct';

const factory = (key, extend = {}) => {
  const available = {
    ajv, joi, superstruct, ...extend,
  };

  if (Object.keys(available).includes(key)) {
    return available[key];
  }

  throw new Error(`Validation Engine for "${key}" not found.`);
};

export default factory;
