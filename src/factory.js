const factory = async (key, extend) => {
  /* istanbul ignore next */
  const resolve = (module) => module.default || module;
  const supported = {
    ajv: () => import('./engines/ajv').then(resolve),
    joi: () => import('./engines/joi').then(resolve),
    superstruct: () => import('./engines/superstruct').then(resolve),
  };

  if (Object.keys(supported).includes(key)) {
    const module = await supported[key]();

    return module;
  }

  if (extend && Object.keys(extend).includes(key)) {
    return extend[key];
  }

  throw new Error(`Validation Engine for "${key}" not found.`);
};

export default factory;
