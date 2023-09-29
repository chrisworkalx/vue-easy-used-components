import util from './util';
import './style.css';
//其实这就是el-collapse源码
export const collapse = {
  beforeEnter(ele, ...rest) {
    const direction = util.getDefaultDirection(rest);
    if (!ele.dataset) ele.dataset = {};

    util.executeBlock({
      isPass: direction === 'vertical',
      callback: () => {
        util.addClass(ele, 'collapse-transition');
        ele.dataset.oldPaddingTop = ele.style.paddingTop;
        ele.dataset.oldPaddingBottom = ele.style.paddingBottom;
        ele.style.height = '0';
        ele.style.paddingTop = '0';
        ele.style.paddingBottom = '0';
      }
    });
    util.executeBlock({
      isPass: direction === 'horizon',
      callback: () => {
        //FIXME: todo sth
        // util.addClass(ele, 'collapse-transition');
      }
    });
  },

  enter(ele, ...rest) {
    const direction = util.getDefaultDirection(rest);

    util.executeBlock({
      isPass: direction === 'vertical',
      callback: () => {
        ele.dataset.oldOverflow = ele.style.overflow;
        if (ele.scrollHeight !== 0) {
          ele.style.height = ele.scrollHeight + 'px';
          ele.style.paddingTop = ele.dataset.oldPaddingTop;
          ele.style.paddingBottom = ele.dataset.oldPaddingBottom;
        } else {
          ele.style.height = '';
          ele.style.paddingTop = ele.dataset.oldPaddingTop;
          ele.style.paddingBottom = ele.dataset.oldPaddingBottom;
        }

        ele.style.overflow = 'hidden';
      }
    });
    util.executeBlock({
      isPass: direction === 'horizon',
      callback: () => {
        const easing = util.getDefaultPropsKey(rest, 'easing', 'ease-in-out');
        const duration = util.getDefaultPropsKey(rest, 'duration', 1000);
        util.detectAndCacheDimensions(ele, direction);
        util.setClosedDimensions(ele);
        util.hideOverflow(ele);
        util.forceRepaint(ele, direction);
        // util.addClass(ele, 'collapse-transition');
        util.setTransition(ele, { easing, duration });

        util.setOpenedDimensions(ele);
      }
    });
  },

  afterEnter(ele, ...rest) {
    // for safari: remove class then reset height is necessary
    const direction = util.getDefaultDirection(rest);
    util.executeBlock({
      isPass: direction === 'vertical',
      callback: () => {
        util.removeClass(ele, 'collapse-transition');
        ele.style.height = '';
        ele.style.overflow = ele.dataset.oldOverflow;
      }
    });

    util.executeBlock({
      isPass: direction === 'horizon',
      callback: () => {
        util.unsetOverflow(ele);
        util.removeClass(ele, 'collapse-transition');
        // util.unsetTransition(ele);
        util.unsetDimensions(ele);
        util.clearCachedDimensions();
      }
    });
  },

  beforeLeave(ele, ...rest) {
    const direction = util.getDefaultDirection(rest);
    if (!ele.dataset) ele.dataset = {};
    util.executeBlock({
      isPass: direction === 'vertical',
      callback: () => {
        ele.dataset.oldPaddingTop = ele.style.paddingTop;
        ele.dataset.oldPaddingBottom = ele.style.paddingBottom;
        ele.dataset.oldOverflow = ele.style.overflow;
        ele.style.height = ele.scrollHeight + 'px';
        ele.style.overflow = 'hidden';
      }
    });
    util.executeBlock({
      isPass: direction === 'horizon',
      callback: () => {
        //FIXME: todo sth
      }
    });
  },

  leave(ele, done, ...rest) {
    const direction = util.getDefaultDirection(rest);
    util.executeBlock({
      isPass: direction === 'vertical',
      callback: () => {
        if (ele.scrollHeight !== 0) {
          // for safari: add class after set height, or it will jump to zero height suddenly, weired
          util.addClass(ele, 'collapse-transition');
          ele.style.height = '0';
          ele.style.paddingTop = '0';
          ele.style.paddingBottom = '0';
        }
      }
    });

    util.executeBlock({
      isPass: direction === 'horizon',
      callback: () => {
        const easing = util.getDefaultPropsKey(rest, 'easing', 'ease-in-out');
        const duration = util.getDefaultPropsKey(rest, 'duration', 1000);
        util.detectAndCacheDimensions(ele, direction);
        util.setOpenedDimensions(ele);
        util.hideOverflow(ele);
        util.forceRepaint(ele, direction);
        // util.addClass(ele, 'collapse-transition');
        util.setTransition(ele, { easing, duration });
        util.setClosedDimensions(ele);
      }
    });
  },

  afterLeave(ele, ...rest) {
    const direction = util.getDefaultDirection(rest);
    util.executeBlock({
      isPass: direction === 'vertical',
      callback: () => {
        util.removeClass(ele, 'collapse-transition');
        ele.style.height = '';
        ele.style.overflow = ele.dataset.oldOverflow;
        ele.style.paddingTop = ele.dataset.oldPaddingTop;
        ele.style.paddingBottom = ele.dataset.oldPaddingBottom;
      }
    });
    util.executeBlock({
      isPass: direction === 'horizon',
      callback: () => {
        util.unsetOverflow(ele); //重置workflow： ‘’
        util.removeClass(ele, 'collapse-transition');
        // util.unsetTransition(ele); //重置transition
        util.unsetDimensions(ele); //清除el上的style相关的key
        util.clearCachedDimensions(); //  清除cachedStyles
      }
    });
  }
};
