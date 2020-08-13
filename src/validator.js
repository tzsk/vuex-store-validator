import factory from './factory';
import ValidationError from './exception';

const validator = ({ extend, strict, engine }) => (store) => {
  const { _modules: modules, _modulesNamespaceMap: modulesNamespaceMap } = store;

  const getModuleByNamespace = (namespace) => {
    let name = namespace;
    if (name && namespace.charAt(namespace.length - 1) !== '/') {
      name += '/';
    }

    const module = modulesNamespaceMap[name];

    return module;
  };

  const getRulesByType = (type, payload) => {
    const target = '_rawModule';
    const pathArray = type.split('/');
    const fn = pathArray.pop();
    const module = getModuleByNamespace(pathArray.join('/'));
    const { rules = {} } = (module || modules.root)[target];
    const schema = rules[fn];

    if (strict && !schema) {
      throw new ValidationError(`[Strict Mode] Rules are not defined for: ${type}`);
    }

    return (typeof schema === 'function') ? schema(store, payload) : schema;
  };

  store.subscribe(({ type, payload }) => {
    const execute = factory(engine, extend);
    const schema = getRulesByType(type, payload);
    const error = execute(schema, payload);

    if (error) {
      throw new ValidationError(`${error} for mutation: ${type}`);
    }
  });
};

export default validator;
