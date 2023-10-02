export default {
  cachedStyles: null,
  transition({ easing, duration }) {
    let transitions = [];

    Object.keys(this.cachedStyles).forEach((key) => {
      transitions.push(
        `${this.convertToCssProperty(key)} ${duration}ms ${easing}`
      );
    });

    const styles = transitions.join(', ');

    return transitions.join(', ');
  },
  convertToCssProperty(style) {
    // Example: convert 'paddingTop' to 'padding-top'
    // Thanks: https://gist.github.com/tan-yuki/3450323
    const upperChars = style.match(/([A-Z])/g);

    if (!upperChars) {
      return style;
    }

    for (let i = 0, n = upperChars.length; i < n; i++) {
      style = style.replace(
        new RegExp(upperChars[i]),
        '-' + upperChars[i].toLowerCase()
      );
    }

    if (style.slice(0, 1) === '-') {
      style = style.slice(1);
    }

    return style;
  },
  setCstStyle(ele, prop, value) {
    ele.style.setProperty(prop, value);
  },
  addClass(ele, cls) {
    const name = ele.className;
    const blank = name !== '' ? ' ' : '';
    ele.className = name + blank + cls;
  },
  removeClass(ele, cls) {
    let name = ` ${ele.className} `;
    name = name.replace(/(\s+)/gi, ' ');
    let removed = name.replace(` ${cls} `, ' ');
    ele.className = removed.replace(/(^\s+)|(\s+$)/g, '');
  },

  getDefaultPropsKey(rest, key, initValue) {
    let defaultValue = initValue;
    if (rest.length && rest[rest.length - 1].hasOwnProperty(key)) {
      defaultValue = rest[rest.length - 1][key];
    }
    return defaultValue;
  },
  getDefaultDirection(rest) {
    let direction = 'vertical';
    if (rest.length && rest[rest.length - 1].hasOwnProperty('direction')) {
      direction = rest[rest.length - 1].direction;
    }
    return direction;
  },
  setTransition(el, { easing = 'ease-in-out', duration = 1000 }) {
    el.style.transition = this.transition({ easing, duration });
  },
  unsetTransition(el) {
    el.style.transition = '';
  },
  executeBlock({ isPass, callback }) {
    isPass && callback();
  },

  detectAndCacheDimensions(el, dimension) {
    // Cache actual dimensions
    // only once to void invalid values when
    // triggering during a transition
    if (this.cachedStyles) return;

    const visibility = el.style.visibility;
    const display = el.style.display;

    // Trick to get the width and
    // height of a hidden element
    el.style.visibility = 'hidden';
    el.style.display = '';

    this.cachedStyles = this.detectRelevantDimensions(el, dimension);

    // Restore any original styling
    el.style.visibility = visibility;
    el.style.display = display;
  },
  setClosedDimensions(el) {
    Object.keys(this.cachedStyles).forEach((key) => {
      el.style[key] = '0';
    });
  },
  hideOverflow(el) {
    el.style.overflow = 'hidden';
  },
  forceRepaint(el, dimension) {
    // Force repaint to make sure the animation is triggered correctly.
    // Thanks: https://markus.oberlehner.net/blog/transition-to-height-auto-with-vue/
    getComputedStyle(el)[dimension === 'vertical' ? 'height' : 'width'];
  },
  setOpenedDimensions(el) {
    Object.keys(this.cachedStyles).forEach((key) => {
      el.style[key] = this.cachedStyles[key];
    });
  },
  unsetOverflow(el) {
    el.style.overflow = '';
  },
  unsetDimensions(el) {
    Object.keys(this.cachedStyles).forEach((key) => {
      el.style[key] = '';
    });
  },
  clearCachedDimensions() {
    this.cachedStyles = null;
  },
  getCssValue(el, style) {
    return getComputedStyle(el, null).getPropertyValue(style);
  },
  detectRelevantDimensions(el, dimension) {
    // These properties will be transitioned
    if (dimension === 'vertical') {
      return {
        height: el.offsetHeight + 'px',
        paddingTop: el.style.paddingTop || this.getCssValue(el, 'padding-top'),
        paddingBottom:
          el.style.paddingBottom || this.getCssValue(el, 'padding-bottom')
      };
    }

    if (dimension === 'horizon') {
      return {
        width: el.offsetWidth + 'px',
        paddingLeft:
          el.style.paddingLeft || this.getCssValue(el, 'padding-left'),
        paddingRight:
          el.style.paddingRight || this.getCssValue(el, 'padding-right')
      };
    }

    return {};
  }
};
