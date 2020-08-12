import factory from './factory';

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

  const getRulesByType = (type) => {
    const target = '_rawModule';
    const pathArray = type.split('/');
    const fn = pathArray.pop();
    const module = getModuleByNamespace(pathArray.join('/'));
    const { rules = {} } = (module || modules.root)[target];

    if (strict && !rules[fn]) {
      throw new Error(`[Strict Mode] Rules are not defined for: ${type}`);
    }

    return rules[fn];
  };

  store.subscribe(({ type, payload }) => {
    const error = factory(engine, extend)(getRulesByType(type), payload);

    if (error) {
      throw new Error(`${error} for mutation: ${type}`);
    }
  });
};

export default validator;
