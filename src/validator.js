import factory from './factory';
import ValidationError from './exception';

const validator = (store, params) => {
  const { extend, strict, engine } = params;
  const { _modules: modules, _modulesNamespaceMap: modulesNamespaceMap } = store;

  const getModuleByNamespace = (namespace) => {
    let name = namespace;
    if (name && namespace.charAt(namespace.length - 1) !== '/') {
      name += '/';
    }

    return modulesNamespaceMap[name] || modules.root;
  };

  const getRulesByType = (type) => {
    const pathSplit = type.split('/');
    const mutation = pathSplit.pop();
    const { _rawModule: rawModule } = getModuleByNamespace(pathSplit.join('/'));
    const schema = (rawModule.rules || {})[mutation];

    if (strict && !schema) {
      throw new ValidationError(`[Strict Mode] Rules are not defined for: ${type}`);
    }

    return (typeof schema === 'function') ? schema : () => schema;
  };

  const Worker = {
    execute: async ({ type, payload }) => {
      const schema = await getRulesByType(type, payload)(store, payload);
      const handler = factory(engine, extend);
      const error = await handler(schema, payload);

      if (error) {
        throw new Error(error);
      }
    },
    validate: async ({ type, payload }) => {
      try {
        await Worker.execute({ type, payload });
      } catch ({ message }) {
        throw new ValidationError(`${message} for mutation: ${type}`);
      }
    },
  };

  return Worker;
};

export default validator;
