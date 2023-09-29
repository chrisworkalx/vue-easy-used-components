<script>
import { collapse as CollapseConfig } from './collapse';
const getListenerPosition = (k, cstHook, defaultHook) => {
  return k.includes('before') ? [cstHook, defaultHook] : [defaultHook, cstHook];
};
export default {
  name: 'EasyUsedCollapseTransition',
  functional: true,
  render(h, { children, listeners, props = {} }) {
    listeners = listeners || {};
    const finalListners = Object.entries(CollapseConfig).reduce(
      (target, [k, v]) => {
        if (k in listeners) {
          target[k] = (...args) => {
            getListenerPosition(k, listeners[k], v).forEach((f) =>
              f(...args, { ...props })
            );
          };
        } else {
          target[k] = (...rest) => {
            v(...rest, { ...props });
          };
        }
        return target;
      },
      {}
    );
    const $data = {
      on: {
        ...finalListners
      },
      ...props
    };
    return h('transition', $data, children);
  }
};
</script>
