const requireComponent = require.context('./', true, /\.vue$/);

const install = (Vue) => {
  if (install.installed) return;
  install.installed = true;

  requireComponent.keys().forEach((element) => {
    const config = requireComponent(element);
    const componentName = config.default.name;
    console.log('componentName', componentName);
    Vue.component(componentName, config.default || config);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install
};
