import joi from './engines/joi';
import superstruct from './engines/superstruct';
import yup from './engines/yup';

const factory = (key, extend = {}) => {
  const available = {
    joi, superstruct, yup, ...extend,
  };

  if (Object.keys(available).includes(key)) {
    return available[key];
  }

  throw new Error(`Validation Engine for "${key}" not found.`);
};

export default factory;
