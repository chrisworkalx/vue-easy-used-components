<script>
export default {
  name: 'EasyUsedThrottle',
  props: {
    events: {
      type: [Object, String],
      default: ''
    },
    time: Number
  },
  created() {
    this.throttledEventsMap = {};
  },
  computed: {
    _eventKeys() {
      let eventKeyNames = '';
      if (typeof this.events === 'string') {
        eventKeyNames = this.events;
      } else {
        eventKeyNames = Object.keys(this.events).join(',');
      }
      return eventKeyNames.split(',');
    }
  },
  methods: {
    isOriginHtmlNode(vnode) {
      return !vnode?.tag?.includes('vue-component');
    },
    getRestTime(key, time) {
      if (typeof this.events === 'object') {
        return this.events[key] || {};
      }
      return {
        time
      };
    },
    _throttle(fn, wait = 500, ctx, key) {
      const self = this;
      let lastCall = 0;
      return function (...params) {
        const now = new Date().getTime();
        if (now - lastCall < self.getRestTime(key, wait).time) return;
        lastCall = now;
        fn.apply(ctx, params);
      };
    }
  },
  render() {
    const _vnode = this.$slots.default; //遍历所有子节点
    this._eventKeys?.forEach((key) => {
      const loopEvent = (vnode) => {
        if (vnode && vnode.length) {
          vnode.forEach((n) => {
            if (n.children) {
              loopEvent(n.children);
            }
            const getTagetEvents = this.isOriginHtmlNode(n)
              ? n.data?.on
              : n.componentOptions?.listeners;
            const target = this.isOriginHtmlNode(n)
              ? n.data?.on[key]
              : n.componentOptions?.listeners[key];
            if (this.throttledEventsMap[key]) {
              const getTransEventObj = this.throttledEventsMap[key].find(
                (fn) => fn.originEvent === target
              );
              if (getTransEventObj) {
                getTagetEvents[key] = getTransEventObj.transEvent;
              } else if (target) {
                this.throttledEventsMap[key].push({
                  key,
                  originEvent: target,
                  transEvent: this._throttle(target, this.time, n, key)
                });
                getTagetEvents[key] = this.throttledEventsMap[key].find(
                  (item) => item.originEvent === target
                ).transEvent;
              }
            } else if (target) {
              this.throttledEventsMap[key] = [
                {
                  key,
                  originEvent: target,
                  transEvent: this._throttle(target, this.time, n, key)
                }
              ];
              getTagetEvents[key] = this.throttledEventsMap[key].find(
                (item) => item.originEvent === target
              ).transEvent;
            }
          });
        }
      };

      loopEvent(_vnode);
    });
    return <div>{_vnode}</div>;
  }
};
</script>
